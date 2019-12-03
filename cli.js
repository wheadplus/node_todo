const program = require('commander');
const api = require('./index.js')

program
    .option('-r, --recursive', 'Remove recursively')
program
    .command('add')
    .description('add a task')
    .action((...args) => {
        if(args[1]) {
            const words = args[1].join(' ')
            api.add(words).then(() => {console.log('添加成功'),()=> {console.log('添加失败')}})
        }

    });
program
    .command('clear')
    .description('clear all task')
    .action(() => {
        api.clear().then(() => {console.log('清空成功'),()=> {console.log('清空失败')}})

    });

program.parse(process.argv)
if(process.argv.length === 2) {
    api.showAll()
}
