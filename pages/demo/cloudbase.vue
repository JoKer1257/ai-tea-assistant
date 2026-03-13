<template>
  <view class="demo-page">
    <view class="section">
      <text class="title">CloudBase 功能演示</text>
    </view>

    <!-- 用户信息 -->
    <view class="section">
      <text class="label">用户 OpenID:</text>
      <text class="value">{{ openid || '点击获取' }}</text>
      <button @click="getOpenId" size="mini">获取 OpenID</button>
    </view>

    <!-- 数据库操作 -->
    <view class="section">
      <text class="label">数据库测试:</text>
      <button @click="addData" size="mini">添加数据</button>
      <button @click="getData" size="mini">查询数据</button>
    </view>

    <!-- 后端 API -->
    <view class="section">
      <text class="label">后端 API:</text>
      <button @click="callApi" size="mini">调用 API</button>
      <text class="value">{{ apiResult }}</text>
    </view>

    <!-- 结果显示 -->
    <view class="result" v-if="result">
      <text class="label">执行结果:</text>
      <text class="value">{{ result }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { db, auth, api } from '@/utils/cloudbase.js'

const openid = ref('')
const result = ref('')
const apiResult = ref('')

// 获取用户 OpenID
const getOpenId = async () => {
  try {
    const id = await auth.getOpenId()
    openid.value = id
    result.value = `OpenID: ${id}`
  } catch (e) {
    result.value = `获取失败: ${e.message}`
  }
}

// 添加数据到数据库
const addData = async () => {
  try {
    const res = await db.add('demo_collection', {
      name: '测试数据',
      time: new Date().toLocaleString(),
      openid: openid.value
    })
    result.value = `添加成功: ${JSON.stringify(res)}`
  } catch (e) {
    result.value = `添加失败: ${e.message}`
  }
}

// 查询数据库
const getData = async () => {
  try {
    const data = await db.get('demo_collection', {
      limit: 10,
      orderBy: { field: 'time', order: 'desc' }
    })
    result.value = `查询结果: ${JSON.stringify(data)}`
  } catch (e) {
    result.value = `查询失败: ${e.message}`
  }
}

// 调用后端 API
const callApi = async () => {
  try {
    const res = await api.get('/health')
    apiResult.value = JSON.stringify(res)
  } catch (e) {
    apiResult.value = `调用失败: ${e.message}`
  }
}
</script>

<style scoped>
.demo-page {
  padding: 30rpx;
}

.section {
  margin-bottom: 30rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 12rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.label {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 10rpx;
}

.value {
  font-size: 24rpx;
  color: #999;
  word-break: break-all;
}

button {
  margin-top: 10rpx;
}

.result {
  margin-top: 30rpx;
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
}
</style>
