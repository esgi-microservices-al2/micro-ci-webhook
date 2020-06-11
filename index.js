"use strict";

const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const morgan = require('morgan');
const routerBuilder = require('./route');


const app = express();

app.use(morgan('dev'));

routerBuilder.build(app);

const port = 3000;
app.listen(port, () => console.log(`Server listening on ${port}...`));
