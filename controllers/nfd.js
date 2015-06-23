var express = require('express');
var router = express.Router();
var backend = require('../modules/backend');
var statusName = '/localhost/nfd/status';
var ProtoBuf = require("protobufjs");
var ProtobufTlv = require('..').ProtobufTlv;

function onStatus(res, content){
  console.log("onStatus");
  console.log("..%j", content);
  var builder = ProtoBuf.loadProtoFile("../modules/protocol/nfd-status.proto");
  console.log("1");
  var descriptor = builder.lookup("ndn_message.NFDForwardingStatus");
  console.log("2");
  var NFDForwardingStatus = descriptor.build();
  console.log("3");

  var nfdForwardingStatus = new NFDForwardingStatus();
  ProtobufTlv.decode(nfdForwardingStatus, descriptor, content);
  res.render('nfd', { nfdData: [{
                    version: nfdForwardingStatus.version,
                    startTime: nfdForwardingStatus.start_time,
                    currentTime: nfdForwardingStatus.current_time,
                    NameTreeEntires: nfdForwardingStatus.name_tree_entries,
                    fibEntries: nfdForwardingStatus.fib_entries,
                    pitEntries: nfdForwardingStatus.pit_entries,
                    measureEntries: nfdForwardingStatus.measure_entires,
                    csEntries: nfdForwardingStatus.cs_entires,
                    inInterests: nfdForwardingStatus.in_interests,
                    inData: nfdForwardingStatus.in_data,
                    outInterests: nfdForwardingStatus.out_interests,
                    outData: nfdForwardingStatus.out_data,
                    inBytes: nfdForwardingStatus.in_bytes,
                    outBytes: nfdForwardingStatus.out_bytes      }]
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
  backend.getData(res, statusName, onStatus, onError);
  console.log("Stuff1");
});

module.exports = router;
