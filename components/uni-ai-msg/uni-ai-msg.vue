<template>
	<view class="msg-item" v-if="!msg.isDelete">
		<!-- <view class="create_time-box">
			<uni-dateformat class="create_time" :date="msg.create_time" format="MM/dd hh:mm:ss"></uni-dateformat>
		</view> -->
		
		<view :class="{reverse:!msg.isAi}">
			<!-- 机器人头像 -->
			<!-- <view class="userInfo">
				<image class="avatar" :src="msg.isAi?'https://env-00jxt26g3woi.normal.cloudstatic.cn/static/head-ai.jpg':'../../static/avatar.png'" mode="widthFix"></image>
			</view> -->
			
			<!-- 消息具体内容 -->
			<view class="content">
				<!-- ai messsage -->
				<view v-if="msg.isAi" class="ai-msg rich-text-box" :class="{'show-cursor':showCursor}" ref="rich-text-box">
					
					<view class="up-flex up-flex-column" style="max-width: 100%;">
						
						<!-- ai回复文本内容 -->
						<rich-text class="rich-val " v-if="nodes&&nodes.length" space="nbsp" :nodes="nodes" @itemclick="trOnclick"></rich-text>
						
						<!-- 插入广告 uniad banner -->
						<!-- #ifdef MP-WEIXIN -->
						<view  v-if="isAd"
							@tap="wxtap"
							@click.capture='wxAdClickCapture' 
							class="dflex flex-row align-center zcolor-while bor-r20 mar-b20 mar-t15">
							<ad-custom id="mywxid" ref="wxad" class="wx-ad" style="width:100%; " unit-id="adunit-1bcd0f5758adf5f3" @bindclick="adWxClick" @bindload="adWxLoad" @binderror="adWxError" @bindclose="adWxClose"></ad-custom>
						</view>
						<!-- #endif -->
						
						<!-- 商品列表 -->
						<view v-for="(item, index) in msg.aiToolResult" :key="index">
							
							<view class="dflex flex-column align-center zcolor-while mar-t25" style="width: 100%;"
								 @click="gotoGoodsDetail(item)">
							
								<view class="u-flex u-flex-around">
									<view class="pa-10">
										<image :src="item.goodsThumbUrl" mode="aspectFill" class="wh-250 bor-r20" />
									</view>
									
									<view class="u-flex u-flex-column u-flex-between">
										<view class="">
											<text class="fs-28 f-w "
												style="width: 100%;">{{(item.goodsName || '').substr(0,25) + '...'}}</text>
										</view>
										
										<view v-if="item.sales_tip" class="u-flex u-flex-row u-flex-items-center">
											<text class="fs-25 fcolor-dark2">销量: </text>
											<text class="fs-32 fcolor-red f-w mar-l10">{{item.sales_tip}}</text>
										</view>
										
										<view v-else-if="item.comments" class="u-flex u-flex-row u-flex-items-center">
											<text class="fs-25 fcolor-dark2">评论数: </text>
											<text class="fs-32 fcolor-red f-w mar-l10">{{item.comments}}</text>
										</view>


									</view>
								</view>
								
								<view class="u-flex u-flex-between u-flex-items-center mar-t5 u-margin-bottom-5" style="width: 100%;">

									<!-- 价格 -->
									<view class="u-flex u-flex-row u-flex-items-center">
										<text class="fs-25 fcolor-dark2 mar-r10">到手: </text>
										<view class="u-flex u-flex-row u-flex-items-end">
											<text class="fs-28 fcolor-red">¥</text>
											<text class="fs-35 fcolor-red f-w mar-l10">{{item.finalPrice}}</text>
										</view>
									</view>
									
									<!-- 品牌或店铺 -->
									<view class="">
										<text class="fs-25 fcolor-dark2">{{(item.shopName || '').substr(0,20) + '...'}}</text>
									</view>

								</view>
							
							</view>
							
						</view>
						
					</view>
					
					<view class="ai-label"><label>内容由Ai生成</label></view>
				</view>
				
				<!-- 用户消息 -->
				<view class="user-msg" v-else>{{msgContent}}</view>
				
				<!-- ai消息选项 -->
				<!-- <view class="menu-box" :class='{"menu-box-ai":msg.isAi}'>
					<uni-icons v-if="isLastMsg && msg.isAi" title="换一个答案" @click="changeAnswer" color="#ccc" class="pointer change-answer" type="reload" size="16"></uni-icons>
					
					<view @click="showMoreMenu = !showMoreMenu" class="more-icon-box">
						<uni-icons class="more-icon pointer" size="12px" type="more-filled" color="#ccc"></uni-icons>
					</view>
					
					<template v-if="showMoreMenu">
						<view class="more-menu">
							<view @click="copy" title="复制" class="copy-icon pointer">
								<view class="copy-icon-a"></view>
								<view class="copy-icon-b"></view>
							</view>
							<uni-icons class="remove-msg pointer" @click="removeMsg" type="trash" size="20" color="#ccc"></uni-icons>
						</view>
						<view class="more-menu-mask" @click="showMoreMenu = false"></view>
					</template>
				</view> -->
				
			</view>
		</view>
	</view>
