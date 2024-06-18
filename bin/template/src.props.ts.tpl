import type { ExtractPropTypes } from 'vue'

export const <%= camelCaseName %>Props = {
  /**
   * 类型定义
   */
  type: String,
}

export type <%= pascalCaseName %>Props = ExtractPropTypes<typeof <%= camelCaseName %>Props>
