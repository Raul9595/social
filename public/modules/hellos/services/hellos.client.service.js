'use strict';

//Hellos service used to communicate Hellos REST endpoints
angular.module('hellos').factory('Hellos', ['$resource',
	function($resource) {
		return $resource('hellos/:helloId', { helloId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);