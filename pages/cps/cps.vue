<template>
	<view class="container" >

			<!-- #ifdef APP -->
			<!-- <view class="" style="height: 80rpx;"></view>
			<view class="pa-10 dflex flex-row align-center justify-space-between" @click="navBk">

				<text class="f-w1" >欢迎来到{{config.mp_name}}！</text>

			</view>
			<view style="height: 30rpx;"></view> -->
			<!-- #endif -->

			<!-- <view class="zcolor-black pa-10 bor-r30"> -->

			<view class="dflex flex-row justify-space-between gradient-while-dack mar-t20  bor-r20 align-center "
				style="position: relative; padding: 45rpx 20rpx 45rpx 20rpx" @click="navTo('/pages/wallet/wallet',true)">

				<view class="dflex flex-row align-center">
					<!-- 头像 -->
					<view class="zcolor-while bor-r100 dflex justify-center align-center"
						:class="isLogin ? 'bor-white' : ''">
						<image :src="userInfo.avatar || 'https://cdn.lapad.cc/static/tx.png'" mode="aspectFill"
							class="wh-100 bor-r100">
						</image>
					</view>

					<!-- nick & 余额 -->
					<view class="mar-l15 ">
						<text class="fs-33  f-w">{{userInfo.nickname || mobile}}</text>
						<view class="dflex flex-row align-center mar-t10" v-if="isLogin">
							<view class="dflex flex-row align-center ">
								<text class="fs-26 fcolor-dark1 ">余额:</text>
								<text class="fs-26 fcolor-red f-w mar-l5">{{income}}</text>
								<text class="fs-26 fcolor-dark1 mar-l5">元</text>
							</view>
							<text class="fs-15 fcolor-dark1 " style="margin: 10rpx;">|</text>
							<view class="dflex flex-row align-center ">
								<text class="fs-26 fcolor-dark1  ">待返:</text>
								<text class="fs-26 fcolor-red f-w mar-l5">{{restitutionMoney}}</text>
								<text class="fs-26 fcolor-dark1 mar-l5">元</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 已登录 -->
				<!-- <view class="zcolor-black dflex flex-row justify-center align-center"
					:class="{origin: !go, target: go}"
					style=" height: 70rpx;position: absolute;bottom: 60rpx; right: 0rpx;border-top-left-radius: 50rpx;border-bottom-left-radius: 50rpx; "
					v-if="isLogin">
					<image :src="config.static+'/fhb.png'" mode="aspectFill" class="bor-r100 wh-40"></image>
					<text class="fs-28 fcolor-while mar-l10 f-w">立即提现</text>
				</view> -->

				<!-- 请先登录 -->
				<!-- <view class="zcolor-black dflex flex-row justify-center align-center"
					:class="{origin: !go, target: go}"
					style=" height: 70rpx;position: absolute;bottom: 60rpx; right: 0rpx;border-top-left-radius: 50rpx;border-bottom-left-radius: 50rpx; "
					v-else>
					<image :src="config.static+'/jq.png'" mode="aspectFill" class="bor-r100 wh-40"></image>
					<text class="fs-28 fcolor-while mar-l10 f-w">登录/注册</text>
				</view> -->

			</view>
			<!-- </view> -->

			<view style="height: 30rpx;"></view>

			<!-- 我的功能列表 -->
			<view>
				<view class="bor-bottom" v-for="(item,index) in menuList" :key="index">

					<!-- 联系客服 -->
					<!-- #ifdef MP-WEIXIN -->
					<button open-type="contact" v-if="index==3"
						class="dflex flex-row justify-space-between align-center">

						<view class="dflex flex-row align-center pa-30-0">

							<view class="dflex align-center justify-center" style="width: 60rpx;">
								<image :src="item.icon" mode="widthFix" class="wh-40"></image>
							</view>

							<text class="fs-30  mar-l10 f-w">{{item.name}}</text>
						</view>

						<!-- <view class="dflex flex-row align-center">
							<view class="zcolor-red wh-20 bor-r100 mar-r10" v-if="index==3 && ishd"></view>
							<view class="wh-40 bor-r100 justify-center align-center">
								<uni-icons type="right" color="#e8e8e8" size="20"></uni-icons>
							</view>
						</view> -->
					</button>
					<!-- #endif -->

					<!-- 意见反馈 -->
					<!-- #ifdef APP -->
					<button open-type="feedback" v-if="index==4"
						class="dflex flex-row justify-space-between align-center">

						<view class="dflex flex-row align-center pa-30-0" >

							<view class="dflex align-center justify-center" style="width: 60rpx;">
								<image :src="item.icon" mode="widthFix" class="wh-40"></image>
							</view>

							<text class="fs-30  mar-l10 f-w">{{item.name}}</text>
						</view>

					</button>
					<!-- #endif -->

					<!-- 分享给好友 -->
					<!-- #ifdef APP -->
					<button v-else-if="index==3"
						@click="appShare()"
						class="dflex flex-row justify-space-between align-center">

						<view class="dflex flex-row align-center pa-30-0">
							<view class="dflex align-center justify-center" style="width: 60rpx;">
								<image :src="item.icon" mode="widthFix" class="wh-40"></image>
							</view>

							<text class="fs-30  mar-l10 f-w">{{item.name}}</text>
						</view>

						<!-- <view class="dflex flex-row align-center">
							<view class="wh-40 bor-r100 justify-center align-center">
								<uni-icons type="right" color="#e8e8e8" size="20"></uni-icons>
							</view>
						</view> -->
					</button>
					<!-- #endif -->

					<view v-else class="dflex flex-row justify-space-between align-center" @click="navTo(item.path,true)" >
						<view class="dflex flex-row align-center pa-30-0">
							<view class="dflex align-center justify-center" style="width: 60rpx;">
								<image :src="item.icon" mode="widthFix" class="wh-40"></image>
							</view>

							<text class="fs-30  mar-l10 f-w">{{item.name}}</text>
						</view>

						<!-- <view class="dflex flex-row align-center">
							<view class="zcolor-red wh-20 bor-r100 mar-r10" v-if="index==3 && ishd"></view>
							<view class="wh-40 bor-r100 justify-center align-center">
								<uni-icons type="right" color="#e8e8e8" size="20"></uni-icons>
							</view>
						</view> -->
					</view>

				</view>
			</view>

		</view>

