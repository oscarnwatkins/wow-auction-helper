const express = require('express'),
  router = express.Router()
  AWS = require('aws-sdk'),
  url = require('url'),
  secrets = require('../secrets/secrets');


// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};

// Response handling
let response = {
  status: 200,
  data: [],
  message: null
};

router.get('*', (req, res) => {
  const url = req.query.url;
	res.setHeader('content-type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (url) {
    request(url).pipe(res);
  } else {
    return {
      realms: [],
      auctions: []
    }
  }
});

module.exports = router;