<template>
	<view class="uni-flex uni-column">
		
		<view class="img-618">
			<image :src="$config.static+'/cps/tmall-618.jpeg'" mode="scaleToFill"></image>
		</view>

		<view class="img-618">
			<image :src="$config.static+'/cps/jd-618.png'" mode="scaleToFill"></image>
		</view>
		
		<button class="btn-red-packet"
			type="default"
			@click="receiveRedPkg">领取红包，高至 666 元</button>
	</view>
</template>

<script setup lang="ts">
import { ref, onLoad } from '@dcloudio/uni-app'
import { uniCloud } from '@dcloudio/uni-mp-weixin'
import Common from '@/common/common'

const $config = ref(uni.getStorageSync('config') || {})
const tpwd = '$ObsoVKzeaqp$'

// 领取红包
const receiveRedPkg = (e: any) => {
	console.log('用户点击了红包领取按钮')
	
	uni.setClipboardData({
		data: tpwd
	})
	
	Common.fz(
		tpwd,
		'红包口令码已复制，打开淘宝 App 进行抽取！',
		''
	)
}

// onLoad 生命周期
onLoad(async (e: any) => {
	console.log("onload triggered.")
	
	let h5Res = await uniCloud.callFunction({
		name: 'h5',
		data: {}
	})
	console.log("h5Res:", h5Res)
	
	let censor = h5Res.result.censor
	
	if (!censor) {
		// 17￥ CZ001 ObsoVKzeaqp￥ https://m.tb.cn/h.ha2v2ad  618 超级红包会场
		uni.setClipboardData({
			data: tpwd
		})
	}
});

</script>

<style>
	.img-618 {
		width: 100%;  
		padding: 0 5px;
		margin-top: 10px;
		text-align: center;
	}
	.btn-red-packet {
		width: 80%; 
		background: linear-gradient(to right, #ff0000, #ff6347, #800080); 
		border: none; 
		border-radius: 25px; 
		color: white;
		margin-top: 20px;
	}
</style>