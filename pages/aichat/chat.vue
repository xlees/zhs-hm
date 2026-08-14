<template>
	<view class="container" >
		<!-- #ifdef H5 -->
		<view v-if="isWidescreen" class="header">uni-ai-chat</view>
		<!-- #endif -->
		
		<!-- #ifdef MP-WEIXIN -->
		<!-- <view class="" style="position: fixed; top: 7rpx; right: 80rpx; background-color: red;" v-if="addTs">
			<view class=" pa-15-20 bor-r50 " style="background-color: red;">
				<view class="dflex align-center" style="background-color: red;">
					<text class="fs-28">添加到我的小程序，买便宜好用的东西，就问Ai购物小助手！</text>
				</view>
			</view>
		</view> -->
		<!-- #endif -->
		
		<scroll-view class="chat-scroll" style="" :scroll-into-view="scrollIntoView" scroll-x="false" scroll-y="true">
			<view style="padding:10rpx; " >
				我是你专属的智能购物小助手,</view>
			<view style="padding:10rpx; " >
				如果你有任何关于购物省钱方面的问题，都可以问我哦！</view>
			<view style="padding:10rpx; margin-bottom: 30rpx;"  >
				试试下面的问题吧！
			</view>
			
			<!-- 默认定义的prompts -->
			<view class="u-flex u-flex-column u-flex-items-baseline ">
				<view class="init-prompts " v-for="(prompt,index) in prompts" :key="index"  @click="handleClick(prompt)">
					<text>{{ prompt }}</text>
				</view>
			</view>
			
			<!-- 小助手回复&用户发送的消息 -->
			<uni-ai-msg v-for="(msg,index) in msgList" :key="index" :msg="msg" @changeAnswer="changeAnswer"
				:show-cursor="index == msgList.length - 1 && msgList.length%2 === 0 && sseIndex"
				:isAd=isChatAd
				:isAiFinish="sseIndex === 0"
				:isLastMsg="index == msgList.length - 1" @removeMsg="removeMsg(index)">
			</uni-ai-msg>
			
			<!-- 用户发送消息中 -->
			<template v-if="msgList.length%2 !== 0">
				<view v-if="requestState == -100" class="retries-box">
					<text>消息发送失败</text>
					<uni-icons @click="send" color="#d22" type="refresh-filled" class="retries-icon"></uni-icons>
				</view>
				<view class="tip-ai-ing" v-else-if="msgList.length">
					<text>正在思考中...</text>
					<view v-if="NODE_ENV == 'development' && !enableStream">
						如需提速，请开通<uni-link class="uni-link" href="https://uniapp.dcloud.net.cn/uniCloud/uni-ai-chat.html"
							text="[流式响应]"></uni-link>
					</view>
				</view>
			</template>
			
			<!-- <view v-if="adpid" class="open-ad-btn-box"> -->
				<!-- <text style="color: red;">
					默认不启用广告组件(被注释)，如需使用，请"去掉注释"(“重新运行”后生效)
					位置：/pages/chat/chat.vue 第30行，或全局搜索 uni-ad-rewarded-video
				</text> -->
				<!-- <uni-ad-rewarded-video :adpid="1888191794" @onAdClose="onAdClose"></uni-ad-rewarded-video> -->
				<!-- <ad unit-id='adunit/
				-d1f7f0cc98d78f5b'></ad> -->
			<!-- </view> -->
			
			<view @click="closeSseChannelManual" class="stop-responding" v-if="sseIndex"> ▣ 停止响应</view>
			
			<!-- 底部锚点元素 -->
			<view id="last-msg-item" ></view>
		</scroll-view>

		<!-- 用户输入框 -->
		<view 
			class="user-msg-input"
			:style="{
				transform: `translateY(-${offset}px)`
			}"
		>
			
			<view v-if="!isWidescreen" class="menu">
				<uni-icons class="menu-item" @click="clearAllMsg" type="trash" size="24" color="#888"></uni-icons>
				<!-- <view class="pc-trash pc-menu-item" @click="clearAllMsg" title="删除">
					<image src="@/static/logo.png" mode="heightFix"></image>
				</view> -->
				<!-- <uni-icons class="menu-item" @click="setLLMmodel" color="#555" size="20px"
					type="settings"></uni-icons> -->
			</view>
			
			<view 
				class="textarea-box" 
			>
		
				<textarea v-model="content" 
					class="textarea" 
					auto-height="true"
					placeholder="发送问题给我哦" :maxlength="-1" 
					:adjust-position="true"
					confirm-type="send"
					:disable-default-padding="false" 
					@focus="triggerInput"
					@blur="blurInput"
					placeholder-class="input-placeholder">
				</textarea>
			</view>
			
			<view class="send-btn-box" :title="(msgList.length && msgList.length%2 !== 0) ? 'ai正在回复中不能发送':''">
				
				<!-- #ifdef H5 -->
				<text v-if="isWidescreen" class="send-btn-tip">↵ 发送 / shift + ↵ 换行</text>
				<!-- #endif -->
				
				<button style="background-color: #d9480f;"  @click="beforeSend" :disabled="inputBoxDisabled || !content" class="send"
					type="primary">发送</button>
			</view>
		</view>
		
		<!-- <view class="foot-box" :style="{'padding-bottom':footBoxPaddingBottom}"> -->
			<!-- #ifdef H5 -->
			<!-- <view class="pc-menu" v-if="isWidescreen">
				<view class="pc-trash pc-menu-item" @click="clearAllMsg" title="删除">
					<image src="@/static/remove.png" mode="heightFix"></image>
				</view>
				<view class="settings pc-menu-item" @click="setLLMmodel" title="设置">
					<uni-icons color="#555" size="20px" type="settings"></uni-icons>
				</view>
			</view> -->
			<!-- #endif -->
		<!-- </view> -->
		
	</view>
