# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# NO CHECKED-IN PROTOBUF GENCODE
# source: video-service.proto
# Protobuf Python Version: 5.29.0
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(
    _runtime_version.Domain.PUBLIC,
    5,
    29,
    0,
    '',
    'video-service.proto'
)
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x13video-service.proto\"+\n\x05\x43hunk\x12\x11\n\tmime_type\x18\x01 \x01(\t\x12\x0f\n\x07payload\x18\x02 \x01(\x0c\"\x16\n\x03\x41\x63k\x12\x0f\n\x07message\x18\x01 \x01(\t27\n\x14VideoServiceEndpoint\x12\x1f\n\x0bStreamVideo\x12\x06.Chunk\x1a\x04.Ack(\x01\x30\x01\x42\x11\n\rio.akka.videoP\x01\x62\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'video_service_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
  _globals['DESCRIPTOR']._loaded_options = None
  _globals['DESCRIPTOR']._serialized_options = b'\n\rio.akka.videoP\001'
  _globals['_CHUNK']._serialized_start=23
  _globals['_CHUNK']._serialized_end=66
  _globals['_ACK']._serialized_start=68
  _globals['_ACK']._serialized_end=90
  _globals['_VIDEOSERVICEENDPOINT']._serialized_start=92
  _globals['_VIDEOSERVICEENDPOINT']._serialized_end=147
# @@protoc_insertion_point(module_scope)
