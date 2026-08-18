<template>
	<view class="" style="height: 100vh;background-color: #ffffff;">

		<!-- 顶部 -->
		<!-- #ifdef APP -->
		<!-- <view class=" wh-w720 dflex flex-row align-center justify-space-between" style="height: 280rpx;">
			<view class="wh-50" style="margin-left: 60rpx;" @click="navTo(1)">
				<uni-icons type="closeempty" size="35"></uni-icons>
			</view>
		</view> -->
		<!-- #endif -->

		<view class="dflex justify-center align-center flex-column">
			<image :src="config.logo" class="wh-130 mar-t150 bor-r100" mode="aspectFill"></image>

			<text class="fs-40 f-w mar-t30">{{config.mp_name}}</text>
		</view>

		<view class="" style="position: fixed; bottom: 0; left: 0; right: 0;">
			<view class="dflex justify-center align-center">

				<view class="pa-30 dflex justify-center align-center flex-column wh-w720 ">

					<!-- #ifdef APP -->

					<view class="dflex flex-row align-center justify-center wh-h130 mar-t60">
						<view class="zcolor-black dflex flex-row align-center justify-center  bor-r100"
							style="height: 100rpx; width: 500rpx;"  @click="wxLogin">
							<text class="fs-30 fcolor-while f-w">微信登录</text>
						</view>
					</view>


					<view class="dflex flex-row align-center justify-center wh-h130 ">
						<view class="zcolor-black dflex flex-row align-center justify-center  bor-r100"
							style="height: 100rpx; width: 500rpx;"  @click="loginUniverify">
							<text class="fs-30 fcolor-while f-w">手机号一键登录/注册</text>
						</view>
					</view>

					<!-- #endif -->

				<!-- <view class=" zcolor-black dflex align-center justify-center mar-t25 mar-b30 bor-r100"
					style="height: 100rpx; width: 400rpx;" @click="navTo(88,'/pages/login/sms')">
					<image src="@/static/mobile1.png" mode="widthFix" class="wh-35 mar-r15"></image>
					<text class="fs-30 f-w fcolor-while">手机号登录</text>
				</view> -->

				</view>

			</view>

			<view class=" dflex flex-row justify-center align-center pa-30-0 ">
				<view>
					<checkbox-group @change="checkboxChange">
						<label>
							<checkbox value="1" color="#000000" style="transform:scale(0.6)" />
						</label>
					</checkbox-group>
				</view>
				<text class="fs-26 fcolor-dark2">已阅读并同意</text>
				<view class="dflex justify-center align-center" @tap="navTo(2,'../my/user-agreement')">
					<text class="fs-26 fcolor-red">《用户协议》</text>
				</view>
				<text class="fs-26 fcolor-dark2">和</text>
				<view class="dflex justify-center align-center" @tap="navTo(2,'../my/privacy-agreement')">
					<text class="fs-26 fcolor-red">《隐私政策》</text>
				</view>

			</view>

			<view class="pa-10">
				<!-- 获取手机号 -->
				<!-- <button open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">授权并获取手机号</button> -->
			</view>
		</view>

		<!-- <popupTs :isShow="isShow" rName="确认" :isBut="false" lName="取消" @lEvent="loginWeixin(2)" @rEvent="loginWeixin(1)"
			title="温馨提醒">
			<view class="pa-15-30">
				<view class="mar-t25">
					<text class="fs-28  fcolor-dark2">是否同步您的微信头像和微信昵称？</text>
				</view>
			</view>
		</popupTs> -->

		<popupTs :isShow="isShow1" rName="确认" :isBut="false" lName="取消" @lEvent="navTo(1)" @rEvent="updateWxUserInfo"
			title="设置信息">
			<view class="pa-15-30">
				<view class="">
					<view class="zcolor-while bor-r30 ">
						<button class="avatar-wrap" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
							<view class="zcolor-while1  dflex flex-row align-center bor-r50 mar-30 mar-t60 pa-20"
								style="height: 60rpx;">
								<text class="fs-28 mar-l15 f-w  ">微信头像：</text>
								<text class="fs-28 mar-l15  " v-if="!getAvatarUrl"
									style="text-decoration: underline;">点击获取头像</text>
								<image v-else
									:src="getAvatarUrl || 'https://cdn.lapad.cc/static/tx.png'"
									mode="aspectFill" class="wh-80 bor-r100"></image>
							</view>
						</button>
						<view class="zcolor-while1  dflex flex-row align-center bor-r50 mar-30 pa-20"
							style="height: 60rpx; ">
							<text class="fs-28 mar-l15 f-w ">微信昵称：</text>
							<input style="width: 250rpx;" class="fs-28" type="nickname" @blur="getNickname"
								id="nickname-input"
								:value="nickname" :placeholder="nickname ? nickname : '点击获取微信昵称'" />
						</view>
					</view>
				</view>
			</view>
		</popupTs>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

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