</template>

<script setup lang="ts">
	// 引入配置文件
	import config from '@/config.js';
	
	console.log("config.js:\n", config);
	
	import { useUserAuthStore } from '@/store/user-auth'
	import { useMemoStore } from '@/store/memo.js'
	import { storeFanliCtx } from '@/store/fanli-ctx.js'
	
	// 导入uniCloud云对象task模块
	import uniCoTask from '@/common/unicloud-co-task.js';
	// 导入 将多个字消息文本，分割成单个字 分批插入到最末尾的消息中 的类
	import SliceMsgToLastMsg from './SliceMsgToLastMsg.js';

	// Vue 3 composition API
	import { ref, computed, watch, nextTick, onMounted } from 'vue'
	import { onLoad, onShow, onHide, onReady } from '@dcloudio/uni-app'
	
	interface TaskList extends Array<any> {
		clear(): void
	}

	// 收集所有执行云对象的任务列表
	const uniCoTaskList = [] as TaskList
	uniCoTaskList.clear = function() {
		
		uniCoTaskList.forEach((task: any) => task.abort())
		uniCoTaskList.splice(0, uniCoTaskList.length)
	}

	// 消息类型定义
	interface ChatMessage {
		isAi?: boolean
		content: string
		create_time: number
		role?: string
		summarize?: boolean
		illegal?: boolean
		aiToolResult?: any[]
	}

	// 获取广告id
	const adpid = config.adpid
	console.log("adpid from config.js: \n", adpid);

	// 状态定义
	const open_ad = ref(getApp().globalData?.all_ad ?? false)
	const uid = ref('')
	const isMsgFinished = ref(false)
	const isAdFinish = ref(false)
	const isManRewardedAd = ref(false)
	const isChatAd = ref(false)
	const isAd = ref(false)
	const addTs = ref(false)
	const videoAd_text = ref('')
	const videoAd: any = ref(null)
	const scrollIntoView = ref("")
	const msgList = ref<ChatMessage[]>([])
	const requestState = ref(0)
	const insufficientScore = ref(false)
	const content = ref("")
	const sseIndex = ref(0)
	const enableStream = ref(true)
	const isWidescreen = ref(false)
	const llmModel = ref(false)
	const keyboardHeight = ref(0)
	const prompts = ref<string[]>([])
	const goodsContent = ref('')
	const isAutoQuery = ref(true)
	const chatHeight = ref(0)
	const chatWidth = ref(0)
	const pageQuery: any = ref(null)
	const winInfo: any = ref(null)
	
	const sliceMsgToLastMsg: any = ref(null)
	const msgCreateTime = ref(0)
	const comparisonResult: any = ref(null)
	const loadingText = ref('')

	// Stores
	const store_memo = useMemoStore()
	const store_userAuth = useUserAuthStore()
	const store_fanli_ctx = storeFanliCtx()
	
	if (!store_userAuth.is_login) {
		const info = uni.getSystemInfoSync();
		console.log("\nnot login, device info: ", info);
		
		uid.value = info.deviceId
	} 
	else {
		uid.value = store_userAuth.uid
		
		console.log("\nuser has loggin: ", uid.value)
	}
	console.log("\nchat user auth: ", store_userAuth.uid, store_userAuth.userinfo, store_userAuth.token)

	// refs
	const msgRef: any = ref(null)
	
	// new 
	const userInput = ref('')
	const sseChannel = ref(null)
	const offset = ref(0)

	// 输入框是否禁用
	const inputBoxDisabled = computed(() => {
		if (sseIndex.value !== 0) return true
		return !!(msgList.value.length && msgList.value.length % 2 !== 0)
	})

	// 获取当前环境
	const NODE_ENV = computed(() => process.env.NODE_ENV)

	// footBoxPaddingBottom
	const footBoxPaddingBottom = computed(() => '0px')

	// msgList发生变化，同步写入到key=uni-ai-msg中去
	watch(msgList, (newMsgList) => {
		uni.setStorage({
			key: "uni-ai-msg",
			data: newMsgList
		})
	}, { deep: true })

	watch(insufficientScore, (val) => {
		uni.setStorage({
			key: "uni-ai-chat-insufficientScore",
			data: val
		})
	})

	// 生命周期
	onLoad((e: any) => {
		console.log("聊天页onLoad: ", e, getApp().globalData)

		pageQuery.value = uni.createSelectorQuery()

		winInfo.value = uni.getWindowInfo()
		console.log("\nwindow info:\n", winInfo.value)

		pageQuery.value.select(".container").boundingClientRect((data: any) => {
			console.log("得到布局位置信息:\n" + JSON.stringify(data));
		}).exec();
		
		// 获得历史对话记录
		msgList.value = uni.getStorageSync('uni-ai-msg') || [];
		console.log(`\n#length of message list = ${msgList.value.length}`)

		if (Object.prototype.hasOwnProperty.call(e, 'ad')) {
			console.log('\n展示ai助手广告...\n')
			isAd.value = true
			isChatAd.value = true
		}

		uniCloud.callFunction({
			name: 'aichat',
			data: {
				action: 'agent/prompts',
				data: {}
			}
		}).then((promts_res: any) => {
			console.log("\npromts_res:\n", promts_res)
			prompts.value = promts_res.result.data;
		})

		console.log("聊天页globalData: ", getApp().globalData)

		const ad_text = getApp().globalData?.advideo_text || ''
		if (!ad_text) {
			videoAd_text.value = '看完视频，新人立领10元红包。可提现！'
		} else {
			videoAd_text.value = ad_text
		}

		if (Object.prototype.hasOwnProperty.call(e, 'content') && e.content && e.content.length > 1) {
			content.value = e.content || ''

			if (e.auto === '1') {
				send()
			}
		}

		addTs.value = true
		setTimeout(() => {
			addTs.value = false
		}, 5000)

		// #ifdef MP-WEIXIN
		if ((wx as any).createRewardedVideoAd) {
			console.log('创建激励视频实例')

			videoAd.value = (wx as any).createRewardedVideoAd({
				adUnitId: 'adunit-cc6ca091462bc952'
			})

			videoAd.value.onLoad(() => {
				console.log('wx激励视频广告预加载成功')
			})

			videoAd.value.onError((err: any) => {
				console.error('wx激励视频光告加载失败', err)
			})

			videoAd.value.onClose((res: any) => {
				console.log("rewarded video res:", res)

				if (res && res.isEnded) {
					console.log("用户看完了广告，下发奖励")

					isAdFinish.value = true

					let uId = uniCloud.getCurrentUserInfo().uid
					if (!uId) {
						uni.showToast({
							title: "登录" + config.mp_name + "，领取奖励！",
							icon: 'none',
							position: 'bottom',
							duration: 2000
						})

						uni.navigateTo({
							url: '/sub_pkgs/common/login/login?scene=reward_no_login',
							fail: (err: any) => {
								console.error('聊天页面跳转失败', err)
							}
						})

						return
					}
				} else {
					console.log("用户中途退出，不下发奖励")

					uniCloud.callFunction({
						name: 'ad-track',
						data: {
							user_id: uid.value,
							adtype: 'cancel'
						}
					}).then((res: any) => {
						console.log("cancel log: ", res)
					})
				}
			})
		}
		// #endif
		
		console.log("\n#msgList: \n", msgList.value)
	})

	onShow(() => {
		console.log("#聊天页onShow called: ")

		isManRewardedAd.value = false
		isAdFinish.value = false

		chatWidth.value = winInfo.value?.screenWidth || 0
		
		showLastMsg()
		
	})

	onHide(() => {
		console.log("聊天页onHide: ")
	})
	
	onReady(() => {
		console.log('#onReady called.')
	})

	onMounted(() => {
		console.log("#onMounted called.")

		insufficientScore.value = uni.getStorageSync('uni-ai-chat-insufficientScore') || false
		console.log("this.insufficientScore:", insufficientScore.value)

		let length = msgList.value.length
		if (length) {
			let lastMsg = msgList.value[length - 1]
			if (!lastMsg.isAi) {
				send()
			}
		}
		

		// #ifdef H5
		let adjunctKeydown = false
		const textareaDom = document.querySelector('.textarea-box textarea') as HTMLTextAreaElement | null
		if (textareaDom) {
			textareaDom.onkeydown = (e: KeyboardEvent) => {
				if ([16, 17, 18, 93].includes(e.key as any)) {
					adjunctKeydown = true;
				}
				if (e.key === '13' && !adjunctKeydown) {
					e.preventDefault()
					setTimeout(() => {
						beforeSend()
					}, 300)
				}
			}
			textareaDom.onkeyup = (e: KeyboardEvent) => {
				if ([16, 17, 18, 93].includes(e.key as any)) {
					adjunctKeydown = false;
				}
			}

			let initialInnerHeight = window.innerHeight;
			const domContainer = document.querySelector('.container') as HTMLTextAreaElement | null
			if (uni.getSystemInfoSync().platform === "ios") {
				textareaDom.addEventListener('focus', () => {
					let interval = setInterval(function() {
						if (window.innerHeight !== initialInnerHeight) {
							clearInterval(interval)
							
							domContainer.style.height = window.innerHeight + 'px'
							window.scrollTo(0, 0);
							showLastMsg()
						}
					}, 1);
				})
				textareaDom.addEventListener('blur', () => {
					
					domContainer.style.height = initialInnerHeight + 'px'
				})
			} else {
				window.addEventListener('resize', () => {
					showLastMsg()
				})
			}
		}
		// #endif

		// #ifndef H5
		uni.onKeyboardHeightChange((e: any) => {
			console.log("\n#输入法小键盘高度变化:\n", e)

			keyboardHeight.value = e.height
			
			if (e.height > 0) {
				offset.value = 15;
			}
			else {
				offset.value = -15;
			}
			
		})
		// #endif
	})

	// 更新最后一条消息
	const updateLastMsg = (param: any) => {
		if (msgList.value.length === 0) return

		const lastMsg = msgList.value[msgList.value.length - 1]

		if (typeof param === 'function') {
			param(lastMsg)
			
		} else {
			const args = param
			
			const [data, cover = false] = args
			if (cover) {
				Object.assign(lastMsg, data)
			} else {
				Object.assign(lastMsg, data)
			}
		}

		msgList.value.splice(msgList.value.length - 1, 1, lastMsg)
	}

	// 广告关闭事件
	const onAdClose = (e: any) => {
		console.log('onAdClose e.detail.isEnded', e.detail.isEnded);

		if (e.detail.isEnded) {
			let i = 0;
			uni.showLoading({ mask: true })
			let myIntive = setInterval(async () => {
				i++;
				const db = uniCloud.database();
				let res = await db.collection("uni-id-users")
					.where('"_id" == $cloudEnv_uid')
					.field('score')
					.get()
				const { score } = res.result.data[0] || {}
				console.log('score', score);
				if (score > 0 || i > 5) {
					clearInterval(myIntive)
					uni.hideLoading()
					if (score > 0) {
						insufficientScore.value = false
						msgList.value.pop()
						await nextTick()
						send()
						uni.showToast({
							title: '积分余额:' + score,
							icon: 'none'
						});
					}
				}
			}, 2000);
		}
	}

	// 换一个答案
	const changeAnswer = async () => {
		if (sseIndex.value) {
			closeSseChannel()
		}
		msgList.value.pop()
		updateLastMsg({ illegal: false })
		insufficientScore.value = false
		await send()
	}

	const removeMsg = (index: number) => {
		if (msgList.value[index].isAi) {
			index -= 1
		}
		if (sseIndex.value && index === msgList.value.length - 2) {
			closeSseChannel()
		}
		msgList.value.splice(index, 2)
	}

	// 点击"发送"消息按钮
	const beforeSend = () => {
		
		if (!store_userAuth.is_login) {
			// const curr_url = getCurrentPageAndParas();
			// console.log("当前页面及参数为：\n",curr_url)
			
			const chat_path: string = "/pages/aichat/chat"
			let paras = ''
			if (content.value) {
				paras = `content=${content.value}&auto=1`
			}
			const chat_url = encodeURIComponent(`${chat_path}?${paras}`)
			
			uni.navigateTo({
				url: '/pages/login/login?back_url='+chat_url
			})
			
			return
		}
		
		if (inputBoxDisabled.value) {
			return uni.showToast({
				title: '小助手正在回复中,不能发送',
				icon: 'none'
			});
		}
		if (adpid) {
			let token = uni.getStorageSync('uni_id_token')
			if (!token) {
				return uni.showModal({
					content: '启用激励视频，客户端需登录并启用安全网络',
					showCancel: false,
					confirmText: "查看详情",
					complete() {
						let url = "https://uniapp.dcloud.net.cn/uniCloud/uni-ai-chat.html#ad"
						// #ifndef H5
						uni.setClipboardData({
							data: url,
							showToast: false,
							success() {
								uni.showToast({
									title: '已复制文档链接，请到浏览器粘贴浏览',
									icon: 'none',
									duration: 5000
								});
							}
						})
						// #endif

						// #ifdef H5
						window.open(url)
						// #endif
					}
				});
			}
		}

		if (!content.value) {
			return uni.showToast({
				title: '内容不能为空',
				icon: 'none'
			});
		}

		msgList.value.push({
			isAi: false,
			content: content.value,
			create_time: Date.now()
		})
		console.log("\n当前消息列表内容:\n", msgList.value)

		showLastMsg()
		nextTick(() => {
			content.value = ''
		})
		
		send()
	}

	// 发送消息
	const send = async () => {
		isMsgFinished.value = false
		requestState.value = 0
		uniCoTaskList.clear()

		let messages: any[] = []
		let now = Date.now()
		let recent_msg = msgList.value.filter((msg: ChatMessage) => (now - msg.create_time) <= 10000)
		let msgs = JSON.parse(JSON.stringify(recent_msg))

		console.log("msgs:\n", msgs)
		console.log("length of all messages:\n", msgs.length)

		let findIndex = [...msgs].reverse().findIndex((item: any) => item.summarize)
		if (findIndex !== -1) {
			let aiSummaryIndex = msgs.length - findIndex - 1
			msgs[aiSummaryIndex].content = msgs[aiSummaryIndex].summarize
			msgs = msgs.splice(aiSummaryIndex)
		} else {
			msgs = msgs.splice(-10)
		}
		msgs = msgs.filter((msg: any) => !msg.illegal)

		messages = msgs.map((item: any) => {
			let role = ""
			if (item.role === undefined) {
				role = "user"
			} else {
				role = item.role
			}
			if (item.role === 'system') {
				role = 'system'
			} else if (item.isAi) {
				role = item.summarize ? 'system' : 'assistant'
			}
			return {
				content: item.content,
				role
			}
		})

		console.log('send to ai messages:', messages)
		console.log("msgList:\n", msgList.value)

		await checkIsOpenPush()
		console.log('enableStream: ', enableStream.value);

		if (enableStream.value) {

			sseChannel.value = new uniCloud.SSEChannel()
			console.log('sseChannel', sseChannel);

			sliceMsgToLastMsg.value = new SliceMsgToLastMsg({
				updateLastMsg,
				showLastMsg,
				get msgCreateTime() { return msgCreateTime.value },
				set msgCreateTime(val: number) { msgCreateTime.value = val }
			})
			let toolResultStr = ''
			let toolFlag = false

			console.log("\n#ssechannel event...\n")
			sseChannel.value.on('message', (message: string) => {
				console.log('on message: ', message, message.length);

				if (message.length === 0) return;

				if (toolFlag) {
					console.log("\n当前商品:\n", message)
					let tcall_result = JSON.parse(message)
					if (!('aiToolResult' in msgList.value[msgList.value.length - 1])) {
						msgList.value[msgList.value.length - 1].aiToolResult = []
					}
					msgList.value[msgList.value.length - 1].aiToolResult.push(tcall_result)
				}

				if (message === '</end>') {
					toolFlag = true
				}

				if (!toolFlag && sseIndex.value === 0) {
					const ct = Date.now()
					msgList.value.push({
						isAi: true,
						content: message,
						create_time: ct
					})
					msgCreateTime.value = ct
				} else {
					if (toolFlag) return
					sliceMsgToLastMsg.value.addMsg(message)
					updateLastMsg((lastMsg: any) => {
						lastMsg.content += message
					})
				}

				showLastMsg()
				sseIndex.value++
			})

			sseChannel.value.on('end', (e: any) => {
				console.log('sse 结束', e)

				isMsgFinished.value = true
				console.log('end tool flag:\n', (e as any)?.toolFlag)

				sliceMsgToLastMsg.value.t = 0
				if (e && typeof e === 'object' && e.errCode) {
					const setLastAiMsgContent = (c: string) => {
						if (sseIndex.value === 0) {
							const ct = Date.now()
							msgList.value.push({
								isAi: true,
								content: c,
								create_time: ct
							})
							msgCreateTime.value = ct
						} else {
							updateLastMsg((lastMsg: any) => {
								lastMsg.content += c
							})
						}
						showLastMsg()
						nextTick(() => {
							// msg ref handling
						});
					}
					if (e.errCode === 60004) {
						let len = msgList.value.length
						if (len % 2) {
							msgList.value.push({
								isAi: true,
								content: "内容涉及敏感",
								illegal: true,
								create_time: Date.now()
							})
							msgCreateTime.value = Date.now()
							len += 1
						}
						msgList.value[len - 2].illegal = true
						msgList.value[len - 1].illegal = true
						msgList.value[len - 1].content = "内容涉及敏感"
					} else {
						setLastAiMsgContent(e.errMsg)
					}
				}
				sseIndex.value = 0
			})

			await sseChannel.value.open();
			console.log("\n#sseChannel opened.\n", msgList.value)
			
			try {
				const chat_data = {
					uid: uid.value,
					channel: sseChannel.value,
					text: msgList.value[msgList.value.length-1]["content"]
				}
				console.log("\n#chat data:\n", chat_data, sseIndex)

				await uniCloud.callFunction({
					name: 'aichat',
					data: {
						action: 'agent/shopping',
						data: chat_data
					}
				})
				
			} catch (err) {
				console.error('\n#chat data error:\n',err)
			}
		}
	}

	const closeSseChannelManual = () => {
		closeSseChannel()
	}

	const closeSseChannel = () => {
		
		if (sseChannel.value) {
			sseChannel.value.close()
			
			sseChannel.value = null
			sliceMsgToLastMsg.value?.end()
		}
		
		uniCoTaskList.clear()
		sseIndex.value = 0
	}

	const showLastMsg = () => {
		
		nextTick(() => {
			scrollIntoView.value = "last-msg-item"
			
			nextTick(() => {
				scrollIntoView.value = ""
			})
		})
	}

	const clearAllMsg = () => {
		uni.showModal({
			title: "确认要清空聊天记录？",
			content: '本操作不可撤销',
			complete: (e: any) => {
				if (e.confirm) {
					closeSseChannel()
					msgList.value.splice(0, msgList.value.length);
				}
			}
		});
	}

	const handleClick = (prompt: string) => {
		console.log("prompt: ", prompt)

		msgList.value.push({
			isAi: false,
			content: prompt,
			create_time: Date.now()
		})
		content.value = prompt
		insufficientScore.value = false

		showLastMsg()
		nextTick(() => {
			content.value = ''
		})

		send()
	}

	const setLLMmodel = () => {
		// 需要 llm-config 组件引用
		console.log('setLLMmodel placeholder')
	}

	const checkIsOpenPush = async () => {
		try {
			await uni.getPushClientId()
			
		} catch (err) {
			console.error('\n#ERROR:\nuni.getPushClientId failed.', err)
			enableStream.value = false
		}
	}

	const onChatLoad = () => {
		console.log("uniad信息流广告加载成功")
	}
	const onChatClose = () => {}
	const onChatError = () => {}
	const adClickCapture = (e: any) => {
		console.log("uni ad click capture:\n", e)
	}
	const manualLoadVideoAd = () => {
		if (videoAd.value) {
			console.log("user clicked videoAd.")
			isManRewardedAd.value = true
			videoAd.value.show()
				.then(() => {
					console.log("广告展示成功")
				})
				.catch(() => {
					videoAd.value.load()
						.then(() => videoAd.value.show())
						.catch((err: any) => {
							console.error('激励视频 广告显示失败', err)
						})
				})
		}
	}

	const queryGoodsDiscount = async () => {
		if (!goodsContent.value) return;

		let cpnResult = await uniCloud.callFunction({
			name: 'cps',
			data: {
				action: 'core/exactGoodsSearch',
				data: {
					goodsContent: goodsContent.value,
					uid: uid.value
				}
			}
		})
		console.log("coupon result:\n", cpnResult.result)

		let contentText = ''
		if (cpnResult.result.code > 0) {
			contentText = goodsContent.value + "\n请推测上述文本想表达的意思"
		} else if (cpnResult.result.data.length === 0) {
			contentText = goodsContent.value + "\n前面商品没有找到优惠券"
		} else {
			comparisonResult.value = cpnResult.result.data
			contentText = comparisonResult.value[0].goodsName + "\n简单介绍上面商品的用途和使用场合"
		}

		loadingText.value = '生成推荐理由中..'
		let messages = [{
			"role": "user",
			"content": contentText
		}]

		await uniCloud.callFunction({
			name: 'aichat',
			data: {
				action: 'agent/wenxiaoyan',
				data: {
					channel: sseChannel.value,
					messages: messages,
					context: store_fanli_ctx.get_ctx_uniq
				}
			}
		})
	}

	const isContentGoods = (c: string) => {
		if (!c) return false
		return /[a-zA-Z\d]{5,}/.test(c)
	}

	const readClipboard = () => {
		console.log("剪贴板历史数量：\n", store_fanli_ctx.$state)

		uni.getClipboardData({
			success: (res: any) => {
				console.log("用户剪贴板：\n", res.data)

				if (!res.data) return

				if (goodsContent.value === res.data) return

				goodsContent.value = res.data
				store_fanli_ctx.addToCtx(res.data)

				content.value = goodsContent.value
			}
		});
	}
	
	const triggerInput = (e: any) => {
		// e.detail.height为键盘高度
		console.log(`\n#用户准备输入: ${JSON.stringify(e)}`)
	}
	
	const blurInput = (e: any) => {
		console.log(`\n#用户收起输入法: ${JSON.stringify(e)}`)
		offset.value = 0;
	}
