(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;

    angular.module('resultados', ['ngRoute'])
        .controller('ResultadoController', ResultadoController);


    ResultadoController.$inject = ['$scope', '$location', '$routeParams', 'NotasService',
        'ComicsService', 'RevistasService'];
    function ResultadoController($scope, $location, $routeParams, NotasService,
                                 ComicsService, RevistasService) {


        var vm = this;
        vm.opcion = 1;
        vm.notas = [];
        vm.comics = [];
        vm.revistas = [];
        vm.value = '';
        document.getElementById('resultados-search-box').focus();

        // FUNCTIONS
        vm.filtrar = filtrar;

        NotasService.get().then(function (data) {
            //console.log(data);
            for (var i = 0; i < data.length; i++) {
                var nota = {};
                nota.id = data[i].$id;
                nota.destacada = data[i].destacada;
                nota.detalle = data[i].detalle != undefined ? getSubString(data[i].detalle, 100) : '';
                nota.fecha = data[i].fecha;
                nota.fotos = data[i].fotos;
                nota.fuente = data[i].fuente;
                nota.status = data[i].status;
                nota.titulo = getSubString(data[i].titulo, 50);
                nota.comentarios = (data[i].comentarios != undefined) ? data[i].comentarios : {};
                nota.color = (i % 2 == 0) ? 1 : 2;

                vm.notas.push(nota);
            }
        });

        ComicsService.getUltimosComics().then(function (data) {
            //console.log(data);
            vm.comics = data;
        });

        /*
        RevistasService.get().then()(function(data){
            vm.revistas = data;
        });
        */

        function getSubString(texto, length) {
            return texto.length > length ? texto.substring(0, length) + "..." : texto;
        }

        console.log(vm.value);

        function filtrar(textBusqueda) {
            if(vm.value.length > 0) {

            } else {
                vm.value = textBusqueda;
            }

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