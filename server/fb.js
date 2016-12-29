var FB = require('fb');

fb = new FB.Facebook({
	appId      : '1074072789305842',
	appSecret: 'e916ed8adfacd35f954127a94451b1de',
	status     : true,
	xfbml      : true,
	version    : 'v2.6'
});

fb.api('oauth/access_token', 
	{
		client_id: '1074072789305842',
		client_secret: 'e916ed8adfacd35f954127a94451b1de',
		grant_type: 'client_credentials'
	},
	function(res){
		fb.setAccessToken(res.access_token)
	}
);
