'use strict';

angular.module('skillsSelectorApp')
    .controller('NavbarController', function ($scope, $location, $state) {
        $scope.$state = $state;
        $scope.insert = function () { 
            $state.go('insert');
        };

        $scope.main = function(event){
           $state.go('main');
        };
        
        $scope.search = function(event){
           $state.go('search');
        };

    });
 


