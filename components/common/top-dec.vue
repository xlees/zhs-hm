<template>
	<view>
		<!-- <image src="../../static/hxx.png" mode="aspectFill"
			style="position: absolute; bottom: 0rpx;  left: 0rpx; width: 100rpx; height: 30rpx;"></image> -->
		<text class="f-w1" :class="fs">{{name}}</text>
	</view>
</template>

<script>
	export default {
		props: {
			name: String,
			fs: {
				type: String,
				default: 'fs-31'
			}
		},
		methods: {

		}
	}
</script>

<style>
</style>
