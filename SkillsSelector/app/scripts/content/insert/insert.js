/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * <!-- @author: Benzaouia Soufiane-->
 */


// Contrôleur de la page d'accueil
skillsSelectorApp.config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('insert', {
          url: '/',
          parent : 'search',
          views: {
           'content@': { 
                templateUrl: 'app/scripts/content/insert/insert.html',
                controller: 'InsertController'
            }
         }
      });
    }
  ]);