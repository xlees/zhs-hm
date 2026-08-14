<template>
	<view class="men-ban dflex justify-center align-center " v-if="isShow" @touchmove.stop.prevent="">
		<view class=" zcolor-while bor-r30 " style="width: 600rpx;">
			
			<view class="pa-30" style="padding-bottom: 0;">
				<view class="flex-row align-center">
					<text class="fs-33 f-w">{{title}}</text>
				</view>
			</view>
			<slot></slot>
			<view class="dflex flex-row justify-center align-center height-130" v-if="isBut">
				<view   @click='show'
					class="zcolor-black justify-center align-center bor-r50 wh-80-500">
					<text class="fs-28 fcolor-while f-w">朕知道了</text>
				</view>
			</view>
			<view class="dflex flex-row justify-space-around align-center  height-130" style="width: 600rpx;" v-else>
				<view  class="wh-80-200 dflex justify-center align-center zcolor-while1 bor-r50"
					@click="lEvent">
					<text class="fs-28 f-w">{{lName}}</text>
				</view>
				<view   @click="rEvent"
					class="zcolor-black dflex justify-center align-center bor-r50 wh-80-200"
					 >
					<text class="fs-28 fcolor-while f-w">{{rName}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title:{
				type: String,
				default:"温馨提示"
			},
			isShow:{
				type:Boolean,
				default:true
			},
			lName: String,
			rName: String,
			isBut:{
				type:Boolean,
				default:true
			}
		},
		methods: {
			show() {
				this.$emit('show')
			},
			lEvent() {
				this.$emit('lEvent');
			},
			rEvent() {
				this.$emit('rEvent');
			},
		}
	}
</script>

<style>
	
</style>
