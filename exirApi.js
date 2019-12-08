require('dotenv/config');
const Api = require('./apiFunc');
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

async function allOrders(side,value){

	const url= 'https://api.testnet.exir.io/v0/user/orders?symbol=btc-tmn' //'https://api.exir.io/v0/user/orders?symbol=btc-tmn'
	const exirClient = new Api(url, ACCESS_TOKEN)
	bsOrders =  await exirClient.exAllOrders()
		.then(async res => {
			try{
				response = JSON.parse(res)
				return side === 'sell' ?   response.filter( order => order.side === side && order.price <= value) : 				
					   side === 'buy' ?   response.filter( order => order.side === side && order.price >= value) : '' ;

			}catch(e){ console.log(e)}
		})
		.catch(err => {console.log(err)})
		// console.log("bsOrders",bsOrders)
		bsOrders.length ? cancelOrders(bsOrders,value) : console.log(`You Do Not Have ${side} Order` )
}

function cancelOrders(bsOrders){

	const url= ' https://api.testnet.exir.io/v0/user/orders' //'https://api.exir.io/v0/user/orders?symbol=btc-tmn'
	const exirClient = new Api(url, ACCESS_TOKEN)
	bsOrders.map(order => {
		exirClient.exCancelOrders(order.id)
			.then(res => {
				try{
					response = JSON.parse(res)
				}catch(e){console.log(e)}
				console.log("its deleted!!!!!!!!!!!!!!!!!!1",response)
			})
			.catch(err => {console.log(err)})
	})


}


module.exports = {
	allOrders
}