</template>

<script>
	// 引入配置文件
	import config from '@/config.js';

	// 获取广告id
	const {
		adpid
	} = config

	// 引入markdown-it库
	import MarkdownIt from '@/lib/markdown-it.min.js';

	// hljs是由 Highlight.js 经兼容性修改后的文件，请勿直接升级。否则会造成uni-app-vue3-Android下有兼容问题
	import hljs from "@/lib/highlight/highlight-uni.min.js";

	// 引入html-parser.js库
	import parseHtml from '@/lib/html-parser.js';
	
	import { openSchema, canOpenURL } from '@/uni_modules/uts-openSchema'

	// console.log('hljs--',hljs);
	// console.log('hljs--',hljs.getLanguage('js'));
	
	// 为复制代码功能保留代码内容
	let codeDataList = []
	
	// 初始化 MarkdownIt库
	const markdownIt = MarkdownIt({
		// 在源码中启用 HTML 标签
		html: true,
		// 如果结果以 <pre ... 开头，内部包装器则会跳过。
		highlight: function(str, lang) {
			// if (lang && hljs.getLanguage(lang)) {
			// 	console.error('lang', lang)
			// 	try {
			// 		return '<pre class="hljs" style="padding: 5px 8px;margin: 5px 0;overflow: auto;display: block;"><code>' +
			// 			hljs.highlight('lang', str, true).value +
			// 			'</code></pre>';
			// 	} catch (__) {}
			// }
			// 经过highlight.js处理后的html
			let preCode = ""
			try {
				preCode = hljs.highlightAuto(str).value
			} catch (err) {
				// console.log('err',err);
				preCode = markdownIt.utils.escapeHtml(str);
			}
			
			
			// 以换行进行分割
			const lines = preCode.split(/\n/).slice(0, -1)
			// 添加自定义行号
			let html = lines.map((item, index) => {
				// 去掉空行
				if( item == ''){
					return ''
				}
				return '<li><span class="line-num" data-line="' + (index + 1) + '"></span>' + item +'</li>'
			}).join('')
			html = '<ol style="padding: 0px 30px;">' + html + '</ol>'
			
			// 代码复制功能
			codeDataList.push(str)
			let htmlCode = `<div style="background:#0d1117;margin-top: 5px;color: #888;padding:5px 0;border-radius: 5px;">`
				// #ifndef MP-WEIXIN
					htmlCode += `<div style="text-align: end;font-size: 12px;">`
						htmlCode += `${lang}<a class="copy-btn" code-data-index="${codeDataList.length - 1}" style="cursor: pointer;"> 复制代码 </a>`
					htmlCode += `</div>`
				// #endif
					htmlCode += `<pre class="hljs" style="padding:0 8px;margin-bottom:5px;overflow: auto;display: block;border-radius: 5px;"><code>${html}</code></pre>`;
				htmlCode += '</div>'
			return htmlCode
		}
	})

	export default {
		name: "uni-ai-msg",
		data() {
			return {
				// 悬浮的复制按钮的左边距
				left: "-100px",
				// 悬浮的复制按钮的上边距
				top: "-100px",
				adpid,
				showMoreMenu:false
			};
		},
		mounted() {
			console.log("\nuni-ai-msg: isAd=",this.isAd, this.isAiFinish, this.isLastMsg)
		},
		created() {
		},
		props: {
			// toolResult: {
			// 	type: Object,
			// 	default () {
			// 		return []
			// 	}
			// },
			// 是否显示鼠标闪烁的效果
			showCursor: {
				type: [Boolean, Number],
				default () {
					return false
				}
			},
			isLastMsg: {
				type: Boolean,
				default () {
					return false
				}
			},
			// ai回复是否结束
			isAiFinish: {
				type: Boolean,
				default () {
					return false
				}
			},
			// 是否开启广告
			isAd: {
				type: Boolean,
				default () {
					return false
				}
			},
			// 消息格式
			msg: {
				type: Object,
				default () {
					return {
						content: "",  	//消息内容
						aiToolResult: [],
						isDelete:false	//消息是否被删除
					}
				}
			},
		},
		computed: {
			msgContent() {
				return this.msg.content
			},
			aiToolResult() {
				return this.msg.aiToolResult
			},
			nodes() {
				if(!this.msgContent){
					return //处理特殊情况，比如网络异常导致的响应的 content 的值为空
				}
				let htmlString = ''
				// 修改转换结果的htmlString值 用于正确给界面增加鼠标闪烁的效果
				// 判断markdown中代码块标识符的数量是否为偶数
				if (this.msgContent.split("```").length % 2) {
					let msgContent = this.msgContent
					// if(msgContent[msgContent.length-1] != '\n'){
					// 	msgContent += '\n'
					// }
					msgContent += ' <span class="cursor" style="color:gray">●</span>'
					htmlString = markdownIt.render(msgContent);
				} else {
					htmlString = markdownIt.render(this.msgContent) + ' \n <span class="cursor" style="color:gray">●</span>';
				}

				// #ifndef APP-NVUE
				return htmlString
				// #endif

				// nvue模式下将htmlString转成htmlArray，其他情况rich-text内部转
				// 注：本示例项目还没使用nvue编译

				// #ifdef APP-NVUE
				return parseHtml(htmlString)
				// #endif
			}
		},
		methods: {
			wxtap(e) {
				console.log('wxtap called.',e )
			},
			adWxClick(e) {
				console.log("wx ad clicked.", e)
			},
			// 微信原生模板广告
			adWxLoad(e) {
				
				console.log("wx ai shopping assistant ad load.")
				
				
			},
			
			adWxError(e) {
			},
			
			adWxClose(e) {
				
			},
			// 用户点击了广告
			wxAdClickCapture(e) {
				// let sdk = this.store_TxSdk.DNSDK;
				
				// console.log("wx ad click capture:\n", e)
				
				// const query = uni.createSelectorQuery().in(this);
				// console.log(query.select("ad-custom").__proto__)
				
				// let tstamp = new Date().getTime()
				
				// uniCloud.callFunction({
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
				// 	console.log("openid: ", sdk.openid," ",tstamp," 上报结果：",res);
				// })
			},
			trOnclick(e){
				console.log('click on ai msg:\n', e);
				
				let {attrs} = e.detail.node
				console.log({attrs});
				let {"code-data-index":codeDataIndex,"class":className} = attrs
				if(className == 'copy-btn'){
					// console.log('codeDataList[codeDataIndex]',codeDataList[codeDataIndex]);
					uni.setClipboardData({
						data:codeDataList[codeDataIndex],
						showToast:false,
						success() {
							uni.showToast({
								title: '复制成功',
								icon: 'none'
							});
						}
					})
				}
			},
			gotoGoodsDetail(item) {
				console.log('\nclick item: \n',item)
				
				if (item.source === 'tb') {
					
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
						
						console.log("\ngoods detail query result: \n", goodsRs.result)
						
						const click_url = goodsRs.result.data.click_url
						const dplink = `tbopen://m.taobao.com/tbopen/index.html?action=ali.open.nav&module=h5&bc_fl_src=tunion_mm_mm&h5Url=${encodeURIComponent(click_url)}`
						
						openSchema(dplink)
					})
					
				}
				else {
					
					uni.navigateTo({
						url: '/pages/cps/goods-details?goodsId='+item.goodsId+'&source='+item.source
					})
				}
			},
			changeAnswer(){
				this.$emit('changeAnswer')
			},
			// 复制文本内容到系统剪切板
			copy() {
				uni.setClipboardData({
					data: this.msgContent,
					showToast: false,
					success() {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						});
					}
				})
				this.showMoreMenu = false
			},
			// 删除消息
			removeMsg(){
				this.$emit('removeMsg')
				this.showMoreMenu = false
			}
		}
	}
