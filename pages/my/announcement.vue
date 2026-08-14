<template>
	<view>
		<unicloud-db ref="udb" v-slot:default="{ data, pagination, loading, hasMore, error, options }"
			collection="announcement" field="title,content,creat_date" orderby="creat_date desc" page-data="add"
			:page-size="options.pageSize" :page-current="options.pageCurrent" :options="options" :get-count="true"
			@load="ggLoad" @error="ggErr">
			<!-- 加载图标 -->
			<loading-icon v-if="loading && data.length < 1" l-class="mar--t200"></loading-icon>
			<!-- 列表 -->
			<list v-if="data.length > 0">
				<cell v-for="(item, index) in data" :key="index">
					<view class="mar-30 zcolor-while pa-30 bor-r30" style="margin-bottom: 0;">
						
						<view class=" dflex flex-row justify-space-between align-center">
							<text class="fs-30 f-w mar-l15">{{ item.title }}</text>
						</view>
						<view class="pa-15">
							<view class="">
								<text class=" fs-25" style="width: 600rpx;">{{ item.content }}</text>
							</view>
							<view class="">
								<uni-date-format class="fs-25 mar-t15 fcolor-dark1" :date="item.creat_date" :threshold="[0, 0]" />
							</view>
						</view>
					</view>
				</cell>
			</list>
			<!-- 没有 -->
			<no-thing v-if="isNothing && data.length < 1"></no-thing>
			<!-- 上拉加载 -->
			<load-more :has-more="hasMore" :loading="loading" v-if="isNothing && data.length > 8"></load-more>
		</unicloud-db>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import Common from '@/common/common'

// 页面参数
const isNothing = ref(false)
const noClick = ref(true)
const options = reactive({
	pageSize: 20,
	pageCurrent: 1
})

// 下拉刷新
onPullDownRefresh(() => {
	// $refs.udb.loadData({
	// 	clear: true
	// });
	setTimeout(() => {
		uni.stopPullDownRefresh()
	}, 1000)
})

// 触底事件
onReachBottom(() => {
	// $refs.udb.loadMore()
})

// onLoad 生命周期
onLoad(() => {
	
})

// 加载成功
const ggLoad = (data: any) => {
	isNothing.value = 1
}

// 加载失败
const ggErr = (e: any) => {
	isNothing.value = 2
	Common.errorOut(e)
}

</script>

<style>

</style>