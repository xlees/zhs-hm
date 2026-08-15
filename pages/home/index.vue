<template>
	<view class="container">

		<!-- <view class="navBarBox"> -->

			<!-- 状态栏 -->
			<!-- <view class="statusBar" :style="{ paddingTop: statusBarHeight+'px' }"></view> -->

			<!-- 真正的导航栏内容，包含微信胶囊 -->
			<!-- <view class="navBar uni-flex uni-row" :style="{ height: navBarHeight+'px'}">

				<image class="image-logo" mode="widthFix" src="@/static/logo.png" />

				<view style="margin-left: 20rpx;">{{ title }}</view>
			</view> -->

		<!-- </view> -->

		<!-- 搜索栏 -->
		<u-sticky class="mar-b5 "
			:bg-color="'rgba(255,0,0,0.0)'"
			:offset-top="searchBarTop"
			offset-left="5"
			offset-right="5">

			<view class="uni-flex uni-row search-bar ">

				<up-search
					shape="square" placeholder="输入关键词进行搜索" v-model="keyword" :disabled="true"
					height="35"
					:border-color="'#888'"
					:show-action="false"
					@search="search"
					@click="navSearchList"
				/>

			</view>
		</u-sticky>

		<!-- 热门活动区 -->
		<view class="mar-b5">
			<u-swiper class="hot-swiper"
				@click="clickSwiper"
				:list="hotGoods"
				height="190"
				:key-name="'url'"
				:indicator-active-color="'#f56c6c'"
				:indicator-inactive-color="'#e6e6e6'"
				:indicator="true"
				:radius="10"
				:indicator-mode="'line'"
				:circular="true">
			</u-swiper>

		</view>

		<!-- 本地服务应用区 -->
		<view class="local-life mar-b5">

			<up-scroll-list
				:indicator-color="'#e6e6e6'"
				:indicator-active-color="'#f56c6c'"
				style="padding-bottom: 0rpx;"
			>
				<view class="scroll-list " style="flex-direction: row;">
					<view
						class="scroll-list__goods-item"
						v-for="(item, index) in goodsArr"
						:key="index"
						@click="navToApp(item)"
					>
							<image
								class="scroll-list__goods-item__image"
								:src="config.static + '/app/' + item.img"
								mode=""
							/>
							<text class="scroll-list__goods-item__text">{{ item.name }}</text>

					</view>

					<!-- <view
						class="scroll-list__show-more"
						@tap="showMore"
					>
						<text class="scroll-list__show-more__text">查看更多</text>
						<u-icon
							name="arrow-leftward"
							color="#f56c6c"
							size="12"
						></u-icon>
					</view> -->

				</view>
			</up-scroll-list>
		</view>

		<!-- 电商菜单 -->
		<u-sticky :bg-color="'rgba(255,255,255,0.96)'" :offset-top="searchBarStickyHeight">
		<view class="ecom-menu mar-b5">
			<!-- <u-sticky :bg-color="'#f2f'>" -->
				<up-tabs @click="clickCatTab" :list="cats"
					:line-width="'35'"
					:line-color="'#f56c6c'"
					:active-style="{
						color: '#303133',
						fontWeight: 'bold',
						transform: 'scale(1.05)'
					}"
					:inactive-style="{
						color: '#606266',
						transform: 'scale(1)'
					}"
					item-style="padding-left: 15px; padding-right: 15px; height: 34px;"
				></up-tabs>
		</view>
		</u-sticky>

		<!-- 商品列表 -->
		<view class="goods-list-scroll">
			<!-- 加载图标 -->
			<view v-if="loading && goods_list.length < 1" class="dflex justify-center align-center">
				<image :src="config.static+'/loading.gif'" mode="widthFix" class="wh-80"></image>
			</view>

			<view class="" v-for="(item, index) in goods_list" :key="item.goodsId">

				<!-- 微信原生模板广告 -->
				<!-- <view v-if="index === 0 && (uid !== '67691dcdd121ac433df0b126' && uid !== '67b7f41a8dc8c182c3fd1ad3')"
					@tap="wxtap"
					@click.capture="wxAdClickCapture"
					class="dflex flex-row align-center zcolor-while bor-r20 mar-b20 mar-t15">
					<ad-custom id="mywxid" ref="wxad" class="wx-ad" style="width:100%;" unit-id="adunit-0ef5bbb7f19b4722" @bindclick="adWxClick" @bindload="adWxLoad" @binderror="adWxError" @bindclose="adWxClose"></ad-custom>
				</view> -->

				<!-- <view v-if="index==1"
					class="uniad-view">
					<ad adpid="1202679606" @load="uni_onload" @close="uni_onclose" @error="uni_onerror"></ad>
				</view> -->

				<view class="dflex flex-row align-center zcolor-while bor-r20 mar-b20"
					 @click="goodsDesc(item)">

					<view class="pa-10">
						<image :src="item.goodsThumbUrl" mode="aspectFill" class="wh-200 bor-r20" />
					</view>
					<view class="mar-l15">
						<view class="">
							<text class="fs-30 f-w"
								style="width: 400rpx;">{{ (item.goodsName || '').substr(0, 25) + '...' }}</text>
						</view>
						<view class="dflex flex-row align-center  mar-t25">
							<view class="justify-center align-center">
								<view v-if="source === 'vip'">
									<text class="fs-25 fcolor-dark1">折扣：</text>
									<text class="fs-25 fcolor-red f-w">{{ (item.discount * 10).toFixed(0) }}折</text>
								</view>
								<view v-else>
									<text class="fs-25 fcolor-dark1">省：</text>
									<text class="fs-25 fcolor-red f-w">{{ item.discount }}元</text>
								</view>
							</view>

							<text v-if="item.sales_tip" class="fs-18 fcolor-dark1 mar-l10 mar-10">|</text>
							<view v-if="item.sales_tip" class="justify-center align-center">
								<text class="fs-25 fcolor-dark1">已售：</text>
								<text class="fs-25 fcolor-red f-w">{{ item.sales_tip }}件</text>
							</view>
						</view>
						<view class="dflex flex-row justify-space-between align-center mar-t25">
							<view class="dflex flex-row u-flex-items-center">
								<text class="fs-25 fcolor-dark2 mar-r10">到手： </text>
								<view class="dflex flex-row align-flex-end align-center">
									<text class="fs-28 fcolor-red">¥</text>
									<text class="fs-35 fcolor-red f-w mar-l10">{{ item.finalPrice }}</text>
								</view>
							</view>
							<view class="dflex flex-row align-center">
								<text v-if="item.shopName" class="fs-25 fcolor-dark1">{{ (item.shopName || '').substr(0, 8) + "..." }}</text>
								<image :src="config.static + '/'+item.source+'.png'" mode="aspectFill" class="bor-r100 wh-40" />
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 没有 -->
			<noThing v-if="!loading && goods_list.length < 1"></noThing>

			<!-- 上拉加载 -->
			<loadMore v-if="goods_list.length > 8" :loading="loading" :hasMore="hasMore"></loadMore>
		</view>

	</view>

