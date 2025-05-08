from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class Chunk(_message.Message):
    __slots__ = ("mime_type", "payload")
    MIME_TYPE_FIELD_NUMBER: _ClassVar[int]
    PAYLOAD_FIELD_NUMBER: _ClassVar[int]
    mime_type: str
    payload: bytes
    def __init__(self, mime_type: _Optional[str] = ..., payload: _Optional[bytes] = ...) -> None: ...

class Ack(_message.Message):
    __slots__ = ("message",)
    MESSAGE_FIELD_NUMBER: _ClassVar[int]
    message: str
    def __init__(self, message: _Optional[str] = ...) -> None: ...