</script>



<style lang="scss">
	/* #ifdef VUE3 && APP-PLUS */
	@import "@/components/uni-ai-msg/uni-ai-msg.scss";
	/* #endif */

	/* #ifndef APP-NVUE */
	page,
	/* #ifdef H5 */
	.container *,
	/* #endif */
	view,
	textarea,
	button {
		display: flex;
		box-sizing: border-box;
	}

	page {
		height: 100%;
		width: 100%;
	}
	
	.chat-scroll {
		flex: 1;
		min-height: 0;
	}

	/* #endif */

	.stop-responding {
		font-size: 14px;
		border-radius: 3px;
		margin-bottom: 15px;
		background-color: #f0b00a;
		color: #FFF;
		width: 90px;
		height: 30px;
		line-height: 30px;
		margin: 0 auto;
		justify-content: center;
		margin-bottom: 15px;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}
	
	/* 应用动画到元素上 */
	.element {
		animation-name: scaleAnimation;
		/* 指定要应用的动画名称 */
		animation-duration: 1s;
		/* 设置动画持续时间 */
	
		animation-timing-function: ease;
		/* 设置动画速度曲线（此处为先加速后减速）*/
	}

	.stop-responding:hover {
		box-shadow: 0 0 10px #aaa;
	}

	// .container {
	// 	// margin-right: 100rpx;
	// 	// height: 100%;
	// 	background-color: rgb(230, 230, 230);
	// 	display: flex;
	// 	flex-direction: column;
	// 	// align-items: center;
	// 	// justify-content: center;
	// 	// border: 3px solid blue;
	// }

	.user-msg-input {
		// background-color: #d2071b;
		
		// border: 2px solid red;
		// width: 750rpx;
		width: 100%;
		display: flex;
		// flex-direction: row;
		// padding: 10px 0px;
		background-color: #eee;
		
		border-top: 1px solid #eee;
		border-radius: 20rpx;
		
		// justify-content: space-around;
		align-content: center;
		gap: 10rpx;
		
		padding: 15rpx 0rpx;
		margin: 10rpx 0;
	}

	.foot-box-content {
		display: flex;
		width: 100%;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
	}

	.textarea-box {
		flex: 1;
		padding: 8px 8px;
		background-color: #f9f9f9;
		border-radius: 20px;
	}

	.textarea-box .textarea {
		max-height: 120px;
		font-size: 14px;
		/* #ifndef APP-NVUE */
		overflow: auto;
		/* #endif */
		width: 450rpx;
		font-size: 14px;
	}

	/* #ifdef H5 */
	/*隐藏滚动条*/
	.textarea-box .textarea::-webkit-scrollbar {
		width: 0;
	}

	/* #endif */

	.input-placeholder {
		color: #bbb;
		line-height: 18px;
	}

	.trash,
	.send {
		width: 50px;
		height: 30px;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
	}

	.trash {
		width: 30rpx;
		margin-left: 10rpx;
	}

	.menu {
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
	}

	.menu-item {
		flex: 1;
		width: 30rpx;
		margin: 0 10rpx;
	}

	.send {
		color: #FFF;
		border-radius: 4px;
		display: flex;
		margin: 0;
		padding: 0;
		font-size: 14px;
		margin-right: 20rpx;
	}

	/* #ifndef APP-NVUE */
	.send::after {
		display: none;
	}

	/* #endif */


	.msg-list {
		height: 0; //不可省略，先设置为0 再由flex: 1;撑开才是一个滚动容器
		flex: 1;
		width: 750rpx;
		// border: 1px solid red;
	}
	
	.init-prompts {
		// display: inline-flex;
		// width: auto;
		margin-bottom: 25rpx;
		margin-left: 50rpx;
		padding: 18rpx;
		border-radius: 20rpx;
		border-color: lightgray;
		border-style: solid;
		border-width: 2rpx;
	}

	.noData {
		margin-bottom: 10px;
		// padding: 10px 10px 10px 20px;
		text-align: left;
		width: 750rpx;
		// color: darkgray;
		font-size: 14px;
		justify-content: left;
	}
	
	.open-ad-btn-box{
		justify-content: center;
		margin: 10px 0;
	}

	.tip-ai-ing {
		align-items: center;
		flex-direction: column;
		font-size: 14px;
		color: #919396;
		padding: 15px 0;
	}

	.uni-link {
		margin-left: 5px;
		line-height: 20px;
	}

	/* #ifdef H5 */
	@media screen and (min-width:650px) {
		.foot-box {
			border-top: solid 1px #dde0e2;
		}

		.container,.container * {
			max-width: 950px;
		}

		.container {
			box-shadow: 0 0 5px #e0e1e7;
			height: calc(100vh - 44px);
			margin: 22px auto;
			border-radius: 10px;
			overflow: hidden;
			background-color: #FAFAFA;
		}
		
		page {
			background-color: #efefef;
		}

		.container .header {
			height: 44px;
			line-height: 44px;
			border-bottom: 1px solid #F0F0F0;
			width: 100vw;
			justify-content: center;
			font-weight: 500;
		}

		.content {
			background-color: #f9f9f9;
			position: relative;
			max-width: 90%;
		}

		// .copy {
		// 	color: #888888;
		// 	position: absolute;
		// 	right: 8px;
		// 	top: 8px;
		// 	font-size: 12px;
		// 	cursor:pointer;
		// }
		// .copy :hover{
		// 	color: #4b9e5f;
		// }

		.foot-box,
		.foot-box-content,
		.msg-list,
		.msg-item,
		// .create_time,
		.noData,
		.textarea-box,
		.textarea,
		textarea-box {
			width: 100% !important;
		}

		.textarea-box,
		.textarea,
		textarea,
		textarea-box {
			height: 120px;
		}

		.foot-box,
		.textarea-box {
			background-color: #FFF;
		}

		.foot-box-content {
			flex-direction: column;
			justify-content: center;
			align-items: flex-end;
			padding-bottom: 0;
		}

		.pc-menu {
			padding: 0 10px;
		}

		.pc-menu-item {
			height: 20px;
			justify-content: center;
			align-items: center;
			align-content: center;
			display: flex;
			margin-right: 10px;
			cursor: pointer;
		}

		.pc-trash {
			opacity: 0.8;
		}

		.pc-trash image {
			height: 15px;
		}


		.textarea-box,
		.textarea-box * {
			// border: 1px solid #000;
		}

		.send-btn-box .send-btn-tip {
			flex: 1;
			color: #919396;
			margin-right: 8px;
			font-size: 12px;
			line-height: 28px;
		}
	}
	/* #endif */
	.retries-box{
		justify-content: center;
		align-items: center;
		font-size: 12px;
		color: #d2071b;
	}
	.retries-icon{
		margin-top: 1px;
		margin-left: 5px;
	}
	.chat-ad {
		position: relative;
		width: 100%;
		flex-direction: column;
		padding: 0 15px;
	}
</style>