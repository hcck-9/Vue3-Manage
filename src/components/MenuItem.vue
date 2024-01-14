<template>
  <el-menu-item :index="menu.path" v-if="!menu.group">
    <el-icon>
      <component :is="menu.icon" />
    </el-icon>
    <span>{{ menu.meta.title }}</span>
  </el-menu-item>
  <el-sub-menu v-else :index="menu.meta.title">
    <template #title>
      <el-icon>
        <component :is="menu.icon" />
      </el-icon>
      <span>{{ menu.meta.title }}</span>
    </template>
    <template v-for="subMenu in menu.group">
      <el-menu-item-group :title="subMenu.title">
        <template v-for="subMenuChild in subMenu.children">
          <el-menu-item :index="subMenuChild.path">{{ subMenuChild.meta.title }}</el-menu-item>
        </template>
      </el-menu-item-group>
    </template>
  </el-sub-menu>
</template>

<script setup lang="ts">
defineProps({
  menu: Object
})
</script>

<style scoped lang="scss">
.el-menu-item,
.el-sub-menu {
  color: #fff;
}
:deep(.el-sub-menu__title) {
  color: #fff;
}
:deep(.el-menu-item:hover) {
  // 有子菜单的
  background: #032552;
}
:deep(.el-sub-menu__title:hover) {
  background: #032552;
}

.el-menu-item.is-active {
  background: #006eff !important ;
}
</style>
