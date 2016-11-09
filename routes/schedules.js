var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user.js');

var Schedule = require('../models/schedule');

router.get('/', function(req, res, next) {
    Schedule.find({user: req.user})
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
    var schedule = new Schedule({
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        category: req.body.category,
        description: req.body.description,
    });
    schedule.user = req.user;
    schedule.save(function (err, result) {
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        req.user.schedules.push(result);
        req.user.save();
        res.status(201).json({
            message: 'Saved schedule',
            obj: result
        });
    });
});

router.delete('/:id', function(req, res, next) {
    Schedule.findById(req.params.id, function(err, doc) {
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!doc) {
            return res.status(404).json({
                title: 'No schedule found',
                error: {message: 'schema could not be found'}
            });
        }
        if (JSON.stringify(doc.user) != JSON.stringify(req.user._id)) {
            return res.status(401).json({
                title: 'Not Authorized',
                error: {message: 'Schedule created by other user'},
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

router.patch('/:id', function(req, res, next) {
    Schedule.findById(req.params.id, function(err, doc) {
        if (err) {
            return res.status(404).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!doc) {
            return res.status(404).json({
                title: 'No schedule found',
                error: {message: 'schema could not be found'}
            });
        }
        if (JSON.stringify(doc.user) != JSON.stringify(req.user._id)) {
            return res.status(401).json({
                title: 'Not Authorized',
                error: {message: 'schema created by other user'},
            });
        }
        doc.title = req.body.title;
        doc.startDate = req.body.startDate;
        doc.endDate = req.body.endDate;
        doc.category = req.body.category;
        doc.description = req.body.description;
        doc.save(function(err, result) {
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

