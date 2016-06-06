(function () {
    'use strict';
    angular.module('noticias', ['ngRoute'])
        .controller('RevistasController', RevistasController);


    RevistasController.$inject = ['$scope', 'Model', 'FireService', 'NotasService', '$location'];
    function RevistasController($scope, Model, FireService, NotasService, $location) {

        var vm = this;
        vm.notas = [];

        //FUNCIONES
        vm.verRevista = verRevista;

        vm.arrComentarios = FireService.cacheFactory(Model.refComentarios);
        vm.arrUsuarios = FireService.cacheFactory(Model.refUsuarios);


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
            //console.log(vm.notas);
        });

        function verRevista(id) {
            console.log(id);
            $location.path('/revista/' + id);
        }

        function getSubString(texto, length) {
            return texto.length > length ? texto.substring(0, length) + "..." : texto;
        }

    }
})();
