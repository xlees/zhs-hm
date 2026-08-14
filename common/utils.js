
import {useUserAuthStore} from "@/store/user-auth"

export default {
	// store_userAuth: useUserAuthStore(),
	
	isLogin() {
		let token = uni.getStorageSync("uni_id_token")
		if (!token) {
			return false
		} else {
			return true
		}
	},
	
	// 跳转到下一页面，携带参数paras
	navTo(url,  need_login=false, paras={}) {
		const store_userAuth = useUserAuthStore()
		
		const query_str = Object.keys(paras)
		  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paras[key])}`)
		  .join('&');
		  
		let full_query_str = ""
		if (query_str) {
			full_query_str = '?' + query_str
		}
		
		try {
			if (need_login && !store_userAuth.is_login) {  // 先登录
				uni.navigateTo({
					url: "/pages/login/login?back_url="+url+'&url_paras='+query_str
				})
				return
			}
			
			uni.navigateTo({
				url: url+full_query_str
			})
			
		} catch (e) {
			console.log("跳转失败：\n",e)
			
			this.showToast(url+' 跳转失败, 请重试')
		}
	},
	
	showToast(title) {
		uni.showToast({
			title: title,
			icon: 'none',
			position: 'bottom'
		})
	},
	
}