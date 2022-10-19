import threading
import json 
import requests
import os

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
        print('Job started. ', imagePath)
        print('exec: ', path)

        tagDict = {}

        try:
            detections = self.detector.detectObjectsFromImage(input_image=path, output_image_path=newPath, minimum_percentage_probability=30)
            
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

        print('tags: ',tagDict)
        print("--------------------------------")

        postDict = {
            "detection_path":newFile,
            "tags": tagDict,
            "status": "complete"
        }

        json_object = json.dumps(postDict) 
        print(json_object)
        print("--------------------------------")
        try:
            print('Sending job results back to core')
            url = 'http://10.0.0.199:3030/v1/eval/'+self.evalId
            x = requests.patch(url, json = postDict, verify=False, timeout=3)
            print(x.text)
            print("--------------------------------")
        except:
            print("--------------------------------")
            print("Failed to send update to eval service")
            print("--------------------------------")