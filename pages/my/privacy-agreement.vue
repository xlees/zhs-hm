<template>
	<view class="">
		<view style="padding: 30rpx;">
			<rich-text class="rich-val" :nodes="content"></rich-text>
			<!-- <text class="" style="font-size: 30rpx;" v-html="content"></text> -->
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const content = ref('')

// onLoad 生命周期
onLoad(() => {
	getData()
})

// 获取数据
const getData = () => {
	
	// let res = await uniCloud.database().collection('privacy-agreement').get({
	// 	getOne: true
	// });
	// if (res.result.data) {
	// 	console.log(res)
	// 	content.value = res.result.data.content
	// }
	
	// uni.request({
	// 	url: 'https://env-00jxt26g3woi.normal.cloudstatic.cn/privacy.txt',
	// 	success(res: any) => {
	// 		console.log(res)
				
	// 		content.value = res.data
	// 	},
	// 	fail(res: any) => {
				
	// 	}
	// })
	
	// 调用云函数获取协议
	uniCloud.callFunction({
		name: 'ucenter',
		data: {
			action: 'agreement/fetch',
			data: {
				ag_type: 1
			}
		}
	}).then((res: any) => {
		console.log("agreement:", res.result.data);
		
		content.value = res.result.data.content;
	})
	
	// try {
	// 	
	// 	
	// } catch (e: any) {
	// 	console.log(e)
	// 	return e
	// }
}

</script>

<style>
	page {
		background-color: #f8f8f8;
	}
	
	.rich-val {
	    word-break: break-all;
	    white-space: pre-line;
	}
</style>