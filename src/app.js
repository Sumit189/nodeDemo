var express = require('express');
var app = express();
const cors = require('cors');
require('./db/mongoose')
var bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const UserEvaluations = require('./models/userEvaluation')
const Questions = require('./models/questions')
const Options = require('./models/options')
const Users = require('./models/users')

app.use(
    cors({
        // origin: 'http://localhost:3001'
        origin: 'https://react-demo-wysa.herokuapp.com'
    }),
    bodyParser.json()
);

app.post('/signin', (req, res) => {
    if(!req.body.username || !req.body.password){
        return res.status(404).send({message: 'Invalid username or password'})
    }else{
        username = req.body.username
        Users.findOne({username: username}, (err, user) => {
            if(err){
                return res.status(404).send({message: ''})
            }
            else{
                if(user.password === req.body.password){
                    return res.status(200).send({message: 'User found', user: user})
                }else{
                    return res.status(400).send({message: 'Incorrect Password'})
                }
            }
        })
    }
})

app.post('/signup', (req, res) => {
    if(!req.body.username || !req.body.password){
        return res.status(404).send({message: 'Invalid username or password'})
    }else{
        username = req.body.username
        const user = new Users(req.body)
        user.save().then(()=>{
            return res.status(200).send({message: "User Created", user: user })
        }).catch(err => {
            console.log(err)
            return res.status(400).send({message: err.message})
        })
    }
})


app.post('/onboarding', (req, res) => {
    if(!req.body.question || !req.body.answer){
        return res.status(400).send({message:"Bad Request"})
    }else{
        const question = parseInt(req.body.question)
        const answer = req.body.answer
        const evaluationRec = new UserEvaluations({question: question, answer: answer, user_id: req.user_id})
        evaluationRec.save().then(() =>{
            return res.status(200).send({ message: "Saved Successfully" })
        }).catch(err => {
            return res.status(400).send({message: err.message})
        })
    }
})

app.post('/setQuestion', (req, res) => {
    const content = req.body.content
    const ques_id = req.body.ques_id
    const input_type = req.body.input_type
    if(content && ques_id && input_type){
        const newQues = new Questions(req.body)
        newQues.save().then(() => {
            res.status(200).send({ message: "Ques Saved Successfully"})
        }).catch(err => {
            return res.status(400).send({ message: err.message })
        })
    }else{
        return res.status(400).send({ message: "Invalid Input"})
    }
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
    const option_id = req.body.option_id
    if(content && ques_id && option_id){
        const newOption = new Options({content: content, ques_id: parseInt(ques_id), option_id: parseInt(option_id)})
        newOption.save().then(() => {
            res.status(200).send({ message: "Saved Successfully"})
        }).catch(err => {
            return res.status(400).send({ message: err.message })
        })
    }else{
        return res.status(400).send({ message: "Invalid Input"})
    }
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