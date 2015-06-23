var express = require('express');
var router = express.Router();
var backend = require('../modules/backend');
var channelStatusName = '/localhost/nfd/faces/channels';
var listFacesName = '/localhost/nfd/faces/list';
var ProtoBuf = require("protobufjs");
var ProtobufTlv = require('..').ProtobufTlv;

function onChannelSuccess(res, encodedMessage){
  var builder = ProtoBuf.loadProtoFile("./modules/protocol/faces-channels.proto");
  var descriptor = builder.lookup("ndn_message.ChannelStatusMessage");
  var ChannelStatusMessage = descriptor.build();

  var channelStatusMessage = new ChannelStatusMessage();
  ProtobufTlv.decode(channelStatusMessage, descriptor, encodedMessage);
  var channelsData = [];
  for (var iEntry = 0; iEntry < channelStatusMessage.channel_status.length; ++iEntry) {
    var channelStatus = channelStatusMessage.channel_status[iEntry];
    channelsData.push(channelStatus.local_uri);
  }
  res.render('faces/channels', { channels: channelsData
  });
};

function onChannelError(res, error, errorCode){
  console.log("onChannelError: " + error);
  res.render('error_block', { message: "Unable to retrieve the channels: " + error,
                             errorCode: errorCode,
                             errorStack: null});
};

function onListSuccess(res, encodedMessage){
  var builder = ProtoBuf.loadProtoFile("./modules/protocol/faces-status.proto");
  var descriptor = builder.lookup("ndn_message.FaceStatusMessage");
  var ChannelStatusMessage = descriptor.build();

  var FaceStatusMessage = descriptor.build();

  var faceStatusMessage = new FaceStatusMessage();
  ProtobufTlv.decode(faceStatusMessage, descriptor, encodedMessage);
  var faceData = [];
  console.log("Faces:");
  for (var iEntry = 0; iEntry < faceStatusMessage.face_status.length; ++iEntry) {
    var faceStatus = faceStatusMessage.face_status[iEntry];

    // Format to look the same as "nfd-status -f".
    var _face = {};
    _face.face_id = faceStatus.face_id;
    _face.uri = faceStatus.uri;
    _face.local_uri = faceStatus.local_uri
    _face.scope = (faceStatus.face_scope == 1 ? "local" : "non-local");
    _face.expires = null;
    if (faceStatus.expiration_period != undefined)
      // Convert milliseconds to seconds.
      _face.expires = Math.round(faceStatus.expiration_period / 1000) + "s";
    _face.persistency = (faceStatus.face_persistency == 2 ? "permanent" :
                         faceStatus.face_persistency == 1 ? "on-demand" : "persistent");
    _face.link_type = (faceStatus.link_type == 1 ? "multi-access" : "point-to-point");
    _face.interests = {in: faceStatus.n_in_interests, out: faceStatus.n_out_interests};
    _face.data = {in: faceStatus.n_in_datas, out: faceStatus.n_out_datas};
    _face.bytes = {in: faceStatus.n_in_bytes, out: faceStatus.n_out_bytes};

    faceData.push(_face);
  }
  res.render('faces/list', { faceList: faceData
  });
};

function onListError(res, error, errorCode){
  console.log("onListError: " + error);
  res.render('error_block', { message: "Unable to retrieve the channels: " + error,
                             errorCode: errorCode,
                             errorStack: null});
};

/* GET Channels page. */
router.get('/channels', function(req, res, next) {
  backend.getData(res, channelStatusName, onChannelSuccess, onChannelError);
});
/* Get Face list page*/
router.get('/list', function(req, res, next) {
  backend.getData(res, listFacesName, onListSuccess, onListError);
});

module.exports = router;
