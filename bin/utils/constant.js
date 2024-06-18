const promptList = [
    {
        type: 'list',
        name: 'framework',
        message: '请选择组件框架',
        choices: [
          { title: 'vue', value: 'vue' },
        ],
    },
    {
        type: 'list',
        name: 'frameworkVersion',
        message: '请选择框架版本',
        choices: [
          { title: 'vue3.0', value: 'vue3.0' },
        ],
    },
    {
        type: 'list',
        name: 'type',
        message: '请选择组件模板',
        choices: [
          { title: 'sfc', value: 'sfc' },
          { title: 'tsx', value: 'tsx' },
        ],
    }
]

module.exports = {
    promptList,
}