</template>

<script setup lang="ts">


import { ref, computed } from 'vue'

import {
  onReady,
  onShow,
  onLoad,
  onShareAppMessage,
  onShareTimeline
} from '@dcloudio/uni-app'

import Common from '@/common/common'
import Api from "@/common/api.ts"
import utils from "@/common/utils.js"
import { useUserAuthStore } from '@/store/user-auth'

import config from '@/config.js'

interface UserInfo {
	nickname?: string
	moble?: string
	avatar?: string
	deviceid?: string
}

const store_userAuth = useUserAuthStore()

const userInfo = ref<UserInfo>({
})
const isLogin = ref(false)
const mobile = ref('')
const income = ref('0.00')
const list = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const isShow = ref(false)
const go = ref(false)
const ishd = ref(false)
const startX = ref(0)
const ggdate = ref(0)
const fz_data = ref('')
const restitutionMoney = ref('0.00')
const menuList = ref([
	{
		icon: config.static+'/cps/dingdan.png',
		name: '个人信息',
		path: '/pages/my/my-data'
	},
	{
		icon: config.static+'/cps/shuju.png',
		name: '我的订单',
		path: '/pages/cps/cps-list'
	},
	{
		icon: config.static+'/cps/yue.png',
		name: '资金明细',
		path: '/pages/wallet/money-detail'
	},

	// {
	// 	icon: config.static+'/cps/xitonggg.png',
	// 	name: '系统公告',
	// 	path: '/pages/my/announcement'
	// },

	// {
	// 	icon: config.static+'/cps/kefu.png',
	// 	name: '联系客服',
	// 	path: ''
	// },

	{
		icon: config.static+'/cps/fxhy.png',
		name: '分享好友',
		path: '66'
	},

	{
		icon: config.static+'/cps/xitomngg.png',
		name: '意见反馈',
		path: '/pages/my/feedback'
	},
	{
		icon: config.static+'/cps/shezhi.png',
		name: '系统设置',
		path: '/pages/my/sys-setting'
	}
])

