<template>
	<view>
		<loading-icon v-if="loading && tableData.length < 1"></loading-icon>
		<list v-if="tableData.length > 0">
			<cell class="" v-for="(item, i) in tableData" :key="i">
				<view class="pa-30 bor-r30 mar-30 zcolor-while" style="margin-bottom: 0;" @click="auditDetails(item)">
					<top-dec name="我的反馈"></top-dec>
					<view class=" mar-t25">
						<view class="">
							<text class="fs-26 fcolor-dark2" style="width: 600rpx;">{{ item.opinion }}</text>
						</view>
						<view class="mar-r20 mar-t15" v-for="(item, index) in item.opinionimg" :key="index">
							<image :src="item" class="wh-170 bor-r10" mode="aspectFill" @click="fd(item)"></image>
						</view>
						<view class="mar-t15">
							<uni-date-format class="fs-25 fcolor-dark1" :date="item.creat_date"
								:threshold="[0, 0]" />
						</view>
					</view>
				</view>
			</cell>
		</list>
		<!-- 没有 -->
		<no-thing v-if="isNothing && tableData.length < 1"></no-thing>
		<!-- 上拉加载 -->
		<load-more :has-more="hasMore" :loading="loading" v-if="isNothing && tableData.length > 4"></load-more>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import Common from '@/common/common'
import Api from '@/common/api.ts'

// 页面数据
const hasMore = ref(true)
const isNothing = ref(false)
const req = reactive({
	page: 0,
	sort: 'desc',
	rows: 10,
	status: 1,
})
const loading = ref(true)
const tableData = ref<any[]>([])
const tableTotal = ref(0)

// 下拉刷新
onPullDownRefresh(() => {
	req.page = 0
	loadData()
})

// 触底事件
onReachBottom(() => {
	hasMore.value = true
	loading.value = true
	loadData(1)
})

// onLoad 生命周期
onLoad(() => {
	loadData()
})

// 加载数据
const loadData = async (i: number = 0) => {
	let obj = {
		name: 'ucenter',
		action: 'getdata/getfeedList',
		data: req
	}
	let res = await Api.cloudHttp(obj)
	console.log(res)
	
	if (res.result.code !== 0) {
		Common.showToast(res.result.message)
		if (res.result.code === 403) {
			Common.clearInfo()
		}
		return
	}
	
	if (tableData.value.length === 0) {
		isNothing.value = 1
	}
	
	req.page = req.page + 1
	loading.value = false
	tableData.value = [...tableData.value, ...(res.result.data.data || [])]
	tableTotal.value = res.result.count_num || 0
	if (tableData.value.length >= tableTotal.value) {
		hasMore.value = false
	}
	console.log(tableData.value)
}

// 查看反馈详情
const auditDetails = (item: any) => {
	Common.showModal({
		title: '反馈详情',
		content: `${item.opinion}\n图片：${item.opinionimg.join(', ')}`,
		showCancel: false
	})
}

// 查看图片
const fd = (item: any) => {
	Common.fdImg(item)
}

</script>

<style>

</style>