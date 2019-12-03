const db = require('./db.js')
const inquirer = require('inquirer');

const api = {
    add: async (title) => {
        //1. 读取之前的任务 add
        let list = await db.read()
        //2. 存title
        list.push({title, done:false})
        //3. 保存task到文件
        await db.write(list)

    },
    clear: async () => {
        await  db.write([])
    },
    showAll: async () => {
        let list = await db.read()
        printTasks(list)
    }
}
module.exports = api



function markAsDone(list,index) {
    list[index].done = true
    db.write(list)
}
function markAsUndone(list,index) {
    list[index].done = false
    db.write(list)
}
function changeTitle(list,index) {
    inquirer.prompt([{
        type: 'input',
        name: 'title',
        message: "新的标题",
        default: list[index].title
    }]).then(answer => {

        list[index].title = answer.title
        db.write(list)
    });
}
function deleteTask(list,index) {
    list.splice(index,1)
    db.write(list)
}

function selectActions(list,index) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: '请选择操作',
            choices: [
                { name: '退出', value: 'exit'},
                { name: '完成任务', value: 'markAsDone'},
                { name: '未完成', value: 'markAsUndone'},
                { name: '修改标题', value: 'changeTitle'},
                { name: '删除任务', value: 'deleteTask'},
            ]
        },
    ]).then(answer => {
        let actions = {markAsDone, markAsUndone, changeTitle, deleteTask}
        let action = actions[answer.action]
        action && action(list,index)
    })
}

function  createNewTask(list) {
    inquirer.prompt([{
        type: 'input',
        name: 'title',
        message: "创建新任务",
    }]).then(answer => {
        list.push({title: answer.title, done: false})
        db.write(list)
    });
}

function printTasks(list) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'index',
            message: '请选择你想操作的任务',
            choices: [{name: '退出',value: -1},...list.map((task,index) => {
                return { name: `${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`, value: index }
            }), {name: '创建新任务',value: -2},{name: '清空所有任务',value: -3}]
        },

    ])
        .then(answer => {
            if(answer.index >= 0) {
                //选择任务
                selectActions(list,answer.index)
            } else if (answer.index === -2) {
                //创建新任务
                createNewTask(list)

            } else if (answer.index === -3) {
                //清空所有任务
                db.write([])
            }else {
                // 退出
            }
        });
}
