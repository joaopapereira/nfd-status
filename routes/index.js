var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NFD Status',
                        version: '0.3.2-4-gcb6e05f'
  });
});

module.exports = router;
