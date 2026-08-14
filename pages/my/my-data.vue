<template>
	<view class="">
		<view class="">
			<!-- #ifdef APP -->
			<view class="dflex flex-row justify-space-between align-center pa-40 zcolor-while mar-30 bor-r30">
				<text class=" f-w fs-28 fcolor-dark2">用户头像</text>
				<view class="dflex flex-row align-center" @click="">
					<image :src="store_userAuth.userinfo.avatar || 'https://cdn.lapad.cc/static/tx.png'" mode="aspectFill" class="wh-100 bor-r100"></image>
				</view>
			</view>
			<!-- #endif -->
			
			<view class="zcolor-while  mar-30 bor-r30" style="margin-top: 0;">
				<!-- <view class="dflex flex-row justify-space-between align-center pa-40 bor-bottom-dark">
					<text class=" f-w fs-28">用户 ID</text>
					<view class="dflex flex-row align-center" @click="copyData">
						<text class="fcolor-dark1 fs-28">{{ store_userAuth.userinfo.uid }}</text>
						<uni-icons type="right" color="#cccccc" size="20"></uni-icons>
					</view>
				</view> -->
				
				<view class="dflex flex-row justify-space-between align-center bor-bottom-dark pa-40">
					<text class=" f-w fs-28">手机号码</text>
					<view class="dflex flex-row align-center" @click="show(1)">
						<text class="fcolor-dark1 fs-28">{{ store_userAuth.userinfo.mobile || '点击绑定手机号' }}</text>
						<uni-icons type="right" color="#cccccc" size="20"></uni-icons>
					</view>
				</view>

				<view class="dflex flex-row justify-space-between align-center pa-40">
					<text class=" f-w fs-28">用户昵称</text>
					<view class="dflex flex-row align-center" @click="show(2)">
						<text class="fcolor-dark1 fs-28">{{ store_userAuth.userinfo.nickname || '点击修改昵称' }}</text>
						<uni-icons type="right" color="#cccccc" size="20"></uni-icons>
					</view>
				</view>
			</view>
			<view class="zcolor-while  mar-30 bor-r30" style="margin-top: 0;">
				<view class="dflex flex-row justify-space-between align-center pa-40  bor-bottom-dark">
					<text class=" f-w fs-28">注册 IP</text>
					<text class="fcolor-dark1 fs-28">{{ store_userAuth.userinfo.client_ip }}</text>
				</view>
				<view class="dflex flex-row justify-space-between align-center pa-40">
					<text class=" f-w fs-28">注册时间</text>
					<text class="fs-28 fcolor-dark1">{{ regdate }}</text>
					<!-- <uni-dateformat class="fs-28 fcolor-dark1" :date="store_userAuth.userinfo.register_date" :threshold="[0, 0]" /> -->
				</view>
			</view>

		</view>

		<popupTs :is-show="isShow" r-name="立即保存" :is-but="false" l-name="取消" @l-event="show" @r-event="updateUserInfo"
			style="z-index: 99999;" :title="isClass === 1 ? '绑定手机号码':'修改昵称'">
			<view class="pa-15-30">
				<view class="zcolor-while1  dflex flex-row align-center bor-r50 mar-20 pa-20"
					style="height: 60rpx; margin-top: 30rpx;" v-if="isClass === 1 && store_userAuth.userinfo.mobile">
					<input class="fs-28 wh-50-450 mar-l15" type="number" :disabled="true" v-model="old_mobile" placeholder="请输入手机号码" />
				</view>
				<view class="zcolor-while1  dflex flex-row align-center bor-r50 mar-20 pa-20"
					style="height: 60rpx; margin-top: 30rpx;" v-if="isClass === 1">
					<input class="fs-28 wh-50-450 mar-l15" type="number" v-model="mobile" placeholder="请输入新手机号码" />
				</view>
				<view class="zcolor-while1  dflex flex-row justify-space-between align-center bor-r50 mar-20"
					style="margin-top: 30rpx; height: 100rpx;" v-if="isClass === 1">
					<view class="dflex flex-row align-center">
						<input class="fs-28 wh-50-450 mar-l30" type="number" maxlength="6" v-model="code"
							style="width: 180rpx;" placeholder="请输入验证码" />
					</view>
					<view class=" pa-20-30 mar-r10  dflex flex-row align-center  justify-center zcolor-black bor-r50"
						hover-class="zcolor-while1" @click="sendSmsCode">
						<text class="fs-23 f-w fcolor-while">{{ codeDuration ? codeDuration + 's' : '发送验证码' }}</text>
					</view>
				</view>
				<view class="zcolor-while1  dflex flex-row align-center bor-r50 mar-20 pa-20"
					style="height: 60rpx; margin-top: 30rpx;" v-else>
					<input class="fs-28 wh-50-450 mar-l15" type="text" v-model="store_userAuth.userinfo.nickname"
						placeholder="请输入昵称" />
				</view>
			</view>
		</popupTs>
	</view>
</template>

<script setup lang="ts">

import { ref, computed } from 'vue'
	
import {
  onReady,
  onShow,
  onLoad,
  onHide,
  onShareAppMessage,
  onShareTimeline
} from '@dcloudio/uni-app'

import Common from '@/common/common'
import Api from '@/common/api.ts'
import dayjs from 'dayjs'
import { useUserAuthStore } from '@/store/user-auth'
import config from '@/config.js'

const store_userAuth = useUserAuthStore()

interface UserInfo {
	nickname?: string
	moble?: string
	avatar?: string
	deviceid?: string
}

const regdate = ref('')
const isClass = ref(0)
const isShow = ref(false)
const userinfo = ref<UserInfo>({})
const isxcx = ref(false)
const isAd = ref(true)
const mobile = ref('')
const old_mobile = ref('')
const code = ref('')
const password = ref('')
const confirmPassword = ref('')
const codeDuration = ref(0)
const countdownTimer = ref<number | null>(null)
const inviteCode = ref('')
const userid = ref('')

