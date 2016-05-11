(function () {
    'use strict';

// Declare app level module which depends on views, and components
    angular.module('macrignetto', ['oc.lazyLoad',
        'ngRoute',
        'firebase',
        'acUtils',
        'acFactory',
        'Model'
    ]).config(['$routeProvider', function ($routeProvider) {

            $routeProvider.otherwise({redirectTo: '/main'});

            $routeProvider.when('/main', {
                templateUrl: 'main/main.html',
                controller: 'MainController',
                data: {requiresLogin: false},
                resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load('main/main.js');
                    }]
                }
            });

            $routeProvider.when('/administracion/:id', {
                templateUrl: 'administracion/administracion.html',
                controller: 'AdministracionController',
                data: {requiresLogin: true},
                resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load('administracion/administracion.js');
                    }]
                }
            });

        }])
        .controller('AppCtrl', AppCtrl)
        //Constante definida para la librería ac-angularfire-factory
        .constant('_FIREREF', 'https://macrignetto.firebaseio.com/');

    AppCtrl.$inject = ['FireService', '$rootScope'];
    function AppCtrl(FireService, $rootScope) {
        var vm = this;

        FireService.init();

        ////////// NAVEGACION //////////
        $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
            vm.menu = next.$$route.originalPath.split('/')[1];
            vm.sub_menu = next.params.id;
        });
        ////////// NAVEGACION //////////

    }
})();

