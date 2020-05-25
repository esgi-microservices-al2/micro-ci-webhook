"use strict";

const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());

router.post('/', async (req, res) => {

    /*const libelle = req.body.libelle;
    if (libelle) {
        let result = await ProduitController.addProductCategory(libelle);

        if (result != 500) {

            return res.status(201).end();
        }
        else {
            return res.status(500).end();
        }

    }
    return res.status(400).end();*/

    console.log("Post request received : ", req);
    return res.status(200).end();



});

router.post('/github', async(req, res) => {
    console.log("Request from github received : ", req.body);
    let branchName = req.body.ref.toString().split('/').pop();
    let output = {
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
    req.body.commits.forEach(element => output.commits.push(element));
    console.log("Output object for RabbitMQ (JSON) : ", output);
    return res.status(200).end();
});

router.post('/gitlab', async(req, res) => {
    console.log("Request from gitlab received : ", req.body);
    let branchName = req.body.ref.toString().split('/').pop();
    let output = {
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
    req.body.commits.forEach(element => output.commits.push(element));
    console.log("Output object for RabbitMQ (JSON) : ", output);
    return res.status(200).end();
})

module.exports = router;