const noClick = ref(true)



// onLoad 生命周期
onLoad(() => {
	isxcx.value = uni.getStorageSync("isxcx") || false
	
	userinfo.value = store_userAuth.userinfo
	console.log('userinfo:', store_userAuth.userinfo)
	
	regdate.value = dayjs(store_userAuth.userinfo.register_date).format('YYYY-MM-DD HH:mm:ss')
})

// onHide 生命周期
onHide(() => {
	isAd.value = false
})

// 选择头像
const onChooseAvatar = (e: any) => {
	console.log('e:', e)
	
	userinfo.value.avatar = e.detail.avatarUrl || ''
}

// 显示/隐藏弹窗
const show = (i: number) => {
	if (i) {
		isClass.value = i
	}
	// old_mobile.value = userinfo.value.mobile || ''
	isShow.value = !isShow.value
}

// 跳转页面
const navTo = (url: string) => {
	Common.navigate(url)
}

// 上传图片
const upload_img = () => {
	let obj = {
		success: (res: any) => {
			console.log("\n图片上传结果:\n", res)
			
			isClass.value = 0
			userinfo.value.avatar = res.fileID
			uni.setStorageSync('userinfo', userinfo.value)
			updateUserInfo()
		}
	}
	
	Common.img(obj)
}


// 复制数据
const copyData = () => {
	Common.fz(store_userAuth.userinfo._id)
}

// 验证手机号码格式
const validateMobile = (mobileNum: string) => {
	return /^1\d{10}$/.test(mobileNum)
}

// 更新用户信息
const updateUserInfo = async () => {
	isShow.value = false

	if (isClass.value === 1) {
		if (userinfo.value.moble) {
			
			if (!validateMobile(old_mobile.value)) {
				noClick.value = true
				Common.showToast("手机号码填写错误")
				return
			}
			
		} else {
			if (!validateMobile(mobile.value)) {
				noClick.value = true
				Common.showToast("手机号码填写错误")
				return
			}
		}
		await bindMobile()
		return
	}

	let obj = {
		name: 'ucenter',
		action: 'updatedata/updateUserInfo',
		data: {
			avatar: userinfo.value.avatar,
			nickname: userinfo.value.nickname,
			isclass: isClass.value || 0
		}
	}

	console.log(obj)
	let res = await Api.cloudHttp(obj)
	console.log(res)

	if (res.result.code !== 0) {
		Common.showToast(res.result.message)
		if (res.result.code === 403) {
			Common.clearInfo()
		}
		return
	}

	isClass.value = 0

	uni.setStorageSync('userinfo', userinfo.value)

	// store_userAuth.$patch({
	// 	userinfo: userinfo.value
	// })
}

// 发送验证码
const sendSmsCode = async () => {
	if (!noClick.value) {
		Common.showToast('请勿频繁点击')
		return
	}
	noClick.value = false
	
	if (codeDuration.value) {
		noClick.value = true
		Common.showToast(`请在${codeDuration.value}s 后重试`)
		return
	}
	
	console.log('mobile:', mobile.value)
	let mobile_sms: string
	if (userinfo.value.moble) {
		if (!validateMobile(old_mobile.value)) {
			noClick.value = true
			Common.showToast("手机号码填写错误")
			return
		}
		mobile_sms = old_mobile.value
	} else {
		if (!validateMobile(mobile.value)) {
			noClick.value = true
			Common.showToast("手机号码填写错误")
			return
		}
		mobile_sms = mobile.value
	}

	Common.showLoading('发送中...')
	let type = 'bind'
	if (old_mobile.value) {
		type = 'unbind'
	}
	
	try {
		let obj = {
			name: 'ucenter',
			action: 'userabout/sendSmsCode',
			data: {
				mobile: mobile_sms,
				type: type
			}
		}
		let res = await Api.cloudHttp(obj)
		console.info(res)
		if (res.result.code !== 0) {
			noClick.value = true
			uni.hideLoading()
			Common.showToast(res.result.message)
			return
		}
		uni.hideLoading()
		Common.showToast('发送成功，耐心等待')
		codeDuration.value = 300
		
		// countdownTimer.value = setInterval(() => {
		// 	codeDuration.value--
		// 	if (codeDuration.value === 0) {
		// 		clearInterval(countdownTimer.value!)
		// 		countdownTimer.value = null
		// 	}
		// }, 1000)

	} catch (e: any) {
		noClick.value = true
		uni.hideLoading()
		
		Common.showToast(e.message)
	}
}

// 绑定手机号码
const bindMobile = async () => {
	if (!noClick.value) {
		Common.showToast('请勿频繁点击')
		return
	}
	noClick.value = false

	Common.showLoading('绑定中...')
	
	try {
		let obj = {
			name: 'ucenter',
			action: 'userabout/bindMobile',
			data: {
				old_mobile: old_mobile.value,
				mobile: mobile.value,
				code: code.value
			}
		}
		let res = await Api.cloudHttp(obj)
		console.info(res)
		if (res.result.code !== 0) {
			noClick.value = true
			uni.hideLoading()
			Common.showToast(res.result.message)
			return
		}
		noClick.value = true
		uni.hideLoading()
		Common.showToast(res.result.message)
		userinfo.value.moble = mobile.value
		mobile.value = ''
		uni.setStorageSync('userinfo', userinfo.value)
		
		// store_userAuth.$patch({
		// 	userinfo: userinfo.value
		// })
		
	} catch (e: any) {
		
		noClick.value = true
		Common.showToast(e.message)
	}
}


</script>

<style>

</style>