var cheerio = require('cheerio')// https://github.com/cheeriojs/cheerio
	, http = require("http")
	, fs = require('fs');


function parseDocument (stringHTML) {
	var $ = cheerio.load(stringHTML);

	return $;
}
 

function getPage (url, callback) {
	var urlParts = url.split('/')
		, 
		options = {
		    host: urlParts[0],
		    path: (urlParts.length > 1) ? urlParts.slice(1).join('/') : '/',
		    headers: {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36'}
		}
		, data = '';

	if(options.path===''){
		options.path = '/'
	}
	
	http.get(options, function (http_res) {

	    // this event fires many times, each time collecting another piece of the response
	    http_res.on("data", function (chunk) {
	        // append this chunk to our growing `data` var
	        data += chunk;
	    });

	    // this event fires *one* time, after all the `data` events/chunks have been gathered
	    http_res.on("end", function () {
	        // you can use res.send instead of console.log to output via express
	        callback(data);
	    });
	});
}

function getImage($) {

	var meta = $('meta')
		, keys = Object.keys(meta)
		, imageUrl;

	keys.forEach(function(key){
	if (  meta[key].attribs
	   && meta[key].attribs.property
	   && meta[key].attribs.property === 'og:image:secure_url' ){
	  		imageUrl = meta[key].attribs.content;
		}
	});

	if(null == imageUrl){
		keys.forEach(function(key){

			if (  meta[key].attribs
			   && meta[key].attribs.property
			   && meta[key].attribs.property === 'og:image' ){
			  		description = meta[key].attribs.content;
			}
		});
	}

	if(imageUrl){
		return imageUrl;
	}

	return $('link[rel=image_src]').attr('href');
};

function getMetaDescription($) {

	var meta = $('meta')
		, keys = Object.keys(meta)
		, description;

	keys.forEach(function(key){
		if ( meta[key].attribs &&
			(
				(meta[key].attribs.property && meta[key].attribs.property === 'og:description') ||
				(meta[key].attribs.name && meta[key].attribs.name === 'description') 
			) 
		){
		  	description = meta[key].attribs.content;
		}
	});

	return description;
};

function processPage(page, callback) {
	//remove protocol
	page = page.replace(/^https?:\/\//,'');

	getPage(page, function(stringHTML) {
		
		var $ = parseDocument(stringHTML);

		callback(getMetaDescription($), getImage($));
		
	});
};


exports.processPage = processPage;

