/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * <!-- @author: Benzaouia Soufiane-->
 */



skillsSelectorApp.config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('main', {
          url: '/',
          parent : 'site',
          views: {
          //  '': { templateUrl: 'js/scripts/index.html'},
            'content@': { 
                templateUrl: 'app/scripts/content/main/main.html',
            }
           // 'body@home': { templateUrl: './templates/body.html'},
           // 'footer@home': { templateUrl: './templates/assets/footer.html' }
         }
      });
    }
  ]);