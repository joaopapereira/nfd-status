var express = require('express');
var router = express.Router();
var backend = require('../modules/backend');
var fibListName = '/localhost/nfd/fib/list';
var ProtoBuf = require("protobufjs");
var ProtobufTlv = require('..').ProtobufTlv;

function onListStatus(res, encodedMessage){
  var builder = ProtoBuf.loadProtoFile("./modules/protocol/fib-entry.proto");
  var descriptor = builder.lookup("ndn_message.FibEntryMessage");
  var FibEntryMessage = descriptor.build();

  var fibMessage = new FibEntryMessage();
  ProtobufTlv.decode(fibMessage, descriptor, encodedMessage);
  var fibData = [];
  console.log("%j", fibMessage);
  for (var iEntry = 0; iEntry < fibMessage.fib_entry.length; ++iEntry) {
    var fibEntry = fibMessage.fib_entry[iEntry];
    var _fibEntry = {};
    var fibName = "";
    for(var iName = 0; iName < fibEntry.name.component.length; ++iName ){
      fibName += "/" + fibEntry.name.component[iName].toString("utf8");
    }
    _fibEntry.name = fibName
    _fibEntry.next_hops = fibEntry.next_hop_records
    fibData.push(_fibEntry);
  }
  res.render('fib/list', { fibData: fibData
  });
};

function onListError(res, error, errorCode){
  console.log("onError: " + error);
  res.render('error_block', { message: "Unable to retrieve the FIB List: " + error,
                             errorCode: errorCode,
                             errorStack: null});
};

/* GET home page. */
router.get('/list', function(req, res, next) {
  backend.getData(res, fibListName, onListStatus, onListError);
});

module.exports = router;
