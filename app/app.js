(function () {
    'use strict';

// Declare app level module which depends on views, and components
    angular.module('macrignetto', ['oc.lazyLoad',
        'ngRoute',
        'firebase',
        'textAngular',
        'acUtils',
        'acUploads',
        'acFactory',
        'Model',
        'login'
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
        .run(function ($rootScope, $location, FireVars) {
            // Para activar la seguridad en una vista, agregar data:{requiresLogin:false} dentro de $routeProvider.when */
            $rootScope.$on('$routeChangeStart', function (e, to) {
                var ref = FireVars._FIREREF;
                var authData = ref.getAuth();
                if (to && to.data && to.data.requiresLogin) {
                    if (!authData) {
                        e.preventDefault();
                        $location.path('/login');
                    } else {
                    }
                }
            });
        })
        .controller('AppCtrl', AppCtrl)
        .service('LinksService', LinksService)
        //Constante definida para la librería ac-angularfire-factory
        .constant('_FIREREF', 'https://macrignetto.firebaseio.com/');

    function LinksService() {
        this.links = [
            {nombre: 'NOTICIAS', path: '/noticias'},
            {nombre: 'AGENDA', path: '/agenda'},
            {nombre: 'QUIENES SOMOS', path: '/quienes_somos'},
            {nombre: 'CONTACTANOS', path: '/contacto'},
            {nombre: 'HUMOR', path: '/humor'},
            {nombre: 'REVISTA', path: '/revista'},
            {nombre: 'CONTACTO', path: '/contacto'},
            {nombre: 'ADMINISTRACION', path: '/administracion'}
        ];

    }

    AppCtrl.$inject = ['FireService', '$rootScope', '$location', 'LinksService'];
    function AppCtrl(FireService, $rootScope, $location, LinksService) {
        var vm = this;
        vm.hideLoader = true;
        vm.display_menu = true;
        vm.display_header = true;
        vm.links = LinksService.links;

        vm.goTo = goTo;

        FireService.init();

        ////////// NAVEGACION //////////
        $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
            vm.menu = (next.$$route == undefined) ? current.$$route.originalPath.split('/')[1] : next.$$route.originalPath.split('/')[1];
            vm.sub_menu = next.params.id;
        });
        ////////// NAVEGACION //////////

        function goTo(location) {
            $location.path(location.path);
        }
    }
})();