import Common from '@/common/common'
import Api from "@/common/api.ts"
import { useUserAuthStore } from "@/store/user-auth"
import config from '@/config.js'
import dayjs from 'dayjs'

let weixinAuthService: any = null

const store_userAuth = useUserAuthStore()

const back_url = ref('')
const url_paras = ref('')
const cloudAvatarPath = ref('')
const scene = ref('')
const paras = ref('')
const raw_paras = ref<Record<string, any>>({})
const burl = ref(null)
const noClick = ref(true)
const oaid = ref('')
const passwordType = ref(false)
const model = reactive({
	phone: '',
	password: '',
})
const isShow = ref(true)
const isShow1 = ref(false)
const hasWeixinAuth = ref(false)
const isxs = ref(0)
const inviteCode = ref('')
const imei = ref('')
const isSms = ref(false)
const nns = ref(1)
const nickname = ref('')
const phone = ref('')
const getAvatarUrl = ref('')
const userinfo = ref<Record<string, any>>({})


// 页面生命周期
onLoad((e: any) => {
	console.log('login paras:\n', e)

	if ('back_url' in e) {
		back_url.value = e.back_url
		if ('url_paras' in e) {
			url_paras.value = e.url_paras
		}
	}

	// #ifdef APP
	plus.oauth.getServices((services: any) => {
		weixinAuthService = services.find((service: any) => {
			return service.id === 'weixin'
		})
		if (weixinAuthService) {
			hasWeixinAuth.value = true
		}
	})
	// #endif
})

onShow(() => {
	// #ifdef APP
	// uni.preLogin({
	// 	provider: 'univerify',
	// 	success(e: any) { //预登录成功
	// 		console.log("e: ", e);
	// 		isSms.value = false
	// 	},
	// 	fail(res: any) {
	// 		isSms.value = true
	// 		// 预登录失败
	// 		// 不显示一键登录选项（或置灰）
	// 		// 根据错误信息判断失败原因，如有需要可将错误提交给统计服务器
	// 		console.log(res.errCode)
	// 		console.log(res.errMsg)
	// 	}
	// })
	// #endif

	// uni.getClipboardData({
	// 	success: (res: any) => {
	// 		console.log(res.data)
	// 		console.log(res.data.length)
	// 		if (res.data.length == 10) {
	// 			let qz = res.data.substr(0, 4)
	// 			if (qz == 'KDZ_') {
	// 				let code = res.data.substr(-6)
	// 				inviteCode.value = code
	// 			}
	// 		}
	// 	}
	// });
})

// 方法
const show = () => {
	isShow.value = !isShow.value
}

const getPhoneNumber = (e: any) => {
	console.log(e.detail.code)  // 动态令牌
	console.log(e.detail.errMsg) // 回调信息（成功失败都会返回）
	console.log(e.detail.errno)  // 错误码（失败时返回）
}

