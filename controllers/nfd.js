var express = require('express');
var router = express.Router();
var backend = require('../modules/backend');
var statusName = '/localhost/nfd/status';
var ProtoBuf = require("protobufjs");
var ProtobufTlv = require('..').ProtobufTlv;

function onStatus(res, content){
  console.log("onStatus");
  console.log("..%j", content.getContent());
  var builder = ProtoBuf.loadProtoFile("./modules/protocol/nfd-status.proto");
  console.log("1");
  var descriptor = builder.lookup("ndn_message.NFDForwardingStatusMessage");
  console.log("2");
  var NFDForwardingStatus = descriptor.build();
  console.log("3");

  var nfdForwardingStatus = new NFDForwardingStatus();
  ProtobufTlv.decode(nfdForwardingStatus, descriptor, content.getContent());
  var nfdId = "";
  if(content.getSignatureOrMetaInfoKeyLocator() != null &&
      content.getSignatureOrMetaInfoKeyLocator().getType() != null)
    nfdId = content.getSignatureOrMetaInfoKeyLocator().getKeyName().toUri();

  res.render('nfd', { nfdData: [{
                    nfdid: nfdId,
                    version: nfdForwardingStatus.version.toString("utf8"),
                    startTime: new Date(nfdForwardingStatus.start_time),
                    currentTime: new Date(nfdForwardingStatus.current_time),
                    upTime: nfdForwardingStatus.current_time - nfdForwardingStatus.start_time + " s",
                    nameTreeEntries: nfdForwardingStatus.name_tree_entries,
                    fibEntries: nfdForwardingStatus.fib_entries,
                    pitEntries: nfdForwardingStatus.pit_entries,
                    measureEntries: nfdForwardingStatus.measure_entires,
                    csEntries: nfdForwardingStatus.cs_entires,
                    inInterests: nfdForwardingStatus.in_interests,
                    inData: nfdForwardingStatus.in_data,
                    outInterests: nfdForwardingStatus.out_interests,
                    outData: nfdForwardingStatus.out_data}]
 });
};

function onError(res, error, errorCode){
  console.log("onError: " + error);
  res.render('error_block', { message: "Unable to retrieve the NFD status: " + error,
                             errorCode: errorCode,
                             errorStack: null});
};

/* GET home page. */
router.get('/status', function(req, res, next) {
  console.log("Stuff");
  backend.getData(res, statusName, onStatus, onError, false);
  console.log("Stuff1");
});

module.exports = router;
