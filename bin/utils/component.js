
const fs = require('fs/promises');
const fsSync = require('fs');
const chalk = require('chalk');
const path = require('path');
const _ = require('lodash');

/**
 * 根据路径创建文件夹和文件
 * @param {*} filepath
 * @param {*} data
 */
const createFile = async (filepath, data) => {
  const dir = path.dirname(filepath);
  if (!fsSync.existsSync(dir)){
    await fs.mkdir(dir, { recursive: true });
  }
  await fs.writeFile(filepath, data, (err) => {});
}


/**
 * 校验组件名称是否符合短横线命名
 */
const checkComponentName = (name) => {
  if(!/^[a-z][a-z|-]*[a-z]$/.test(name)) {
    console.log(chalk.red(
      `The ${name} Component name is not valid. Please use a valid component name`
    ));
    process.exit(1);
  }
}

/**
 * 校验组件是否已存在
 * @param {*} dir 
 * @param {*} name 
 */
function checkDir(dir,name) {
  let isExists = fsSync.existsSync(dir);
  if (isExists) {
    console.log(chalk.red(
      `The ${name} Component already exists in  directory. Please try to use another component name`
    ));
    process.exit(1);
  } else {
     console.log(chalk.green(`The ${name} Component is available`))
  }
};

/**
 * 获取需要创建的文件
 */
const getCreatedFiles = (name, type) => {
  return [
    {
      file: 'index.ts',
      template: 'index.ts.tpl',
    },
    {
      file: 'README.md',
      template: 'README.md.tpl',
    },
    {
      file: 'src/props.ts',
      template: 'src.props.ts.tpl',
    },
    type === 'tsx'
      ? {
          file: `src/${name}.tsx`,
          template: 'src.component.tsx.tpl',
        }
      : {
          file: `src/${name}.vue`,
          template: 'src.component.vue.tpl',
        },
    {
      file: 'style/index.scss',
      template: 'style.index.scss.tpl',
    },
    {
      file: 'style/index.ts',
      template: 'style.index.ts.tpl',
    },
    {
      file: 'style/scss.ts',
      template: 'style.scss.ts.tpl',
    },
    {
      file: '__demos__/basic.vue',
      template: '__demos__.basic.vue.tpl',
    },
    {
      file: `__tests__/${name}.test.tsx`,
      template: '__tests__.component.test.tsx.tpl',
    },
  ]
}

/**
 * 更新全局导入
 * @param {*} name  
 */

const fineIndex = (lines, fuzzy) => {
  let lastIndex = -1
  lines.forEach((line, index) => {
    if (line.includes(fuzzy)) {
      lastIndex = index
    }
  })
  return lastIndex
}
const updateGlobalImport = async (name) => {
  const componentName = _.upperFirst(_.camelCase(name))
  const indexPath = path.resolve(process.cwd(), 'src/index.ts')
  if(!fsSync.existsSync(indexPath)) {
    console.log(chalk.red('The index.ts file does not exist in the src directory'))
    process.exit(1)
  }
  let data = await fs.readFile(indexPath, 'utf-8')
  const lines = data.split('\n')
  const importIndex = fineIndex(lines, 'import {')
  const exportIndex = fineIndex(lines, 'export * from')
  const importStr = `import { ${componentName} } from './${name}'`
  const exportStr = `export * from './${name}'`
  lines.splice(importIndex + 1, 0, importStr)
  lines.splice(exportIndex + 2, 0, exportStr)
  const componentIndex = fineIndex(lines, 'const components = [')
  const componentsStr = `  ${componentName},`
  lines.splice(componentIndex + 1, 0, componentsStr)
  data = lines.join('\n')
  await fs.writeFile(indexPath, data)
}

/**
 * 添加一个组件
 */
const addComponent = async (name, type) => {
  getCreatedFiles(name, type).forEach(async (item) => {
    // 读取模板
    const tplPath = path.resolve(__dirname, `../template/${item.template}`)
    let data = await fs.readFile(tplPath, 'utf-8', (err, data) => {
      if (err) {
        console.log(chalk.red(err))
        process.exit(1)
      }
      return data
    })

    // 编译模板
    // console.log('rowData:', data)
    const compiled = _.template(data)
    data = compiled({
      name,
      type,
      camelCaseName: _.camelCase(name),
      pascalCaseName: _.upperFirst(_.camelCase(name)),
    })

    // 输入模板
    const outputPath = path.resolve(process.cwd(), `src/${name}/${item.file}`)
    // console.log('data:', data)
    await createFile(outputPath, data)
    console.log(`已创建：${outputPath}`)
  })

  updateGlobalImport(name)
}




module.exports = {
  checkDir,
  checkComponentName,
  getCreatedFiles,
  addComponent,
}