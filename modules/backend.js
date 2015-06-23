var Face = require('..').Face;
var Blob = require('..').Blob;
var Name = require('..').Name;
var Interest = require('..').Interest;
var UnixTransport = require('..').UnixTransport;
var SegmentFetcher = require('..').SegmentFetcher;
var hostip = "spurs.cs.ucla.edu";
function getData(response, interestName, onData, onError){
  // Connect to the local forwarder with a Unix socket.
  var face = new Face(new UnixTransport());

  var interest = new Interest(new Name(interestName));
  interest.setInterestLifetimeMilliseconds(10000);
  console.log("Express interest " + interest.getName().toUri());

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
};

module.exports = getData;
module.exports = {
  getData: function(response, interestName, onData, onError){
    getData(response, interestName, onData, onError);}
}
