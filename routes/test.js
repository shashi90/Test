
var request = require("request"),
	cheerio = require("cheerio");

var letters = "acdegilmnoprstuw";
var multiplier = 37;

module.exports = function(app) {

	app.get('/LoktraTest/reverseHash', function(req, res) {
		res.render("reversehash")
	});

	var getReverseHashVal = function(hV) {
		var rHV = '';
		var indexInLetters = [];
		var i;

		for(i = 0; hV > multiplier; i++) {
			indexInLetters[i] = Math.floor(hV % multiplier);
			hV = hV / multiplier;
		}

		for(i = (indexInLetters.length - 1); i >= 0; i--) {
			var c = letters[indexInLetters[i]];
			if(!c) {
				return -1;
			}
			rHV += c;
		}

		return rHV;
	}

	app.post('/LoktraTest/reverseHash/submit', function(req, res) {
		var hV = req.body.hashedVal;
		var rHV = getReverseHashVal(hV);
		if(rHV == -1) {
			return res.json({status: 0});
		}
		return res.json({status: 1, reversedHash: rHV});
	});

	// Web Crawler
	app.get('/LoktraTest/webCrawler', function(req, res) {
		res.render("webcrawler")
	});

	var getProductCount = function(numOfPages, prodName, callback) {
		var prodCount = 0;
		var j = 1;
		for(var i = 2; i <= numOfPages; i++) {
			url = "http://www.shopping.com/products~PG-" + i + "?KW=" + prodName;
			request(url, function (err, response, body) {
				j++;
				if (!err) {
					var $ = cheerio.load(body);
					var pCount = $('.gridBox').length;
					prodCount += pCount;
				} else {
					
				}
				if(j == numOfPages) {
					callback(prodCount);
				}
			});
		}
	}

	app.post('/LoktraTest/webCrawler/submit', function(req, res) {
		var prodName = req.body.prodName;
		var pageNum = req.body.pageNum
		var url = "http://www.shopping.com/products?KW=" + prodName;
		if(pageNum) {
			url = "http://www.shopping.com/products~PG-" + pageNum + "?KW=" + prodName;
		}

		console.log(url);
		request(url, function (err, response, body) {
			if (!err) {
				var $ = cheerio.load(body);
				if(!pageNum) {
					var p1Count = $('.gridBox').length;
					if(p1Count == 0){
						return res.json({status:1, prodCount: 0});
					}
					var numOfPages = $('.paginationNew span[align="center"] a').last().text().trim() - 0;
					if(numOfPages > 1) {
						getProductCount(numOfPages, prodName, function(prodCount){
							return res.json({status:1, prodCount: prodCount + p1Count});
						});
					} else {
						return res.json({status:1, prodCount: p1Count});
					}
				} else {
					var pNum = $('.productName span').length;
					var products = [];
					for(var i = 0; i < pNum; i++) {
						products.push($($('.productName span')[i]).attr("title"));
					}
					return res.json({status: 1, products: products});
				}
			} else {
				return res.json({status: 0});
			}
		});
	});
}
