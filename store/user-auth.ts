import { defineStore } from 'pinia'

import Common from '@/common/common'
import Api from "@/common/api"
import dayjs from 'dayjs'

interface UserInfo {
	uid?: string
	nickname?: string
	mobile?: string
	avatar?: string
	deviceid?: string
	status?: number
	client_ip?: string
	register_date?: string
}

interface UserAuthState {
	uid: string | undefined
	avatar: string
	nickname: string
	userinfo: UserInfo
	token: string | undefined
	token_expired: string | undefined
}

export const useUserAuthStore = defineStore('user-auth', {
	state: (): UserAuthState => {
		return {
			uid: uni.getStorageSync('uid'),
			avatar: uni.getStorageSync('avatar'),
			nickname: uni.getStorageSync('nickname'),
			userinfo: (uni.getStorageSync('userinfo') as UserInfo) || {},
			token: uni.getStorageSync('uni_id_token'),
			token_expired: uni.getStorageSync('uni_id_token_expired'),
		}
	},

	persist: {
		storage: {
			getItem: (key: string) => uni.getStorageSync(key),
			setItem: (key: string, value: string) => uni.setStorageSync(key, value),
		}
	},

	actions: {
		exit() {
			uni.removeStorageSync('uni_id_token')
			uni.removeStorageSync('uni_id_token_expired')
			uni.removeStorageSync('userinfo')
			uni.removeStorageSync('uid')
			uni.removeStorageSync('avatar')
			uni.removeStorageSync('nickname')
		},
		
		// app使用微信oauth登录
		async wxAppLogin(code: string): Promise<number> {

			let obj = {
				name: 'ucenter',
				action: 'userabout/loginByWeixin',
				data: {
					code: code,
					channel_login: 'app'
				}
			}
			
			try {
				let oauthRes = await Api.cloudHttp(obj)
				console.log("\nuserabout resp result:\n", oauthRes)
				
				const wxlogin_result = oauthRes.result
				const wxlong_userinfo = oauthRes.result.userInfo
				
				const status = wxlogin_result.status || 0
				if (status === '-1') {
					Common.showToast('账号已禁用')
					return 0
				}
		
				this.token = wxlogin_result.token
				this.token_expired = wxlogin_result.tokenExpired
				
				this.uid = wxlogin_result.uid
				this.userinfo = {
					uid: this.uid,
					nickname: wxlong_userinfo.nickname,
					avatar: wxlong_userinfo.avatar,
					deviceid: wxlong_userinfo.deviceid,
					client_ip: wxlong_userinfo.register_env.client_ip,
					register_date: dayjs(wxlong_userinfo.register_date).format('YYYY-MM-DD HH:mm:ss') 
				}
				this.avatar = wxlong_userinfo.avatar
				this.nickname = wxlong_userinfo.nickname
		
				uni.setStorageSync('uni_id_token', this.token)
				uni.setStorageSync('uni_id_token_expired', this.token_expired)
				uni.setStorageSync('userinfo', this.userinfo)
				uni.setStorageSync('uid', this.uid)
				uni.setStorageSync('avatar', this.avatar)
				uni.setStorageSync('nickname', this.nickname)
		
				return 1
				
			} catch (e) {
				
				console.log("登录失败e: \n", e)
				return 0
			}
		},

		async wxLogin(code: string, avatar: string = '', nickname: string = ''): Promise<number> {
			const obj = {
				name: 'ucenter',
				action: 'userabout/loginByWeixin',
				data: {
					code: code,
					avatar: avatar,
					nickname: nickname,
					channel_login: 2
				}
			}
			try {
				const res: any = await Api.cloudHttp(obj)
				if (res.result.code !== 0) {
					Common.showToast(res.result.message)
					return 0
				}

				const status = res.result.userInfo?.status || 0
				if (status === 1) {
					Common.showToast('账号已禁用')
					return 0
				}

				this.token = res.result.token
				this.token_expired = res.result.tokenExpired
				this.uid = res.result.uid
				this.userinfo = res.result.userInfo
				this.avatar = avatar
				this.nickname = nickname

				uni.setStorageSync('uni_id_token', this.token)
				uni.setStorageSync('uni_id_token_expired', this.token_expired)
				uni.setStorageSync('userinfo', this.userinfo)
				uni.setStorageSync('uid', this.uid)
				uni.setStorageSync('avatar', avatar)
				uni.setStorageSync('nickname', nickname)

				return 1
			} catch (e) {
				console.log("登录失败e: \n", e)
				return 0
			}
		}
	},

	getters: {
		
		is_login: (state) => {
			if (!state.token) {
				return false
			} else {
				return true
			}
		}
	},
})
