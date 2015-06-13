var request = require('request');
var parseXml = require('xml2js').parseString;
var config = {
   usdaKey : 'mGJLNkyEOxqIQg0i99gC6by18qabPPIJbxc91w8H',
   superMarketApiKey: 'd53f07be7d',
   sampleSuperMarketId: 'e6k3fjw75k',
};

module.exports = function(req,res) {
	var itemName = req.query.name;
  console.log(itemName);
  console.log(config.sampleSuperMarketId);
  console.log(config.superMarketApiKey);
	var url = "http://www.SupermarketAPI.com/api.asmx/SearchForItem?APIKEY=" + config.superMarketApiKey 
    + "&StoreId=" + config.sampleSuperMarketId + "&ItemName=" + itemName;
    url = url.split(' ').join('+');
    console.log("requested: ", url);

  request.get(url, function(err, requestRes, body) {
  	if (err) {
  		console.error(err);
  	}
  	parseXml(body, function(err, result) {
  		if (err) {
  			console.error(err);
  		}
      console.log(result);
      console.log(result.ArrayOfProduct.Product); 
  		res.status(200).json(result.ArrayOfProduct.Product);
  	})
  })
}