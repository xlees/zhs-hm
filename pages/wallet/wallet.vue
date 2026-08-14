<template>
	<view>
		<!-- 余额明细 -->
		<view class="zcolor-while mar-30 bor-r30 pa-30" style="position: relative;">
			
			<view class="dflex flex-row justify-space-between align-center">
				<topDec name="账户余额"></topDec>
				<view class="dflex flex-row align-center" @click="navTo('/pages/cps/cps-list')">
					<text class="fs-26 fcolor-dark1">待返:</text>
					<text class="fs-26 f-w fcolor-red mar-l5">{{ restitutionMoney }}</text>
					<text class="fs-26 fcolor-dark1">元</text>
					<uni-icons type="right" color="#cccccc" size="17"></uni-icons>
				</view>
			</view>
			
			<view class=" dflex flex-row align-center justify-space-between mar-t60"  @click="navTo('/pages/wallet/money-detail')">
				<text class="fs-40 f-w fcolor-red ">{{ parseFloat(income).toFixed(2) }}</text>
			</view>
			
			<view class="zcolor-while1 dflex justify-center align-center"
				style="width: 170rpx; height: 70rpx;position: absolute;bottom: 30rpx; right: 0rpx;border-top-left-radius: 50rpx;border-bottom-left-radius: 50rpx;"
				@click="navTo('../wallet/money-detail')">
				<text class="fs-28  f-w">查看明细</text>
			</view>
		</view>
		
		<!-- 提现金额门槛 -->
		<view class="zcolor-while mar-30 bor-r30 pa-30" style="margin-top: 0;">
			<topDec name="提现金额"></topDec>
			<view class="dflex flex-row justify-space-between flex-wrap mar-t15" style="padding-bottom: 10rpx;">
				<view  class="align-center bor-r30 dflex flex-column  justify-center  pa-15 mar-t30" style="width: 170rpx;"
					v-for="(item, index) in walletTabBars" :key="index" @click="tabBar(index)"
					:class="tabIndex === index ? 'zcolor-black' : 'zcolor-f1f1f1'">
					<text class="fs-28"
						:class="tabIndex === index ? 'f-w fcolor-while' : ''">{{ parseInt(item.money) }}元</text>
					<text class="fs-23 mar-t15" :class="tabIndex === index ? 'f-w fcolor-while' : ''">无门槛</text>
				</view>
			</view>
		</view>
		
		<!-- 提现方式 -->
		<!-- #ifdef APP -->
		<view class="zcolor-while mar-30 bor-r30 pa-30" style="margin-top: 0;" v-if="isxcx">
			<!-- <view class="dflex flex-row justify-space-between align-center">
				<topDec name="提现方式"></topDec>
				<view class="dflex flex-row align-center" @click="navTo('/pages/setup/bind-account')">
					<text class="fs-26 fcolor-dark1">修改/绑定收款账户</text>
					<uni-icons type="right" color="#cccccc" size="17"></uni-icons>
				</view>
			</view> -->
			<!-- <radio-group class="mar-t30" @change="zhClass"> -->
				
				<!-- <label class="dflex flex-row justify-space-between align-center mar-t15">
					<view class="dflex flex-row align-center">
						<image src="../../static/zfb.png" mode="widthFix" class="wh-60"></image>
						<text class="fs-28 fcolor-dark2  mar-l15">支付宝</text>
					</view>
					<radio value="0" color="#000000" checked="true" style="transform:scale(0.7)" />
				</label> -->
				
				<!-- <label class="dflex flex-row justify-space-between align-center mar-t30">
					<view class="dflex flex-row align-center">
						<image src="../../static/spread/wx.png" class="wh-65" mode="widthFix"></image>
						<text class="fs-28 fcolor-dark2  mar-l15">微信</text>
					</view>
					<radio value="1" color="#000000" style="transform:scale(0.7)" />
				</label> -->
			<!-- </radio-group> -->
		</view>
		
		<!-- <view class="zcolor-while mar-30 bor-r30 pa-30" style="margin-top: 0;" v-else>
			<view class="dflex flex-row justify-space-between align-center">
				<topDec name="提现方式"></topDec>
				
			</view>
			<radio-group class="mar-t30" @change="zhClass">
				
				<label class="dflex flex-row justify-space-between align-center mar-t30">
					<view class="dflex flex-row align-center">
						<image src="../../static/spread/wx.png" class="wh-65" mode="widthFix"></image>
						<text class="fs-28 fcolor-dark2  mar-l15">微信</text>
					</view>
					<radio value="1" color="#000000" checked="true" style="transform:scale(0.7)" />
				</label>
			</radio-group>
		</view> -->
		<!-- #endif -->
		
		<!-- 需要注册插件 -->
		<!-- <view class="mar-30 bor-r30  gradient-green-while" style="margin-top: 0;" v-if="isAd">
			<ad :ad-pid="$store.state.adList.xxl" @load="onload" @close="onclose" @error="onerror"></ad>
		</view> -->
		
		<view style="height: 130rpx;"></view>
		
		<!-- 按钮 -->
		<doubleButton left_name="查看明细" right_name="申请提现"  @l-event="navTo('/pages/wallet/money-detail')"
			@r-event="withdrawalAdd">
		</doubleButton>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import Common from '@/common/common'
