<template>
	<view class="mar-20 zcolor-while bor-r20 justify-center pa-0-30" style="margin-top: 0; height: 170rpx;" @click="navTo(item.path)">
		<image :src="item.icon" mode="aspectFill" class="bor-r10"
			style="position: absolute; bottom: 0rpx; right: 0; opacity: 0.3; width: 250rpx; height: 170rpx;">
		</image>
		<view class="flex-row justify-space-between align-center ">
			<view class="flex-row align-center ">
				<view class="">
					<image :src="item.icon" mode="widthFix" class="wh-100 bor-r20"></image>
				</view>
				<view class=" mar-l30">
					<text class="f-w fs-28">{{item.name}}</text>
					<view class="flex-row align-center mar-t15">
						<view class="zcolor-green pa-6-12 bor-r0-15">
							<text class="fs-20  fcolor-while f-w">{{item.left}}</text>
						</view>
						<view class="zcolor-red pa-6-12 mar-l15 bor-r0-15">
							<text class="fs-20  fcolor-while f-w">{{item.right}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="">
				<image :src="item.an" mode="aspectFill"
					style="width: 270rpx; height: 75rpx; margin-right: -35rpx;"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item:{
				type:Object,
				default:{}
			}
		},
		methods: {
			navTo(path) {
				this.$emit('navTo',path);
			}
		}
	}
</script>

<style> 
</style>
