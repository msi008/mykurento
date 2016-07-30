
var oauth_opts =
{
	qq:{
		client_id: "101208996",
		app_key: "49a34a48ef3d077d4971824595ae9887",
		base_uri: "https://graph.qq.com/oauth2.0/authorize?",
		redirect_uri: "https://www.handword.com/logon/qq",
		response_type:"code",
		state:"hisun123"
	},
	wechat : {
		appid:"wx6cc0359ebadad829",
		secret:"27c1788849c03225ee30ebe8b275af82",
		redirect_url: "https://www.handword.com/wxoauth/callback"
	},
	weibo : {
		client_id: "1652564834",
		client_secret: "99910eff2287b3b1af70a3af24a3d15b",
		redirect_uri: "https://www.handword.com:8443/logon/weibo/callback"
	}
};
module.exports = oauth_opts;