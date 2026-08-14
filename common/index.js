'use strict'
const crypto = require('crypto')
const db = uniCloud.database()
const $cmd = db.command
exports.main = async (event, context) => {
	console.log('event.body: ',event.body);
	
	if (!event.body) {
		return {
			"code": 2,
			"msg": "未知错误"
		}
	}
	// 分解
	let arr = event.body.split("&"); //先通过？分解得到？后面的所需字符串，再将其通过&分解开存放在数组里
	let data = {};
	for (let i of arr) {
		data[i.split("=")[0]] = i.split("=")[1]; //对数组每项用=分解开，=前为对象属性名，=后为属性值
	}
	console.log(data); 
	let appSecret = "guBcShOsaqM4gfBiE46AO20I3E3iRnUi"
	const hmac = crypto.createHash('md5')
	console.log(data)
	let str = appSecret + data.time
	hmac.update(str)
	// if (data.sign !== hmac.digest('hex')) {
	// 	console.log("签名不正确")
	// 	return {
	// 		"code": "401",
	// 		"msg": "签名不正确",
	// 		"data": true
	// 	}
	// }
	let res = await db.collection('xjx').where({
		tagId: data.tagId
	}).get()
	if (res.data.length > 0) {
		return {
			"code": 200,
			"msg": "success",
			"data": true
		}
	}
	// 判断用户是否存在
	let resUser = await db.collection('uni-id-users').doc(data.userId).field({
		play_count: true,
		income: true,
		mobile: true,
		inviter_uid: true
	}).get()
	console.log(resUser)
	// 判断用户是否存在
	if (resUser.data.length == 0) {
		return {
			code: 0,
			message: "用户不存在"
		}
	}
	let userinfo = resUser.data[0]
	let play_count = userinfo.play_count || 0
	let mobile = userinfo.mobile || ''
	let income = userinfo.income || 0
	let name = userinfo.mobile.substr(0, 3) + '****' + userinfo.mobile.substr(-4)
	 
	let money = Number(data.rewardAmount)
	let xxd = money * 0.5
	const transaction = await db.startTransaction()
	try {
		await transaction.collection('xjx').add(data)
		await transaction.collection('uni-id-users').doc(data.userId).update({
			income: $cmd.inc(xxd),
			yyhb_number: $cmd.inc(1),
			yyhb_count: $cmd.inc(1)
		})
		await transaction.collection('money-details').add({
			userid: data.userId,
			title: '语音红包奖励',
			status: 1,
			money: xxd,
			q_income: income,
			h_income: income + xxd,
			user_dec: {
				mobile: mobile
			},
			system_dec: context,
			creat_date: new Date().getTime()
		})
		// 增加相关数据
		await transaction.collection('dj').doc("63ac07eee1a35c86f4b7e120").update({
			count_yyuser: $cmd.inc(xxd),
			count_yyme: $cmd.inc(money - xxd),
			today_yyuser: $cmd.inc(xxd),
			today_yyme: $cmd.inc(money - xxd),
			
		})
		
		// 成功
		await transaction.commit()
		return {
			"code": 200,
			"msg": "success",
			"data": true
		}
	} catch (e) {
		await transaction.rollback()
		//返回数据给客户端
		return {
			"code": 0,
			"msg": e.message,
			"data": true
		}
	}

};
