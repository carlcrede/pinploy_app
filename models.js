const { DataTypes, Model } = require("sequelize");
// Classes
class Task extends Model {}

Task.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    difficulty: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'task',
    timestamps: false
});


class SubTask extends Model {}

SubTask.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hours: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'subtask',
    timestamps: false
});

Task.hasMany(SubTask);
SubTask.belongsTo(Task, { constraints: false });

exports.Task = Task;
exports.SubTask = SubTask;