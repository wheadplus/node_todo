const homedir = require('os').homedir()
const home = process.env.HOME || homedir; //用户设置home路径或默认home路径
const p = require('path') // 当前路径
const fs = require('fs') //读文件
const dbPath = p.join(home, '.todo') //

const db = {
    read(path = dbPath) {
        return new Promise((resolve, reject) => {
         fs.readFile(path, {flag: 'a+'},(error, data) => {
             if(error) return reject(error)
             let list
             try {
                 list = JSON.parse(data.toString())
             } catch (error) {
                 list = []
             }
             resolve(list)
         })
        })
    },
    write(list ,path = dbPath) {
        let string = JSON.stringify(list)
        return new Promise((resolve, reject) => {
            fs.writeFile(path, string , (error) => {
                if(error) return reject(error)
                resolve()
            })
        })

    }
}
module.exports = db