// 待返金额查询
const myRestitutionMoney = async () => {
	try {
		let res = await uniCloud.callFunction({
			name: 'cps',
			data: {
				action: 'ddxCps/myRestitutionMoney'
			}
		})
		console.log('res: ', res)

		if (res.result.code != 0) {
			Common.showToast(res.result.message)

			// if (res.result.code == 403) {
			// 	Common.clearInfo()
			// }
			return
		}
		restitutionMoney.value = (res.result.money || 0).toFixed(2)
	} catch (e) {
		console.log('e: ', e)
	}
}

const show = () => {
	isShow.value = !isShow.value
}

const fz = () => {
	Common.fz(fz_data.value)
	show()
}

// const touchStart = (e) => {
// 	console.log('1', e)
// 	if (e.touches.length === 1) {
// 		// 设置触摸起始点水平方向位置
// 		startX.value = e.touches[0].pageX || 0
// 		console.log("this.startX: ", startX.value)
// 	}
// }

// const touchEnd = (e) => {
// 	console.log('2', e)
// 	if (e.changedTouches.length === 1) {
// 		// 手指移动结束后水平位置
// 		const endX = e.changedTouches[0].pageX
// 		console.log("endX: ", endX)
// 		const diff = endX - startX.value
// 		if (Math.abs(diff) > 20) {
// 			if (diff > 0) {
// 				uni.navigateBack()
// 				console.log("左滑...")

// 			} else {
// 				console.log("右滑...")

// 			}
// 		}
// 	}
// }

const navBk = () => {
	uni.navigateBack()
}

const getMoney = async () => {

	let res = await uniCloud.callFunction({
		name: "ucenter",
		data: {
			action: 'getdata/getMoney'
		}
	})
	console.log(res)
	if (res.result.code != 0) {
		Common.showToast(res.result.message)

		// if (res.result.code == 403) {
		// 	Common.clearInfo()
		// }
		return
	}
	const data = res.result.data[0]
	income.value = (data.income || 0).toFixed(2)
	const time = uni.getStorageSync("ggtime") || ''
	console.log('time: ', time)
	if (res.result.gg && res.result.gg.length > 0) {
		ggdate.value = res.result.gg[0].creat_date || 0

		console.log('this.ggdate: ', ggdate.value)
		if (ggdate.value > time) {
			console.log('---------------------: ', 'this.ggdate')
			ishd.value = true
		} else {
			ishd.value = false
		}
	}
}

const navTo = (url, is_login = false) => {
	// console.log('nav to: ',url,is_login)
	utils.navTo(url, is_login)
}

const appShare = () => {
	console.log("\n#click app share button.")

	uni.share({
		provider: 'weixin', // 使用系统分享
		scene: "WXSceneSession",
		type: 0, // 分享类型，0表示链接分享，1表示文本分享，2表示图片分享
		href: "https://r.app.xiaomi.com/details?id=com.zz.zhenhuisheng",
		title: config.mp_name,
		imageUrl: config+'/logo.png',
		summary: '我发现了一个AI购物助手app，邀请你来使用！', // 分享的摘要
		// imageUrl: config+'/logo.png', // 分享的图片链接，type为2时需要
		success: (res: any) => {
		  console.log('分享成功！', res);
		},
		fail: function (err) {
		  console.log('分享失败：', err);
		}
	})

}

