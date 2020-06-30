"use strict";

const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());



router.get('/', async(req, res) => {

    let jsonData = require('./../doc-api.json');

    return res.status(200).json(jsonData);
});


module.exports = router;