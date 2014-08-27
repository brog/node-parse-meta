node-meta-parser
=============
This module will export the image and description of a given url via the meta tags.  The data prefers og: (Open Graph Protocol http://ogp.me/) tags, but will default to meta description or meta image_src if og tags are not found.

NOTE: This has not been published to npm. 


Installation
-------------------
npm install	git@github.com:brog/node-parse-meta.git


Useage
-------------------
```js
var metaParse = require('node-meta-parser')
	, url = 'http://www.stupidventures.com';

metaParse.processPage(url, function(description, image){
	console.log(description, image);
})
```
