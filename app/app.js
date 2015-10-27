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
 
 	$scope.currentYear = new Date().getFullYear();

    // we will store all of our form data in this object
    $scope.formData = {};
	$scope.formData.customer = {};
	$scope.formData.customer.groupOrder = true;
	$scope.formData.customer.comprehensiveOrder = true;
	$scope.formData.customer.summativeOrder = true;
	$scope.formData.customer.periodicOrder = true;
    $scope.formData.group = {};
    $scope.formData.group.createOrJoin == 'create';
    $scope.formData.group.schools=[{'id':1}];
    $scope.formData.comprehensive = {};
    $scope.formData.comprehensive.schoolYears = [{'year':$scope.currentYear}];

    
    // function to process the form
    $scope.processForm = function() {

    };

    $scope.addNewSchool = function() {
    	var schools = $scope.formData.group.schools;
  		var newItemNo = schools[schools.length - 1].id + 1;
  		$scope.formData.group.schools.push({'id':newItemNo});
	};

	$scope.removeSchool = function(school){
		var schools = $scope.formData.group.schools;
		if(schools.length > 1){
			var index = schools.indexOf(school);
			if (index > -1) {
			    schools.splice(index, 1);
			}
		}
	};

	$scope.addYear = function(years){
		var nextYear = years[years.length - 1].year + 1;
		years.push({'year':nextYear});
	};

	$scope.removeYear = function(years){
		if(years.length > 1){
			years.splice(years.length -1, 1);
		}
	};
	
	$scope.totalStudents =  function(newValue, oldValue) {
		var years = newValue;
		angular.forEach(years, function(year, key) {
			var total = 0;
			angular.forEach(year.grade, function(grade, key) {
				if(!isNaN(grade.cbt)){
					total += parseInt(grade.cbt);
				}
				if(!isNaN(grade.pbt)){
					total += parseInt(grade.pbt);
				}
			});
			year.totalStudents = total;
		});
	};
	$scope.$watch('formData.comprehensive.schoolYears', $scope.totalStudents, true);



    
});