</template>

<script setup lang="ts">
	import { ref,computed } from 'vue'

	import {
	  onReady,
	  onLoad,
	  onPageScroll,
	  onUnload,
	  onReachBottom,
	  onPullDownRefresh,
	  onBackPress
	} from '@dcloudio/uni-app'

	import {
	  onShareAppMessage,
	  onShareTimeline
	} from '@dcloudio/uni-app'

	import { openSchema, canOpenURL } from '@/uni_modules/uts-openSchema'
	import config from '@/config.js'

	// import { storeUserAuth } from '@/store/user-auth'
	// import { storeTxSdk } from '@/store/ad-track.js'
	import Common from '@/common/common'
	import Api from '@/common/api.ts'
	import lf from '@/common/cps'

	// const store_userAuth = storeUserAuth()
	// const store_TxSdk = storeTxSdk()

// 页面数据
const title = ref('')

const uid = ref(uniCloud.getCurrentUserInfo()?.uid || '')
const numhotItems = ref(5)
const isnothing = ref(true)
const hasMore = ref(true)
const sourceIcon = ref(null)
const scrollTop = ref(0)
const current_tab = ref(0)
const stickyStyle = ref('')
const showPlaceholder = ref(false)
const keyword = ref('')
// const config = ref(uni.getStorageSync('config') || {})
const source = ref('pdd')
const loading = ref(true)
const goods_list = ref<any[]>([])

