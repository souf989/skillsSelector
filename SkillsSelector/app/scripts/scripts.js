// js/script.js
//<!-- @author: Benzaouia Soufiane-->
'use strict';


/**
 * Déclaration de l'application outilAE
 */
var skillsSelectorApp = angular.module('skillsSelectorApp', [
    'ngRoute',
    'ngDialog',
    'ngCookies',
    'ngResource',
    'chieffancypants.loadingBar',
    'ui.bootstrap',
    'toaster',
    'ui.grid',
    'elasticsearch',
    'ui.router',
    'ngMaterial',
    'ngAnimate',
    'ngAria'
    
])

skillsSelectorApp.service('messageUpdate', function() {
   this.query = '';
    this.setQuery = function(query) {
           this.query = query;
        //   arrayOfmessage.push()
     };
      this.getQuery = function() {
          return this.query ;
     };
});
skillsSelectorApp.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('green', {
      'default': 'A200' // by default use shade 400 from the pink palette for primary intentions
    })
    .accentPalette('grey');
});
skillsSelectorApp.config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('site', {
            //abstract: true,
          url: '/',
          views: {
            'navbar@': { 
                templateUrl: 'app/scripts/navbar/navbar.html',
                controller: 'NavbarController'
            }
         }
      });
    }
  ]);


