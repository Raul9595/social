'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Hello = mongoose.model('Hello'),
	_ = require('lodash');

/**
 * Create a Hello
 */
exports.create = function(req, res) {
	var hello = new Hello(req.body);
	hello.user = req.user;

	hello.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hello);
		}
	});
};

/**
 * Show the current Hello
 */
exports.read = function(req, res) {
	res.jsonp(req.hello);
};

/**
 * Update a Hello
 */
exports.update = function(req, res) {
	var hello = req.hello ;

	hello = _.extend(hello , req.body);

	hello.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hello);
		}
	});
};

/**
 * Delete an Hello
 */
exports.delete = function(req, res) {
	var hello = req.hello ;

	hello.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hello);
		}
	});
};

/**
 * List of Hellos
 */
exports.list = function(req, res) {

	var sort;
	var sortObject = {};
	var count = req.query.count || 5;
	var page = req.query.page || 1;


	var filter = {
		filters : {
			mandatory : {
				contains: req.query.filter
			}
		}
	};

	var pagination = {
		start: (page - 1) * count,
		count: count
	};

	if (req.query.sorting) {
		var sortKey = Object.keys(req.query.sorting)[0];
		var sortValue = req.query.sorting[sortKey];
		sortObject[sortValue] = sortKey;
	}
	else {
		sortObject.desc = '_id';
	}

	sort = {
		sort: sortObject
	};


	Hello
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, hellos){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(hellos);
			}
		});

};

/**
 * Hello middleware
 */
exports.helloByID = function(req, res, next, id) {
	Hello.findById(id).populate('user', 'displayName').exec(function(err, hello) {
		if (err) return next(err);
		if (! hello) return next(new Error('Failed to load Hello ' + id));
		req.hello = hello ;
		next();
	});
};

/**
 * Hello authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.hello.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
