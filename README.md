

# IP Camera Detection

This project is meant to take in images from ip-cameras via FTP and detecting objects from AI Model

### Getting started

Download the below model and add it to `eval-worker/models` directory

* **[RetinaNet](https://github.com/OlafenwaMoses/ImageAI/releases/download/essentials-v5/resnet50_coco_best_v2.1.0.h5)** _(Size = 145 mb, high performance and accuracy, with longer detection time)_


Serve application

```
docker-compose up --build
```

Then vist `http://localhost:3030` or `http://<system-ip-address>:3030`

To hook up your ip-cameras, get your systems IP address (perferably static-ip) and add it to your ip-camera's ftp service. Make sure to specifc port `22`






#### Other models
* **[RetinaNet](https://github.com/OlafenwaMoses/ImageAI/releases/download/essentials-v5/resnet50_coco_best_v2.1.0.h5)** _(Size = 145 mb, high performance and accuracy, with longer detection time)_
* **[YOLOv3](https://github.com/OlafenwaMoses/ImageAI/releases/download/1.0/yolo.h5)** _(Size = 237 mb, moderate performance and accuracy, with a moderate detection time)_
* **[TinyYOLOv3](https://github.com/OlafenwaMoses/ImageAI/releases/download/1.0/yolo-tiny.h5)** _(Size = 34 mb, optimized for speed and moderate performance, with fast detection time)_