import Api from '@/common/api.ts'
import { useUserAuthStore } from '@/store/user-auth'

const userStore = useUserAuthStore()

// 页面数据
const rightDisable = ref(false)
const noClick = ref(true)
const tabIndex = ref(0)
const radio = ref(0)
const income = ref(0.0)
const restitutionMoney = ref('0.00')
const name = ref('')
const alipay = ref('')
const task_status = ref(0)
const isxcx = ref(false)
const isAd = ref(true)
const walletTabBars = ref([
	// {
	// 	money: 1,
	// 	id: 1
	// },
	// {
	// 	money: 5,
	// 	id: 1
	// },
	{
		money: 30,
		id: 2
	},
	{
		money: 50,
		id: 3
	},
	{
		money: 100,
		id: 4
	},
	{
		money: 200,
		id: 5
	},
])

// onLoad 生命周期
onLoad((e: any) => {
	// await getApp().initCtx()
	
	// 
	// let obj = {
	// 	name: "mp-money-update",
	// 	action: 'updateMoney/getUserInfo',
	// 	data: {
	// 		uid: uniCloud.getCurrentUserInfo().uid
	// 	}
	// }
	// let user_result = await Api.cloudHttp(obj)
	// let userinfo = user_result.result.data.data[0]
	// console.log('userinfo:', userinfo);
	
	// let draw_money = walletTabBars.value[tabIndex.value].money
	// console.log("提取金额:", draw_money, userStore.userinfo)
	
	// let income = userStore.userinfo.income || 0.0
	// 判断是否有足够的余额
	// if (draw_money > income) {
	// 	rightDisable.value = true
	// }
})

// onShow 生命周期
onShow(() => {
	// isxcx.value = uni.getStorageSync("isxcx") || false
	// myRestitutionMoney()
	// getMoney()
})

// 导航栏按钮点击
// onNavigationBarButtonTap((e: any) => {
// 	switch (e.index) {
// 		case 0:
// 			uni.vibrateShort()
// 			Common.showToast('工作日内，提现 24 小时内到账')
// 			break
// 	}
// })

// onHide 生命周期
onHide(() => {
	isAd.value = false
})

// 待返金额查询
const myRestitutionMoney = async () => {
	try {
		
		let fn_result = await uniCloud.callFunction({
			name: 'cps',
			data: {
				action: 'ddxCps/myRestitutionMoney',
				data: {
				}
			}
		})
		
		console.log('res:', fn_result)
			
		if (fn_result.result.code !== 0) {
			Common.showToast(fn_result.result.message)
			
			if (fn_result.result.code === 403) {
				Common.clearInfo()
			}
			return
		}
		
		restitutionMoney.value = (fn_result.result.money || 0).toFixed(2)
	} catch (e: any) {
		
		console.log('e:', e)
	}
}

// 广告加载
const onload = (e: any) => {
	isAd.value = true
	console.log("onload")
}

// 广告关闭
const onclose = (e: any) => {
	isAd.value = false
	console.log("onclose:", e.detail)
}

// 广告错误
const onerror = (e: any) => {
	isAd.value = false
	console.log("onerror:", e.detail.errCode, "message::", e.detail.errMsg)
}

// 切换单选
const zhClass = (e: any) => {
	// if (e.detail.value === 1) {
	// 	Common.showToast('微信提现暂未开放')
	// }
	radio.value = e.detail.value
}

// 跳转页面
const navTo = (url: string) => {
	Common.navigate(url)
}

// 切换 tab
const tabBar = (index: number) => {
	isAd.value = !isAd.value
	uni.vibrateShort()
	tabIndex.value = index
}

// 获取金钱
const getMoney = async () => {
	let fn_result = await uniCloud.callFunction({
		name: 'ucenter',
		data: {
			action: 'getdata/getMoney',
			data: {
			}
		}
	})
	
	console.log("\n#getMoney: \n", fn_result)
	
	if (fn_result.result.code !== 0) {
		Common.showToast(fn_result.result.message)
		
		if (fn_result.result.code === 403) {
			Common.clearInfo()
		}
		return
	}
	
	let data = fn_result.result.data[0]
	income.value = Number((data.income).toFixed(2)) || 0.0
	
	const bouns_coin = data.bouns_coin || 0
	alipay.value = data.alipay || ''
	name.value = data.name || ''
	
	const bouns_status = data.bouns_status || 0
}

