'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var hellos = require('../../app/controllers/hellos.server.controller');

	// Hellos Routes
	app.route('/hellos')
		.get(hellos.list)
		.post(users.requiresLogin, hellos.create);

	app.route('/hellos/:helloId')
		.get(hellos.read)
		.put(users.requiresLogin, hellos.hasAuthorization, hellos.update)
		.delete(users.requiresLogin, hellos.hasAuthorization, hellos.delete);

	// Finish by binding the Hello middleware
	app.param('helloId', hellos.helloByID);
};
