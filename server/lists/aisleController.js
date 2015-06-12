var request = require('request');
var parseXml = require('xml2js').parseString;
var config = require('./config')

module.exports = function(req,res) {
	var itemName = req.param('name');
	console.log("req.params:", req.params);
	console.log("req.param:", req.param);
	var url = "http://www.SupermarketAPI.com/api.asmx/SearchForItem?APIKEY=" + config.superMarketApiKey 
    + "&StoreId=" + config.sampleSuperMarketId + "&ItemName=" + itemName;

  request.get(url, function(err, requestRes, body) {
  	if (err) {
  		console.error(err);
  	}
  	parseXml(body, function(err, result) {
  		if (err) {
  			console.error(err);
  		}
      console.log(result.ArrayOfProduct.Product);
  		res.status(200).json(result.ArrayOfProduct.Product);
  	})
  })
}