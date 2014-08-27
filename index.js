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
		    path: urlParts.length>1 ? urlParts.slice(1).join('/') : '/'
		}
		, data = '';

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

function getMeta($) {

	var meta = $('meta')
		, keys = Object.keys(meta)
		, description;

	keys.forEach(function(key){
		if ( meta[key].attribs
		   && meta[key].attribs.property
		   && (meta[key].attribs.property === 'og:description'
		   || meta[key].attribs.property === 'description') ){
		  		description = meta[key].attribs.content;
			}
	});

	return description;
};

function processPage(page, callback) {
	//remove protocol
	page = page.replace(/^https?:\/\//,'')

	getPage(page, function(stringHTML) {
		
		var $ = parseDocument(stringHTML);

		callback(getMeta($), getImage($));
		
	});
};


exports.processPage = processPage;

