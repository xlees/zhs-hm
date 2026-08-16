<template>
	<view class="dflex flex-row align-center" style="height: 80rpx;" :class="dClass">
		<view class="dflex justify-center align-center fcolor-dark1 pa-0-20" v-for="(item,index) in tabBarArr" :key="index"
			@click="handleTabTap(index)">

			<view :class="{'bor-bottom-black': tabIndex==index}">
				<view :class="pClass">
					<text class="" :class="tabIndex==index ? 'f-w fs-30' : 'fcolor-dark2 fs-28'">{{ item.name }}</text>
				</view>
			</view>

		</view>
	</view>
</template>

<script setup lang="ts">
interface Props {
	tabBarArr: { name: string }[]
	tabIndex: number
	dClass?: string
	pClass?: string
}
// 接收父组件参数
defineProps<Props>()

const emit = defineEmits<{
	'tab-tap': [index: number]

}>()

// 定义点击处理函数
const handleTabTap = (index: number) => {
	console.log('Tab clicked:', index)

	emit('tab-tap', index)  // 使用 kebab-case 事件名
}

</script>

<style>
</style>
