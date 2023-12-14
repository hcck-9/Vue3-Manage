<template>
  <breadCrumb ref="breadcrumb" :item="item"></breadCrumb>
  <!-- 首页 -->
  <div class="home-wrapped">
    <!-- 轮播图 -->
    <div class="swiper-wrapped">
      <el-carousel :interval="4000" indicator-position="outside" type="card" height="240px">
        <el-carousel-item v-for="(item, index) in imageUrl" :key="index">
          <img :src="imageUrl[index]" class="swiper" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 栅格布局 -->
    <div class="layout-wrapped">
      <el-row :gutter="20">
        <el-col
          :span="6"
          v-for="(item, index) in companyIntroduceData"
          @click="openIntroduce(item.id)"
        >
          <div class="company-message-area">
            <span>{{ item.set_name }}</span>
            <div v-html="item.set_text" class="company-introduce"></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格外壳 -->
    <div class="two-table-wrapped">
      <!-- 公司公告 -->
      <div class="company-notice">
        <span class="title">公司公告</span>
        <el-table
          :data="companyTableData"
          style="width: 100%"
          :show-header="false"
          @row-dblclick="openCompany"
        >
          <el-table-column prop="message_title" label="公告主题" />
          <el-table-column prop="message_level" label="公告等级" width="100">
            <template #default="{ row }">
              <el-tag class="ml-2" v-if="row.message_level === '一般'">一般</el-tag>
              <el-tag class="ml-2" type="success" v-else-if="row.message_level === '重要'"
                >重要</el-tag
              >
              <el-tag class="ml-2" type="warning" v-else-if="row.message_level === '必要'"
                >必要</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="message_publish_department" label="公告发布部门" />
          <el-table-column property="message_publish_time" label="发布时间">
            <template #default="{ row }">
              <div>{{ row.message_publish_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 系统消息 -->
      <div class="system-message">
        <span class="title">系统消息</span>
        <el-table
          :data="systemTableData"
          style="width: 100%"
          :show-header="false"
          @row-dblclick="openSystem"
        >
          <el-table-column prop="message_title" label="消息主题" />
          <el-table-column property="message_publish_time" label="发布时间">
            <template #default="{ row }">
              <div>{{ row.message_publish_time?.slice(0, 10) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <introduce ref="intro"></introduce>
  <commonmsg ref="commonMsg"></commonmsg>
</template>

<script setup lang="ts">
import { ref, toRaw } from 'vue'
import breadCrumb from '@/components/bread-crumb.vue'
import { getAllSwiper, getAllCompanyIntroduce } from '@/api/setting.js'
import { companyMessageList, systemMessageList } from '@/api/message.js'

import { bus } from '@/utils/mitt.js'
import introduce from './components/introduce.vue'
import commonmsg from '@/components/common_msg.vue'
// 面包屑
const breadcrumb = ref()
const item = ref({
  first: '首页',
  second: null
})

// 轮播图
const imageUrl = ref([])
// 获取所有轮播图
const getAllswiper = async () => {
  const res = await getAllSwiper()
  imageUrl.value = res.data
}
getAllswiper()

// 公司信息数据
const companyIntroduceData = ref([])

const getAllCompanyintroduce = async () => {
  const res = await getAllCompanyIntroduce()
  companyIntroduceData.value = res.data
  // console.log(companyIntroduceData.value)
}
getAllCompanyintroduce()

// 弹窗
const intro = ref()
// 获取弹窗
const openIntroduce = (id: number) => {
  // 第一个参数是标记，第二个是参数
  bus.emit('introduce', id)
  intro.value.open()
}

// 弹窗
const commonMsg = ref()
// 获取弹窗
const openCompany = (row: any) => {
  row = toRaw(row)
  // 第一个参数是标记，第二个是参数
  bus.emit('msgCompanyRow', row)
  commonMsg.value.open()
}
// 获取弹窗
const openSystem = (row: any) => {
  row = toRaw(row)
  // 第一个参数是标记，第二个是参数
  bus.emit('msgSystemRow', row)
  commonMsg.value.open()
}

const companyTableData = ref([])

const getCompanyTableData = async () => {
  const res = await companyMessageList()
  companyTableData.value = res.data
}
getCompanyTableData()

const systemTableData = ref([])
const getSystemTableData = async () => {
  const res = await systemMessageList()
  // console.log(res.data)
  systemTableData.value = res.data
}
getSystemTableData()
</script>

<style scoped lang="scss">
@mixin table-class {
  height: 232px;
  width: 48%;
  display: flex;
  flex-direction: column;
}

// 首页外壳
.home-wrapped {
  padding: 8px;
  height: calc(100vh - 101px);
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  // overflow: hidden;

  // 轮播图外壳
  .swiper-wrapped {
    padding: 0 20px;
    background: #fff;
    margin-bottom: 8px;

    .swiper {
      width: 100%;
      height: 100%;
    }
  }

  // 栅格布局外壳
  .layout-wrapped {
    padding: 8px;
    margin-bottom: 8px;
    background: #fff;

    // 公司信息区域
    .company-message-area {
      background: #f5f5f5;
      height: 150px;
      padding: 8px;
      cursor: pointer;

      span {
        border-bottom: 1px solid #409eff;
        font-size: 14px;
      }

      .company-introduce {
        margin-top: 4px;
        text-indent: 24px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 3;
        display: -webkit-box;
        -webkit-box-orient: vertical;
      }
    }

    .company-message-area:hover {
      cursor: pointer;
      background-color: #eef5ff;
    }
  }

  // 表格外壳
  .two-table-wrapped {
    height: 232px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: #fff;

    // 公司公告
    .company-notice {
      @include table-class;
    }

    // 系统消息
    .system-message {
      @include table-class;
    }

    .title {
      font-size: 14px;
      margin-bottom: 5px;
      border-bottom: 1px solid #ea0709;
    }
  }
}

.message_title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

// 轮播图默认样式
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
