<template>
	<view class="container">
		<loadingIcon v-if="loading" lClass="mar--t200"></loadingIcon>
		
		<view class="" v-else>
			<view v-if="goodsDec.goodsId">
				<view class="zcolor-while" style="width: 750rpx;">
					<swiper :indicator-dots="true" :circular="true" class="justify-center align-center"
						style="height: 650rpx;">
						<swiper-item v-for="(item,index) in goodsDec.goodsCarouselPictures" :key="item"
							style="height: 750rpx;">
							<image :src="item" style="width: 750rpx; height: 750rpx;" mode="aspectFill">
							</image>
						</swiper-item>
					</swiper>
					
					<view class="zcolor-while" style="height: 10rpx;"></view>
				</view>
				
				<view class="zcolor-while ">
			
					<view class="zcolor-while1 pa-30"
						style="border-top-right-radius: 50rpx; border-top-left-radius: 50rpx;">
						<view class="pa-30 zcolor-while bor-r30">
			
							<view class="dflex flex-row justify-space-between align-center">
								<view class="dflex flex-row align-center">
									<view class="dflex flex-row align-center">
										<text class="fs-25 fcolor-red mar-r10 mar-t15">¥</text>
										<text class="fs-45 f-w fcolor-red mar-r30">{{goodsDec.price}}</text>
									</view>
									<view class="dflex flex-row align-flex-end mar-t5">
										<text class="fs-25 fcolor-dark1 mar-r10">¥</text>
										<text class="fs-30  fcolor-dark1 mar-r30"
											style="text-decoration: line-through;">{{ goodsDec.marketPrice }}</text>
									</view>
								</view>
			
							</view>
							<text class="fs-31 f-w1 mar-t30  text-overflow">{{goodsDec.goodsName}}</text>
							<view class="dflex flex-row justify-space-between align-center mar-t30">
								<view class="zcolor-while1 pa-15 bor-r50 dflex flex-row align-center">
									<view class="zcolor-while bor-r100">
										<image :src="tab_img" mode="aspectFill" class="bor-r100 wh-40" />
									</view>
									
									<text class="fs-26  mar-l10">{{goodsDec.shopName.substr(0,16) + '...'}}</text>
									
									<!-- <text class="fs-26  mar-l10"
										v-if="goodsDec.shopName.length>=10">{{goodsDec.shopName.substr(0,10) + '...'}}</text>
									<text class="fs-26  mar-l10" v-else>{{shopName}}</text> -->
								</view>
								<view class="dflex flex-row align-center">
								<view class="justify-center align-center">
										<!-- <view class="dflex flex-row align-center" v-if="source=='vip'">
											<text class="fs-26 fcolor-dark1 ">折扣：</text>
											<text
												class="fs-26  fcolor-red f-w">{{(goodsDec.discount*10).toFixed(0)}}折</text>
										</view> -->
										
									<view class="dflex flex-row align-center" v-if="goodsDec.discount!==null">
										<text class="fs-26  fcolor-dark1">省：</text>
										<text class="fs-26  fcolor-red f-w">{{parseFloat(goodsDec.discount).toFixed(1)}}元</text>
									</view>
								</view>
									<!-- <text class="fs-18 fcolor-dark1 mar-l10 mar-10">|</text>
									<view class="justify-center align-center">
										<view class="dflex flex-row align-center">
											<text class="fs-26  fcolor-dark1">已售：</text>
											<text class="fs-26  fcolor-red f-w">{{commission}}件</text>
										</view>
									</view> -->
								</view>
							</view>
			
						</view>
						
						<view class="flex flex-column zcolor-while bor-r30 mar-t30  pa-30">
							<topDec name="产品详情" class=""></topDec>
							<view class="wh-30"></view>
							
							<view class="" v-for="item in goodsDec.goodsDetailPictures"
								:key="item">
								<view>
									<image :src="item" class="bor-r10 "  mode="aspectFill">
									</image>
								</view>
							</view>
						</view>
			
						<view class="wh-h130 zcolor-while1"></view>
						
						
						
						<view class="position-r-b-l dflex flex-row justify-space-between align-center pa-0 zcolor-while mar-30 bor-r100">
							
							<!-- #ifdef MP-WEIXIN -->
							<!-- <button  open-type="share"  style="border-radius: 50rpx;">
								<view   class="gradient-red-purple wh-85-200 bor-r50  dflex flex-row align-center justify-center" >
									<image src="@/static/re.png" mode="aspectFill" class="wh-45"></image>
									<text class="fcolor-while fs-30 mar-l5 f-w">分享</text>
								</view>
							</button> -->
							<!-- #endif -->
							
							<view class="gradient-red-purple bor-r50 dflex align-center justify-center " style="width: 100vh; height: 85rpx;"
								  @click="navTb(2)">
								<text class=" fs-30 fcolor-while f-w">直达购买链接</text>
							</view>
							
						</view>
					
					</view>
				</view>
			
			</view>
			
			<!-- 商品不存在 -->
			<view class="dflex justify-center align-center flex-column" style="height: 100vh;" v-else>
				<view class="">
					<image style="width: 400rpx; opacity: 1;" src="https://mp-ba2f31ba-46dc-47fe-abf6-70aa178a7c92.cdn.bspapp.com/static/nothing.png"
						mode="widthFix"></image>
				</view>
				<text class="fs-26 fcolor-dark1">该商品维护中，请等会再来~</text>
				<view   class="bor-r50 dflex align-center justify-center zcolor-black mar-t60" style="width: 300rpx; height: 85rpx;"
					  @click="navB()">
					<text class=" fs-30 fcolor-while f-w">返回上个页面</text>
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
	
	import utils from "@/common/utils.js"
	import { useUserAuthStore } from "@/store/user-auth"
	import Common from '@/common/common'
	import { openSchema, canOpenURL } from '@/uni_modules/uts-openSchema'
	
	import config from '@/config.js'
	
	const store_userAuth = useUserAuthStore()
	
	
	// 页面数据
	interface GoodsDetail {
		goodsId: string
		goodsName: string
		// price: string
		marketPrice: string
		discount: string
		shopName: string
		price: number
		marketPriceNum: number
		discountNum: number
		commission: number
		url: string
		click_url: string
		schema_url: string
		deeplinkUrl: string
		tpwd: string
		we_app_info: {
			app_id: string
			page_path: string
		}
		goodsCarouselPictures: string[]
		goodsDetailPictures: string[]
		toast_msg: string
		censor: boolean
	}
	
	const censor = ref(false)
	
	// 领券文本，根据是否登录来显示
	const gotoText = ref('领取优惠')
	const goodsId = ref('')
	// const goodsDec = ref<GoodsDetail>({})
	const goodsDec = ref<GoodsDetail | null>(null)
	
	const loading = ref(true)
	const tab_img = ref('')
	const isTj = ref(false)
	const toast_msg = ref('口令码已复制！')
	
	const source = ref('pdd')
	const shopName = ref('')
	const finalPrice = ref('')
	const marketPrice = ref('')
	const discount = ref('')
	
	// const config = ref(uni.getStorageSync('config') || {})
	
	// 获取商品详情
	const fetchGoods = () => {
		
		let sourceVal = source.value 
		if (sourceVal == 'tb') {
			sourceVal = 'taobao'
		}
		
		uniCloud.callFunction({
			name: 'cps',
			data: {
				action: 'mix/getGoodsDetail',
				data: {
					goodsId: goodsId.value,
					source: sourceVal
				}
			}
		})
		.then((goodsRs) => {
			console.log("\ngoods detail query result: \n", goodsRs.result)
			
			const data = goodsRs.result.data || {}
			goodsDec.value = data
			toast_msg.value = data.toast_msg
			censor.value = data.censor
			
			loading.value = false
		})
		
		if(!store_userAuth.is_login) {
			gotoText.value = '登录领取优惠'
		}
	}
	
	// 用户打开商详页时上报行为
	// const trackPvEvent = async () => {
	// 	goodsDec.value.finalPrice = goodsDec.value.price
	// 	goodsDec.value.marketPrice = String(goodsDec.value.marketPriceNum)
	// 	goodsDec.value.discount = String(goodsDec.value.discountNum)
		
	// 	const pages = getCurrentPages()
		
	// 	const reportRs = await uniCloud.callFunction({
	// 		name: 'tracking',
	// 		data: {
	// 			action: 'core/report',
	// 			data: {
	// 				goods: goodsDec.value,
	// 				eventType: 'pv',
	// 				source: source.value,
	// 				prePage: pages[pages.length - 2].route
	// 			}
	// 		}
	// 	})
	// 	console.log("pv 上报结果：\n",reportRs.result)
	// }
	
	// 返回上个页面
	const navB = () => {
		uni.navigateBack()
	}
	
	// 跳转淘宝/京东/拼多多/唯品会
	const navTb = (i: number) => {
		// const store_userAuth = storeUserAuth()
		
		console.log('i: ',i);
		
		if (i == 1) {
			
			// #ifdef APP-PLUS
			plus.share.sendWithSystem(
				{
					type: 'text',
					content: '亲亲，这个商品有巨额优惠卷赶紧来领取！！！【商品标题】： ' + goodsDec.value.goodsName,
					href: goodsDec.value.click_url || goodsDec.value.url,
				},
				() => {
					console.log('分享成功')
				},
				(err) => {
					console.log('分享失败', err)
				}
			)
			
			// uni.share({
			// 	provider: 'weixin',
			// 	scene: 'WXSceneSession',
			// 	type: 0,
			// 	title: '标题',
			// 	summary: '内容',
			// 	href: 'https://example.com',
			// 	success() {
			// 		console.log('success')
			// 	}
			// })
			// #endif
			
		} else {
			
			// 没有登录，先去登录
			// if (!store_userAuth.is_login) {
			// 	const curr_url = getCurrentPageAndParas();
			// 	console.log("当前页面及参数为：\n",curr_url)
				
			// 	uni.navigateTo({
			// 		url: '/pages/login/login?back_url=/'+encodeURIComponent(curr_url)
			// 	})
				
			// 	return
			// }
			console.log('goodsDec: ', goodsDec.value);
			
			if (source.value == "taobao" || source.value=='tb') {
				
				
				// #ifdef MP-WEIXIN
				// if (!censor.value) {
					
				// 	Common.fz(
				// 		goodsDec.value.tpwd,
				// 		toast_msg.value,
				// 		''
				// 	)
				// }
				// #endif

				// #ifdef APP
				// utils.openLink('taobao://' + goodsDec.value.click_url.split('://')[1], (res) => {
				// 	utils.openLink(goodsDec.value.click_url)
					
				// }, 'com.taobao.taobao')
				
				const dplink = `tbopen://m.taobao.com/tbopen/index.html?action=ali.open.nav&module=h5&bc_fl_src=tunion_mm_mm&h5Url=${encodeURIComponent(goodsDec.value.click_url)}`
				openSchema(dplink)
				// #endif

			} else if (source.value == "jd") {
				
				// #ifdef MP-WEIXIN
				uni.navigateToMiniProgram({
					appId: goodsDec.value.we_app_info.app_id, // 此为 开源字节 appid
					path: goodsDec.value.we_app_info.page_path, // 此为开源字节首页路径
					envVersion: "release",
					success: (res: any) => {
						// 打开成功
						console.log("打开成功", res);
					},
					fail: (err: any) => {
						console.log(err);
					}
				})
				// #endif

				// #ifdef APP-PLUS
				const paras = {
					'category': 'jump', 
					'des': 'm',
					'url': goodsDec.value.url
				}
				const dplink = `openapp.jdmobile://virtual?params=${encodeURIComponent(JSON.stringify(paras))}`
				
				openSchema(dplink)
				// #endif
				
			} else if (source.value == "pdd") {
				
				// #ifdef MP-WEIXIN
				uni.navigateToMiniProgram({
					appId: goodsDec.value.we_app_info.app_id, // 此为 开源字节 appid
					
					path: goodsDec.value.we_app_info.page_path, // 此为开源字节首页路径
					envVersion: "release",
					success: (res: any) => {
						// 打开成功
						console.log("打开成功", res);
					},
					fail: (err: any) => {
						console.log(err);
					}
				})
				// #endif
				
				// #ifdef APP-PLUS
				const dplink = `pinduoduo://com.xunmeng.pinduoduo/app.html?url=${encodeURIComponent(goodsDec.value.url)}`
				openSchema(dplink)
				// #endif

			} else if (source.value == "vip") {
				// #ifdef MP-WEIXIN
				uni.navigateToMiniProgram({
					appId: goodsDec.value.we_app_info.app_id, // 此为 开源字节 appid
					path: goodsDec.value.we_app_info.page_path, // 此为开源字节首页路径
					envVersion: "release",
					success: (res: any) => {
						// 打开成功
						console.log("打开成功", res);
					},
					fail: (err: any) => {
						console.log(err);
					}
				})
				// #endif
				
				// #ifdef APP-PLUS
				openSchema(goodsDec.value.url)
				// #endif

			} else {
				Common.fz(
					`${goodsDec.value.url}\n商品标题：${goodsDec.value.goodsName}\n原价：${goodsDec.value.price}元\n优惠券：${goodsDec.value.discount}元\n返利：${goodsDec.value.commission}元\n复制该文字到抖音 APP 打开即可获得优惠及返利！`,
					'复制口令成功，请打开抖音 APP'
				)
				
			}
		}
	}
	
	// 获取当前页面及参数
	const getCurrentPageAndParas = () => {
		const pages = getCurrentPages()
		console.log("当前页面为：", pages)
		
		// const currentPage = pages[pages.length - 1]
		const currentPage = pages[pages.length - 1] as {
			route: string
			options: Record<string, any>
		}
		const url = currentPage.route
		const options = currentPage.options
		
		const params = Object.keys(options)
			.map(key => `${key}=${options[key]}`)
			.join('&')
		
		return url + (params ? '?' + params : '')
	}
	
	// 设置分享
	onShareTimeline(() => {
		let shareTitle = ''
		shareTitle += '到手' + goodsDec.value.price.toFixed(1) + '元，立省' + (goodsDec.value.marketPriceNum - goodsDec.value.price).toFixed(1) + '元'
		shareTitle += '\n' + goodsDec.value.goodsName.substr(0, 10) + "..."
		
		const data = {
			title: shareTitle, // 默认是小程序的名称
			path: `/pages/cps/goods-details?goodsId=${goodsId.value}&source=${source.value}`, // 默认是当前页面，必须是以 '/' 开头的完整路径
			imageUrl: goodsDec.value.goodsDetailPictures[0], // 图片封面，本地文件路径、网络图片路，支持 PNG 及 JPG，默认当前页面截图，显示图片长宽比是 5:4。
			success: (res: any) => {
				console.log('sharetimeline succ')
				// 分享成功
				if (res.errMsg === 'shareAppMessage:ok') {}
			},
			fail: (res: any) => {
				// 用户取消
				if (res.errMsg === 'shareAppMessage:fail cancel') {}
				// 分享失败
				if (res.errMsg === 'shareAppMessage:fail') {}
			},
			complete: (res: any) => {}
		}
		return data
	})
	
	// 分享给好友
	onShareAppMessage(() => {
		
		let shareTitle = ''
		shareTitle += '到手' + goodsDec.value.price.toFixed(1) + '元，立省' + (goodsDec.value.marketPriceNum - goodsDec.value.price).toFixed(1) + '元'
		shareTitle += '\n' + goodsDec.value.goodsName.substr(0, 10) + "..."
		
		// 设置菜单中的转发按钮触发转发事件时的转发内容
		return {
			title: shareTitle, 
			// desc: "商品标题" + goodsDec.value.goodsName, // 小程序的描述
			path: `/pages/cps/goods-details?goodsId=${goodsId.value}&source=${source.value}`, // 默认是当前页面，必须是以 '/' 开头的完整路径
			imageUrl: goodsDec.value.goodsCarouselPictures[0], // 图片封面，本地文件路径、网络图片路，支持 PNG 及 JPG，默认当前页面截图，显示图片长宽比是 5:4。
			// success: (res: any) => {
			// 	// 转发成功之后的回调
			// 	console.log('shareapp succ')
				
			// 	if (res.errMsg === 'shareAppMessage:ok') {
			// 		console.log(res)
				
			// 	}
			// },
			// fail: (res: any) => {
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
		// if (arguments[0].from === 'button') {
		// 	const eData = arguments[0].target.dataset
		// 	console.log(eData.id); // shareBtn
		// 	// 此处可以修改 shareObj 中的内容
		// 	shareObj.path = `/pages/cps/goods-details?goodsId=${goodsId.value}&source=${source.value}`
		// }
		
	})
	
	// onLoad 生命周期
	onLoad((data: any) => {
		console.log('onload options of goods-detail: ',data)
		
		goodsId.value = data.goodsId
		source.value = data.source || 'pdd'
		shopName.value = data.shopName
		
		finalPrice.value = data.finalPrice || ''
		marketPrice.value = data.marketPrice || ''
		discount.value = data.discount || ''
		
		if (source.value == 'taobao' || source.value=='tb') {
			tab_img.value = config.static +  '/tb.png'
		} else if (source.value == 'jd') {
			tab_img.value = config.static +  '/jd.png'
		} else if (source.value == 'pdd') {
			tab_img.value = config.static +  '/pdd.png'
		} else if (source.value == 'vip') {
			tab_img.value = config.static +  '/vip.png'
		} else {
			tab_img.value = config.static +  '/dy.png'
		}
		
		fetchGoods()
		
		if(!store_userAuth.is_login) {
			gotoText.value = '登录领取优惠'
		}
		
		// 仅 app 平台支持
		// plus.device.getOAID({
		// 	success:function(e){
		// 		console.log('getOAID success: '+JSON.stringify(e));
		// 	},
		// 	fail:function(e){
		// 		console.log('getOAID failed: '+JSON.stringify(e));
		// 	}
		// });
		
		// 获取位置参数
		// uni.getLocation({
		// 	type: 'wgs84',
		// 	success: (res: any) => {
		// 		console.log('当前位置：', res)
		// 	}
		// });
		
		// trackPvEvent()
	})
	
	// onShow 生命周期
	onShow(() => {
		
		// #ifdef MP-WEIXIN
		// uni.showShareMenu({
		// 	withShareTicket: true,
		// 	//设置下方的 Menus 菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
		// 	menus: ["shareAppMessage", "shareTimeline"]
		// })
		// #endif
		
	})
	
</script>

<style lang="scss">

</style>
