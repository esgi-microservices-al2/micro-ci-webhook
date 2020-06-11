"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const sendMessage = require('../amqp/emit_payload_topic');
const receiveMessage = require('../amqp/receive_payload_topic');

const asyncMiddleware = require('../utils/asyncMiddleware');

const router = express.Router();
router.use(bodyParser.json());

router.post('/', asyncMiddleware( async (req, res) => {
    let message = req.body.message;
    let routingKey = req.query["routingKey"];

    if (typeof message == 'undefined')
        throw Error("message should not be empty");
    if (typeof routingKey == 'undefined')
        throw Error("routingKey should not be empty");

    sendMessage(routingKey, message,  async (err, response) => {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.status(200).json(response);
        }
    });
}));


router.get('/', asyncMiddleware( async (req, res) => {
    let routingKey = req.query["routingKey"];
    if (typeof routingKey == 'undefined')
        throw Error("rountingKey should not be empty");

    receiveMessage(routingKey);
}));

module.exports = router;