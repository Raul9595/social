'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Hello Schema
 */
var HelloSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Hello name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Hello', HelloSchema);