// console.log('\n#localLiving: ',lf, Api)
const local_living = lf.localLiving()
const goodsArr = ref<any[]>(local_living)
const containerWidth = ref(0)

// 电商分类
interface Badge {
	isDot?: boolean
}

interface Mapping {
	jd: number
	pdd?: number
	taobao: number
}

interface CatItem {
	cat_id: number
	name: string
	badge?: Badge
	mapping?: Mapping
}

const cats = ref<CatItem[]>([
	{
		cat_id: 0,
		name: '推荐',
		mapping: {
			'jd': 1,
			'pdd': 1,
			'taobao': 1
		}
		// name: '猜你喜欢'
	},
	{
		cat_id: 100,
		name: '美妆',
		mapping: {
			'jd': 6,
			'pdd': 8,
			'taobao': 9
		},
		badge: {
			isDot: true
		}
	},
	{
		cat_id: 101,
		name: '母婴',
		mapping: {
			'jd': 2,
			// 'pdd': 1,
			'taobao': 4
		}
	},
	{
		cat_id: 102,
		name: '数码',
		mapping: {
			'jd': 9,
			'pdd': 9,
			'taobao': 6
		}
		// badge: {
		// 	value: 5,
		// }
	},
	{
		cat_id: 107,
		name: '健康',
	},

	{
		cat_id: 105,
		name: '家居',
		mapping: {
			'jd': 3,
			'pdd': 5,
			'taobao': 5
		}
	},
	{
		cat_id: 106,
		name: '服饰内衣',
	},
])

// 状态栏和导航栏高度
const statusBarHeight = ref(0)
const navBarHeight = ref(0)
const navBarWidth = ref(0)
const menuButtonHeight = ref(0)
const menuButtonWidth = ref(0)
const searchBarHeight = ref(0)
const searchBarTop = ref(0)
const searchBarStickyHeight = ref(45)
const searchBarWidth = ref(0)

// swiper
const indicatorDots = ref(true)
const autoplay = ref(true)
const interval = ref(2000)
const duration = ref(500)

// 轮播图片
const hotGoods = ref<any[]>([])

// 商品信息
const goodsDec = ref(null)
const pageId = ref(1)
const pageSize = ref(20)

// 所有分享
let allShares = null

const handleScrolltolower = (e) => {
  console.log('到底了', e)
}

// 获取猜你喜欢商品

const fetchGuessGoods = async () => {

	return uniCloud.callFunction({
		name: 'cps',
		data: {
			action: 'core/homeRecommend',
			data: {
				page_id: pageId.value,
				page_size: pageSize.value
			}
		}
	}).then(res => {
		console.log("\nguess goods result:\n", res)

		if (res.result.length > 0) {
			console.log("猜你喜欢&为你推荐结果:", res.result[0])

			goods_list.value.push(...res.result)
		} else {
			console.log("猜你喜欢&为你推荐结果错误:", res)
		}

		current_tab.value = 0
		loading.value = false
	}).catch(error => {
		console.log('请求 fetchHotGoods 错误:', error)
	});

}

