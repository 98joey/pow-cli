#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk'); //命令行输出样式美化
const { program } = require('commander'); //命令行工具
const inquirer = require('inquirer'); //命令行交互
const { checkDir } = require('./utils/component.js');
const { exec } = require('child_process');
const { promptList }  = require('./utils/constant')
const { getCreatedFiles, addComponent, checkComponentName } = require('./utils/component')
const packageContent = fs.readFileSync(
    path.resolve(__dirname, '../package.json'),
    'utf8',
  )
  const packageData = JSON.parse(packageContent)

function resolve(dir){
    return path.join(__dirname, '..', dir)
}

program.version(packageData.version || '1.0.0', '-v,--version')

program.command('init [componentName]')
.alias('i')
.description('输入组件名称，初始化组件模板')
.action(async (componentName, cmd) => {
    if(!componentName) {
        promptList.unshift({
            type: 'input',
            message: '请输入组件名称',
            name: 'componentInputName',
            validate: (val) => {
                if(val === '') {
                    return '组件名称不能为空'
                }
                return true
            }
        })
    } else {
        await checkDir(path.join(process.cwd(), `src/${componentName}`), componentName); //检测创建组件文件夹是否存在
    }
    inquirer.prompt(promptList).then((result) => {
        const { componentInputName, framework, frameworkVersion, type } = result;
        componentName = componentName || componentInputName;
        checkComponentName(componentName)   
        addComponent(componentName, type)
    })
})
    
program.parse(process.argv);