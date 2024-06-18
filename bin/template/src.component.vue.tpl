<template>
  <div :class="bem()"><%= pascalCaseName %></div>
</template>

<script lang="ts" setup>
import { <%= camelCaseName %>Props } from './props'

defineOptions({
  name: '<%= pascalCaseName %>',
})

defineProps(<%= camelCaseName %>Props)
</script>