// 获取热门商品
const fetchHotGoods = () => {
	uniCloud.callFunction({
		name: 'cps',
		data: {
			action: 'hots/getJDHotItems',
			data: {}
		}
	})
	.then(res => {
		console.log("fetchHotGoods:", res.result)

		if (res.result.data.length > numhotItems.value) {
			hotGoods.value.push(...res.result.data.slice(0, 5))

			console.log("hotGoods:", hotGoods.value)

			numhotItems.value = hotGoods.value.length
		}

		console.log("获取到", res.result.data.length, '条商品数据')
	})
	.catch(error => {
		console.log('请求 fetchHotGoods 错误:', error)
	});
}

// 获取分类商品
const fetchTabGoods = (tab_index: number) => {
	console.log("\n获取第", tab_index, " 个tab的商品列表...")

	if (tab_index === 0) {		// 猜你喜欢

		fetchGuessGoods()

	} else {		// 分类 tab

		return uniCloud.callFunction({
			name: 'cps',
			data: {
				action: 'core/fetchCatsGoods',
				data: {
					cat_id: cats.value[tab_index].cat_id,
					page_id: pageId.value,
					page_size: pageSize.value
				}
			}
		}).then(res => {
			goods_list.value.push(...res.result)

			loading.value = false
		})

	}
}

// 点击分类 tab
const clickCatTab = (tab: any) => {
	console.log("click tab:", tab)

	let tab_index = tab.index
	console.log("\n获取第", tab.index, " 个tab的商品列表...")

	loading.value = true
	if (tab.index !== current_tab.value) {
		goods_list.value.length = 0
	}

	if (tab_index === 0) {		// 猜你喜欢

		fetchGuessGoods()

	} else {		// 分类 tab

		uniCloud.callFunction({
			name: 'cps',
			data: {
				action: 'core/fetchCatsGoods',
				data: {
					cat_id: cats.value[tab_index].cat_id,
					page_id: pageId.value,
					page_size: pageSize.value
				}
			}
		})
		.then(res => {
			goods_list.value.push(...res.result)

			current_tab.value = tab.index
			loading.value = false

			if ('badge' in cats.value[current_tab.value] && 'isDot' in cats.value[current_tab.value].badge) {
				cats.value[current_tab.value].badge.isDot = false
			}
		})

	}



}

// 获取容器尺寸
const getContainerRect = () => {

	uni.createSelectorQuery()
		.select('.container')
		.boundingClientRect(res => {
			if (res && !Array.isArray(res)) {
				containerWidth.value = res.width || 0
			}
		})
		.exec()
}

// 点击商品
const goodsDesc = (item: any) => {
	console.log('click item:', item)

	// 广告转化上报
	// Api.cloudHttp({
	// 	name: 'ads',
	// 	data: {
	// 		action: 'core/reportGoodsDetailConv',
	// 		data: {
	// 			openid: store_TxSdk.DNSDK.openid
	// 		}
	// 	}
	// }).then(res => {
	// 	console.log("上报结果:", res)
	// })

	if (item.source === 'tb' || item.source ==="taobao") {

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

		uni.navigateTo({
			url: '/pages/cps/goods-details?goodsId=' + item.goodsId + '&source=' + item.source
		})
	}
}

// 搜索
const search = (e: any) => {
	uni.showToast({
		title: '搜索：' + e.value,
		icon: 'none'
	})
}

// 点击搜索
const navSearchList = () => {

	uni.navigateTo({
		url: '/pages/cps/search-list'
	})

}

// 点击轮播
const clickSwiper = (index: number) => {
	console.log('swiper click', index, ' item: ', hotGoods.value[index])

	goodsDesc(hotGoods.value[index])

	trackClickEvent({
		type: 'hots',
		index: index,
		goods: hotGoods.value[index]
	});
}

