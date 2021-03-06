"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const sendMessage = require('../amqp/emit_payload_topic');
const receiveMessage = require('../amqp/receive_payload_topic');

const asyncMiddleware = require('../utils/asyncMiddleware');

const router = express.Router();
router.use(bodyParser.json());

router.get('/', asyncMiddleware( async (req, res) => {
    let routingKey = req.query["routingKey"];
    if (typeof routingKey == 'undefined')
        throw Error("rountingKey should not be empty");

    receiveMessage(routingKey);
}));

router.post('/', asyncMiddleware(async(req,res) =>{
    let gitlabProvider = req.get('x-gitlab-event');
    let githubProvider = req.get('x-github-event');

    if(githubProvider !== undefined){
        let branchName = req.body.ref.toString().split('/').pop();
        var payload = {
            repository: {
                fullname: req.body.repository.full_name,
                name: req.body.repository.name,
                url: req.body.repository.url,
                clone_url: req.body.repository.clone_url,
                default_branch: req.body.repository.default_branch
            },
            commits: [ ],
            branch: branchName,
            user: {
                username: req.body.pusher.name,
                email: req.body.pusher.email,
                avatar: req.body.sender.avatar_url
            },
            timestamp: Date.now()
        };
        req.body.commits.forEach(element => payload.commits.push(element));
    }

    else if(gitlabProvider !== undefined){
        let branchName = req.body.ref.toString().split('/').pop();
        var payload = {
            repository: {
                fullname: req.body.project.path_with_namespace,
                name: req.body.project.name,
                url: req.body.project.web_url,
                clone_url: req.body.project.http_url,
                default_branch: req.body.project.default_branch
            },
            commits: [ ],
            branch: branchName,
            user: {
                username: req.body.user_username,
                email: req.body.user_email,
                avatar: req.body.user_avatar
            },
            timestamp: Date.now()
        };
        req.body.commits.forEach(element => payload.commits.push(element));
    }
    else{
        let cloneUrl = "https://" + req.body.repository.workspace.slug + "@bitbucket.org/" + req.body.repository.workspace.slug + "/" + req.body.repository.name + ".git"; 
        let branchName = req.body.push.changes[0].new.name;
        var payload = {
            repository: {
                fullname: req.body.repository.full_name,
                name: req.body.repository.name,
                url: req.body.repository.links.html.href,
                clone_url: cloneUrl,
                default_branch: null,
            },
            commits: [ ],
            branch: branchName,
            user: {
                username: req.body.actor.nickname,
                email: null,
                avatar: req.body.actor.links.avatar.href
            },
            timestamp: Date.now()
        };
        req.body.push.changes[0].commits.forEach(element => payload.commits.push(element));
    }

    if (typeof payload == 'undefined')
        throw Error("payload should not be empty");

    sendMessage("webhook.payload", payload,async (err, response) => {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.status(200).json(response);
        }
    });

}));

router.post('/github', asyncMiddleware(async(req, res) => {
    console.log("Request from github received : ", req.body);
    let branchName = req.body.ref.toString().split('/').pop();
    let payload = {
        repository: {
            fullname: req.body.repository.full_name,
            name: req.body.repository.name,
            url: req.body.repository.url,
            clone_url: req.body.repository.clone_url,
            default_branch: req.body.repository.default_branch
        },
        commits: [ ],
        branch: branchName,
        user: {
            username: req.body.pusher.name,
            email: req.body.pusher.email,
            avatar: req.body.sender.avatar_url
        },
        timestamp: Date.now()
    };
    req.body.commits.forEach(element => payload.commits.push(element));
    console.log("Output object for RabbitMQ (JSON) : ", payload);

    if (typeof payload == 'undefined')
        throw Error("payload should not be empty");

    sendMessage("webhook.payload.github", payload, async (err, response) => {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.status(200).json(response);
        }
    });
}));

router.post('/gitlab', asyncMiddleware(async(req, res) => {
    console.log("Request from gitlab received : ", req.body);
    let branchName = req.body.ref.toString().split('/').pop();
    let payload = {
        repository: {
            fullname: req.body.project.path_with_namespace,
            name: req.body.project.name,
            url: req.body.project.web_url,
            clone_url: req.body.project.http_url,
            default_branch: req.body.project.default_branch
        },
        commits: [ ],
        branch: branchName,
        user: {
            username: req.body.user_username,
            email: req.body.user_email,
            avatar: req.body.user_avatar
        },
        timestamp: Date.now()
    };
    req.body.commits.forEach(element => payload.commits.push(element));
    console.log("Output object for RabbitMQ (JSON) : ", payload);

    if (typeof payload == 'undefined')
        throw Error("payload should not be empty");

    sendMessage("webhook.payload.gitlab", payload,async (err, response) => {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.status(200).json(response);
        }
    });
}));

module.exports = router;
