<template>
	<view class=" dflex justify-center align-center" style="height: 100vh;">
		<view class="dflex justify-center align-center flex-column" style="margin-top: -200rpx;">
			<image class="wh-150 bor-r30" :src="config.static+'/logo.png'" mode="aspectFill"></image>
			<text class="fs-33 f-w mar-t60">{{ title || config.mp_name + ', 真的会省！' }}</text>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

import config from '@/config.js'

const title = ref('')
// const logo = ref(config.value.logo)

// onLoad 生命周期
onLoad(() => {
	// #ifdef MP-WEIXIN
	title.value = config.value.mp_name + ' - 真的会省！'
	// #endif
})

</script>

<style>

</style>