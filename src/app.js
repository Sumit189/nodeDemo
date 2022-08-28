var express = require('express');
var app = express();
const cors = require('cors');
require('./db/mongoose')
var bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const UserEvaluations = require('./models/userEvaluation')
const Questions = require('./models/questions')
const Options = require('./models/options')

app.use(
    cors({
        origin: 'http://localhost:3000'
    }),
    bodyParser.json()
);


app.post('/onboarding', (req, res) => {
    if(!req.body.question || !req.body.answer){
        return res.status(400).send({message:"Bad Request"})
    }else{
        const question = parseInt(req.body.question)
        const answer = req.body.answer
        const evaluationRec = new UserEvaluations({question: question, answer: answer})
        evaluationRec.save().then(() =>{
            return res.status(200).send({ message: "Saved Successfully" })
        }).catch(err => {
            return res.status(400).send({message: err.message})
        })
    }
})

app.post('/setQuestion', (req, res) => {
    const content = req.body.content
    let ques_id
    Questions.count({},function (err, count) {
        if(!err){
            ques_id = count + 1
            const newQues = new Questions({content: content, ques_id: parseInt(ques_id)})
            newQues.save().then(() => {
                res.status(200).send({ message: "Ques Saved Successfully"})
            }).catch(err => {
                return res.status(400).send({ message: err.message })
            })
        }else{
            return res.status(400).send({ message: err.message})
        }
    })
})

app.get('/question', (req, res) => {
    if (!req.query.ques_id){
        return res.status(400).send({ message: "Invalid Request"})
    }
    const quesNum = parseInt(req.query.ques_id)
    Questions.findOne({ques_id: quesNum}).then(question => {
        return res.status(200).send({ question: question.content, input_type: question.input_type})
    }).catch(err => {
        return res.status(400).send({ message: err.message })
    })

})

app.post('/setOptions', (req, res)=>{
    const content = req.body.content
    const ques_id = req.body.ques_id
    let option_id = 1
    Options.count({},function (err, count) {
        if(!err){
            option_id = count + 1
            const newOption = new Options({content: content, ques_id: parseInt(ques_id), option_id: parseInt(option_id)})
            newOption.save().then(() => {
                res.status(200).send({ message: "Saved Successfully"})
            }).catch(err => {
                return res.status(400).send({ message: err.message })
            })
        }else{
            return res.status(400).send({ message: err.message})
        }
    })
})

app.get('/options', (req, res) => {
    if (!req.query.ques_id){
        return res.status(400).send({ message: "Invalid Request"})
    }
    const quesNum = parseInt(req.query.ques_id)
    Options.find({ques_id: quesNum}).then(options => {
        let resJSON = {};
        options.forEach(option =>{
            resJSON[option.option_id] = option.content
        })
        return res.status(200).send({ options: JSON.stringify(resJSON) })
    }).catch(err => {
        return res.status(400).send({ message: err.message })
    })

})

var server = app.listen(PORT, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Server listening on", host, port)
})