(function () {
    'use strict';

// Declare app level module which depends on views, and components
    angular.module('macrignetto', ['oc.lazyLoad',
        'ngRoute',
        'firebase',
        'acUtils',
        'inmobiliarias.factory',
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

            $routeProvider.when('/administracion', {
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

    AppCtrl.$inject = ['FireService', '$rootScope', '$location'];
    function AppCtrl(FireService, $rootScope, $location) {
        var vm = this;

        FireService.init();

        ////////// NAVEGACION //////////
        var location = $location.path().split('/');
        vm.menu = location[1];
        vm.sub_menu = location[2];
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            var location = next.$$route.originalPath.split('/');
            vm.menu = location[1];
            vm.sub_menu = location[2];
        });
        ////////// NAVEGACION //////////


    }
})();