// 点击本地服务
const navToApp = (app: any) => {
	console.log("\n#click local-life app: ", app)
	console.log('\n#current os: ', plus.os.name)

	// trackClickEvent({
	// 	type: 'locals',
	// 	app: app,
	// });

	let sweixin = null;
	for(let i=0; i<allShares.length; i++){
		var t = allShares[i];

		if(t.id == 'weixin'){
			sweixin = t;
		}
	}

	if (sweixin) {

		if (plus.os.name=='Android' && app.android_dplink) {

			// plus.runtime.launchApplication(
			// 	{
			// 		pname: app.android_pkg,
			// 		action: app.android_dplink,
			// 	},
			// 	(error) => {
			// 	  console.error('拉起失败', error)
			// 	}
			// );

			openSchema(app.android_dplink)

		}
		else {
			sweixin.launchMiniProgram({
				id: app.ghid,
				path: app.path,
				type: 0,
			})
		}

	} else {

		plus.nativeUI.alert('当前环境不支持微信操作!');
	}


	// uni.navigateToMiniProgram({
	// 	appId: app.appid,
	// 	path: app.path,
	// 	extraData: {
	// 	},
	// 	success(res: any) {
	// 		console.log(app.name, "打开成功:", res)
	// 	}
	// })

}

// 点击事件上报
const trackClickEvent = async (pos: any) => {
	// let sdk = store_TxSdk.DNSDK;

	const pages = getCurrentPages();
	console.log("pages:", pages)

	let prePage = ''
	if (pages.length > 1) {
		prePage = pages[pages.length - 2].route
	}

	// let reportRs = await Api.cloudHttp({
	// 	name: 'tracking',
	// 	data: {
	// 		action: 'core/report',
	// 		data: {
	// 			pos: pos,
	// 			goods: goodsDesc,
	// 			eventType: 'clk',
	// 			source: source.value,
	// 			prePage: prePage
	// 		}
	// 	}
	// })
	// console.log("点击上报结果:", reportRs.result)

	// 广告转化回传
	// Api.cloudHttp({
	// 	name: 'ads',
	// 	data: {
	// 		action: 'core/reportGoodsDetailConv',
	// 		data: {
	// 			openid: sdk.openid,
	// 			pos: pos,
	// 			goods: goodsDec,
	// 			eventType: 'clk',
	// 			source: source.value,
	// 			prePage: prePage
	// 		}
	// 	}
	// })
	// console.log("openid:", sdk.openid, "点击了首页商品或 tab, 上报结果:", res);
}

// onLoad 生命周期
onLoad((opts: any) => {
	console.log("\nonload opts:\n", opts)

	// this.getContainerRect()

	// 获取分享服务
	plus.share.getServices(function(obj){
		allShares = obj;

		console.log('\n#微信分享对象: ', allShares)

	}, function(err){

		alert("获取分享服务列表失败： "+JSON.stringify(err));
	});

	// 手机状态栏的高度
	statusBarHeight.value = uni.getWindowInfo()['statusBarHeight'];

	console.log("状态栏高度:", statusBarHeight.value);

	// 微信菜单栏的高度与宽度
	// let custom = uni.getMenuButtonBoundingClientRect();
	// console.log("微信胶囊大小:", custom)

	// // 导航栏高度 (标题栏高度) = 胶囊高度 + (顶部距离 - 状态栏高度) * 2
	// navBarHeight.value = custom.height + (custom.top - statusBarHeight.value) * 2

	// console.log("导航栏高度：" + navBarHeight.value)

	// // 胶囊高度
	// menuButtonHeight.value = custom.height
	// menuButtonWidth.value = custom.width

	searchBarHeight.value = 30
	// searchBarTop.value = statusBarHeight.value + (navBarHeight.value - menuButtonHeight.value)/2 - 1
	// console.log("\n搜索栏 top:", searchBarTop.value)

	// 获取热门商品
	fetchHotGoods()

	// 获取猜你喜欢商品
	fetchGuessGoods()

	// console.log("store:", store_userAuth, store_userAuth.is_login)

	// 实验区
	// let res = await uniCloud.callFunction({
	// 	name: 'cps',
	// 	data: {
	// 		action: 'core/homeRecommend',
	// 		data: {
	// 			// source: 'tb',
	// 			// cat_id: 100,
	// 			// keyword: '键盘',
	// 			page_id: 1,
	// 			page_size: 20
	// 		}
	// 	}
	// })
	// console.log("实验云函数结果:", res)
})

