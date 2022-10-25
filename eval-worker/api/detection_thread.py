import threading
import json 
import requests
import os
from os.path import exists


execution_path = os.getcwd()

class ObjectDetectionThread(threading.Thread):
    def __init__(self,evalId, imagePath,detector):
        threading.Thread.__init__(self)
        self.detector = detector
        self.evalId = evalId
        self.imagePath = imagePath
    def run(self):
        imagePath = self.imagePath 
        # "HMDAlarm_20221014-152016.jpg"  
        # "SNAP_CH01_2022_10_14_14_15_35_23978.jpg"
        fileFullName = imagePath.split('/')[-1]
        fileName = fileFullName.split('.')[0]
        fileExt = fileFullName.split('.')[-1]
        fileDir = imagePath.replace(fileFullName,"")
        newFile = fileDir + fileName+"_detect." + fileExt

        path = os.path.join(execution_path , imagePath)
        newPath = os.path.join(execution_path , newFile)
        print('Job started : ', imagePath, '  new: ', newPath)
        print('exec: ', path)

        tagDict = {}

        file_exists = exists(path)
        if  not file_exists:
            print('Error file  does not  exist: ', path)
            return

        try:
            print('trying detector ', newPath)
            # detections = self.detector.detectObjectsFromImage(input_image=os.path.join(execution_path , 'image2new.jpg'), output_image_path=os.path.join(execution_path , 'ftp-dir/detect.jpg'), minimum_percentage_probability=30)
            detections = self.detector.detectObjectsFromImage(input_image = path, output_image_path = newPath, minimum_percentage_probability=30)
            print('finished detector ', newPath)

            for eachObject in detections:
                print(eachObject["name"] , " : ", eachObject["percentage_probability"], " : ", eachObject["box_points"] )
                print("--------------------------------")
                tagDict[eachObject["name"]] = {"probability": eachObject["percentage_probability"],"boundries":eachObject["box_points"]}
        except Exception as e:
            print("--------------------------------")
            print('Eval Error for img: ', path, " eval-id:",  self.evalId)
            print(e)
            print("--------------------------------")

            url = 'http://10.0.0.199:3030/v1/eval/'+self.evalId
            x = requests.patch(url, json = {"status":"failed"}, verify=False, timeout=3)
            return 

        postDict = {
            "detection_path": newFile,
            "tags": tagDict,
            "status": "complete"
        }
        
        print("--------------------------------")
        try:
            print('Sending job results back to core')
            json_object = json.dumps(postDict) 
            print(json_object,4)
            url = 'http://10.0.0.199:3030/v1/eval/'+self.evalId
            x = requests.patch(url, json = postDict, verify=False, timeout=3)
            print('Core api resp: ',x.text)
            print("--------------------------------")
        except:
            print("--------------------------------")
            print("Failed to send update to eval service")
            print("--------------------------------")