// 选择头像时触发
const onChooseAvatar = (e: any) => {
	console.log('选择头像参数 e: ', e);

	getAvatarUrl.value = e.detail.avatarUrl || ''

	cloudAvatarPath.value = 'avatar/' + uniCloud.getCurrentUserInfo().uid + ".jpeg"

	uniCloud.uploadFile({
		filePath: getAvatarUrl.value,
		cloudPath: cloudAvatarPath.value,
		onUploadProgress: function(progressEvent: any) {
			console.log("onUploadProgress: ", progressEvent);

			var percentCompleted = Math.round(
				(progressEvent.loaded * 100) / progressEvent.total
			);
		},
		success() {},
		fail() {},
		complete() {}
	});

}

const onGetPhoneNumber = (e: any) => {
	console.log('---------------e: ', e);
}

// 获取昵称
const getNickname = (e: any) => {
	console.log("用户昵称：", e.detail)

	// uni.createSelectorQuery().in(this) 		// 注意这里要加上 in(this)
	// 	.select("#nickname-input")
	// 	.fields({
	// 		properties: ["value"],
	// 	})
	// 	.exec((res: any) => {
	// 		console.log('createSelectorQuery 选择昵称：', res[0].value)
	// 		nickname.value = e.detail.value || ''
	// 	})

}

const getWeixinCode = () => {
	if (isxs.value !== 1) {
		uni.vibrateLong();
		Common.showToast('请阅读并同意用户/隐私协议')
		return;
	};

	// weixinAuthService.authorize((res: any) => {
	// 	// 这里拿到的是 code，不是 access_token！
	// 	const code = res.code
	// 	console.log('微信授权code:', code)

	// 	// 将 code 发送到云端
	// 	// this.loginToUniCloud(code)

	// 	}, (err) => {
	// 	  console.error('微信授权失败:', err)
	// })

}

// 设置信息
const updateWxUserInfo = async () => {

	if (!noClick.value) {
		Common.showToast('请勿频繁点击')
		return
	}
	noClick.value = false
	console.log('this.getAvatarUrl: ', getAvatarUrl.value);
	if (!getAvatarUrl.value) {
		noClick.value = true
		Common.showToast('请设置头像')
		return;
	};
	console.log('this.nickname: ', nickname.value);
	if (!nickname.value) {
		noClick.value = true
		Common.showToast('请设置昵称')
		return;
	};
	try {
		let obj = {
			name: 'ucenter',
			action: 'updatedata/updateWxUserInfo',
			data: {
				avatar: getAvatarUrl.value,
				nickname: nickname.value,
			}
		}
		console.log(obj)
		let res = await Api.cloudHttp(obj)
		console.log(res)
		if (res.result.code !== 0) {
			noClick.value = true
			Common.showToast(res.result.message)
			if (res.result.code === 403) {
				Common.clearInfo()
			}
			return
		}

		userinfo.value = uni.getStorageSync("userinfo")
		// userinfo.value.avatar = getAvatarUrl.value
		// userinfo.value.nickname = nickname.value

		// uni.setStorageSync('userinfo', userinfo.value)

		store_userAuth.userinfo = userinfo.value

		isShow1.value = false
		noClick.value = true
		Common.showToast("登录成功")
		uni.reLaunch({
			url: '/pages/home/index'
		})
	} catch (e: any) {
		noClick.value = true
		console.log('e: ', e);
	}
}

