<template>
	<!-- #ifdef MP-WEIXIN -->
	<view  class="mar-40 bor-r30  gradient-green-while" style="margin-top: 0; height:100px; "  >
		<!-- <ad ref="adFlowSearch2" unit-id="adunit-8cfe3f3db34e0c50" ad-type="video" ad-theme="white" @click="seAdClick" @load="mponload" @error="onerror" @close="onclose"></ad> -->
		
		<ad ref='adcomp' unit-id="adunit-1a7f74f6d8ea4aa0" @click="adClick" @tap="adTap" @load="adLoad" @error="adError" @close="adClose"></ad>
		
	</view>
	<!-- #endif -->
	
</template>

<script>
	export default {
		name: 'adTest',
		props: {
		},
		
		// mounted() {
		// 	const adElem = this.$refs.adcomp.$el
		// 	console.log("adElem: ", adElem)
		// },
		
		// beforeDestroy() {
		// 	const adElem = this.$refs.adcomp.$el
		// 	adElem.removeEventListener('click', this.adClick())
		// },
		
		methods: {
			adClick(e) {
				console.log("ad click")
				
			},
			
			adLoad(e) {
				console.log("ad onload");
				
				console.log("ref value: ", this.$refs)
				
				this.$emit('click');
				
				// uni.$emit('adclick',{})
				
				// uni.$emit('')
				
				// let providerName = this.$refs.adRewardedVideo.getProvider();
				// console.log('广告商名称:', providerName);
				
			},
			adClick(e) {
				console.log("ad click  event")
			},
			adTap(e) {
				console.log("ad tap event.")
			},
			adClose(e) {

				console.log("ad onclose: " + e.detail);
			},
			adError(e) {

				console.log("onerror: " + e.detail.errCode + " message:: " + e.detail.errMsg);
			},
		}
	}
</script>

<style>
</style>