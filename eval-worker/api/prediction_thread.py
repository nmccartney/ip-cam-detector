
class PredictionThread(threading.Thread):
    def __init__(self,imagePath):
        threading.Thread.__init__(self)
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

        newPath = fileDir + fileName+"_predict." + fileExt
        print('--------',newPath)
        
        
        predictions, probabilities = prediction.classifyImage(os.path.join(execution_path, imagePath), result_count=5 )
        for eachPrediction, eachProbability in zip(predictions, probabilities):
            print(eachPrediction , " : " , eachProbability)

        # for eachPicture in allfiles:
        #     if eachPicture.endswith(".png") or eachPicture.endswith(".jpg"):
        #         predictions, percentage_probabilities = prediction.predictImage(picturesfolder + eachPicture, result_count=1)
        #         for prediction, percentage_probability in zip(predictions, probabilities):
        #             print(prediction , " : " , percentage_probability)
