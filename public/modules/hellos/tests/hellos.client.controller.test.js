'use strict';

(function() {
	// Hellos Controller Spec
	describe('Hellos Controller Tests', function() {
		// Initialize global variables
		var HellosController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Hellos controller.
			HellosController = $controller('HellosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Hello object fetched from XHR', inject(function(Hellos) {
			// Create sample Hello using the Hellos service
			var sampleHello = new Hellos({
				name: 'New Hello'
			});

			// Create a sample Hellos array that includes the new Hello
			var sampleHellos = [sampleHello];

			// Set GET response
			$httpBackend.expectGET('hellos').respond(sampleHellos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hellos).toEqualData(sampleHellos);
		}));

		it('$scope.findOne() should create an array with one Hello object fetched from XHR using a helloId URL parameter', inject(function(Hellos) {
			// Define a sample Hello object
			var sampleHello = new Hellos({
				name: 'New Hello'
			});

			// Set the URL parameter
			$stateParams.helloId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/hellos\/([0-9a-fA-F]{24})$/).respond(sampleHello);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hello).toEqualData(sampleHello);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Hellos) {
			// Create a sample Hello object
			var sampleHelloPostData = new Hellos({
				name: 'New Hello'
			});

			// Create a sample Hello response
			var sampleHelloResponse = new Hellos({
				_id: '525cf20451979dea2c000001',
				name: 'New Hello'
			});

			// Fixture mock form input values
			scope.name = 'New Hello';

			// Set POST response
			$httpBackend.expectPOST('hellos', sampleHelloPostData).respond(sampleHelloResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Hello was created
			expect($location.path()).toBe('/hellos/' + sampleHelloResponse._id);
		}));

		it('$scope.update() should update a valid Hello', inject(function(Hellos) {
			// Define a sample Hello put data
			var sampleHelloPutData = new Hellos({
				_id: '525cf20451979dea2c000001',
				name: 'New Hello'
			});

			// Mock Hello in scope
			scope.hello = sampleHelloPutData;

			// Set PUT response
			$httpBackend.expectPUT(/hellos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/hellos/' + sampleHelloPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid helloId and remove the Hello from the scope', inject(function(Hellos) {
			// Create new Hello object
			var sampleHello = new Hellos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Hellos array and include the Hello
			scope.hellos = [sampleHello];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/hellos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleHello);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.hellos.length).toBe(0);
		}));
	});
}());