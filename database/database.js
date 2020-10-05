const Sequelize = require('sequelize')

const connection = new Sequelize('perguntasrespostas', 'root', 'root', {
    host: "localhost",
    dialect: "mysql"
})

module.exports = connection
