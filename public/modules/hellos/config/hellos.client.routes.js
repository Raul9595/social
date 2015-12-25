'use strict';

//Setting up route
angular.module('hellos').config(['$stateProvider',
	function($stateProvider) {
		// Hellos state routing
		$stateProvider.
		state('listHellos', {
			url: '/hellos',
			templateUrl: 'modules/hellos/views/list-hellos.client.view.html'
		}).
		state('createHello', {
			url: '/hellos/create',
			templateUrl: 'modules/hellos/views/create-hello.client.view.html'
		}).
		state('viewHello', {
			url: '/hellos/:helloId',
			templateUrl: 'modules/hellos/views/view-hello.client.view.html'
		}).
		state('editHello', {
			url: '/hellos/:helloId/edit',
			templateUrl: 'modules/hellos/views/edit-hello.client.view.html'
		});
	}
]);