// onReady 生命周期
onReady(() => {
	console.log("onready called")

	// 使用搜索栏实际高度，保证电商菜单吸顶时位于搜索栏下方
	uni.createSelectorQuery()
		.select('.search-bar')
		.boundingClientRect((rect: any) => {
			if (rect && !Array.isArray(rect) && rect.height) {
				searchBarStickyHeight.value = rect.height + 10
			}
		})
		.exec()

	// const query = uni.createSelectorQuery().in(this);
	// console.log(query.select("ad-custom").__proto__)

	// const adComponent = this.selectComponent('#mywxid');
	// console.log("unit-id:", adComponent);

	// this.wxAdClickCapture()
})

const loadMoreGoods = async () => {
	console.log("loadMoreGoods triggered. ", loading.value, hasMore.value)
	if (loading.value || !hasMore.value) {
		return
	}

	loading.value = true

	pageId.value += 1

	try {
		if (current_tab.value === 0) {
			await fetchGuessGoods()
		} else {
			await fetchTabGoods(current_tab.value)
		}
	} catch (error) {
		console.log('加载更多商品失败:', error)
	} finally {
		loading.value = false
	}
}

// 部分端在吸顶组件存在时不会稳定触发 onReachBottom，使用列表位置兜底。
const checkGoodsListBottom = () => {
	if (loading.value || !hasMore.value) {
		return
	}

	uni.createSelectorQuery()
		.select('.goods-list-scroll')
		.boundingClientRect((rect: any) => {
			const windowHeight = uni.getWindowInfo().windowHeight
			if (rect && rect.bottom <= windowHeight + 40) {
				loadMoreGoods()
			}
		})
		.exec()
}

// 页面整体滚动到底部时加载下一页
onReachBottom(() => {
	loadMoreGoods()
})

// onPullDownRefresh 生命周期
onPullDownRefresh(() => {
	loading.value = true
	isnothing.value = false

	setTimeout(() => {
		uni.stopPullDownRefresh()
	}, 1000)
})

// onPageScroll 生命周期
onPageScroll((e: any) => {
	console.log("scroll page: ", e);
	// console.log("吸顶距离：\n",this.searchBarTop)

	if (e.scrollTop > navBarHeight.value) {
		// 搜索栏高度不变
		searchBarHeight.value = menuButtonHeight.value
		// 搜索栏宽度发生变化
		searchBarWidth.value = containerWidth.value - menuButtonWidth.value - 12
	}

	if (e.scrollTop === 0) {
		searchBarWidth.value = containerWidth.value - 8;
	}

	scrollTop.value = e.scrollTop
	checkGoodsListBottom()
})

// onUnload 生命周期
onUnload(() => {
	stickyStyle.value = ''
})

// 分享
onShareAppMessage(() => {
	return {
		title: config.value.mp_name + ', 真的会省！',
		path: '/pages/home/index',
		imageUrl: config.value.static + '/home-loading.png',
	}
})

// onShareAppMessage(() => {
// 	// console.log('onShareAppMessage options:', arguments[0]);

// 	let shareObj = {
// 		title: config.value.mp_name + ', 真的会省！', // 默认是小程序的名称 (可以写 slogan 等)
// 		path: '/pages/home/index', // 默认是当前页面，必须是以'/'开头的完整路径
// 		imageUrl: config.value.static + '/home-loading.png',
// 		success(res: any) {
// 			console.log(uniCloud.getCurrentUserInfo()?.uid, '转发成功！', res)

