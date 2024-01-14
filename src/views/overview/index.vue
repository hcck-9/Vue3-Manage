<template>
  <breadCrumb ref="breadcrumb" :item="item"></breadCrumb>
  <div class="overview-wrapped">
    <!-- 顶部外壳 -->
    <div class="top-content-wrapped">
      <!-- 个人信息 -->
      <div class="person-infor">
        <!-- 头像区域 -->
        <div class="person-avatar-wrapped">
          <el-avatar :size="100" :src="userInfoData.imageUrl" />
          <span class="department">{{ userInfoData.department }}</span>
          <span class="company">123123123</span>
        </div>
        <!-- 分割线 -->
        <div class="line-wrapped">
          <span class="line"></span>
        </div>
        <!-- 详细信息区域 -->
        <div class="detail-infor-wrapped">
          <p>姓名：{{ userInfoData.name }}</p>
          <p>性别：{{ userInfoData.sex === 'man' ? '男' : '女' }}</p>
          <p>身份：{{ userInfoData.identity }}</p>
          <p>分管领域：超级管理员</p>
          <p>权限：最高权限</p>
        </div>
      </div>
      <!-- 管理员与用户比值饼状图pie 第一个类用于创建图例，第二个类修改样式 -->
      <div class="manage-user pie"></div>
    </div>
    <!-- 中间外壳 -->
    <div class="mid-content-wrapped">
      <!-- 产品类别图 为了与产品类别饼状图区分 加了个bar代表柱状图 -->
      <div class="product-category-bar mid-content-left"></div>
      <div class="mid-content-right">
        <div class="title">常用管理</div>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="button-area" @click="routerTo('user_user_list')">
              <SvgIcon
                icon-name="user"
                style="width: 24px; height: 24px"
                class="bread-crumb-icon"
              ></SvgIcon>
              <div class="buttom-name">用户管理</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="button-area" @click="routerTo('product_product_manage')">
              <SvgIcon
                icon-name="product"
                style="width: 24px; height: 24px"
                class="bread-crumb-icon"
              ></SvgIcon>
              <div class="buttom-name">产品管理</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="button-area" @click="routerTo('message_list')">
              <SvgIcon
                icon-name="notice"
                style="width: 24px; height: 24px"
                class="bread-crumb-icon"
              ></SvgIcon>
              <div class="buttom-name">系统消息</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="button-area" @click="routerTo('set')">
              <SvgIcon
                icon-name="me"
                style="width: 24px; height: 24px"
                class="bread-crumb-icon"
              ></SvgIcon>
              <div class="buttom-name">个人信息</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="button-area" @click="routerTo('set')">
              <SvgIcon
                icon-name="message"
                style="width: 24px; height: 24px"
                class="bread-crumb-icon"
              ></SvgIcon>
              <div class="buttom-name">部门信息</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="button-area" @click="routerTo('set')">
              <SvgIcon
                icon-name="set"
                style="width: 24px; height: 24px"
                class="bread-crumb-icon"
              ></SvgIcon>
              <div class="buttom-name">系统设置</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 下部分 footer 底部外壳 -->
    <div class="footer-content-wrapped">
      <!-- 消息等级图 -->
      <div class="massage-level footer-content-left"></div>
      <!-- 消息每日总量图 -->
      <div class="userlogin-week footer-content-right"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import breadCrumb from '../../components/bread-crumb.vue'
// 引入store
import { useUserInfoStore } from '@/store/userinfo.js'
const userInfoStore = useUserInfoStore()

import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { PieChart, LineChart, BarChart } from 'echarts/charts'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

// 在use方法中列出所有需要使用的组件和图表
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  PieChart,
  LineChart,
  BarChart,
  CanvasRenderer,
  LabelLayout,
  UniversalTransition
])

// 导入 SvgIcon
import SvgIcon from '@/components/SvgIcon.vue'
// 导入用户信息接口
import { getUserInfor } from '@/api/userinfo.js'

import {
  getCategoryAndNumber,
  getAdminAndNumber,
  getLevelAndNumber,
  getDayAndNumber
} from '@/api/ov.js'

import { useRouter } from 'vue-router'
const router = useRouter()

const routerTo = (x: string) => {
  router.push(`\/${x}`)
}
// 面包屑
const breadcrumb = ref()
const item = ref({
  first: '系统概览',
  second: null
})
// 用户信息部分
interface formData {
  imageUrl: string
  name: string
  sex: string
  department: string
  identity: string
}
const userInfoData: formData = reactive({
  imageUrl: '',
  name: '',
  sex: '',
  department: '',
  identity: ''
})
const getUserInfo = async () => {
  const res = await getUserInfor(localStorage.getItem('id'))
  userInfoData.imageUrl = res.data.image_url
  userInfoData.name = res.data.name
  userInfoData.sex = res.data.sex
  userInfoData.department = res.data.department
  userInfoData.identity = res.data.identity
}
getUserInfo()

