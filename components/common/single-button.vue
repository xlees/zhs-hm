<template>
	<view class="position-r-b-l dflex justify-center align-center pa-20-30 zcolor-black">
		<view   class="wh-700-85 bor-r50 dflex align-center justify-center gradient-green"   
			@click="commonEvent">
			<text class=" fs-30 fcolor-while f-w">{{name}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			name:String
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
