'use strict';
var app = angular.module('angularApp', ['ngResource']);

app.config(function ($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/main.html'
	})
	.when('/users/new', {
		templateUrl: 'views/users/form.html',
		controller: 'UsersCreateCtrl'
	})
	.when('/users/:username', {
		templateUrl: 'views/users/view.html',
		controller: 'UsersDetailCtrl'
	})
	.when('/users/:username/edit', {
		templateUrl: 'views/users/form.html',
		controller: 'UsersUpdateCtrl'
	})
	.when('/users/:username/delete', {
		templateUrl: 'views/users/view.html',
		controller: 'UsersDeleteCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
	//$locationProvider.html5Mode(true).hashPrefix('!');
});
