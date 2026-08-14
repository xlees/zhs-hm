<template>
	<!-- 推荐悬赏 -->
	<view>
		<!-- 顶部选项卡 -->
		<hTabbar :tab-bar-arr="moneyArr" :tab-index="tabIndex" @tab-tap="tabTap" p-class="pa-20-0"
			d-class="justify-space-around zcolor-while" style="position: fixed; top: 0; left: 0; right: 0; z-index: 9999;"></hTabbar>
		<view class="" style="height: 90rpx;">
			
		</view>
		<!-- 加载图标 -->
		<loading-icon v-if="loading && tableData.length < 1"></loading-icon>
		<list v-if="tableData.length > 0">
			<!-- 列表 -->
			<cell v-for="(item, i) in tableData" :key="i" @click="tabDec(item.title)">
				<view class="zcolor-while mar-30 bor-r30" style="margin-bottom: 0;">
					<view class=" dflex flex-row justify-space-between align-center pa-30" style="padding-bottom: 0rpx;">
						<top-dec name="我的提现"></top-dec>
						<view v-if="item.status === 3">
							<text class="fs-23 fcolor-red">提现账户错误或未打开手机号查找</text>
						</view>
					</view>
					<view class="dflex flex-row  justify-space-between align-flex-end  ">
						<view class="pa-20-30">
							<view>
								<text class="fs-28">提现名字：*{{ item.name.substr(1) }}</text>
							</view>
							<view class="mar-t15">
								<text
									class="fs-28">提现账号：{{ item.alipay.substr(0, 3) + '****' + item.alipay.substr(-4) }}</text>
							</view>
							<view class="mar-t15">
								<uni-date-format class="fs-25 fcolor-dark1" :date="item.creat_date"
									:threshold="[0, 0]" />
							</view>
						</view>
						<view class="pa-20-30  " style="border-top-left-radius: 30rpx;"  @click="show">
							
							<text class=" fs-26  fcolor-red">提现金额：{{ parseFloat(item.y_money).toFixed(2) }}元</text>
							<view class="dflex flex-row align-center mar-t10">
								<text
									class=" fs-26 fcolor-red  ">手续费：{{ (parseFloat(item.y_money) - parseFloat(item.money)).toFixed(2) }}元</text>
								<uni-icons type="help" size="20" color="red"></uni-icons>
							</view>
							<text
								class=" fs-26 fcolor-red  mar-t10">到账金额：{{ parseFloat(item.money).toFixed(2) }}元</text>
						</view>
					</view>
					<view class="justify-center align-center" style=" width: 710rpx; height: 80rpx;"
						v-if="item.status === 3" @click="updateMoney(item._id)">
						<text class="fs-28 fcolor-dark1">重新申请</text>
					</view>
				</view>
			</cell>
		</list>
		<no-thing v-if="isNothing && tableData.length < 1"></no-thing>
		<!-- 上拉加载 -->
		<load-more :has-more="hasMore" :loading="loading" v-if="isNothing && tableData.length > 9"></load-more>

		<popupTs :is-show="isShow" r-name="理解并关闭" :is-but="false" l-name="关闭" @l-event="show" @r-event="show1" title="手续费说明">
			<view class="pa-15-30">
				<view class="mar-t25">
					<text class="fs-28 line-h fcolor-dark2">手续费：技术服务费和税务成本</text>
				</view>
			</view>
		</popupTs>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue"
import { onLoad, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app'

import Api from '@/common/api.ts'
import Common from '@/common/common'
import { useUserAuthStore } from '@/store/user-auth'

const userStore = useUserAuthStore()

// 页面数据
const isNothing = ref(false)
const moneyArr = reactive([
	{
		id: 'yj',
		name: "进行中"
	},
	{
		id: 'ej',
		name: "已到账"
	},
	{
		id: 'sj',
		name: "未通过"
	}
])
const tabIndex = ref(0)
const hasMore = ref(true)
const loading = ref(true)
const tableData = ref<any[]>([])
const tableTotal = ref(0)
const isShow = ref(false)
const req = reactive({
	page: 0,
	rows: 10,
	status: 1
})
const income = ref(0)
const jb = ref(0)

// 当前页面参数
const where = ref({
	userid: ''
})

// 加载数据
const loadData = async (i: number = 0) => {
	if (!i) {
		tableData.value = []
	}
	
	req.status = 1
	
	let obj = {
		name: "ucenter",
		action: 'getdata/getWithdrawalState',
		data: req
	}
	
	try {
		let res = await uniCloud.callFunction({
			name: "ucenter",
			data: {
				action: 'getdata/getWithdrawalState',
				data: req
			}
		})
		console.log('----------------------------列表')
		console.log(res)
		
		if (res.result.code !== 0) {
			Common.showToast(res.result.message)
			if (res.result.code === 403) {
				Common.clearInfo()
			}
			return
		}
		
		if (tableData.value.length === 0) {
			isNothing.value = true
		}
		
		req.page = req.page + 1
		loading.value = false
		tableData.value = [...tableData.value, ...(res.result.data.data || [])]
		tableTotal.value = res.result.count_num || 0
		if (tableData.value.length >= tableTotal.value) {
			hasMore.value = false
		}
		console.log(tableData.value)
	} catch (e) {
		console.log(e)
	}
}

// 点击提示
const tabDec = (data: string) => {
	Common.showToast(data)
}

// tabbar 点击事件
const tabTap = (index: number) => {
	if (tabIndex.value !== index) {
		loading.value = true
		req.page = 0
		tableData.value = []
		isNothing.value = false
		tabIndex.value = index
		req.status = tabIndex.value + 1
		
		loadData()
	}
}

// 显示/隐藏弹窗
const show = () => {
	isShow.value = !isShow.value
}

const show1 = () => {
	isShow.value = !isShow.value
	Common.showToast('吃饭不易，感谢您的理解！谢谢！')
}

// 更新提现
const updateMoney = async (id: string) => {

	if (!noClick.value) {
		Common.showToast('请勿频繁点击')
		return
	}
	noClick.value = false
	
	if (!id) {
		noClick.value = true
		Common.showToast('参数缺失')
		return
	}
	
	if (!where.value.userid) {
		noClick.value = true
		Common.showToast('参数缺失')
		return
	}
	
	Common.showLoading('申请中...')
	
	let res = await uniCloud.callFunction({
		name: "ucenter",
		data: {
			action: 'updatedata/updateCftx',
			data: {
				id: id
			}
		}
	})
	console.log(res)
	
	if (res.result.code !== 0) {
		Common.showToast(res.result.message)
		if (res.result.code === 403) {
			Common.clearInfo()
		}
		noClick.value = true
		return
	}
	
	Common.showToast('申请成功')
	
	// 刷新列表
	const udb = ref({
		loadData: (clear: boolean, cb: Function) => {
			if (clear) {
				tableData.value = []
				isNothing.value = false
			}
			if (cb) cb()
		}
	})
	udb.value.loadData(true, () => {
		noClick.value = true
	})
}

// 是否可点击
const noClick = ref(true)



</script>

<style>

</style>