<script lang="uts">
	export default {
		onLaunch: function() {
			console.log('App Launch')
			
			if (!uni.getStorageSync("is_agree")) {
				
				uni.navigateTo({
					url: "/pages/login/first-enter"
				})
			}
			
			// let sys_info = uni.getSystemInfoSync() 
			// console.log("\nsystem info:\n", sys_info)
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uview-plus/index.scss';
	
	@import '@/common/common.css';
</style>
