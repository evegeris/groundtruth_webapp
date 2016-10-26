'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        //$urlRouterProvider.when('/dashboard', 'dashboard');
        // For unmatched routes
        $urlRouterProvider.otherwise('/signin');
        //$urlRouterProvider.otherwise('/dashboard');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/signin.html'
            })
            .state('tables', {
                url: '/tables',
                templateUrl: 'templates/tables.html'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'templates/dashboard.html'
            })
            .state('signin', {
                url: '/signin',
                templateUrl: 'templates/signin.html'
            })
            .state('display', {
                url: '/display',
                templateUrl: 'templates/display.html'
            })
            .state('hello', {
                url: '/hello',
                templateUrl: 'templates/helloExample.html'
            })
            ;
    }
]);
