<template>
	<view class="dflex justify-center align-center" style="position: fixed; top: 0; right: 0; left: 0; bottom: 0;">
		<image src="https://mp-ba2f31ba-46dc-47fe-abf6-70aa178a7c92.cdn.bspapp.com/static/loading.gif" mode="widthFix" class="wh-80" style="margin-top: -200rpx;" :class="lClass"></image>
	</view>
</template>

<script>
	export default {
		props: {
			lClass:{
				type:String,
				default:''
			},
		},
		methods: {
			
		}
	}

</script>

<style>
</style>
