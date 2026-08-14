<template>
	<view>
		<!-- 填写反馈相关内容 -->
		<view class="zcolor-while mar-30 bor-r30 pa-30">
			<top-dec name="反馈内容"></top-dec>
			<view class="mar-t30 zcolor-while" style="height: 350rpx;">
				<textarea class="fs-28 fcolor-dark2" style="width: 600rpx;" auto-height="true" maxlength="200"
					v-model="opinion" value="" placeholder="请输入反馈内容 (限 200 字)" />
			</view>
			<view class="pa-30" style="position: absolute; right: 0; bottom: 0;">
				<text class="fs-26 fcolor-dark1">{{ opinion.length }}/200</text>
			</view>
		</view>
		<view class="zcolor-while mar-30 bor-r30 pa-30" style="margin-top: 0;">
			<top-dec name="相关图片"></top-dec>
			<view class=" zcolor-while">
				<view class="dflex flex-row align-center">
					<view class=" dflex flex-row align-center mar-t30" v-if="opinionimg.length > 0">
						<view class="mar-r10" v-for="(item, index) in opinionimg" :key="index">
							<image :src="item" class="wh-170 bor-r10" mode="aspectFill" @click="uploadImg(index + 1)"></image>
							<view class="wh-50 gradient-black justify-center align-center bor-r10"
								style="position: absolute; right: 0rpx; top: 0;" @click="opinionimg.splice(index, 1)">
								<text class="iconfont-nvue fcolor-while f-w fs-25">&#xe69f;</text>
							</view>
						</view>
					</view>
					<view class="zcolor-while1 dflex flex-column justify-center align-center mar-t30 wh-170 bor-r30"
						@click="uploadImg" v-if="opinionimg.length < 3">
						
						<image :src="config.static+'/upload.png'" mode="widthFix" class="wh-80"></image>
						<text class="fs-23  mar-t15 f-w">上传图片</text>
					</view>
				</view>

			</view>
		</view>
		
		<!-- #ifdef APP -->
		<view class="mar-30 bor-r30  gradient-green-while" style="margin-top: 0;" v-if="isAd">
			<ad :ad-pid="$store.state.adList.xxl" @load="onload" @close="onclose" @error="onerror"></ad>
		</view>
		<!-- #endif -->

		<view class="wh-h130"></view>
		<!-- 按钮 -->
		<double-button left-name="我的反馈" right-name="确认反馈" @l-event="navTo" @r-event="addOpinion">
		</double-button>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { onLoad, onHide } from '@dcloudio/uni-app'
import Common from '@/common/common'
import Api from '@/common/api.ts'

const config = ref(uni.getStorageSync('config') || {})

const isShow = ref(true)
const opinion = ref('')
const opinionimg = ref<string[]>([])
const noClick = ref(true)
const isAd = ref(true)

// onLoad 生命周期
onLoad(() => {
	
})

// onHide 生命周期
onHide(() => {
	isAd.value = false
})

// 跳转页面
const navTo = () => {
	Common.navigate('/pages/my/my-back')
}

// 提交反馈
const addOpinion = async () => {
	if (!noClick.value) {
		Common.showToast('请勿频繁点击')
		return
	}
	noClick.value = false
	
	if (!opinion.value) {
		noClick.value = true
		Common.showToast('内容不能为空')
		return
	}
	
	// --------------判断结束开始执行
	Common.showLoading('反馈中...')
	
	let obj = {
		name: 'ucenter',
		action: 'userabout/feedback',
		data: {
			opinion: opinion.value,
			opinionimg: opinionimg.value
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
		noClick.value = true
		return
	}
	
	Common.showToast('反馈成功')
	opinion.value = ''
	opinionimg.value = []
	noClick.value = true
}

// 上传图片
const uploadImg = async (i: number) => {
	let obj = {
		success: (res: any) => {
			console.log(res)
			
			if (i > 0) {
				console.log('1111111111111111111111111')
				opinionimg.value[i - 1] = res.fileID
			} else {
				console.log('1111111111111111111111111')
				opinionimg.value.push(res.fileID)
			}
		}
	}
	
	Common.img(obj)
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

</script>

<style>

</style>