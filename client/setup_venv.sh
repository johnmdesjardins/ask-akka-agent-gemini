#!/bin/bash -x
#
# Pre-requisites (macos):
# brew install portaudio
#
# python3 -m venv .venv
# source .venv/bin/activate.{fish|sh|zsh}

# grpc/proto
python3 -m pip install grpcio grpcio-tools
# other libs
python3 -m pip install opencv-python pyaudio pillow mss taskgroup exceptiongroup