<template>
	<view  class="position-flex-right dflex align-center gradient-while-dack bor-r100 justify-center" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)" @click="tapEvent" v-if="scrollTop>1200">
		<image src="../../static/zhiding.png" mode="widthFix"  :class="iClass"></image>
	</view>
</template>

<script>
	export default {
		props: {
			url: String,
			iClass:{
				type:String,
				default:'wh-100'
			},
			scrollTop: {
				type: Number,
				default: 0
			},

		},
		methods: {
			tapEvent() {
				this.$emit('tapEvent');
			},
		}
	}
</script>

<style>
</style>
