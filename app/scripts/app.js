'use strict';

/**
 * @ngdoc overview
 * @name superGroceryListProtoApp
 * @description
 * # superGroceryListProtoApp
 *
 * Main module of the application.
 */
angular
  .module('superGroceryListProtoApp', [
    'ngAnimate',
    'ngAria',
    'ngRoute',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
