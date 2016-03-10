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
        .state('search', {
          url: '/',
          parent : 'site',
          views: {
            'content@': { 
                templateUrl: 'app/scripts/content/search/search.html',
                controller: 'SearchController'
            }
         }
      });
    }
  ]);