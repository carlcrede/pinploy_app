const { Sequelize } = require('sequelize');
const express = require('express');
const app = express();

app.use(express.json());

// set up db connection
sequelize = new Sequelize('mysql://localhost:3306/pinploy', {
    host: 'localhost',
    dialect: 'mysql',
    username: 'root',
    password: 'root'
});

// sync models to db - and populate with data
let sync = sequelize.sync({ force: true });
sync.then(() => populateDB());


// set port
const port = Number(process.env.PORT, 10) || 8080;
app.set('port', port);

// start server
app.listen(port, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server running on', port);
    }
});


const { Task, SubTask } = require("./models");

function populateDB () {
    console.log('Adding data to db');
    Task.create({ title: 'House chores', difficulty: 'medium' });
    Task.create({ title: 'Car maintenance', difficulty: 'hard' });

    SubTask.create({ title: 'Vacuum all rooms', hours: 2.5, taskId: 1 });
    SubTask.create({ title: 'Take out the trash', hours: 99, taskId: 1 });
    SubTask.create({ title: 'Assemble IKEA furniture', hours: 4, taskId: 1 });
    SubTask.create({ title: 'Change oil', hours: 2.5, taskId: 2 });
    SubTask.create({ title: 'Take car to the carwash', hours: 1, taskId: 2 });
}


// routing + controller

// POST /tasks
app.post('/tasks', (req, res) => {
    const task = {
        title: req.body.title,
        difficulty: req.body.difficulty
    };
    Task.create(task)
        .then(data => {
            res.send({ data: data });
        })
        .catch(error => {
            res.status(500).send({ error: error.message });
        });
});

// POST /subtasks
app.post('/subtasks', (req, res) => {
    const subtask = {
        title: req.body.title,
        hours: req.body.hours,
        taskId: req.body.taskId
    };
    SubTask.create(subtask)
        .then(data => {
            res.send({ data: data });
        })
        .catch(error => {
            res.status(500).send({ error: error.message });
        });
});

// GET /tasks
app.get('/tasks', (req, res) => {
    const tasks = Task.findAll({ include: SubTask });
    tasks.then(data => {
        res.send({ data: data });
    });
});

// GET /tasks/id
app.get('/tasks/:id', (req, res) => {
    const id = req.params.id;
    Task.findByPk(id, { include: SubTask })
        .then(data => {
            res.send({ data: data });
        })
        .catch(error => {
            res.status(500).send({ error: error.message, message: "Error getting task id=", id });
        });
});

// GET /subtasks
app.get('/subtasks', (req, res) => {
    const subTasks = SubTask.findAll({ include: Task });
    subTasks.then(data => {
        res.send({ data: data });
    });
});

// GET /subtasks/id
app.get('/subtasks/:id', (req, res) => {
    const id = req.params.id;
    SubTask.findByPk(id)
        .then(data => {
            res.send({ data: data });
        })
        .catch(error => {
            res.status(500).send({ error: error.message, message: "Error getting subtask id=", id });
        });
});

// UPDATE /tasks/id
app.put('/tasks/:id', (req, res) => {
    const id = req.params.id;
    Task.update(req.body, {
        where: { id: id }
    })
    .then(data => {
        if (data) {
            res.send({ message: "Task updated"});
        } else {
            res.send({ message: `Error updating task id=${id}` });
        }
    })
    .catch(error => {
        res.send({ error: error.message });
    });
});

// UPDATE /subtasks/id
app.put('/subtasks/:id', (req, res) => {
    const id = req.params.id;
    SubTask.update(req.body, {
        where: { id: id }
    })
    .then(data => {
        if (data) {
            res.send({ message: "Subtask updated"});
        } else {
            res.send({ message: `Error updating subtask id=${id}` });
        }
    })
    .catch(error => {
        res.send({ error: error.message });
    });
});

// DELETE /tasks/id
app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;
    Task.destroy(
        { where: { id: id }
    })
        .then(data => {
            if (data) {
                res.send({ message: `Task id=${id} deleted`});
            } else {
                res.send({ message: `Task id=${id} could not be deleted`});
            }
        })
        .catch(error => {
            res.status(500).send({ error: error.message });
        });
});

// DELETE /subtasks/id
app.delete('/subtasks/:id', (req, res) => {
    const id = req.params.id;
    SubTask.destroy(
        { where: { id: id }
    })
        .then(data => {
            if (data) {
                res.send({ message: `SubTask id=${id} deleted`});
            } else {
                res.send({ message: `SubTask id=${id} could not be deleted`});
            }
        })
        .catch(error => {
            res.status(500).send({ error: error.message });
        });
});