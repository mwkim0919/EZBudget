var express = require('express');
var router = express.Router();

var Transaction = require('../models/transaction');

router.get('/', function(req, res, next) {
    Transaction.find()
        .exec(function(err, docs) {
            if (err) {
                return res.status(404).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: docs
            });
        });
});

router.post('/', function(req, res, next) {
    var transaction = new Transaction({
        date: new Date(),
        category: 'category',
        amount: 1000,
        user: null
    });
    transaction.save(function (err, result) {
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(201).json({
            message: 'Saved transaction',
            obj: result
        });
    });
});

router.delete('/:id', function(req, res, next) {
    Transaction.findById(req.params.id, function(err, doc) {
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!doc) {
            return res.status(404).json({
                title: 'No transaction found',
                error: {message: 'Transaction could not be found'}
            });
        }
        doc.remove(function(err, result) {
            if (err) {
                return res.status(404).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: result
            });
        });
    });
});

module.exports = router;