// 微信授权登陆
const wxLogin = async () => {
	console.log('\nweixin login...\n', weixinAuthService)

	if (isxs.value !== 1) {
		uni.vibrateLong();
		Common.showToast('请阅读并同意用户/隐私协议')
		return;
	};

	// 获取微信昵称和头像
	// const wxUserInfo = await uni.getUserInfo({
	// 	provider: 'weixin',
	// })
	// console.log("\nwxUserInfo: \n", wxUserInfo)

	// oauth授权登录
	weixinAuthService.authorize((res: any) => {
		// 这里拿到的是 code，不是 access_token！
		const code = res.code
		console.log('微信授权code:', code)

		store_userAuth.wxAppLogin(code).then((res: any) => {
			console.log("\nstore_userAuth: \n", store_userAuth.$state)

			uni.hideLoading();

			uni.showToast({
				title: "登录成功！",
				icon: 'none',
				position: 'bottom',
				duration: 2000
			})

			if (back_url.value) {
				console.log("回调地址：\n", back_url.value)

				uni.redirectTo({
					url: decodeURIComponent(back_url.value)
				})

			} else {
				uni.reLaunch({
					url: '/pages/home/index'
				})
			}
		})

	}, (err: any) => {
		console.error('微信授权失败:', err)
	})



}

