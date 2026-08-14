<template>
	
	<view class="dflex flex-column justify-space-around align-center h100">
		<view class="fs-50 mar-b30 wh-h20">{{ "欢迎使用" + config.mp_name }}</view>
		
		<view class="dflex flex-column justify-space-between privacy-panel align-center">
			<view class="fs-40 mar-b30 ">
				隐私政策
			</view>
			
			<view class="mar-b30">
				<view class="fs-30">
					本个人信息保护指引将通过<text @tap="navTo('../my/user-agreement')" class=" fcolor-red">《用户协议》</text>
					和<text @tap="navTo('../my/privacy-agreement')" class="fcolor-red">《隐私政策》</text>
					帮助您了解我们如何收集、处理个人信息。
				1.我们可能会申请系统设备权限、设备信息、日志信息，用于推送和安全，并申请存储权限用于...
				</view>
			</view>
			
			<view class="dflex flex-column " style="width: 100%">
				<button @click="agree" class="btn mar-b10 fs-35" >同意</button>
				<button @click="disagree" class="btn fs-35" >不同意，退出APP</button>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'
	
	import config from '@/config.js'
	import { useUserAuthStore } from "@/store/user-auth"
	
	
	const store_userAuth = useUserAuthStore()
	
	const agree = () => {
		console.log("user agree.")
		
		uni.setStorageSync("is_agree",true);
		
		uni.reLaunch({
		    url: '/pages/home/index'
		})
	}
	
	const disagree = () => {
		console.log("user disagree")
		
		// #ifdef APP-PLUS
		plus.runtime.quit();
		// #endif
	
		// #ifdef MP-WEIXIN
		uni.exitMiniProgram();
		// #endif
	}
	
	const navTo = (url: string) => {
		uni.navigateTo({
			url: url
		})
	}
</script>

<style>
	.privacy-panel {
		background-color: white;
		padding: 20rpx;
		border-radius: 20rpx;
	}
	
	.btn {
	    width: 100%;
	    height: 88rpx;
	    line-height: 88rpx;
	    text-align: center;
	    background: #2979ff;
	    color: #fff;
	    border-radius: 8rpx;
	}
</style>