// 			if (res.errMsg === 'shareAppMessage:ok') {
// 				console.log(uniCloud.getCurrentUserInfo()?.uid, '转发成功！', res)
// 			}
// 		},
// 		fail(res: any) {
// 			console.log(uniCloud.getCurrentUserInfo()?.uid, '转发失败！', res)

// 			// 转发失败之后的回调
// 			if (res.errMsg === 'shareAppMessage:fail cancel') {
// 				// 用户取消转发
// 				console.log(uniCloud.getCurrentUserInfo()?.uid, '取消转发！', res)

// 			} else if (res.errMsg === 'shareAppMessage:fail') {
// 				// 转发失败，其中 detail message 为详细失败信息
// 				console.log(uniCloud.getCurrentUserInfo()?.uid, '转发失败！', res)
// 			}
// 		},
// 		complete(res: any) {
// 			//
// 			console.log(uniCloud.getCurrentUserInfo()?.uid, '转发完成！', res)
// 		}
// 	}

// 	// 来自哪里的转发：menu/button
// 	// if (arguments[0].from === 'button') {
// 	// 	// let eData = arguments[0].target.dataset;
// 	// 	// console.log(eData.id); // shareBtn

// 	// 	shareObj.path = '/pages/home/index'
// 	// }

// 	return shareObj;
// })

onShareTimeline(() => {
	return {
		title: config.value.mp_name + ', 真的会省！', // 默认是小程序的名称
		imageUrl: config.value.static + '/home-loading.png',
		success(res: any) {
			// 分享成功
			if (res.errMsg === 'shareAppMessage:ok') {
				console.log(uniCloud.getCurrentUserInfo()?.uid, '朋友圈分享成功！', res)
			}
		},
		fail(res: any) {
			// 用户取消
			if (res.errMsg === 'shareAppMessage:fail cancel') {
				console.log(uniCloud.getCurrentUserInfo()?.uid, '朋友圈取消分享！', res)
			}
			// 分享失败
			if (res.errMsg === 'shareAppMessage:fail') {
				console.log(uniCloud.getCurrentUserInfo()?.uid, '朋友圈分享失败！', res)
			}
		},
		complete(res: any) {
			//
		}
	}
})

// 方法
const wxtap = (e: any) => {
	console.log('wxtap called.', e)
}

const adWxClick = (e: any) => {
	console.log("wx ad clicked.", e)
}

// 微信原生模板广告
const adWxLoad = (e: any) => {

	console.log("wx custom ad load.")


}

const adWxError = () => {
}

const adWxClose = (e: any) => {

}

// 用户点击了广告
const wxAdClickCapture = (e: any) => {
	// const store_TxSdk = storeTxSdk()

	// let sdk = store_TxSdk.DNSDK;

	// console.log("wx ad click capture:", e)

	// const query = uni.createSelectorQuery().in(this);
	// console.log(query.select("ad-custom").__proto__)

	// let tstamp = new Date().getTime()

	// Api.cloudHttp({
	// 	name: 'ads',
	// 	data: {
	// 		action: 'core/userClickHomeAd',
	// 		data: {
	// 			etype: 'ad_click',
	// 			adid: 'adunit-0ef5bbb7f19b4722',
	// 			openid: sdk.openid,
	// 			x: e.detail.x,
	// 			y: e.detail.y,
	// 			click_time: tstamp
	// 		}
	// 	}

	// }).then(res => {
	// 	console.log("openid:", sdk.openid, " ", tstamp, "上报结果:", res);
	// })
}


const changeIndicatorDots = (e: any) => {
	indicatorDots.value = !indicatorDots.value
}

const changeAutoplay = (e: any) => {
	autoplay.value = !autoplay.value
}

const intervalChange = (e: any) => {
	interval.value = e.detail.value
}

const durationChange = (e: any) => {
	duration.value = e.detail.value
}

// const change = (e: any) => {
// 	let { index } = e.detail
// 	cats.value[index].badge && cats.value[index].badge++

