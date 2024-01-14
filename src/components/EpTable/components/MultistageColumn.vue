<template>
  <el-table-column :label="column.label" :prop="column.label" v-bind="column">
    <template v-for="item in column.children">
      <MultistageColumn
        v-if="item.children && item.children.length"
        :column="item"
        :key="item.prop"
      >
      </MultistageColumn>
      <el-table-column v-else :key="item.id" v-bind="item" show-overflow-tooltip>
        <template v-if="item.slotName" v-slot="scope">
          <slot :name="item.slotName" :data="scope"></slot>
        </template>
      </el-table-column>
    </template>
  </el-table-column>
</template>

<script lang="ts">
export default defineComponent({
  name: 'MultistageColumn'
})
</script>

<script setup lang="ts">
import { defineProps, defineComponent } from 'vue'

// 定义组件接收的prop属性
defineProps({
  column: {
    type: Object,
    required: true
  }
})
</script>

<style scoped lang="scss"></style>
