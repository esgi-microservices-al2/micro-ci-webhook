"use strict";

function asyncMiddleware (callback) {
    return function (req, res, next) {
        callback(req, res, next)
            .catch(next);
    }
}

module.exports = asyncMiddleware;