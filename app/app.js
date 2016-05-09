(function () {
    'use strict';

// Declare app level module which depends on views, and components
    angular.module('inmobiliarias', ['oc.lazyLoad',
        'ngRoute',
        'firebase',
        'acUtils',
        'inmobiliarias.factory',
        'acFactory'
    ]).config(['$routeProvider', function ($routeProvider) {
            $routeProvider.otherwise({redirectTo: '/administracion'});
            $routeProvider.when('/administracion', {
                templateUrl: 'administracion/administracion.html',
                controller: 'AdministracionCtrl',
                data: {requiresLogin: true},
                resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load('administracion/administracion.js');
                    }]
                }
            });

            $routeProvider.when('/listado', {
                templateUrl: 'listado/listado.html',
                controller: 'ListadoCtrl',
                data: {requiresLogin: true},
                resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load('listado/listado.js');
                    }]
                }
            });

        }])
        .controller('AppCtrl', AppCtrl)
        //Constante definida para la librería ac-angularfire-factory
        .constant('_FIREREF', 'https://inmobiliarias.firebaseio.com');

    AppCtrl.$inject = ['FireService'];
    function AppCtrl(FireService) {

        var vm = this;

        FireService.init();




    }
})();

