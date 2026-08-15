<template>
	<view class="dflex justify-center align-center pa-30">
		<view class=" dflex flex-row justify-center align-center" v-if="loading">
			<image src="https://mp-ba2f31ba-46dc-47fe-abf6-70aa178a7c92.cdn.bspapp.com/static/loadings.gif" mode="widthFix" class="wh-35"></image>
			<text class="fs-23 fcolor-dark mar-l10">加载中...</text>
		</view>
		<view v-else>
			<text class="fs-23 fcolor-dark">{{hasMore ?'上拉加载更多':'触碰到底线了'}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			loading: Boolean,
			hasMore: Boolean
		},
		methods: {

		}
	}
</script>

<style>
</style>
