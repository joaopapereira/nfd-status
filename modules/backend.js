var Face = require('..').Face;
var Blob = require('..').Blob;
var Name = require('..').Name;
var Interest = require('..').Interest;
var UnixTransport = require('..').UnixTransport;
var SegmentFetcher = require('..').SegmentFetcher;
var hostip = "spurs.cs.ucla.edu";
function getData(response, interestName, onData, onError, useSegmentFetcher){
  // Connect to the local forwarder with a Unix socket.
  var face = new Face(new UnixTransport());

  var interest = new Interest(new Name(interestName));
  interest.setInterestLifetimeMilliseconds(10000);
  console.log("Express interest " + interest.getName().toUri());
  if(useSegmentFetcher){
    _getDataSegmentFetcher(face, interest, response, onData, onError);
  }else {
    _getDataDirect(face, interest, response, onData, onError);
  }
};
function _getDataSegmentFetcher(face, interest, response, onData, onError){
  SegmentFetcher.fetch
    (face, interest, SegmentFetcher.DontVerifySegment,
     function(content) {
       face.close();  // This will cause the script to quit.
       //printChannelStatuses(content);
       onData(response, content);
     },
     function(errorCode, message) {
       face.close();  // This will cause the script to quit.
       console.log(message);
       onError(response, message, errorCode);
     });
}
function _getDataDirect(face, interest, response, onData, onError){
  interest.setMustBeFresh(true);
  interest.setChildSelector(1);
  face.expressInterest
    (interest, function(originalInterest, data){
          onData(response, data);
        },
        function(interest) {
          var message = "Timeout on interest " + interest.getName().toUri();
          console.log(message);
          onError(response, message, -1);
        });
}

module.exports = getData;
module.exports = {
  getData: function(response, interestName, onData, onError, useSegmentFetcher){
    useSegmentFetcher = typeof useSegmentFetcher !== 'undefined' ?  useSegmentFetcher : true;
    getData(response, interestName, onData, onError, useSegmentFetcher);}
}