const onLogin = async () => {
	if (!noClick.value) {
		Common.showToast('请勿频繁点击')
		return
	}
	noClick.value = false
	if (isxs.value !== 1) {
		noClick.value = true
		uni.vibrateLong();
		Common.showToast('请阅读并同意用户/隐私协议')
		return;
	};

	//获取用户信息 （头像和名称）
	const userProfile = await uni.getUserProfile({
		desc: "用于识别用户",
		lang: "zh_CN",
	});

	console.log('userProfile: ', userProfile);
	if (userProfile) {
		//调用微信登录接口获取临时 code
		const loginInfo = await uni.login({
			provider: "weixin"
		});
		if (loginInfo) {
			console.log('loginInfo: ', loginInfo);
			// 登录临时 code
			const {
				code
			} = loginInfo;
			const {
				userInfo: {
					avatarUrl,
					nickName
				}
			} = userProfile;
			console.log('avatarUrl: ', avatarUrl);

			let obj = {
				name: 'ucenter',
				action: 'userabout/loginByWeixin',
				data: {
					code: code,
					avatar: getAvatarUrl.value,
					nickname: nickName,
					channel_login: 2
				}
			}
			Common.showLoading('加载中...')
			try {
				let res = await Api.cloudHttp(obj)
				console.info(res)
				if (res.result.code !== 0) {
					noClick.value = true
					uni.hideLoading();
					Common.showToast(res.result.message)
					return;
				};
				let status = res.result.userInfo.status || 0
				let status_msg = res.result.userInfo.status_msg || ''
				let userid = res.result.uid
				if (status === 1) {
					noClick.value = true
					uni.hideLoading();
					Common.showToast(status_msg || '账号已禁用')
					return;
				};
				uni.setStorageSync('uni_id_token', res.result.token);
				uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired);
				res.result.userInfo._id = userid
				// res.result.userInfo.avatar = avatarUrl || ''
				// res.result.userInfo.nickname = nickName || ''
				res.result.userInfo.deviceid = res.result.deviceid
				console.log(res.result.userInfo._id)
				uni.setStorageSync('userinfo', res.result.userInfo);
				store_userAuth.token = res.result.token
				store_userAuth.token_expired = res.result.tokenExpired
				store_userAuth.uid = res.result.uid
				store_userAuth.userinfo = res.result.userInfo
				uni.hideLoading();

				// this.isShow1 = true
				if (res.result.type === "register") {
					isShow1.value = true

					uni.showToast({
						title: "首次登录成功！10 元红包已发放！",
						icon: 'none',
						position: 'bottom',
						duration: 2000
					})

					// 给新用户发放 20 元红包
					let obj = {
						name: "mp-money-update",
						action: 'updateMoney/giveLoginRedPacket',
						data: {
							amount: 10.0
						}
					}
					let res = await Api.cloudHttp(obj)
					console.log("新用户奖励发放结果: ", res)

				} else {

					uni.showToast({
						title: "登录成功！",
						icon: 'none',
						position: 'bottom',
						duration: 2000
					})

					let jump_url = '/pages/home/index'
					if (back_url.value) {
						jump_url = back_url.value
						if (url_paras.value) {
							jump_url = jump_url + '?' + url_paras.value
						}
					}
					uni.reLaunch({
						url: jump_url
					})
				}

				noClick.value = true
			} catch (e: any) {

				noClick.value = true
				console.log("e: ", e);
			}

		}
	}

	/// 登陆成功
	if (scene.value) {
		if (scene.value === 'reward_no_login') {

			uniCloud.callFunction({
				name: 'ad-callback',
				data: {
					'user_id': uniCloud.getCurrentUserInfo().uid
				}
			}).then(res => {
				console.log("激励视频奖励下发成功！")

				// #ifdef MP-WEIXIN
				uni.showModal({
					title: '奖励发放',
					content: '现金奖励已到帐，点击「确定」查看现金收益',
					success: function (res: any) {
						if (res.confirm) {
							console.log('用户点击确定');

							uni.navigateTo({
								url: '/pages/wallet/money-detail',
								fail: (err: any) => {
									console.error('资金明细页面跳转失败', err)
								}
							})

						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				// #endif

			}).catch(err => {
				// 处理错误
				console.log("err for 下发奖励：", err)
			})

		} else if (scene.value === 'alice_no_login') {

			uniCloud.callFunction({
				name: 'alice-qa-score',
				data: {
					'user_id': uniCloud.getCurrentUserInfo().uid,
					'watch_time': parseInt(raw_paras.value.watch_time),
					'finish_time': parseInt(raw_paras.value.finish_time),
					'watch_date': raw_paras.value.watch_date,
					'gh_openid': raw_paras.value.gh_openid
				}
			}).then(res => {
				console.log("公众号问答次数奖励下发成功！")

				let gh_openid = raw_paras.value.gh_openid

				// #ifdef MP-WEIXIN
				uni.showModal({
					title: '问答奖励发放',
					content: '问答奖励已到帐，点击「确定」查看',
					success: function (res: any) {
						if (res.confirm) {
							console.log('用户点击确定');

							uni.navigateTo({
								url: '/pages/reward/reward-detail?gh_openid='+gh_openid,
								fail: (err: any) => {
									console.error('资金明细页面跳转失败', err)
								}
							})

						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				// #endif

			}).catch(err => {
				// 处理错误
				console.error("err for 下发奖励：", err)
			})
		}
	}

	if (burl.value) {
		if (!paras.value) {
			uni.navigateTo({
				url: burl.value,
				fail: (err: any) => {
					console.error('登录页面跳转失败', err)
				}
			})
		} else {
			uni.navigateTo({
				url: burl.value+'?'+paras.value,
				fail: (err: any) => {
					console.error('登录页面跳转失败', err)
				}
			})
		}
	}
}

// 获取设备信息
// const getDeviceInfo = () => {

// 	const info = uni.getSystemInfoSync();
// 	console.log("this.info: ", info);

// 	plus.device.getOAID({
// 		success:function(e: any){
// 			console.log('getOAID success: '+JSON.stringify(e));
// 		},
// 		fail:function(e: any){
// 			console.log('getOAID failed: '+JSON.stringify(e));
// 		}
// 	});

// 	var androidosv =  info.osAndroidAPILevel || 33
// 	let imei = info.imei || ''
// 	let oaid = info.oaid || ''

// 	nns.value = 1
// 	if (androidosv >= 29) {
// 		oaid.value = oaid
// 		nns.value = 2
// 	} else {
// 		plus.device.getInfo({
// 			success: (e: any) => {
// 				let imei1 = e.imei.split(',')[0] || ''
// 				if (imei1) {
// 					imei.value = imei1

// 				} else {
// 					plus.device.getOAID({
// 						success: (e: any) => {
// 							oaid.value = e.oaid || ''
// 							console.log("device oaid: ", oaid.value)
// 						},
// 						fail: (e: any) => {
// 							const mittModule = uni.requireNativePlugin('MiitModule');
// 							mittModule.getDeviceSyncFunc((ret: any) => {
// 								console.log("ret: ", ret);
// 								oaid.value = ret.oaid || ''
// 							});
// 						}
// 					})
// 				}
// 			}
// 		});
// 	}

// 	console.log("oaid: ",oaid.value)
// }

const checkboxChange = (e: any) => {
	uni.vibrateShort();
	console.log(e.detail.value)
	isxs.value = Number(e.detail.value[0] || 0)
	console.log(isxs.value)
}

const updateType = () => {
	passwordType.value = false
}

// 调试
const login = async () => {
	if (!noClick.value) {
		Common.showToast('请勿频繁点击')
		return
	}
	noClick.value = false
	if (isxs.value !== 1) {
		noClick.value = true
		uni.vibrateLong();
		Common.showToast('请阅读并同意用户/隐私协议')
		return;
	};
	if (!/^1\d{10}$/.test(model.phone)) {
		noClick.value = true
		Common.showToast("手机号码填写错误")
		return
	};
	if (model.password.length < 6) {
		noClick.value = true

		Common.showToast('密码最短为 6 个字符')
		return
	};
	if (model.password.length > 12) {
		noClick.value = true
		Common.showToast('密码最长为 12 个字符')
		return
	};
	Common.showLoading('登录中...')
	let data = {
		username: model.phone,
		password: model.password
	}
	try {
		let obj = {
			name: 'ucenter',
			action: 'userabout/loginTo',
			data: data
		}
		let res = await Api.cloudHttp(obj)
		console.info(res)
		if (res.result.code !== 0) {
			noClick.value = true
			uni.hideLoading();
			Common.showToast(res.result.message)
			return;
		};
		// 成功逻辑
		let status = res.result.userInfo.status;
		let userid = res.result.uid;
		if (status === 1) {
			uni.hideLoading()
			Common.showToast('账号已禁用')
			return
		};
		// 个人信息存入缓存
		uni.setStorageSync('userinfo', res.result.userInfo);
		uni.setStorageSync('uni_id_token', res.result.token);
		uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired);
		uni.setStorageSync('login_data', data);

		// console.log(res.result.userInfo)

		store_userAuth.token = res.result.token
		store_userAuth.token_expired = res.result.tokenExpired
		store_userAuth.uid = res.result.uid
		store_userAuth.userinfo = res.result.userInfo
		uni.hideLoading();
		Common.showToast("登录成功")
		noClick.value = true
		uni.reLaunch({
			url: '/pages/home/index'
		})

	} catch (e: any) {
		console.log(e)

		noClick.value = true

		// Common.showToast(e.result.message)
	}
}

// 所有运营商手机号一键登录
const loginUniverify = () => {

	if (isxs.value !== 1) {
		uni.vibrateLong();
		Common.showToast('请阅读并同意用户/隐私协议')
		return;
	};

	Common.showLoading('加载中...')
	let data = {
		success: (res: any) => {
			uni.hideLoading();
			console.log(res.authResult);

			// 一键登陆
			login_sms(res.authResult)

			// 在得到 access_token 后，通过 callfunction 调用云函数
			// const ph_rst = uniCloud.callFunction({
			//   name: 'qcklogin', // 你的云函数名称
			//   data: {
			//     'access_token': res.authResult.access_token, // 客户端一键登录接口返回的 access_token
			//     'openid': res.authResult.openid // 客户端一键登录接口返回的 openid
			//   }
			// });
			// console.log('qcklogin result:',ph_rst)

			// .then(res => {
			//   // res.result = {
			//   //   code: '',
			//   //   message: ''
			//   // }
			//   uni.closeAuthView()
			//   // 登录成功，可以关闭一键登录授权界面了
			// }).catch(err=>{
			//   // 处理错误
			//   console.log("err for login: ", err)
			// })

			uni.closeAuthView()

		},
		fail: (res: any) => { // 登录失败
			uni.hideLoading();

			console.log("\n登录失败：\n", res)

			if (res.errCode === 30005) {
				Common.showToast("请先打开流量数据")
				uni.closeAuthView()
				return
			}
			if (res.errCode === 20301) {
				uni.closeAuthView()
				return
			}
			uni.closeAuthView()
		}
	}

	Common.loginUniverify(data)
}

// 执行登入请求
const login_sms = async (data: any) => {
	console.log('--------------执行: login_sms')

	if (inviteCode.value) {
		data.inviteCode = inviteCode.value || ''
	}
	data.deviceid = oaid.value || imei.value
	data.nns = nns.value
	let obj = {
		name: "ucenter",
		action: 'userabout/loginByUniverify',
		data: data
	}
	console.log("obj:",obj)

	Common.showLoading('加载中...')
	try {
		let res = await Api.cloudHttp(obj)
		console.info('\n#登录结果:\n', res)

		if (res.result.code !== 0) {
			uni.hideLoading();
			Common.showToast(res.result.message)
			return;
		};
		let status = res.result.userInfo.status || 0
		let userid = res.result.uid
		if (status === 1) {
			uni.hideLoading();
			Common.showToast('账号已禁用')
			return;
		};

		uni.setStorageSync('uni_id_token', res.result.token);
		uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired);
		uni.setStorageSync('userinfo', res.result.userInfo)
		uni.setStorageSync('uid', res.result.uid)
		uni.setStorageSync('avatar', res.result.userInfo.avatar)
		uni.setStorageSync('nickname', res.result.userInfo.nickname)


		res.result.userInfo._id = userid
		res.result.userInfo.deviceid = res.result.deviceid
		console.log(res.result.userInfo._id)

		store_userAuth.token = res.result.token
		store_userAuth.token_expired = res.result.tokenExpired
		store_userAuth.uid = res.result.uid
		store_userAuth.userinfo = {
			uid: res.result.uid,
			mobile: res.result.userInfo.mobile,
			nickname: res.result.userInfo.nickname,
			avatar: res.result.userInfo.avatar,
			deviceid: res.result.userInfo.deviceid,
			client_ip: res.result.userInfo.register_env.client_ip,
			register_date: dayjs(res.result.userInfo.register_date).format('YYYY-MM-DD HH:mm:ss')
		}
		store_userAuth.avatar = res.result.userInfo.avatar
		store_userAuth.nickname = res.result.userInfo.nickname

		// 判断是否登录
		// store_userAuth.$state.token = res.result.token

		// store_userAuth.updateUserInfo(res.result.userInfo)

		uni.hideLoading();

		// 登录成功，res 中包含 token 等信息，需传给自己的服务器进行验证和登录
		uni.showToast({
			title: '登录成功',
			icon: 'success'
		});

		if (back_url.value) {
			console.log("回调地址：\n", back_url.value)

			uni.redirectTo({
				url: decodeURIComponent(back_url.value)
			})

		} else {
			uni.reLaunch({
				url: '/pages/home/index'
			})
		}

		// let jump_url = '/pages/home/index'
		// if (back_url.value) {
		// 	jump_url = decodeURIComponent(back_url.value)

		// 	if (url_paras.value) {
		// 		jump_url = jump_url + '?' + url_paras.value
		// 	}
		// }
		// console.log("登录成功，即将跳转url: ", jump_url)

		// uni.navigateTo({
		// 	url: jump_url
		// })


	} catch (e: any) {

		console.log("e: ", e);
	}
}

// 导航方法
const navTo = (i: number, url?: string) => {
	if (i === 88) {
		if (isxs.value !== 1) {
			uni.vibrateLong();
			Common.showToast('请阅读并同意用户/隐私协议')
			return;
		};
	}
	if (i === 1) {
		isShow1.value = false
		uni.reLaunch({
			url: '/pages/home/index'
		})
	} else {
		uni.navigateTo({
			url
		})
	}
}
</script>

<style>

</style>
