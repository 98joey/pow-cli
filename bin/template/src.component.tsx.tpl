import { defineComponent, useAttrs, useSlots } from 'vue'
import { <%= pascalCaseName %> } from '@arco-design/web-vue'
// import { <%= camelCaseName %>Props } from './props'

export default defineComponent({
  name: '<%= pascalCaseName %>',

  // props: <%= camelCaseName %>Props,

  // emits: ['click'],

  setup() {
    const attrs = useAttrs()
    const slots = useSlots()

    return () => <<%= pascalCaseName %> {...attrs} v-slots={slots}></<%= pascalCaseName %>>
  },
})
