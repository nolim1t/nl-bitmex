const isStringEmpty = require('fuckingundefinedemptynull').isStringSet;
var crypto = require('crypto');

module.exports = function(authinfo) {
  var expiry = new Date().getTime() + (60 * 1000);
  var headers = {
    'content-type' : 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  };
  if (isStringEmpty(authinfo.secret) && isStringEmpty(authinfo.key) && isStringEmpty(authinfo.verb) && isStringEmpty(authinfo.path)) { // If 'key', 'secret', 'path', 'verb' and 'data' are set
    var postbody, signature
    if (authinfo["data"] !== undefined) {
      postbody = JSON.stringify(authinfo["data"]);
      signature = crypto.createHmac('sha256', authinfo.secret).update(authinfo.verb + authinfo.path + expiry + postBody).digest('hex');
    } else { // No data set
      signature = crypto.createHmac('sha256', authinfo.secret).update(authinfo.verb + authinfo.path + expiry).digest('hex');
    }

    headers['api-key'] = authinfo['key'];
    headers['api-signature'] = signature;
    headers['api-expires'] = expiry;
  }

  return headers;
}
