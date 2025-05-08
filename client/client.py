#
# run:
#
# python3 client.py --mode [camera,screen,none]
#
#


import grpc
import subprocess
import time
import sys

import asyncio
import base64
import io
import os
import sys
import traceback

import cv2
import pyaudio
import PIL.Image
import mss

import video_service_pb2
import video_service_pb2_grpc

import argparse

if sys.version_info < (3, 11, 0):
    import taskgroup, exceptiongroup

    asyncio.TaskGroup = taskgroup.TaskGroup
    asyncio.ExceptionGroup = exceptiongroup.ExceptionGroup

FORMAT = pyaudio.paInt16
CHANNELS = 1
SEND_SAMPLE_RATE = 16000
RECEIVE_SAMPLE_RATE = 24000
CHUNK_SIZE = 1024

MODEL = "models/gemini-2.0-flash-exp"

DEFAULT_MODE = "camera"

# While Gemini 2.0 Flash is in experimental preview mode, only one of AUDIO or
# TEXT may be passed here.
CONFIG = {"generation_config": {"response_modalities": ["AUDIO"]}}

pya = pyaudio.PyAudio()


class AudioLoop:
    def __init__(self, video_mode=DEFAULT_MODE):
        self.video_mode = video_mode

        self.audio_in_queue = None
        self.out_queue = None

        self.send_text_task = None
        self.receive_audio_task = None
        self.play_audio_task = None

    # text input not supported
    # async def send_text(self):
    #   while True:
    #        text = await asyncio.to_thread(
    #            input,
    #            "message > ",
    #        )
    #        if text.lower() == "q":
    #            break
    #        await self.grpc_client.send(input=text or ".", end_of_turn=True)

    def _get_frame(self, cap):
        # Read the frameq
        ret, frame = cap.read()
        # Check if the frame was read successfully
        if not ret:
            return None
        # Fix: Convert BGR to RGB color space
        # OpenCV captures in BGR but PIL expects RGB format
        # This prevents the blue tint in the video feed
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img = PIL.Image.fromarray(frame_rgb)  # Now using RGB frame
        img.thumbnail([1024, 1024])

        image_io = io.BytesIO()
        img.save(image_io, format="jpeg")
        image_io.seek(0)

        mime_type = "image/jpeg"
        image_bytes = image_io.read()
        return video_service_pb2.Chunk(mime_type = mime_type, payload = image_bytes)

    async def get_frames(self):
        # This takes about a second, and will block the whole program
        # causing the audio pipeline to overflow if you don't to_thread it.
        cap = await asyncio.to_thread(
            cv2.VideoCapture, 0
        )  # 0 represents the default camera

        while True:
            frame = await asyncio.to_thread(self._get_frame, cap)
            if frame is None:
                break

            await asyncio.sleep(1.0)

            await self.out_queue.put(frame)

        # Release the VideoCapture object
        cap.release()

    def _get_screen(self):
        sct = mss.mss()
        monitor = sct.monitors[0]

        i = sct.grab(monitor)

        mime_type = "image/jpeg"
        image_bytes = mss.tools.to_png(i.rgb, i.size)
        img = PIL.Image.open(io.BytesIO(image_bytes))

        image_io = io.BytesIO()
        img.save(image_io, format="jpeg")
        image_io.seek(0)

        image_bytes = image_io.read()
        return video_service_pb2.Chunk(mime_type = mime_type, payload = image_bytes)

    async def get_screen(self):

        while True:
            frame = await asyncio.to_thread(self._get_screen)
            if frame is None:
                break

            await asyncio.sleep(1.0)

            await self.out_queue.put(frame)

    async def stream_to_service(self):
        while True:
            yield self.out_queue.get()

    async def listen_audio(self):
        mic_info = pya.get_default_input_device_info()
        self.audio_stream = await asyncio.to_thread(
            pya.open,
            format=FORMAT,
            channels=CHANNELS,
            rate=SEND_SAMPLE_RATE,
            input=True,
            input_device_index=mic_info["index"],
            frames_per_buffer=CHUNK_SIZE,
        )
        if __debug__:
            kwargs = {"exception_on_overflow": False}
        else:
            kwargs = {}
        while True:
            data = await asyncio.to_thread(self.audio_stream.read, CHUNK_SIZE, **kwargs)
            await self.out_queue.put(video_service_pb2.Chunk(mime_type = "audio/pcm", payload = data))

    async def play_audio(self):
        stream = await asyncio.to_thread(
            pya.open,
            format=FORMAT,
            channels=CHANNELS,
            rate=RECEIVE_SAMPLE_RATE,
            output=True,
        )
        while True:
            bytestream = await self.audio_in_queue.get()
            await asyncio.to_thread(stream.write, bytestream)

    async def stream_to_service(self):
        while True:
            message = await self.out_queue.get()
            yield message

    async def run(self):
        try:
            async with (
                grpc.aio.insecure_channel("localhost:9000") as channel,
                asyncio.TaskGroup() as tg,
            ):

                self.out_queue = asyncio.Queue(maxsize=5)

                stub = video_service_pb2_grpc.VideoServiceEndpointStub(channel)
                response_stream = stub.StreamVideo(self.stream_to_service())

                tg.create_task(self.listen_audio())
                if self.video_mode == "camera":
                    tg.create_task(self.get_frames())
                elif self.video_mode == "screen":
                    tg.create_task(self.get_screen())

                while True:
                    async for response in response_stream:
                        print(response.message.replace("Content: ", "").strip())

        except asyncio.CancelledError:
            pass
        except ExceptionGroup as EG:
            traceback.print_exception(EG)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--mode",
        type=str,
        default=DEFAULT_MODE,
        help="pixels to stream from",
        choices=["camera", "screen", "none"],
    )
    args = parser.parse_args()

    main = AudioLoop(video_mode=args.mode)
    asyncio.run(main.run())
