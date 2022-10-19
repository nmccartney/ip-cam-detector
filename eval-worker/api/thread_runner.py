import time
import threading
from .thread_queue import ThreadQueue

"""
    Thread Runner 
    https://stackoverflow.com/questions/3393612/run-certain-code-every-n-seconds
"""
class ThreadRunner:
    def __init__(self, queue, delay) -> 'ThreadRunner':
        self.queue = queue
        self.delay = delay
        self._timer     = None
        self.interval   = delay
        self.is_running = False
        # self.start()

    def _run(self):
        self.is_running = False
        self.start()
        if not self.queue.is_empty():
            self._pickNext()
        else:
            print('queue is empty. stopping...')
            self.stop()

    def _pickNext(self):
        print('---Running next Queue Item---')
        nextQue = self.queue.dequeue()
        if nextQue != None:
            try:
                nextQue.start()
            except:
                print('Failed to add job to queue. ', nextQue)
        else:
            print('Bad Thread')

    def start(self):
        if not self.is_running:
            print('---Runner Tick---', self.queue.size())
            self._timer = threading.Timer(self.interval, self._run)
            self._timer.start()
            self.is_running = True

    def stop(self):
        self._timer.cancel()
        self.is_running = False


