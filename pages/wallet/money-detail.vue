<template>
	<view>
		<!-- 顶部选项卡 -->
		<hTabbar :tabBarArr="moneyTabBars" :tabIndex="tabIndex" @tabtap="tabTap"
			dClass="justify-space-around zcolor-while"  style="position: fixed; top: 0; left: 0; right: 0; z-index: 9999;"></hTabbar>
		
		<view class="" style="height: 90rpx;"></view>
		
		<!-- 加载图标 -->
		<!-- <loading-icon v-if="loading && tableData.length < 1"></loading-icon> -->
		
		<!-- <view v-if="loading && tableData.length < 1" class="dflex justify-center align-center" style="position: fixed; top: 0; right: 0; left: 0; bottom: 0;">
			<image :src="config.static + '/loading.gif'" mode="widthFix" class="wh-80" style="margin-top: -200rpx;" ></image>
		</view> -->
		
		<list v-if="tableData.length > 0">
			<!-- 列表 -->
			<cell v-for="(item, i) in tableData" :key="i" @click="tabDec(item.title)">
				<view class=" dflex flex-row align-center zcolor-while justify-space-between pa-40 mar-30 bor-r30  " style="margin-bottom: 0;">
					<view class="dflex flex-row justify-center">
						<view class="dflex justify-center align-center">
							<image :src="config.static+'/cps/yue.png'" mode="widthFix" class="wh-70"></image>
						</view>
						<view class="mar-l30 ">
							<view class="">
								<text class=" fs-26 text-overflow " v-if="item.title.length > 13" style="width: 400rpx;">{{ (item.title || '').substr(0, 13) + '...' }}</text>
								<text class=" fs-26 text-overflow " v-else style="width: 400rpx;">{{ item.title }}</text>
							</view>
							<view class="">
								<uni-dateformat class="fs-25 fcolor-dark1 mar-t15" :date="item.creat_date" :threshold="[0, 0]" />
							</view>
						</view>
					</view>
					<view class="dflex flex-row align-center">
						<text class="fcolor-red fs-28" v-if="item.money > 0">+</text>
						<text
							class="fcolor-red f-w fs-28">{{ parseFloat(item.money).toFixed(2) }}</text>
					</view>
				</view>
			</cell>
		</list>
		
		<noThing v-if="isNothing && tableData.length < 1"></noThing>
		
		<!-- 上拉加载 -->
		<!-- <load-more :has-more="hasMore" :loading="loading" v-if="isNothing && tableData.length > 9"></load-more> -->
		
		<view class="dflex justify-center align-center pa-30">
			<view class=" dflex flex-row justify-center align-center" v-if="loading">
				<image :src="config.static+'/loadings.gif'" mode="widthFix" class="wh-35"></image>
				<text class="fs-23 fcolor-dark mar-l10">加载中...</text>
			</view>
			<view v-else>
				<text class="fs-23 fcolor-dark">{{hasMore ?'上拉加载更多':'触碰到底线了'}}</text>
			</view>
		</view>
		
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, computed} from "vue"
import { onLoad, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app'
import Common from '@/common/common'
import Api from '@/common/api.ts'

import { useUserAuthStore } from '@/store/user-auth'

const store_userAuth = useUserAuthStore()

// 页面数据
import config from '@/config.js'
	
const moneyTabBars = reactive([
	{
		name: "进账",
		id: "quanbu"
	},
	{
		name: "支出",
		id: "new"
	}
])
const isNothing = ref(false)
const tabIndex = ref(0)
const hasMore = ref(true)
const loading = ref(true)
const tableData = ref<any[]>([])
const tableTotal = ref(0)
const req = reactive({
	page: 0,
	rows: 10,
	status: 1
})
const income = ref(0)
const jb = ref(0)

// 加载数据
const loadData = async (i: number = 0) => {
	if (!i) {
		tableData.value = []
	}
	
	let obj = {
		name: 'ucenter',
		action: 'getdata/getMoneyDec',
		data: req
	}
	
	try {
		let res = await Api.cloudHttp(obj)
		console.log('----------------------------列表')
		console.log(res)
		
		if (res.result.code !== 0) {
			Common.showToast(res.result.message)
			
			if (res.result.code === 403) {
				Common.clearInfo()
			}
			return
		}
		
		if (tableData.value.length === 0) {
			isNothing.value = true
		}
		
		req.page = req.page + 1
		loading.value = false
		tableData.value = [...tableData.value, ...(res.result.data.data || [])]
		tableTotal.value = res.result.count_num || 0
		if (tableData.value.length >= tableTotal.value) {
			hasMore.value = false
		}
		console.log(tableData.value)
	} catch (e) {
		console.log(e)
	}
}

// 点击提示
const tabDec = (data: string) => {
	Common.showToast(data)
}

// tabbar 点击事件
const tabTap = (index: number) => {
	console.log('\n#click the tab: ', index)
	
	if (tabIndex.value !== index) {
		loading.value = true
		req.page = 0
		tableData.value = []
		isNothing.value = false
		tabIndex.value = index
		req.status = tabIndex.value + 1
		loadData()
	}
}

// onLoad 生命周期
onLoad((e: any) => {
	console.log('money-detail onLoad paras:', e)
	
	let paras = ''
	if (Object.keys(e).length > 0) {
		let arr = []
		for (let key in e) {
			arr.push(key + '=' + e[key])
		}
		paras += arr.join('&')
	}
	
	let uid = uniCloud.getCurrentUserInfo().uid
	console.log("\n uid of money-detail: ", uid)
	
	console.log("\nstore_userAuth: \n", store_userAuth.$state)
	
	// if (!uid) {
	// 	if (!paras) {
	// 		uni.navigateTo({
	// 			url: '/pages/login/login?burl=/pages/wallet/money-detail',
	// 			fail: (err: any) => {
	// 				console.error('资金明细页面跳转失败', err)
	// 			}
	// 		})
	// 	} else {
	// 		uni.navigateTo({
	// 			url: '/pages/login/login?burl=/pages/wallet/money-detail&' + paras,
	// 			fail: (err: any) => {
	// 				console.error('资金明细页面跳转失败', err)
	// 			}
	// 		})
	// 	}
	// }
	
	// if (e.hasOwnProperty('source')) {
	// 	if (e.source === 'alice_lx') {
	// 		uniCloud.callFunction({
	// 			name: 'ad-callback',
	// 			data: {
	// 				'user_id': uid,
	// 				'money': e.money,
	// 				'adtype': e.adtype
	// 			}
	// 		}).then(res => {
	// 			console.log("公众号拉新奖励发放成功！")
			
	// 		}).catch(err => {
	// 			  // 处理错误
	// 			console.log("err for 公众号拉新下发奖励:", err)
	// 		})
	// 	}
	// }
	
	// 获取数据
	req.status = 1
	loadData()
	
	
})

// onReachBottom 生命周期
onReachBottom(() => {
	hasMore.value = true
	loading.value = true
	// loadData(1)
})

// onPullDownRefresh 生命周期
onPullDownRefresh(() => {
	loading.value = true
	isNothing.value = false
	req.page = 0
	// loadData()
	
	// setTimeout(() => {
	// 	uni.stopPullDownRefresh()
	// }, 1000)
})

</script>

<style>

</style>