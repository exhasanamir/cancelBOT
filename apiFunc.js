const { createRequest } = require('./utils');

class Api {
	constructor(url,Token) 
		{   
			this._url = url ;   
			this._accessToken = Token || '';
			this._headers = {
			   'content-type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + this._accessToken
			};
		}

	bMTicker() {
		return createRequest('GET', `${this._url}`, this._headers);
	}
	exOrderBook() {		
		return createRequest('GET', `${this._url}`, this._headers);		
	}
	exAllOrders() {
		return createRequest('GET', `${this._url}`, this._headers);
	}
	exCancelOrders(orderId) {
		return createRequest('DELETE', `${this._url}/${orderId}`, this._headers);
	}
							

}

module.exports = Api;
