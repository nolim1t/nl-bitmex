const process = require('process');

module.exports = function(prefixinfo) {
  if (prefixinfo.endpoint !== undefined) {
    var version = prefixinfo["version"] || process.env.APIVERSION || "v1";
    var querystring = "?" + prefixinfo["querystring"] || "";
    return "/api/" + version + "/" + prefixinfo.endpoint + querystring;
  } else {
    return;
  }

}
