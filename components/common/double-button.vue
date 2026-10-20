<template>
	<view class="position-r-b-l dflex flex-row justify-space-between align-center pa-20 zcolor-while mar-30 bor-r100">
		<view   class="wh-85-200 bor-r50 zcolor-while1 dflex align-center justify-center"
			@click="lEvent">
			<text class="fs-30 f-w">{{left_name}}</text>
		</view>
		<view   class="bor-r50 dflex align-center justify-center zcolor-black"
			  :class="{ 'double-button-disabled': right_disable }"
			  style="width: 400rpx; height: 85rpx;"
			  @click="rEvent" >
			<text class="fs-30 fcolor-while f-w">{{right_name}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			left_name:String,
			right_name:String,
			right_disable: Boolean
		},
		methods: {
			lEvent() {
				this.$emit('lEvent');
			},
			rEvent() {
				if (this.right_disable) {
					return;
				}
				this.$emit('rEvent');
			},
		}
	}
</script>

<style>
.double-button-disabled {
	opacity: 0.45;
}
</style>
