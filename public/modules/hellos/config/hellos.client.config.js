'use strict';

// Configuring the new module
angular.module('hellos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Hellos', 'hellos', 'dropdown', '/hellos(/create)?');
		Menus.addSubMenuItem('topbar', 'hellos', 'List Hellos', 'hellos');
		Menus.addSubMenuItem('topbar', 'hellos', 'New Hello', 'hellos/create');
	}
]);
