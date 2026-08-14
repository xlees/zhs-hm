<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import Common from '@/common/common'
import Api from '@/common/api.ts'
import { useUserAuthStore } from '@/store/user-auth'

const store_userAuth = useUserAuthStore()
const config = computed(() => this.$config)

const isxcx = ref(false)
const avatar = ref('')
const nickname = ref('')
const disabled = ref(false)
const name = ref('')
const alipay = ref('')
const tabIndex = ref(0)

// 初始化加载数据
onLoad((e) => {
  this.isxcx = uni.getStorageSync('isxcx') || false
  this.userinfo = this.store_userAuth.userinfo
  this.avatar = this.userinfo.avatar || ''
  this.nickname = this.userinfo.nickname || ''
  console.log('this.userinfo:', this.userinfo)
  this.getPay()
})

// 监听页面隐藏
onHide(() => {
  this.isxcx = false
})

// 获取支付宝支付信息
async getPay() {
  const obj = {
    name: this.$store.state.banben,
    action: 'getdata/getReal'
  }
  const res = await Api.cloudHttp(obj)
  console.log(res)
  
  if (res.result.code !== 0) {
    Common.showToast(res.result.message)
    if (res.result.code === 403) {
      Common.clearInfo()
    }
    return
  }
  
  const userinfo = res.result.user[0]
  this.alipay.value = userinfo.alipay || ''
  this.name.value = userinfo.name || ''
  
  if (userinfo.name) {
    this.disabled.value = true
  }
}

// tabbar 点击事件
tabtap(index: number) {
  if (this.tabIndex.value !== index) {
    if (index === 1) {
      Common.showToast('微信暂未开放')
      return
    }
    this.tabIndex.value = 0
  }
}

// 绑定支付宝
async addPay() {
  if (!this.noClick.value) {
    Common.showToast('请勿频繁点击')
    return
  }
  this.noClick.value = false
  
  if (!this.name.value) {
    this.noClick.value = true
    Common.showToast('姓名不能为空')
    return
  }
  
  if (!this.alipay.value) {
    this.noClick.value = true
    Common.showToast('支付宝不能为空')
    return
  }
  
  // 执行保存操作
  Common.showLoading('保存中...')
  const obj = {
    name: this.$store.state.banben,
    action: 'updatedata/updateAlipay',
    data: {
      name: this.name.value,
      alipay: this.alipay.value
    }
  }
  
  const res = await Api.cloudHttp(obj)
  console.log(res)
  
  if (res.result.code !== 0) {
    Common.showToast(res.result.message)
    if (res.result.code === 403) {
      Common.clearInfo()
    }
    this.noClick.value = true
    return
  }
  
  Common.showToast('绑定成功')
  this.getPay()
  this.noClick.value = true
}

// 定义响应式变量
const noClick = ref(true)

</script>

<template>
  <view>
    <view class="mar-30 pa-30 zcolor-while bor-r30 " v-if="isxcx">
      <view class="zcolor-while1  dflex flex-row align-center bor-r50 mar-30 mar-t60 pa-20" style="height: 60rpx;">
        <text class="fs-28 mar-l15 f-w  ">真实姓名：</text>
        <input class="fs-28 wh-50-250 mar-l15" :class="disabled ? 'fcolor-dark1' : ''" type="text" :disabled="disabled"
          v-model="name" placeholder="请输入真实姓名" />
      </view>
      <view class="zcolor-while1  dflex flex-row align-center bor-r50 mar-30 pa-20" style="height: 60rpx; margin-top: 60rpx;">
        <text class="fs-28 mar-l15 f-w  ">支付宝账号：</text>
        <input class="fs-28 wh-50-250 mar-l15" type="text" v-model="alipay" placeholder="请确认支付宝账户" />
      </view>
      <view class="mar-t60 dflex flex-row  align-center justify-center height-130">
        <view class=" dflex flex-row justify-center align-center  bor-r50 zcolor-black" @click="addPay" style="height: 95rpx;width: 580rpx; ">
          <text class="fs-30 fcolor-while f-w">{{disabled ? '修改信息' : '保存信息'}}</text>
          <view v-if="!noClick">
            <image src="https://mp-ba2f31ba-46dc-47fe-abf6-70aa178a7c92.cdn.bspapp.com/static/loading-s.gif" mode="widthFix" class="wh-45"></image>
          </view>
        </view>
      </view>
    </view>
    <view class="mar-30 pa-30 zcolor-while bor-r30 " v-else>
      <view class="zcolor-while1  dflex flex-row align-center bor-r50 mar-30 mar-t60 pa-20" style="height: 60rpx;">
        <text class="fs-28 mar-l15 f-w  ">微信头像：</text>
        <image :src="avatar" mode="aspectFill" class="wh-80 bor-r100"></image>
      </view>
      <view class="zcolor-while1  dflex flex-row align-center bor-r50 mar-30 pa-20" style="height: 60rpx; margin-top: 60rpx;">
        <text class="fs-28 mar-l15 f-w  ">微信昵称：{{nickname}}</text>
      </view>
    </view>
  </view>
</template>

<style>

</style>