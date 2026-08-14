<template>
	<view class="container">
		
		<up-sticky bgColor="#fff" offset-top="5" offset-left="5" offset-right="5">
			<view>
				<up-tabs :list="cpsTabBars" @click="switchEcomm" 
					:activeStyle="{
						color: '#303133',
						fontWeight: 'bold',
						transform: 'scale(1.05)'
					}"
					:inactiveStyle="{
						color: '#606266',
						transform: 'scale(1)'
					}"
					itemStyle="width:100%; padding-left: 5rpx; padding-right: 5rpx; height: 80rpx;"
				/>
			</view>
			
			<view ref="ref-view" class="" style="height: 10rpx;"></view>
		
			<view class="uni-flex uni-row search-bar">
				
				<up-search 
					:showAction="true" actionText="搜索" :animation="true"
					shape="round" placeholder="输入关键词进行搜索" v-model="keyword"
					borderColor="#888"
					:clearabled="true"
					:focus="search_focus"
					@search="handleSearch"
					@change="keywordChange"
					@custom="handleSearch"
				/>
				
			</view>
		</up-sticky>
		
		<view class="mar-t20">
			<!-- 加载图标 -->
			<loadingIcon v-if="loading && spList.length<1" lClass="mar--t200"></loadingIcon>
			
			<!-- 商品列表 -->
			<view class="pa-0"  v-for="(item,index) in spList" :key="item.goodsId">
				<view class="dflex flex-row  zcolor-while bor-r30 mar-b10"  
					@click="navToDetail(item)">
					
					<!-- 商品图片 -->
					<view class="pa-10">
						<image :src="item.goodsThumbUrl" mode="aspectFill" lazy-load="true" class="wh-200 bor-r30">
						</image>
					</view>
					
					<view class="dflex flex-column justify-space-between  mar-l15 pa-10">
						<!-- 标题 -->
						<view class="">
							<text class="fs-30 f-w"
								style="width: 400rpx;">{{(item.goodsName || '').substr(0,30) + '...'}}</text>
						</view>
						
						
						<!-- 价格信息 -->
						<view class="dflex flex-row justify-space-between align-center ">
							<!-- 优惠券 -->
							<view class="justify-center align-center">
								<view class="dflex flex-row align-center" v-if="source=='vip'">
									<text class="fs-25 fcolor-dark1 ">折扣：</text>
									<text class="fs-25  fcolor-red f-w">{{(item.discount*10).toFixed(0)}}折</text>
								</view>
								<view class="dflex flex-row align-center" v-else>
									<text class="fs-25  fcolor-dark1">优惠券：</text>
									<text class="fs-25  fcolor-red f-w">{{(item.discount)}}元</text>
								</view>
							</view>
							
							<!-- 到手价 -->
							<view class="dflex flex-row align-center">
								<!-- <text class="fs-28 fcolor-red">¥</text> -->
								<text class="fs-25  fcolor-dark1">到手：</text>
								<text class="fs-25 fcolor-red f-w mar-l10">{{item.finalPrice}}元</text>
							</view>
						</view>
					</view>
					
					<!-- <view class="zcolor-black dflex flex-row justify-center align-center"
						
						style="width: 250rpx; height: 65rpx;position: absolute;bottom: 25rpx; right: 0rpx;border-top-left-radius: 50rpx;border-bottom-left-radius: 50rpx;">
						<image :src="tab_img" mode="aspectFill" class="bor-r100 wh-40" />
						<text class="fs-25 fcolor-while mar-l10 f-w ">{{cpn_text}}</text>
					</view> -->
				</view>
			</view>

			<!-- 没有 -->
			<noThing v-if="!loading && spList.length<1"></noThing>
			<!-- 上拉加载 -->
			<loadMore :loading="loading" v-if="spList.length>8"></loadMore>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	
	import {
	  onReady,
	  onShow,
	  onLoad,
	  onShareAppMessage,
	  onShareTimeline,
	  onPullDownRefresh,
	  onReachBottom,
	  onPageScroll
	} from '@dcloudio/uni-app'
	
	import { openSchema, canOpenURL } from '@/uni_modules/uts-openSchema'
	
	import Common from '@/common/common'
	// import Api from '@/common/api.js'
	
	// 页面数据
	interface TabItem {
		name: string
		id: string
		index: number
	}
	
	const cpsTabBars = ref<TabItem[]>([{
		name: "淘宝",
		id: "tb",
		index: 0
	}, {
		name: "京东",
		id: "jd",
		index: 1
	}, {
		name: "拼多多",
		id: "pdd",
		index: 2
	}])
	
	const search_focus = ref(true)
	const keyword = ref('')
	const open_ad = ref(false)
	const showAd = ref(false)
	const uid = ref(uniCloud.getCurrentUserInfo()?.uid || '')
	const show_history = ref(false)
	const show_hot = ref(false)
	const dataList = ref<any[]>([])
	const hotList = ref<any[]>([])
	const cpn_text = ref('领取优惠')
	const source = ref('tb')
	const tabIndex = ref(0)
	const seaText = ref('')
	const spList = ref<any[]>([])
	const pageId = ref(1)
	const loading = ref(false)
	const data = ref<any[]>([])
	const go = ref(false)
	const tab_img = ref('https://mp-ba2f31ba-46dc-47fe-abf6-70aa178a7c92.cdn.bspapp.com/static/sea/tb.png')
	const scrollTop = ref(0)
	const isAd = ref(false)
	
	// onLoad 生命周期
	onLoad((e: any) => {
		console.log("搜索页面参数: ", e)
		
		seaText.value = e.text || ''
		tabIndex.value = 0
		
		if (seaText.value.length == 0) {
			search_focus.value = true
		}
		
		if (keyword.value.length == 0) {
			search_focus.value = true
		} else {
			search_focus.value = false
		}
	})
	
	// onShow 生命周期
	onShow(() => {
		if (keyword.value.length == 0) {
			search_focus.value = true
		} else {
			search_focus.value = false
		}
	})
	
	// onPullDownRefresh 生命周期
	onPullDownRefresh(() => {
		setTimeout(() => {
			uni.stopPullDownRefresh()
		}, 1000)
		seaSp(1)
	})
	
	// onReachBottom 生命周期
	onReachBottom(() => {
		seaSp(2)
	})
	
	// onPageScroll 生命周期
	onPageScroll((e: any) => {
		scrollTop.value = e.scrollTop
	})
	
	// 分享给朋友圈
	onShareTimeline(() => {
		return {
			title: "「" + seaText.value + "」- 真的很省！",
			path: '/pages/cps/search-cps?text=' + seaText.value,
			imageUrl: '/static/home-loading.png',
			success(res: any) {
				if (res.errMsg === 'shareAppMessage:ok') {
					console.log('朋友圈分享成功')
				}
			},
			fail(res: any) {
				if (res.errMsg === 'shareAppMessage:fail cancel') {
					console.log('用户取消分享')
				} else if (res.errMsg === 'shareAppMessage:fail') {
					console.log('分享失败')
				}
			}
		}
	})
	
	// 分享给好友
	onShareAppMessage(() => {
		
		return {
			title: "「" + seaText.value + "」- 真的很省！",
			path: '/pages/cps/search-cps?text=' + seaText.value,
			imageUrl: '/static/home-loading.png',
			
			// success(res: any) {
			// 	if (res.errMsg === 'shareAppMessage:ok') {
			// 		console.log('转发成功')
			// 	}
			// },
			// fail(res: any) {
			// 	if (res.errMsg === 'shareAppMessage:fail cancel') {
			// 		console.log('取消转发')
			// 	} else if (res.errMsg === 'shareAppMessage:fail') {
			// 		console.log('转发失败')
			// 	}
			// }
		}
		
	})
	
	// 关键词变化
	const keywordChange = () => {
		console.log('当前关键词：', keyword.value)
	}
	
	// 广告点击处理
	const adClickCapture = (e: any) => {
		let tstamp = new Date().getTime()
		
		// Api.cloudHttp({
		// 	name: 'tencent-ad-report',
		// 	data: {
		// 		etype: 'ad_click',
		// 		adid: '1108970724',
		// 		openid: uid.value,
		// 		x: e.detail.x,
		// 		y: e.detail.y,
		// 		click_time: tstamp
		// 	}
		// }).then(res => {
		// 	console.log("上报结果:", res)
		// })
	}
	
	// 处理搜索
	const handleSearch = (keyword: string) => {
		console.log('点击搜索关键字', keyword)
		
		if (!keyword) {
			show_history.value = true
			show_hot.value = true
		}
		
		seaText.value = keyword
		seaSp(1)
	}
	
	// 删除历史记录
	const handleDelete = () => {
		console.log('删除所有历史记录')
		spList.value = []
		show_history.value = true
		show_hot.value = true
		seaText.value = ''
	}
	
	// 清空搜索框
	const handleClear = () => {
		console.log('清空搜索框内容')
		
		spList.value = []
		show_history.value = true
		show_hot.value = true
		seaText.value = ''
	}
	
	// 广告加载
	const adLoad = (e: any) => {
		isAd.value = true
		console.log("uni ad onload", e)
	}
	
	// 广告关闭
	const adClose = (e: any) => {
		isAd.value = false
		console.log("ad onclose: ", e.detail)
	}
	
	// 广告错误
	const adError = (e: any) => {
		isAd.value = false
		console.log("onerror: ", e.detail.errCode, " message:: ", e.detail.errMsg)
	}
	
	// 处理自定义事件
	const handleCustomEvent = (e: any) => {
		console.log("Simulated handleCustomEvent", e)
	}
	
	// 返回顶部
	const goTop = () => {
		uni.pageScrollTo({
			scrollTop: 0
		})
	}
	
	// 切换电商平台
	const switchEcomm = (item: TabItem) => {
		if (keyword.value.length == 0) {
			search_focus.value = true
		} else {
			search_focus.value = false
		}
		
		console.log('用户点击了标签', item)
		
		if (item.index === 0) {
			source.value = 'tb'
			tab_img.value = 'https://mp-ba2f31ba-46dc-47fe-abf6-70aa178a7c92.cdn.bspapp.com/static/sea/tb.png'
		} else if (item.index === 1) {
			source.value = 'jd'
			tab_img.value = 'https://mp-ba2f31ba-46dc-47fe-abf6-70aa178a7c92.cdn.bspapp.com/static/sea/jd.png'
		} else if (item.index === 2) {
			source.value = 'pdd'
			tab_img.value = 'https://mp-ba2f31ba-46dc-47fe-abf6-70aa178a7c92.cdn.bspapp.com/static/sea/pdd.png'
		} else if (item.index === 3) {
			source.value = 'vip'
			tab_img.value = 'https://mp-ba2f31ba-46dc-47fe-abf6-70aa178a7c92.cdn.bspapp.com/static/sea/wph.png'
		} else {
			source.value = 'douyin'
			tab_img.value = 'https://mp-ba2f31ba-46dc-47fe-abf6-70aa178a7c92.cdn.bspapp.com/static/sea/dy.png'
		}
		
		seaSp(1)
	}
	
	// 搜索商品
	const seaSp = (i: number) => {
		if (i === 1) {
			spList.value = []
			pageId.value = 1
		}
		if (i === 2) {
			pageId.value = pageId.value + 1
		}
		
		loading.value = true
		if (seaText.value) {
			const obj = {
				name: "cps",
				action: 'core/keywordSearch',
				data: {
					keyword: seaText.value,
					page_id: pageId.value,
					page_size: 20,
					source: source.value
				}
			}
			
			uniCloud.callFunction({
				name: 'cps',
				data: {
					action: 'core/keywordSearch',
					data: {
						keyword: seaText.value,
						page_id: pageId.value,
						page_size: 20,
						source: source.value
					}
				}
			})
			.then((se_result) => {
				console.log("数据已获取到: ", se_result)
				
				spList.value = spList.value.concat(se_result.result.data)
				
				loading.value = false
			})
			
		}
		
	}
	
	// 跳转到商品详情
	const navToDetail = (item: any) => {
		console.log('\n#跳转到下面商品中:\n',item)
		
		let source = ""
		if (item.source === 'tb' || item.source ==="taobao") {
			source = "tb"
			
			// 点击直接拉起淘宝app
			uniCloud.callFunction({
				name: 'cps',
				data: {
					action: 'mix/queryTbGoods',
					data: {
						goodsId: item.goodsId
					}
				}
			})
			.then((goodsRs) => {
				
				console.log("\ntaobao goods link result: \n", goodsRs.result)
				
				const click_url = goodsRs.result.data.click_url
				const dplink = `tbopen://m.taobao.com/tbopen/index.html?action=ali.open.nav&module=h5&bc_fl_src=tunion_mm_mm&h5Url=${encodeURIComponent(click_url)}`
				
				openSchema(dplink)
			})
			
		}
		else {
			source = item.source
			
			uni.navigateTo({
				url: '/pages/cps/goods-details?goodsId=' + item.goodsId + '&source=' + source
			})
		}
		
		
		// const url = '/pages/cps/goods-details?goodsId=' + item.goodsId + '&goodsName=' + item.goodsName + '&source=' + item.source + '&finalPrice=' + item.finalPrice + '&marketPrice=' + item.marketPrice + '&discount=' + item.discount
		// Common.navigate(url)
	}
	
</script>

<style lang="scss">
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 500rpx;
		background-color: transparent;
		z-index: 99999;
	}
	
	.target_c {
		transform: translateX(0px);
		transition: transform 0.5s;
	}

	.origin_c {
		transform: translateX(500px);
		transition-property: transform;
		transition-duration: 0.5s;
	}
</style>