// import MD5 from '@/common/md5.js'

export default {
	name: 'abc',
	hello() {
		console.log('test in hello.')
	},
	eat() {
		console.log('test in eat.')
	},
	showToast(title) {
		uni.showToast({
			title: title,
			icon: 'none',
			position: 'bottom'
		})
	},
	addressList: []
}