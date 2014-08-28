var assert = require("assert")
	, metaParse = require('../index');



describe('metaParse', function(){

  describe('testParse', function(){

    it('url', function(done){

    	metaParse.processPage('http://kikin.com', function(desc, url) {
    		
    		console.log(desc, url);

    		done();

    	})

    });

  });

});