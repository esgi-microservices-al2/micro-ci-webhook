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

module.exports = router;