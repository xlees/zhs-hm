<template>
	<view   class="bor-r50 wh-130-60 dflex justify-center align-center gradient-green"
		   @tap="commonEvent">
		<text class="fs-20 f-w">{{name}}</text>
	</view>
</template>

<script>
	export default {
		props: {
			name: String
		},
		methods: {
			commonEvent() {
				this.$emit('commonEvent');
			},
		}
	}
</script>

<style>
</style>
