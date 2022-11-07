#!/usr/bin/env bash


for FILE in ./ftp-dir/*; do rm -rf $FILE; done

docker-compose down

docker volume prune