// 提现：调用微信商家转账功能
const withdrawalAdd = async () => {
	
	// #ifdef MP-WEIXIN

	// let obj = {slr-e-r0g0og9,
	// 	name: "mp-money-update",
	// 	action: 'updateMoney/getUserInfo',
	// 	data: {
	// 		uid: uniCloud.getCurrentUserInfo().uid
	// 	}
	// }
	// let user_result = await Api.cloudHttp(obj)
	// let userinfo = user_result.result.data.data[0]
	// console.log('userinfo:', userinfo);
	
	let draw_money = walletTabBars.value[tabIndex.value].money
	console.log("提取金额:", draw_money, userStore.userinfo)
	
	let incomeData = Number(userStore.userinfo.income) || 0.0
	// 判断是否有足够的余额
	if (draw_money > incomeData) {
		uni.showToast({
			title: "提现余额不足！快去找你喜欢的宝贝下单吧！",
			icon: 'none',
			position: 'bottom',
			duration: 3000
		})
		return
	}
	
	// 获取 unionid
	const loginRes = await uni.login({
		provider: "weixin"
	})
	
	if (loginRes.errMsg === 'getUserProfile:ok' || loginRes.errMsg === 'login:ok') {
		const userInfo = await uni.getUserInfo({
			provider: "weixin"
		})
			
		console.log("loginRes", loginRes)
		console.log("userInfo", userInfo)
			
		const mp_result = await uniCloud.callFunction({
			name: 'mp-unionid',
			data: {
				code: loginRes.code
			}
		})
		
		let unionid = mp_result.result.data.unionid
		console.log("unionid result:", mp_result)
		
		// 原始数据
		let curtime = new Date().getTime()
		let draw_token = unionid + '@' + draw_money + '@' + userStore.userinfo._id + '@' + curtime
		
		// 调用云函数对上面的 token 进行加密
		
		// 加密数据
		let obj = {
			name: "mp-money-update",
			action: 'updateMoney/encryptString',
			data: {
				token: draw_token
			}
		}
		
		const encrypt_result = await uniCloud.callFunction({
			name: 'encrypt',
			data: {
				data: draw_token
			}
		})
		console.log("加密后的数据:", encrypt_result)
		
		// uni.showModal({
		// 	title: '余额提现',
		// 	content: '点击「确定」，按照流程进行提现。',
		// 	success(res: any) => {
		// 		if (res.confirm) {
		// 			console.log('用户点击了确定');
					
		// 			// f(提现金额 & Unionid & 提现码)=token
		// 			console.log("draw_token:", encrypt_result)
		// 			uni.setClipboardData({
		// 				data: '$' + encrypt_result,
		// 				success(() => {
		// 					console.log("复制 token 到剪贴板:", encrypt_result)
							
		// 					uni.showToast({
		// 						title: "提现码已复制到剪贴板",
		// 						icon: 'none',
		// 						position: 'bottom'
		// 					})
		// 				},
		// 				fail((error: any) => {
		// 					console.log('失败', error)
		// 				})
		// 			})
					
		// 			console.log("wallet app globalData:", getApp().globalData)
		// 			let mp_url = getApp().globalData.mp_url
					
		// 			uni.navigateTo({
		// 				url: '/pages/web/web?link=' + mp_url,
		// 				fail(err: any) => {
		// 					console.error('资金明细页面跳转失败', err)
		// 				}
		// 			})
					
		// 		} else if (res.cancel) {
		// 			console.log('用户点击取消');
		// 		}
		// 	}
		// })
		
	} else {
		
		uni.showToast({
			title: "微信登录失败",
			icon: "none"
		})
	}
	
	// #endif
	
	// -----判断
	// if (!noClick.value) {
	// 	Common.showToast('请勿频繁点击')
	// 	return
	// }
	// noClick.value = false;
	
	// // 判断结束开始请求
	// Common.showLoading('提现中...')
	// let yzDate = new Date().getTime()
	// let sign = Common.encryptionMd5(userStore.kdz_key + tabIndex.value + yzDate)
	// // console.log(sign)
	// // ---------------------请求
	// let obj = {
	// 	name: userStore.banben,
	// 	action: 'updatedata/updateTx',
	// 	data: {
	// 		name: name.value,
	// 		alipay: alipay.value,
	// 		tabIndex: tabIndex.value,
	// 		yzDate: yzDate,
	// 		sign: sign
	// 	}
	// }
	// let res = await Api.cloudHttp(obj)
	// console.log(res)
	// if (res.result.code !== 0) {
	// 	Common.showToast(res.result.message)
	// 	if (res.result.code === 403) {
	// 		Common.clearInfo()
	// 	}
	// 	noClick.value = true;
	// 	return
	// }
	// uni.hideLoading();
	// getMoney()
	// Common.showToast('提现成功，24 小时内到账')
	// noClick.value = true;
}

</script>

<style>

</style>