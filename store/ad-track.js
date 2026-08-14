
import { defineStore } from 'pinia'

import Common from '@/common/common'
import Api from "@/common/api"
import {SDK} from '@/util/dn-sdk-miniprogram/index.js';

// import {storeUserAuth} from "./user-auth"

export const storeTxSdk = defineStore('tecent_ad_sdk', {
	
	state: () => {
		return {
			DNSDK: new SDK({
				// 数据源ID，必填
				user_action_set_id: 1213000653,
				// 加密key，必填
				secret_key: 'e1ed4448264e65ba39160768ccf2237e',
				// 微信小程序APPID，wx开头，必填
				appid: 'wx84bc52413480050d',
				// 微信 openid，openid 和 unionid 只能填一个（优先填写openid）, 可以调用 setOpenId 设置
				openid: '',
				// 微信 unionid，openid 和 unionid 只能填一个（优先填写openid）, 可以调用 setUnionId 设置
				unionid: '',
				// 自定义用户ID，选填
				user_unique_id: uniCloud.getCurrentUserInfo().uid,
				// 是否开启自动采集，选填，默认为true
				auto_track: true
			})
		}
	},
	
	// 默认网页端
	// persist: true,
	
	// 小程序端
	persist: {
		storage: {
			getItem: (key) => uni.getStorageSync(key),
			setItem: (key, value) => uni.setStorageSync(key, value),
		}
	},
	
	actions: {
		
		async set_openid() {
			// const userStore = storeUserAuth()
			// console.log("auth openid:\n",userStore.userinfo.wx_openid['mp-weixin'])
			
			const loginInfo = await uni.login({ provider: "weixin" });
			console.log("loginInfo:",loginInfo);
			
			let res = await uniCloud.callFunction({
				name: 'ucenter',
				data: {
					action: 'userabout/getOpenid',
					data: {
						code: loginInfo.code
					}
				}
			});
			console.log("\n当前用户openid:\n",res)
			
			this.DNSDK.openid = res.result.data.openid
		},
		
		exit() {
			
		}
	},
	
	getters: {
		
	},
})
