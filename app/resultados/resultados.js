(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;

    angular.module('resultados', ['ngRoute'])
        .controller('ResultadoController', ResultadoController);


    ResultadoController.$inject = ['$location', '$interval', '$routeParams', '$timeout'];
    function ResultadoController($location, $interval, $routeParams, $timeout) {


        var vm = this;
        vm.proyectos = [];
        //vm.type = AppService.type;
        vm.value = '';
        document.getElementById('resultados-search-box').focus();

        // FUNCTIONS
        vm.filtrar = filtrar;

        // INIT



        function filtrar() {
            /*
            ProyectService.get(function (data) {
                ProyectService.getByParams('nombre', vm.value, 'false', function (data) {
                    AppService.search = vm.value;
                    //vm.proyectos = data;
                    procesarData(data);
                });
            });
            */
        }




    }
})();