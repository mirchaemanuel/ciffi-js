const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const ConfigFile = require(path.resolve(process.cwd(), '.ciffisettings'))
const input = require(ConfigFile.general.designTokenInputFile)

const transformNodes = input => {
  return Object.keys(input).map(node => {
    return Object.keys(input[node]).map(item => {
      if (typeof input[node][item] !== 'object') {
        return `$${node}-${item}: ${input[node][item]};\n`
      }
    })
  })
}

const writeFile = input => {
  if (!ConfigFile.general.designToken) {
    return
  }
  const result = transformNodes(input)
    .join(',')
    .replace(/,/g, '')
    .replace(/' /g, "', ")
  fs.writeFile(
    path.normalize(ConfigFile.general.designTokenOutputFile),
    result,
    err => {
      if (err) {
        return console.log(err)
      }

      console.log(
        chalk.blue(
          `🦄 Design token file ${
            ConfigFile.general.designTokenOutputFile
          } generated`
        )
      )
    }
  )
}

writeFile(input)