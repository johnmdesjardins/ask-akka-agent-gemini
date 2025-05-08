#!/bin/bash -x
#
# Pre-requisite (for MacOS, might be python instead of python3):
#
# python3 -m venv .venv
# source .venv/bin/activate.{fish|sh|zsh}
# python3 -m pip install grpcio grpcio-tools
#
python3 -m grpc_tools.protoc -I./ --python_out=. --pyi_out=. --grpc_python_out=. video-service.proto
