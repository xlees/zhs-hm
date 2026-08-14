<template>
	<view>
		<view class="dflex justify-center align-center  flex-column pa-50">
			
			<image :src="config.static+'/zhs.webp'" class="wh-130 bor-r30" mode="aspectFill" lazy-load></image>
			<view class=" mar-t60">
				
				<text class="fs-30 fcolor-dark1">{{ config.mp_name + '- 让省钱像呼吸一样简单！' }}</text>
			
			</view>
			<view style="height: 80rpx;">
				
			</view>
		</view>
		
		<view class=" mar-30 bor-r30" style="margin-top: -60rpx;">
			<view class="pa-35 bor-bom dflex flex-row justify-space-between align-center zcolor-while bor-r30 mar-b30"
				v-for="(item, index) in setup_list" :key="index" @click="navList(item.path)">
				
				<view class="dflex flex-row justify-space-between align-center" v-if="index==3">
					<text class="mar-r30 fs-30 f-w">个性化推荐</text>
					<switch checked />
					
				</view>
				
				<view v-else class="dflex flex-row justify-space-between">
					<text class="fs-30 f-w">{{ item.title }}</text>
					<view class="">
						<uni-icons type="right" color="#e8e8e8" size="20"></uni-icons>
					</view>
				</view>
			</view>
			<!-- <view class="pa-35 bor-bom dflex flex-row justify-center align-center zcolor-while bor-r30 mar-b30 "
				@click="exit(1)">
				
				<text class="fs-30 f-w">退出登录</text>
				
			</view> -->
		</view>
		<view class="position-r-b-l dflex flex-row justify-center align-center" @click="exit(1)">
			<view class=" pa-10 dflex justify-center align-center mar-40 zcolor-black  bor-r100"
				style="height: 80rpx; width: 300rpx; margin-bottom: 60rpx;">
				
				<text class="fs-30 fcolor-while f-w">退出登录</text>
			</view>
		</view>
		
		<popupTs :is-show="isShow" r-name="确认注销" :is-but="false" l-name="取消" @l-event="show" @r-event="cancellationUser"
			title="温馨提示">
			<view class="pa-15-30">
				<view class="mar-t25">
					<text class="fs-28 fcolor-dark2">注销成功后该账号已作废！是否确定要注销？</text>
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
  onShareAppMessage,
  onShareTimeline
} from '@dcloudio/uni-app'
	
import Common from '@/common/common'
import Api from '@/common/api.ts'
import { useUserAuthStore } from '@/store/user-auth'
import config from '@/config.js'

const userStore = useUserAuthStore()

const isShow = ref(false)
const noClick = ref(true)

// 设置列表
const setup_list = ref([
	// {
	// 	title: '版本检测',
	// 	path: ''
	// },
	{
		title: '关于我们',
		path: '/pages/my/about-us'
	},
	{
		title: '用户协议',
		path: '/pages/my/user-agreement'
	},
	{
		title: '隐私协议',
		path: '/pages/my/privacy-agreement'
	},
	{
		title: '关闭个性化推荐',
		path: 'close-recommend'
	},
	{
		title: '账号注销',
		path: '868'
	}
])

// onLoad 生命周期
onLoad(() => {
	
})

// 显示/隐藏弹窗
const show = () => {
	isShow.value = !isShow.value
}

// 注销账号
const cancellationUser = async () => {
	if (!noClick.value) {
		Common.showToast('请勿频繁点击')
		return
	}
	noClick.value = false

	Common.showLoading('注销中...')

	let obj = {
		name: 'ucenter',
		action: 'userabout/cancellationUser',
		data: {}
	}

	console.log(obj)
	let res = await Api.cloudHttp(obj)
	console.log(res)

	if (res.result.code !== 0) {
		Common.showToast(res.result.message)
		if (res.result.code === 403) {
			Common.clearInfo()
		}
		noClick.value = true
		return
	}

	Common.showToast(res.result.message)
	exit('520')
	
	noClick.value = true
}

// 退出登录
const exit = (i: string | number) => {
	try {
		userStore.exit()
		userStore.$reset()

		if (i !== '520') {
			Common.showToast('退出成功')
		}

		uni.reLaunch({
			url: '/pages/home/index'
		})

		console.log('1:', 1)
	} catch (e: any) {
		console.log('e:', e)
	}
}

// 导航跳转
const navList = (url: string ) => {
	console.log("跳转到 ", url)
	
	if (url === '868') {
		show()
	}
	else {
		uni.navigateTo({
			url
		})
	}
	
	
	// if (url === 1) {
	// 	let res = uni.getSystemInfoSync()
	// 	console.log("this.info:", res)
	// 	Common.showToast('当前版本：V' + res.appVersion)
		
	// } else if (url === '868') {
	// 	show()
	// } else {
	// 	uni.navigateTo({
	// 		url
	// 	})
	// }
}

</script>

<style>

</style>