// 调用echarts图
onMounted(() => {
  manageUser()
  productCategoryBar()
  massageLevel()
  massageAllDay()
})
// 管理员与用户比值图
const manageUser = async () => {
  // 通过类名 初始化
  const mu = echarts.init(document.querySelector('.manage-user'))
  mu.showLoading()
  const res = await getAdminAndNumber()
  const data = res.data.data
  mu.hideLoading()
  document.querySelector('.manage-user').setAttribute('_echarts_instance_', '')
  // 设置基本的参数
  mu.setOption({
    title: {
      text: '管理与用户对比图',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      padding: [20, 20, 20, 20]
    },
    series: [
      {
        // name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })
  // 用于echarts响应式
  window.addEventListener('resize', function () {
    mu.resize()
  })
}

// 产品类别图
const productCategoryBar = async () => {
  const pcb = echarts.init(document.querySelector('.product-category-bar'))
  pcb.showLoading()
  const res = await getCategoryAndNumber()
  const data = res.data
  pcb.hideLoading()
  document.querySelector('.product-category-bar').setAttribute('_echarts_instance_', '')
  pcb.setOption({
    title: {
      text: '产品类别库存总价图',
      top: '3%',
      textStyle: {
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      // 食品类，服装类，鞋帽类，日用品类，家具类，家用电器类，纺织品类，五金类
      data: data.category,
      axisLabel: {
        interval: 0 //代表显示所有x轴标签显示
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'bar',
        barWidth: 40,
        colorBy: 'data',
        data: data.price
      }
    ]
  })
  window.addEventListener('resize', function () {
    pcb.resize()
  })
}

// 公告等级分布图
const massageLevel = async () => {
  const ml = echarts.init(document.querySelector('.massage-level'))
  ml.showLoading()
  const res = await getLevelAndNumber()
  const data = res.data.data
  ml.hideLoading()
  document.querySelector('.massage-level').setAttribute('_echarts_instance_', '')
  ml.setOption({
    title: {
      text: '公告等级分布图',
      top: '1%',
      textStyle: {
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '10%',
      left: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['35%', '65%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data
      }
    ]
  })
  window.addEventListener('resize', function () {
    ml.resize()
  })
}
// 消息每日总量图
const massageAllDay = async () => {
  // // 底部日期的实现
  // let dd = new Date()
  // let week = []
  // for (let i = 1; i < 8; i++) {
  //   dd.setDate(dd.getDate() - 1)
  //   // 得到日期并且把斜杠替换成横杠
  //   week.push(dd.toLocaleDateString().replace(/\//g, '-'))
  // }

  // let number = []
  // week.forEach(async (e) => {
  //   // 如果在Moment中不加'YYYY-MM-DD'会提示警告
  //   let day = moment(e, 'YYYY-MM-DD').format('YYYY-MM-DD')
  //   // 调用每天登录人数的接口
  //   const res = await everydaynumberofpeople(day)
  //   number.push(res.number)
  // })
  const mad = echarts.init(document.querySelector('.userlogin-week'))
  mad.showLoading()
  const res = await getDayAndNumber()
  const data = res.data
  // console.log(data)
  mad.hideLoading()
  document.querySelector('.userlogin-week').setAttribute('_echarts_instance_', '')
  mad.setOption({
    title: {
      text: '每日登录人数图',
      top: '3%',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      type: 'category',
      data: data.week.reverse()
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: data.number.reverse(),
        type: 'line'
      }
    ]
  })
  window.addEventListener('resize', function () {
    mad.resize()
  })
}
</script>

<style lang="scss" scoped>
// 总览内容
.overview-wrapped {
  padding: 8px;
  height: calc(100vh - 101px);
  background: #f8f8f8;
  overflow: hidden;

  // 上部分内容 个人资料 + 饼状图
  .top-content-wrapped {
    height: 30%;
    display: flex;

    // 个人信息
    .person-infor {
      height: 100%;
      margin-right: 8px;
      width: calc(50% - 8px);
      display: flex;
      background: #fff;

      // 头像区域
      .person-avatar-wrapped {
        display: flex;
        width: 50%;
        height: 100%;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        // 公司
        .company {
          margin: 10px 0px;
          font-size: 12px;
        }

        // 职务
        .department {
          margin-top: 8px;
          font-size: 12px;
        }
      }

      // 分割线
      .line-wrapped {
        height: 100%;
        display: flex;
        align-items: center;

        .line {
          height: 170px;
          border: 1px solid #d3d3d3;
        }
      }

      // 详细信息区域
      .detail-infor-wrapped {
        height: 100%;
        width: calc(50% - 1px);
        margin-left: 50px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
      }
    }

    // 饼状图
    .pie {
      width: calc(50%);
      height: 100%;
      background: #fff;
    }
  }

  // 中间部分内容 消息阅读量图 产品类别图
  .mid-content-wrapped {
    margin-top: 8px;
    height: calc(32% - 8px);
    display: flex;

    // 中间左部分
    .mid-content-left {
      margin-right: 8px;
      width: calc(60% - 8px);
      background: #fff;
    }

    // 中间右部分
    .mid-content-right {
      width: calc(40%);
      background: #fff;
      padding: 8px;

      // 标题
      .title {
        font-size: 14px;
        margin-bottom: 8px;
      }

      // 按钮区域
      .button-area {
        margin-bottom: 6px;
        height: 70px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background: #f5f5f5;

        // 按钮名字
        .buttom-name {
          margin-top: 6px;
        }
      }

      // 按钮变色
      .button-area:hover {
        background: #e4efff;
      }
    }
  }

  // 底部内容
  .footer-content-wrapped {
    margin-top: 8px;
    height: calc(38% - 8px);
    display: flex;

    // 底部左部分
    .footer-content-left {
      margin-right: 8px;
      height: 100%;
      width: calc(30% - 8px);
      background: #fff;
    }

    // 底部右部分
    .footer-content-right {
      height: 100%;
      width: calc(70%);
      background: #fff;
    }
  }
}
</style>