const navTo1 = (url) => {
	if (ishd.value && url === "/pages/my/announcement") {
		uni.setStorageSync('ggtime', ggdate.value)
		ishd.value = false
	}
	if (url === 88) {
		show()
		return
	}
	if (url === 66) {
		// #ifdef APP
		// plus.share.sendWithSystem({
		// 	type: 'text',
		// 	content: store.state.share_text_app,
		// 	href: store.state.share_link_app,
		// })
		// return
		// #endif
	}
	console.log("navto: ", url)

	Common.navigate(url)
}

// 分享给好友
onShareAppMessage(() => {

	return {
		title: config.mp_name + ' - 汇聚全网优惠渠道', // 默认是小程序的名称 (可以写 slogan 等)
		desc: '汇聚全网优惠渠道，外卖、电商、出行、生活等都可享受折扣优惠！', // 小程序的描述
		path: '/pages/home/index', // 默认是当前页面，必须是以'/'开头的完整路径
		imageUrl: 'https://mp-c97ee0bc-337f-425d-9c46-e907f3358ae7.cdn.bspapp.com/share.png', // 图片封面，本地文件路径、网络图片路，支持 PNG 及 JPG，默认当前页面截图，显示图片长宽比是 5:4。
		// success: (res) => {
		// 	// 转发成功之后的回调
		// 	if (res.errMsg === 'shareAppMessage:ok') {
		// 		console.log(res)
		// 	}
		// },
		// fail: (res) => {
		// 	// 转发失败之后的回调
		// 	if (res.errMsg === 'shareAppMessage:fail cancel') {
		// 		console.log(res)
		// 		// 用户取消转发
		// 	} else if (res.errMsg === 'shareAppMessage:fail') {
		// 		console.log(res)
		// 		// 转发失败，其中 detail message 为详细失败信息
		// 	}
		// }
	}

	// 来自页面内的按钮的转发
	// const options = arguments[0] || {}
	// if (options.from === 'button') {
	// 	const eData = options.target.dataset
	// 	console.log(eData.id) // shareBtn
	// 	// 此处可以修改 shareObj 中的内容
	// 	shareObj.path = '/pages/home/index'
	// }
	// // 返回 shareObj
	// return shareObj
})

// 页面内分享
onShareTimeline(() => {

	return {
		title: '', // 默认是小程序的名称
		// path: '/pages/share/share', // 页面路径，默认是当前页面，必须是以'/'开头的完整路径
		imageUrl: '', // 图片封面，本地文件路径、网络图片路，支持 PNG 及 JPG，默认当前页面截图，显示图片长宽比是 5:4。
		success: (res) => {
			// 分享成功
			if (res.errMsg === 'shareAppMessage:ok') {
			}
		},
		fail: (res) => {
			// 用户取消
			if (res.errMsg === 'shareAppMessage:fail cancel') {
			}
			// 分享失败
			if (res.errMsg === 'shareAppMessage:fail') {
			}
		},
		complete: (res) => {
		}
	}

})

onLoad((opts: any) => {
	console.log("页面参数: ", opts)

	console.log("是否登录：",store_userAuth.userinfo)


})

onShow(() => {
	// 判断是否登入
	userInfo.value = store_userAuth.userinfo;
	if (store_userAuth.is_login) {
		console.log("已登录")

		isLogin.value = true

		mobile.value = store_userAuth.userinfo.mobile ? store_userAuth.userinfo.mobile.substr(0, 3) + '****' + store_userAuth.userinfo.mobile
			.substr(-4) : ''

		getMoney()

	} else {
		console.log("未登录")

		mobile.value = '请先登录/注册'
		isLogin.value = false
	}


})

</script>

<style lang="scss">
.bor-bottom button {
	margin-left: 0rpx;
	padding-left: 0rpx;
	background-color: transparent;
	line-height: normal;
}

button::after {
	border: none;
}

.target_c {
	transform: translateX(0px);
	transition: transform 1s;
}

.origin_c {
	transform: translateX(-200px);
	transition-property: transform;
	transition-duration: 1s;
}

.target {
	transform: translateX(0px);
	transition: transform 1s;
}

.origin {
	transform: translateX(200px);
	transition-property: transform;
	transition-duration: 1s;
}
</style>
