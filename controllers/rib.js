var express = require('express');
var router = express.Router();
var backend = require('../modules/backend');
var ribListName = '/localhost/nfd/rib/list';
var ProtoBuf = require("protobufjs");
var ProtobufTlv = require('..').ProtobufTlv;

function onListStatus(res, encodedMessage){
  var builder = ProtoBuf.loadProtoFile("./modules/protocol/rib-entry.proto");
  var descriptor = builder.lookup("ndn_message.RibEntryMessage");
  var RibEntryMessage = descriptor.build();

  var ribMessage = new RibEntryMessage();
  ProtobufTlv.decode(ribMessage, descriptor, encodedMessage);
  var ribData = [];
  console.log("%j", ribMessage);
  for (var iEntry = 0; iEntry < ribMessage.rib_entry.length; ++iEntry) {
    var ribEntry = ribMessage.rib_entry[iEntry];
    var _ribEntry = {};
    var ribName = "";
    for(var iName = 0; iName < ribEntry.name.component.length; ++iName ){
      ribName += "/" + ribEntry.name.component[iName].toString("utf8");
    }
    _ribEntry.name = ribName
    _ribEntry.routes = ribEntry.routes
    ribData.push(_ribEntry);
  }
  res.render('rib/list', { ribData: ribData
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
  backend.getData(res, ribListName, onListStatus, onListError);
});

module.exports = router;
