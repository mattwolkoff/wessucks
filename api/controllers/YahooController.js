/**
 * YahooController
 *
 * @description :: Server-side logic for managing yahoos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var FantasySports = require('FantasySports');
FantasySports.options({
    "accessTokenUrl": "https://api.login.yahoo.com/oauth/v2/get_request_token",
    "requestTokenUrl": "https://api.login.yahoo.com/oauth/v2/get_token",
    "oauthKey": 'dj0yJmk9STc4czc0dEdkcmRtJmQ9WVdrOVFtUm1kalpoTm5FbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1lOQ--',
    "oauthSecret": 'bda6e823ad9c1c7ebdcec8d625ab532806b119e9',
    "version": "1.0",
    "callback": "http://localhost:1337/auth/oauth/callback",
    "encryption": "HMAC-SHA1"
});

module.exports = {
	index:function(req,res){
		if (!req.session.oauthAccessToken) {
        	return res.redirect('/auth/oauth');
    	}

	    FantasySports.
	        request(req, res)
	        .api('https://social.yahooapis.com/v1/user/' + req.session.xoauthYahooGuid + '/profile/usercard?format=json')
	        .done(function(data) {
	            data = data.profile;
	                res.view({ 
	                    title: 'Express',
	                    user: JSON.stringify(data)
	                });	

	        });
			
	},
	//auth/oauth
	oauth:function(req,res){
		// 		$key = 'dj0yJmk9Ulgwa3l4dldhY1dLJmQ9WVdrOVVFeHJXV1JOTkhVbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD00Mg--';
		// $secret = '7f9644010c933964f70d13edae5b657522cf65d1';
		// $appid = 'mangames';
		req.session.key = 'dj0yJmk9STc4czc0dEdkcmRtJmQ9WVdrOVFtUm1kalpoTm5FbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1lOQ--',
		req.session.secret = 'bda6e823ad9c1c7ebdcec8d625ab532806b119e9',
		req.session.proxy = true;
		req.session.save(function(){
			console.log('doing auth',req.session)
			FantasySports.startAuth(req, res);
		})
	},

	// app.get("/auth/oauth/callback")
	authorize:function(req, res) {
		console.log('authorize')
    	FantasySports.endAuth(req, res);
	},

	myTeams:function(req, res) {
   	console.log('get my teams');

   	var path = 'http://fantasysports.yahooapis.com/fantasy/v2/league/12344/teams?format=json',
   		stupid_path = "http://fantasysports.yahooapis.com/fantasy/v2/league/12344/players?format=json",
   		crazy_path = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20fantasysports.leagues%20where%20league_key%3D'nhl.l.12344'&format=json&callback="

    FantasySports
        .request(req, res)
        .api(crazy_path)
        .done(function(data) {
            
        	console.log('-----------------------------------------')
        	console.log(data);
        	console.log('-----------------------------------------')
            res.json(data);
        });
	}
};

