var express = require('express');
var router = express.Router();
var face = new Face();
var statusName = '/localhost/nfd/status';
/* GET home page. */
router.get('/', function(req, res, next) {
  face.expressInterest
    (new Name(statusName),
     function(interest, content) { onData(interest, content, T0); },
     onTimeout);
   };
  res.render('nfd', { nfdData: []
  });
});

module.exports = router;
