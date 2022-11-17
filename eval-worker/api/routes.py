# -*- encoding: utf-8 -*-

from datetime import datetime, timezone, timedelta
from functools import wraps
import jwt
import os

from flask import request
from flask_restx import Api, Resource, fields, reqparse
from imageai.Classification import ImageClassification
from imageai.Detection import ObjectDetection

from .models import db, Users, JWTTokenBlocklist
from .config import BaseConfig
from .thread_queue import ThreadQueue
from .thread_runner import ThreadRunner
from .detection_thread import ObjectDetectionThread
from .prediction_thread import PredictionThread

parser = reqparse.RequestParser()
parser.add_argument("image", type=str, action="split")
parser.add_argument("eval", type=str, action="split")

rest_api = Api(version="1.0", title="Eval API")

execution_path = os.getcwd()

"""
    SETUP DETECTION DEPENDECIES
"""
prediction = ImageClassification()
prediction.setModelTypeAsResNet50()
# prediction.setModelPath(os.path.join(execution_path, "inception_v3_weights_tf_dim_ordering_tf_kernels.h5"))
prediction.setModelPath(os.path.join(execution_path, "models/resnet50_imagenet_tf.2.0.h5"))
prediction.loadModel()


detector = ObjectDetection()
# detector.setModelTypeAsYOLOv3()
# detector.setModelPath( os.path.join(execution_path , "models/yolo.h5"))
detector.setModelTypeAsRetinaNet()
# print(dir(detector))
detector.setModelPath( os.path.join(execution_path , "models/resnet50_coco_best_v2.1.0.h5"))
detector.loadModel()

"""
    SETUP QUEUE AND RUNNER
"""
thread_queue = ThreadQueue()
thread_runner = ThreadRunner(thread_queue,5)
# tr.start()

"""
    Flask-Restx routes
"""
@rest_api.route('/health')
class Health(Resource):
    """
       health check
    """
    def get(self):
        return {"ok": True, "success": True, "test": True, }, 200


@rest_api.route('/run-object')
class Run(Resource):
    """
       run image detection
    """
    @rest_api.expect(parser)
    def get(self):
        imagePath = parser.parse_args()['image'][0]
        evalId = parser.parse_args()['eval'][0]
        # print('img:', imagePath)

        try:
            # create detection job
            detectionThread = ObjectDetectionThread (evalId,imagePath,detector)
            # add to que
            thread_queue.enqueue(detectionThread)
            # tell runner to start if not already
            thread_runner.start()
        except:
            print('Failed to add job to queue. ', imagePath)

        return {"ok": True, "success": True, "evalId": evalId, "img": imagePath}, 200


"""
    classify endpoint
"""
@rest_api.route('/run-prediction')
class RunPrediction(Resource):
    """
       run image classification
    """
    @rest_api.expect(parser)
    def get(self):

        imagePath = parser.parse_args()['image'][0]
        evalId = parser.parse_args()['eval'][0]
        print('img:', imagePath)
        
        predictionThread = PredictionThread (evalId,imagePath,prediction)
        predictionThread.start()
        print('Thread: ', predictionThread.ident)

        # "ident": predictionThread.ident, 
        return {"ok": True, "success": True, "evalId": evalId, "img": imagePath}, 200





# class TestThread(threading.Thread):
#     def __init__(self,evalId, imagePath):
#         threading.Thread.__init__(self)
#         self.evalId = evalId
#         self.imagePath = imagePath
#     def run(self):
#         print('--------------------')
#         print('Running job ', self.imagePath)
#         time.sleep(random.random() *5)
#         print('Stopping job ', self.imagePath)
#         print('--------------------')

# time.sleep(random.random() *5)
# tt = TestThread('testimage.jpg','1')
# tq.enqueue(tt)
# tr.start()

# time.sleep( 10)
# tt = TestThread('testimage2.jpg','2')
# tq.enqueue(tt)
# tr.start()