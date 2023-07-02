const express = require('express');
const AWS = require('aws-sdk');
const PORT = 3000;

const app = express();

app.use(express.json());

const creds = new AWS.SharedIniFileCredentials({ profile: 'default'})

const sns = new AWS.SNS({creds, region: 'us-east-2'});


app.get('/status', (req, res) => {
    res.send({status: "ok", sns});
});

app.post('/subscribe', (req, res) => {
    let params = {
        Protocol: 'EMAIL',
        TopicArn: 'arn:aws:sns:us-east-2:981957619155:test',
        Endpoint: req.body.email
    };

    sns.subscribe(params, (err, data) => {
        if(err) console.log(err);
        res.send({data});
    })
});

app.post("/publish", (req, res) => {
    let params = {
        Subject: req.body.subject,
        Message: req.body.message,
        TopicArn: 'arn:aws:sns:us-east-2:981957619155:test',
    };

    sns.publish(params, (err, data) => {
        if(err) console.log(err);
        res.send({data});
    })
});

app.listen(PORT, ()=>{
    console.log("App is listening on port", PORT);
})