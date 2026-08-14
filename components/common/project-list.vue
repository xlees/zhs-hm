<template>
	<view class="bor-bottom-dark zcolor-while">
		<view class="bor-bottom-dark zcolor-while flex-row align-center justify-space-between pa-10">
			<view class="flex-row align-center pa-20">
				<image src="../../static/biaoti.png" mode="widthFix" class="wh-25"></image>
				<view class="mar-l15">
					<text class="fs-28 f-w">{{title}}</text>
				</view>
			</view>
			<slot></slot>
		</view>
		<view class="flex-row  flex-wrap wh-w750" v-if="iszk">
			<view v-for="(item,index) in arr" :key="index" @click="navTo(item.path)">
				<view class=" flex-row align-center pa-30 wh-w375 bor-right-dark bor-bottom-dark">
					<view  class="gradient-while-dack wh-80 bor-r100 justify-center align-center" >
						<image :src="item.icon" mode="widthFix" class="wh-60"></image>
					</view>
					<view class="mar-l15">
						<text class="fs-25 f-w">{{item.bt}}</text>
						<text class="fs-23 fcolor-dark1 mar-t15">{{item.sm}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: String,
			arr:{
				type:Array,
				default:[]
			},
			iszk:{
				type:Boolean,
				default:true
			}
		},
		methods: {
			navTo(url) {
				this.$emit('navTo',url);
			}
		}
	}
</script>

<style>

</style>
