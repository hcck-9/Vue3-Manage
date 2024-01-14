<template>
  <el-button :type="type" @click="handleClick" :loading="loading" :disabled="disabled">{{
    title
  }}</el-button>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  type: String,
  handleClick: Function,
  loading: Boolean,
  disabled: {
    type: Boolean,
    defaults: false
  }
})
</script>

<style scoped lang="scss"></style>