// 	uni.showToast({
// 		title: `点击第${index+1}个宫格`,
// 		icon: 'none'
// 	})
// }

// onBackPress 生命周期
onBackPress(() => {
	// #ifdef APP-PLUS
	plus.key.hideSoftKeybord();
	// #endif
})

</script>


<style lang="scss">
.search-sticky {
	// height: 100%;
	// line-height: 100%;
	// text-align: center;

}

.hot-swiper {
	width: 100%;
	aspect-ratio: 16 / 9;
	border-radius: 20rpx;
	margin-top: 10rpx;
}

.search-bar {
	margin-top: 8rpx;
	background-color: rgba(255,0,0,0.0);
}

.ecomm-menu {
	background-color: blueviolet;
	margin-top: 10rpx;
}


.navBarBox {
	align-items: center;
}

.navBar {
	display: flex;
	flex-direction: row;
	justify-content: left;
	align-items: center;
}


.uni-margin-wrap {
	/* width:690rpx; */
	width: 100%;
}

// .swiper {
// 	border-radius: 20rpx;
// 	height: 300rpx;
// }
// .swiper-item {
// 	display: block;
// 	height: 300rpx;
// 	line-height: 300rpx;
// 	text-align: center;
// }


.grid-item-box {
	flex: 1;
	position: relative;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */

	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 5px 0;
}

.local-life {

	border-radius: 20rpx;
	background-color: white;
	margin-top: 10rpx;
	padding: 10rpx;

	&__content {
		@include flex(column);
	}

	// &__title {
	// 	font-size: 14px;
	// 	color: rgb(143, 156, 162);
	// 	margin-bottom: 8px;
	// 	@include flex;
	// }
}


.tabItem {
	display: flex;
	flex-direction: row;
	/* flex-shrink: 0; */
	text-align: center;
	width: 25%;
}

.grid-image-item {
	width: 25px;
	height: 25px;
}

.scroll-image-item {
	width: 100rpx;
	height: 100rpx;
	background-color: #4CD964;
	margin: 20rpx;
	border-radius: 4rpx;
}


.image-logo {
	width: 9%;
	height: 9%;
	// border-radius: 4px;
}

.text {
	color: #f56c6c;
	text-align: center;
	font-size: 12px;
	margin-top: 5px;
}


.scroll-list {
	@include flex(column);

	padding: 0rpx;

	&__goods-item {
		margin-right: 20px;
		margin-top: 5px;

		&__image {
			width: 50px;
			height: 50px;
			border-radius: 20px;
			background: linear-gradient(to bottom right, #B8DBF4, #7EBBE4);
		}

		&__text {
			// color: #f56c6c;
			text-align: center;
			font-size: 12px;
			margin-top: 5px;
		}
	}

	// &__indicator {
	// 	background-color: #f56c6c;
	// 	margin: 0rpx;
	// }

	&__show-more {
		background-color: #fff0f0;
		border-radius: 3px;
		padding: 3px 6px;
		@include flex(column);
		align-items: center;

		&__text {
			font-size: 12px;
			width: 12px;
			color: #f56c6c;
			line-height: 16px;
		}
	}

	&__line {
		@include flex;
		margin-top: 10px;

		&__item {
			margin-right: 15px;

			&__image {
				width: 50px;
				height: 50px;
				border-radius: 20px;
				background: linear-gradient(to bottom right, #eaf5e3, #d4ebc4);
			}

			&__text {
				margin-top: 5px;
				color: $u-content-color;
				font-size: 12px;
				text-align: center;
			}

			&--no-margin-right {
				margin-right: 0;
			}
		}
	}
}

.u-scroll-list {

	&__indicator {
		@include flex;
		justify-content: center;
		margin-top: 5px;

		&__line {
			width: 60px;
			height: 4px;
			border-radius: 100px;
			overflow: hidden;

			&__bar {
				width: 20px;
				height: 4px;
				border-radius: 100px;
			}
		}
	}
}

</style>
