'use strict';

const express = require('express');
const cors = require('cors');
const fs = require('fs')

const app = express();
app.use(cors({
    origin: 'http://localhost:4200'
  }));
app.use(express.json({ limit: '10MB' }));

app.post('/task/save', function(req, res) {
    const task = req.body.task;
    if (!task) {
        res.status(400).end();
    }
    try {
        storeTask(task);
        return res.status(200).json();
    } catch(err) {
        return res.status(400).json();
    }
    
});

app.get('/task', (req, res) => {
    getTask().then(data => {
        res.status(200).json({tasks: data});
    }).catch(err => res.status(400).end());
});

app.delete('/delete/:taskIndex', (req, res) => {
    const taskIndex = req.params.taskIndex;
    deleteTask(taskIndex).then(data => res.status(200).end()).catch(err => res.status(400).end());
});

app.use('/*', (req, res) => {
    res.status(404).end();
});

function storeTask(task) {
    fs.appendFile('task.txt', task + '*', function (err,data) {
        if (err) {
          return err;
        }
        console.log(data);
      });
}

function getTask() {
    return new Promise ((resolve, reject) => {
        fs.readFile('task.txt', 'utf8', function(err, data){
            if (err) {
                console.log('errrrrr')
                reject(err);
            } else {
                console.log('readdddd')
                resolve(data);
            }
        });
    });
}

function deleteTask(num) {
  return  new Promise ((resolve, reject) => {
        getTask().then(data => {
            const arrayData = data.split('*');
            console.log(arrayData, num, '---->1')
            arrayData.splice(num, 1);
            console.log(arrayData, '---->2')
            return arrayData.join('*');
        }).then(data => {
            fs.writeFile('task.txt', data, function (err,data) {
                if (err) {
                  throw err;
                }
                resolve(data);
              });
        }).catch(err => {
            reject(err);
        });
    });
}

app.listen(process.env.HTTP_PORT || 3001, () => { console.log ('node server running in port 3001')});