'use strict';


angular.module('selecteurApp', [
    'selecteur-services',
    'selecteur-domains',
    'dndLists',
    'elasticsearch',
    'infinite-scroll',
    'LocalStorageModule',
    'ngCookies',
    'ngResource',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'ui.bootstrap',
    'ui.bootstrap-slider',
    'ui.grid',
    'ui.grid.pagination',
    'ui.grid.pinning',
    'ui.grid.resizeColumns',
    'ui.grid.autoResize',
    'ui.router',
    'ui.select',
    'ngAnimate',
    'ngMaterial'
    ])

    .run(function ($rootScope, $location, $window, $http, $state, $translate, Auth, Principal, Language, ENV, VERSION, esLog) {
        $rootScope.ENV = ENV;
        $rootScope.VERSION = VERSION;
        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;

           // if (Principal.isIdentityResolved()) {
                Auth.authorize();
            //}

            // Update the language
            Language.getCurrent().then(function (language) {
                $translate.use(language);
            });
            console.log("here1" + toState.name);
            esLog.info('Change state start to: ' + toState.name);
        });

        $rootScope.$on('$stateChangeSuccess',  function(event, toState, toParams, fromState, fromParams) {
            var titleKey = 'global.title';

            $rootScope.previousStateName = fromState.name;
            $rootScope.previousStateParams = fromParams;

            // Set the page title key to the one configured in state or use default one
            if (toState.data.pageTitle) {
                titleKey = toState.data.pageTitle;
            }
            $translate(titleKey).then(function (title) {
                // Change window title with translated one
                $window.document.title = title;
            });

            esLog.info('Change state succeed from:' +fromState.name + ' to: ' + toState.name);
        });

        $rootScope.back = function() {
             console.log("here2");
            // If previous state is 'activate' or do not exist go to 'home'
            if ($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null) {
                $state.go('home');
            } else {
                $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
            }
        };
    })
    
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $translateProvider, tmhDynamicLocaleProvider) {
        $httpProvider.interceptors.push(function($q,$rootScope,$timeout){
            console.log("here3");
            $rootScope.loading = false;
            $rootScope.requestCount = 0;
            var seemsToBeLoaded = null;

            return {
                'request' : function(config){
                    $rootScope.requestCount ++;
                    $rootScope.loading = true;
                    if(seemsToBeLoaded){
                        $timeout.cancel(seemsToBeLoaded);
                    }
                    return config || $q.when(config);
                },
                'requestError' : function(rejection){
                    if($rootScope.requestCount > 0){
                        $rootScope.requestCount --;
                    }
                    if($rootScope.requestCount == 0){
                        seemsToBeLoaded = $timeout(function(){
                            $rootScope.loading = false;
                        },200);
                    }
                    return $q.reject(rejection);
                },
                'response' : function(response){
                    if($rootScope.requestCount > 0){
                        $rootScope.requestCount --;
                    }
                    if($rootScope.requestCount == 0){
                        seemsToBeLoaded = $timeout(function(){
                            $rootScope.loading = false;
                        },200);
                    }
                    return response || $q.when(response);
                },
                'responseError' : function(rejection){
                    if($rootScope.requestCount > 0){
                        $rootScope.requestCount --;
                    }
                    if($rootScope.requestCount == 0){
                        seemsToBeLoaded = $timeout(function(){
                            $rootScope.loading = false;
                        },200);
                    }
                    return $q.reject(rejection);
                }
            }
        });
        //enable CSRF
        $httpProvider.defaults.xsrfCookieName = 'CSRF-TOKEN';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';

        $urlRouterProvider.otherwise('/');
        console.log("here4");
        $stateProvider.state('site', {
            'abstract': true,
            
            views: {
                'navbar@': {
                    templateUrl: 'scripts/components/navbar/navbar.html',
                    controller: 'NavbarController'
                }
            },
            resolve: {
                authorize: ['Auth',
                    function (Auth) {
                        return Auth.authorize();
                    }
                ],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('global');
                    $translatePartialLoader.addPart('language');
                    return $translate.refresh();
                }]
            }
        });


        // Initialize angular-translate
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'i18n/{lang}/{part}.json'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useCookieStorage();

        tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.useCookieStorage('NG_TRANSLATE_LANG_KEY');
    }).config(function(uiSelectConfig) {
        uiSelectConfig.theme = 'bootstrap';
    }).config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default');
    }).run(function ($log, $window, $location, $timeout, $rootScope) {
        var keys = [];
        angular.element($window).bind('keydown', function (e) {
            keys.push(e.keyCode);
            if (keys.length > 10) {
                keys.shift();
            }
            // ↑↑↓↓←→←→ⓑⓐ
            if (keys.join('') === '38384040373937396665') {
                //esLog.info('Display menu with konami code');
                $timeout($rootScope.$broadcast('show-menu'));
            }
        });
    });
