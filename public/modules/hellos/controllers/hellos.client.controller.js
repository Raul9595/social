'use strict';

// Hellos controller
angular.module('hellos').controller('HellosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Hellos', 'TableSettings', 'HellosForm',
	function($scope, $stateParams, $location, Authentication, Hellos, TableSettings, HellosForm ) {
		$scope.authentication = Authentication;
		$scope.tableParams = TableSettings.getParams(Hellos);
		$scope.hello = {};

		$scope.setFormFields = function(disabled) {
			$scope.formFields = HellosForm.getFormFields(disabled);
		};


		// Create new Hello
		$scope.create = function() {
			var hello = new Hellos($scope.hello);

			// Redirect after save
			hello.$save(function(response) {
				$location.path('hellos/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Hello
		$scope.remove = function(hello) {

			if ( hello ) {
				hello = Hellos.get({helloId:hello._id}, function() {
					hello.$remove();
					$scope.tableParams.reload();
				});

			} else {
				$scope.hello.$remove(function() {
					$location.path('hellos');
				});
			}

		};

		// Update existing Hello
		$scope.update = function() {
			var hello = $scope.hello;

			hello.$update(function() {
				$location.path('hellos/' + hello._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



		$scope.toViewHello = function() {
			$scope.hello = Hellos.get( {helloId: $stateParams.helloId} );
			$scope.setFormFields(true);
		};

		$scope.toEditHello = function() {
			$scope.hello = Hellos.get( {helloId: $stateParams.helloId} );
			$scope.setFormFields(false);
		};

	}

]);
