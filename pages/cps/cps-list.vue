<template>
	<view class="">
		<hTabbar :tab-bar-arr="listTabBars" p-class="pa-20-0" :tab-index="tabIndex" @tab-tap="tabTap"
			d-class="justify-space-around zcolor-while" style="position: fixed; top: 0; left: 0; right: 0; z-index: 9999;"></hTabbar>
		<view class="" style="height: 90rpx;">
			
		</view>
		<view class="">
			<!-- 加载图标 -->
			<loadingIcon v-if="loading && spList.length < 1" l-class="mar--t200"></loadingIcon>
			<view class="" v-for="(item, index) in spList" :key="index">
				<view class="dflex flex-row align-center zcolor-while bor-r30 mar-30 pa-30" style="margin-bottom: 0; position: relative;">
					
					<view class="">
						<view class="dflex flex-row align-center justify-space-between" style="width: 630rpx;">
							<view class="dflex flex-row align-center" @click="fz(item.order_sn)">
								<text class="fs-25 fcolor-dark1">订单号：{{ item.order_sn }}</text>
							</view>
							<view class="dflex flex-row align-center">
								<text class="fs-25 text-r fcolor-dark1">{{ item.status_desc }}</text>
								<text class="fs-15 fcolor-dark1" style="margin: 5rpx;"
									v-if="item.jtk_share_fee > 0">|</text>
								<view class="dflex justify-center align-center">
									<view v-if="item.jtk_share_fee > 0">
										<text class="fs-25  fcolor-dark1">返利：</text>
										<text class="fs-25  fcolor-yellow2 f-w">{{ item.jtk_share_fee }}元</text>
									</view>
								</view>
							</view>
						</view>
						<view class="dflex flex-row align-center mar-t25">
							<view class="mar-l15">
								<view class="dflex flex-row align-center">
									<text class="fs-28 fcolor-dark2 f-w"
										style="width: 450rpx;">{{ item.order_title }}</text>
								</view>
								<uni-dateformat class="fs-26 fcolor-dark1 mar-t15" :date="item.create_time"
									:threshold="[0, 0]" />
								<view class="dflex flex-row align-center justify-space-between mar-t15">
									<view class="dflex flex-row align-center">
										<view class="dflex justify-center align-center">
											<view class="dflex flex-row align-center">
												<text class="fs-25  fcolor-dark1">来自：</text>
												<image :src="item.icon" mode="aspectFill" class="wh-35 bor-r100"></image>
												<text class="fs-25  fcolor-yellow2 f-w">{{ item.act_name }}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="zcolor-black dflex flex-row justify-center align-center" v-if="item.status === 3"
						style="width: 150rpx; height: 65rpx;position: absolute;bottom: 25rpx; right: 0rpx;border-top-left-radius: 50rpx;border-bottom-left-radius: 50rpx;"
						@click="receiveReward(item)">
						<text class="fs-25 fcolor-while f-w" v-if="cps_list.includes(item.order_sn)">领取返利</text>
						<text class="fs-25 fcolor-while f-w" v-else="true">已领取</text>
					</view>
				</view>
			</view>

			<!-- 没有 -->
			<noThing v-if="!loading && spList.length < 1"></noThing>
			<!-- 上拉加载 -->
			<loadMore :loading="loading" v-if="spList.length > 3"></loadMore>
		</view>
	</view>
</template>

<script setup lang="ts">

	import { ref, computed } from 'vue'
	
	import {
	  onReady,
	  onShow,
	  onLoad,
	  onReachBottom, onPullDownRefresh
	} from '@dcloudio/uni-app'
	
import Common from '@/common/common'
import Api from '@/common/api.ts'

const tabIndex = ref(0)
const pageId = ref(1)
const loading = ref(true)
const spList = ref<any[]>([])
const noClick = ref(true)
const cps_list = ref<string[]>([])

const listTabBars = ref([
	{
		name: "全部",
		id: "0"
	},
	{
		name: "已付款",
		id: "1"
	},
	{
		name: "待结算",
		id: "2"
	},
	{
		name: "待领取/已结算",
		id: "3"
	},
	{
		name: "无效订单",
		id: "4"
	}
])

// onLoad 生命周期
onLoad(() => {
	getApp(1)
})

// 下拉刷新
onPullDownRefresh(() => {
	getApp(1)
	
	setTimeout(() => {
		uni.stopPullDownRefresh()
	}, 1000)
})

// 触底事件
onReachBottom(() => {
	getApp(2)
})

// tab 切换
const tabTap = (i: number) => {
	console.log("\n订单tab切换：", i)
	tabIndex.value = i
	
	getApp(1)
}

// 复制订单号
const fz = (data: string) => {
	Common.fz(data)
}

// 领取奖励
const receiveReward = async (item: any) => {
	// -----判断
	if (!noClick.value) {
		Common.showToast('请勿频繁点击')
		return
	}
	noClick.value = false
	
	// if (!cps_list.value.includes(item.order_sn)) {
	// 	// 判断结束开始请求
	// 	Common.showLoading('领取中...')
		
	// 	let yzDate = new Date().getTime()
	// 	let kk = kdz_key.value + item.order_sn + item.jtk_share_fee + yzDate
	// 	let sign = Common.encryptionMd5(kk)
		
	// 	item.sign = sign
	// 	item.yzDate = yzDate
		
	// 	// ---------------------请求
	// 	try {
	// 		let obj = {
	// 			name: 'ucenter',
	// 			action: 'updatedata/receiveReward',
	// 			data: item
	// 		}
	// 		let res = await Api.cloudHttp(obj)
	// 		console.log(res)
	// 		if (res.result.code !== 0) {
	// 			Common.showToast(res.result.message)
	// 			if (res.result.code === 403) {
	// 				Common.clearInfo()
	// 			}
	// 			noClick.value = true
	// 			return
	// 		}
	// 		uni.hideLoading()
	// 		getApp()
	// 		Common.showToast(res.result.message)
	// 		noClick.value = true
	// 	} catch (e: any) {
	// 		console.log(e)
	// 	}
	// } else {
	// 	Common.showToast('已领取')
	// 	noClick.value = true
	// 	return
	// }
	
}

// 获取数据
const getApp = async (i: number) => {
	if (i === 1) {
		spList.value = []
		pageId.value = 1
	}
	if (i === 2) {
		pageId.value = pageId.value + 1
	}
	
	loading.value = true
	
	let obj = {
		name: "cps",
		action: 'mix/myCpsOrder',
		data: {
			status: tabIndex.value,
			pageId: pageId.value
		}
	}
	
	let res = await Api.cloudHttp(obj)
	console.log("res:", res)
	
	loading.value = false
	
	if (res.result.code === 0) {
		if (res.result.data.data.data) {
			spList.value = [...spList.value, ...res.result.data.data.data]
		}
		
		if (res.result.data1.length > 0) {
			cps_list.value = res.result.data1[0].cps_list || []
		}
	}
}

</script>

<style>

</style>