import threading
import json 
import requests
import os
from os.path import exists

execution_path = os.getcwd()

class PredictionThread(threading.Thread):
    def __init__(self, evalId, imagePath, prediction):
        threading.Thread.__init__(self)
        self.prediction = prediction
        self.evalId = evalId
        self.imagePath = imagePath

    def run(self):

        # print("curr thread:",self.imagePath, '-- \n')
        imagePath = self.imagePath
        # "HMDAlarm_20221014-152016.jpg"  
        # "SNAP_CH01_2022_10_14_14_15_35_23978.jpg"
        fileFullName = imagePath.split('/')[-1]
        fileName = fileFullName.split('.')[0]
        fileExt = fileFullName.split('.')[-1]
        fileDir = imagePath.replace(fileFullName,"")

        path = os.path.join(execution_path , imagePath)
        newPath = fileDir + fileName+"_predict." + fileExt
        print('Predeciton Job Started : ', imagePath, '  new: ', newPath)

        tagDict = {}

        file_exists = exists(path)
        if  not file_exists:
            print('Error file  does not  exist: ', path)
            return
        
        try:
            predictions, probabilities = self.prediction.classifyImage(os.path.join(execution_path, imagePath), result_count=5 )
            for eachPrediction, eachProbability in zip(predictions, probabilities):
                print(eachPrediction , " : " , eachProbability)
                # tagDict[eachObject["name"]] = {"probability": eachObject["percentage_probability"],"boundries":eachObject["box_points"]}
                tagDict[eachPrediction] = {"percentage_probability": eachProbability}

        except Exception as e:
            print("--------------------------------")
            print('Eval Error for img: ', path, " eval-id:",  self.evalId)
            print(e)
            print("--------------------------------")

            url = 'http://10.0.0.106:3030/v1/eval/'+self.evalId
            x = requests.patch(url, json = {"status":"failed"}, verify=False, timeout=3)
            return


        postDict = {
            "detection_path": imagePath,
            "tags": tagDict,
            "status": "complete"
        }
        
        try:
            print("------------------------------------")
            print('--Sending job results back to core--')
            print("------------------------------------")

            json_object = json.dumps(postDict) 
            # print(json_object,4)
            url = 'http://10.0.0.106:3030/v1/eval/'+self.evalId
            x = requests.patch(url, json = postDict, verify=False, timeout=3)
            # print('Core api resp: ',x.text)
            # print("------------------------------------")
        except Exception as err:
            print("-----------------------------------------")
            print("--Failed to send update to core service--")
            print(err)
            print("-----------------------------------------")









        # for eachPicture in allfiles:
        #     if eachPicture.endswith(".png") or eachPicture.endswith(".jpg"):
        #         predictions, percentage_probabilities = prediction.predictImage(picturesfolder + eachPicture, result_count=1)
        #         for prediction, percentage_probability in zip(predictions, probabilities):
        #             print(prediction , " : " , percentage_probability)
