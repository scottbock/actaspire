'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router'
])
.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
    
        // route to show our basic form (/form)
        .state('form', {
            url: '/form',
            templateUrl: 'form.html',
            controller: 'formController'
        })
		
		.state('form.customer', {
			url: '/customer',
			templateUrl: 'form-customer.html'
		})		
        
		.state('form.group', {
			url: '/group',
			templateUrl: 'form-group.html'
		})

		.state('form.comprehensive', {
			url: '/comprehensive',
			templateUrl: 'form-comprehensive.html'
		})

		.state('form.summative', {
			url: '/summative',
			templateUrl: 'form-summative.html'
		})

		.state('form.periodic', {
			url: '/periodic',
			templateUrl: 'form-periodic.html'
		})

		.state('form.implementation', {
			url: '/implementation',
			templateUrl: 'form-implementation.html'
		})	
		
		.state('form.billing', {
			url: '/billing',
			templateUrl: 'form-billing.html'
		})	
		
      
        
    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/form/customer');
})

// our controller for the form
// =============================================================================
.controller('formController', function($scope) {
    
    // we will store all of our form data in this object
    $scope.formData = {};
    
    // function to process the form
    $scope.processForm = function() {
        alert('awesome!');
    };
    
});


