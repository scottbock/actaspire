'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'ngCookies',
  'ui.bootstrap'
])
.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
    
        // route to show our basic form (/form)
        .state('form', {
            url: '/form',
            templateUrl: 'app/form.html'
        })
		
		.state('form.customer', {
			url: '/customer',
			templateUrl: 'app/form-customer.html',
            controller: 'formController'
		})

		.state('form.customer.tax', {
			url: '/tax',
			templateUrl: 'app/tax.html'
		})

		.state('form.customer.confirmation', {
			url: '/confirmation',
			templateUrl: 'app/confirmation.html'
		})

		.state('form.isr', {
			url: '/isr',
			templateUrl: 'app/form-isr.html',
			controller: 'isrController'
		})

		.state('form.isr.confirmation', {
			url: '/confirmation',
			templateUrl: 'app/confirmation.html'
		})

		.state('form.training', {
			url: '/training',
			templateUrl: 'app/form-training.html',
			controller: 'trainingController'
		})

		.state('form.training.confirmation', {
			url: '/confirmation',
			templateUrl: 'app/confirmation.html'
		})		
        
    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/form/customer');
});