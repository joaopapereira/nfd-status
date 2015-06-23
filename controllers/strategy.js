var express = require('express');
var router = express.Router();
var backend = require('../modules/backend');
var strategyListName = '/localhost/nfd/strategy-choice/list';
var ProtoBuf = require("protobufjs");
var ProtobufTlv = require('..').ProtobufTlv;

function onListStatus(res, encodedMessage){
  var builder = ProtoBuf.loadProtoFile("./modules/protocol/strategy-entry.proto");
  var descriptor = builder.lookup("ndn_message.StrategyEntryMessage");
  var StrategyEntryMessage = descriptor.build();

  var strategyMessage = new StrategyEntryMessage();
  ProtobufTlv.decode(strategyMessage, descriptor, encodedMessage);
  var strategyData = [];
  console.log("encoded: %j", encodedMessage);
  console.log("%j", strategyMessage);
  for (var iEntry = 0; iEntry < strategyMessage.strategy_entry.length; ++iEntry) {
    var strategyEntry = strategyMessage.strategy_entry[iEntry];
    var _strategyEntry = {};
    var strategyNamespace = "";
    for(var iName = 0; iName < strategyEntry.namespace.component.length; ++iName ){
      strategyNamespace += "/" + strategyEntry.namespace.component[iName].toString("utf8");
        console.log("NameSpace: " + strategyNamespace);
    }
    if(strategyNamespace.length == 0)
      strategyNamespace = "/";
    _strategyEntry.namespace = strategyNamespace;
    var strategyName = "";
    for(var iName = 0; iName < strategyEntry.strategy_name.name.component.length; ++iName ){
      var namePart = strategyEntry.strategy_name.name.component[iName];

      strategyName += "/" + encodeURIComponent(namePart.toString("utf8"));//.toString("utf8");
    }
    console.log("Name: " + strategyName);
    _strategyEntry.strategy_name = strategyName
    strategyData.push(_strategyEntry);
  }
  res.render('strategy/list', { strategyData: strategyData
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
  backend.getData(res, strategyListName, onListStatus, onListError);
});

module.exports = router;
