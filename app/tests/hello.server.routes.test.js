'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Hello = mongoose.model('Hello'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, hello;

/**
 * Hello routes tests
 */
describe('Hello CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Hello
		user.save(function() {
			hello = {
				name: 'Hello Name'
			};

			done();
		});
	});

	it('should be able to save Hello instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hello
				agent.post('/hellos')
					.send(hello)
					.expect(200)
					.end(function(helloSaveErr, helloSaveRes) {
						// Handle Hello save error
						if (helloSaveErr) done(helloSaveErr);

						// Get a list of Hellos
						agent.get('/hellos')
							.end(function(hellosGetErr, hellosGetRes) {
								// Handle Hello save error
								if (hellosGetErr) done(hellosGetErr);

								// Get Hellos list
								var hellos = hellosGetRes.body;

								// Set assertions
								(hellos[0].user._id).should.equal(userId);
								(hellos[0].name).should.match('Hello Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Hello instance if not logged in', function(done) {
		agent.post('/hellos')
			.send(hello)
			.expect(401)
			.end(function(helloSaveErr, helloSaveRes) {
				// Call the assertion callback
				done(helloSaveErr);
			});
	});

	it('should not be able to save Hello instance if no name is provided', function(done) {
		// Invalidate name field
		hello.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hello
				agent.post('/hellos')
					.send(hello)
					.expect(400)
					.end(function(helloSaveErr, helloSaveRes) {
						// Set message assertion
						(helloSaveRes.body.message).should.match('Please fill Hello name');
						
						// Handle Hello save error
						done(helloSaveErr);
					});
			});
	});

	it('should be able to update Hello instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hello
				agent.post('/hellos')
					.send(hello)
					.expect(200)
					.end(function(helloSaveErr, helloSaveRes) {
						// Handle Hello save error
						if (helloSaveErr) done(helloSaveErr);

						// Update Hello name
						hello.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Hello
						agent.put('/hellos/' + helloSaveRes.body._id)
							.send(hello)
							.expect(200)
							.end(function(helloUpdateErr, helloUpdateRes) {
								// Handle Hello update error
								if (helloUpdateErr) done(helloUpdateErr);

								// Set assertions
								(helloUpdateRes.body._id).should.equal(helloSaveRes.body._id);
								(helloUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Hellos if not signed in', function(done) {
		// Create new Hello model instance
		var helloObj = new Hello(hello);

		// Save the Hello
		helloObj.save(function() {
			// Request Hellos
			request(app).get('/hellos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Hello if not signed in', function(done) {
		// Create new Hello model instance
		var helloObj = new Hello(hello);

		// Save the Hello
		helloObj.save(function() {
			request(app).get('/hellos/' + helloObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', hello.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Hello instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hello
				agent.post('/hellos')
					.send(hello)
					.expect(200)
					.end(function(helloSaveErr, helloSaveRes) {
						// Handle Hello save error
						if (helloSaveErr) done(helloSaveErr);

						// Delete existing Hello
						agent.delete('/hellos/' + helloSaveRes.body._id)
							.send(hello)
							.expect(200)
							.end(function(helloDeleteErr, helloDeleteRes) {
								// Handle Hello error error
								if (helloDeleteErr) done(helloDeleteErr);

								// Set assertions
								(helloDeleteRes.body._id).should.equal(helloSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Hello instance if not signed in', function(done) {
		// Set Hello user 
		hello.user = user;

		// Create new Hello model instance
		var helloObj = new Hello(hello);

		// Save the Hello
		helloObj.save(function() {
			// Try deleting Hello
			request(app).delete('/hellos/' + helloObj._id)
			.expect(401)
			.end(function(helloDeleteErr, helloDeleteRes) {
				// Set message assertion
				(helloDeleteRes.body.message).should.match('User is not logged in');

				// Handle Hello error error
				done(helloDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Hello.remove().exec(function(){
				done();
			});	
		});
	});
});
