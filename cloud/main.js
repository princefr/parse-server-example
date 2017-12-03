var stripe = require('stripe')(process.env.STRIPE_API_KEY);

Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});