</script>

<style lang="scss">
	/* #ifndef APP-NVUE */
	view,
	textarea,
	button,
	.page {
		display: flex;
		box-sizing: border-box;
	}
	/* #endif */
	
	.rich-val {
		word-break: break-all;
		white-space: pre-line;
	}

	.userInfo {
		flex-direction: column;
	}

	.msg-item {
		// position: relative;
		// width: 750rpx;
		// width: 100%;
		flex-direction: column;
		// padding: 0 15px;
		// padding-bottom: 8px;
	}
	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 2px;
	}

	.create_time {
		font-size: 12px;
		padding: 5px 0;
		padding-top: 0;
		color: #aaa;
		text-align: center;
		width: 750rpx;
		/* #ifdef MP */
		display: flex;
		/* #endif */
		justify-content: center;
	}

	.content {
		// position: relative;
		
		/* #ifndef APP-NVUE */
		// max-width: calc(100% - 5px);
		/* #endif */
		
		// background-color: #aaa;
		// border-radius: 20px;
		// padding: 12px 10px;
		// margin-left: 10px;
		
		/* #ifndef APP-NVUE */
		// word-break: break-all;
		// user-select: text;
		// cursor: text;
		/* #endif */
		
		flex-direction: column;
	}
	
	.user-msg {
		padding: 15rpx;
		background-color: #d9480f;
		border-radius: 20rpx 20rpx 0rpx 20rpx;
		margin: 15rpx 0rpx;
	}
	
	.ai-msg {
		position: relative;
		padding: 15rpx;
		background-color: #fff;
		border-radius: 20rpx 20rpx 20rpx 0rpx;
		margin: 5rpx;
	}
	
	.ai-label {
		position: absolute;
		bottom: 0;               /* 定位在父元素内容区域的底部 */
		right: 0;                  /* 定位在父元素内容区域的左侧 */
		// width: 100px;
		// height: 30px;
		// background-color: red;
		color: #BBB;
		padding-right: 12px;
		font-size: 10px;
	}
	
	.menu-box {
		position: absolute;
		left: -18px;
		bottom: 0;
		width: 20px;
		flex-direction: column;
		height: 40px;
		justify-content: flex-end;
    /* #ifndef APP-NVUE */
    /* #endif */
	}
	
	.menu-box-ai {
		left: auto;
		right: -20px;
	}
	
	.change-answer {
		margin-bottom: 5px;
		position: relative;
    transform: rotate(90deg);
	}
  
  /* #ifdef H5 */
  .uni-icons {
    opacity: 0.6;
  }
  .uni-icons:hover{
    opacity: 1;
  }
  /* #endif */
	
	.pointer {
		cursor: pointer;
	}
	
	.pointer:hover {
		color: #BBB;
	}
	
	.more-icon-box {
		justify-content: center;
		overflow: hidden;
	}
	
	.more-icon {
		color: #d4d4d4;
		transform: rotate(90deg);
    padding-top: 2px;
		position: relative;
		font-size: 16px;
		z-index: 999;
	}
	
	.more-menu {
		position: absolute;
		bottom:-10px;
		left:-30px;
		flex-direction: column;
		justify-content: space-around;
		width: 30px;
		padding: 2px 5px;
		height: 60px;
		z-index: 999;
		background-color: #FFF;
		box-shadow: 0 0 20px #eee;
		border-radius: 3px;
	}
	
	.more-menu-mask {
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		z-index: 998;
	}
	
	.menu-box-ai .more-menu {
		left:auto;
		right: -32px;
	}
	
	.more-menu .pointer{
		width: 20px;
	}
	
	.copy-icon{
		position: relative;
		height: 25px;
		width: 20px;
	}
	.copy-icon-a,
	.copy-icon-b {
		position: absolute;
		border: 1.5px solid #d4d4d4;
		width: 10px;
		height: 12px;
		background-color: #FFF;
		left: 3px;
		top: 4px;
		border-radius: 3px;
	}
	.copy-icon-b {
		top: 8px;
		left: 6px;
	}
	.copy-icon:hover .copy-icon-a
	.copy-icon:hover .copy-icon-b {
		border-color:#bbb;
	}

	/* #ifndef APP-NVUE */
	.content ::v-deep rich-text {
		max-width: 100%;
		overflow: auto;
	}
	code .l:before {
		color: #516363;
		position: absolute;
		left: 15px;
		content: counter(step);
		counter-increment: step;
	}
	/* #endif */


	.reverse {
		flex-direction: row-reverse;
	}

	.reverse .content {
		margin-left: 0rpx;
		margin-right: 0rpx;
	}

	.reverse-align {
		align-items: flex-end;
	}

	.create_time-box {
		margin-top: 15px;
		justify-content: center;
	}
	
	/* #ifdef H5 */
	a.copy-btn:hover {
	    color: #259939;
	}
	/* #endif */


	/* #ifndef VUE3 && APP-PLUS */
	@import "@/components/uni-ai-msg/uni-ai-msg.scss";
	/* #endif */
	
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