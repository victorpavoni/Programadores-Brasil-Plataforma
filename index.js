const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

const cool = require('cool-ascii-faces');
const path = require('path');
const PORT = process.env.PORT || 5000;

express()
    .use(express.static(path.join(__dirname, 'assets')))
    .set('views', path.join(__dirname, 'assets'))
    .set('view engine', 'ejs')
    .get('/cool', (req, res) => res.send(cool()))
    .listen(PORT);

// Conectando com a DataBase
connection
    .authenticate()
    .then(() => {
        console.log('Db conectado com sucesso!');
    })
    .catch(err => {
        console.log(err);
    })

// Setando EJS


// Configuracao para usar arquivos estaticos (Estilos css, Javascript frontend, etc...)


// Configurando o body parser para pegar as informacoes do formulario
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Rotas
app.get("/", (req, res) => {
    // equivalente a SELECT * FROM perguntas
    Pergunta.findAll({
        raw: true, order: [
            ['id', 'DESC'] // ASC significa crescente || DESC significa decrescente
        ]
    }).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        })
    })
})
app.get("/perguntar", (req, res) => {
    res.render("perguntar")
})
app.post("/salvarpergunta", (req, res) => {
    // a tag "body" eh gracas ao body-parser
    let titulo = req.body.titulo
    let descricao = req.body.descricao

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/")
    })
})

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id
    Pergunta.findOne({
        where: { id: id }
    }).then(pergunta => {
        if (pergunta != undefined) {
            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order: [
                    ['id', 'DESC']
                ]
            }).then(resposta => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: resposta
                })
            })
        } else {
            res.render("404")
        }
    })
})

app.post("/responder", (req, res) => {
    let corpo = req.body.corpo
    let perguntaId = req.body.perguntaId

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId)
    })
})

app.listen(process.env.PORT || 3000)