(function () {
    'use strict';
    angular.module('noticias', ['ngRoute'])
        .controller('NoticiasController', NoticiasController);


    NoticiasController.$inject = ['$scope', 'Model', 'FireService', '$sce', 'NotasService', '$location'];
    function NoticiasController($scope, Model, FireService, $sce, NotasService, $location) {

        var vm = this;
        vm.fotoSelected = '';
        vm.nota = {};
        vm.notas = [];
        vm.objNota = {};
        vm.comentarios = [];

        vm.verNoticia = verNoticia;


        NotasService.get().then(function (data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                var nota = {};
                nota.id = data[i].$id;
                nota.destacada = data[i].destacada;
                nota.detalle = data[i].detalle != undefined ? $sce.trustAsHtml(getSubString(data[i].detalle, 100)) : '';
                nota.fecha = data[i].fecha;
                nota.fotos = data[i].fotos;
                nota.fuente = data[i].fuente;
                nota.status = data[i].status;
                nota.titulo = getSubString(data[i].titulo, 50);
                if(data[i].comentario != undefined) {
                    nota.ultimo_comentario = data[i].destacada == 1 ? getSubString(data[i].comentario.detalles, 200) : getSubString(data[i].comentario.detalles, 100);
                } else {
                    nota.ultimo_comentario = 'Se el primero en comentar';
                }

                vm.notas.push(nota);
            }
        });

        function verNoticia(id) {
            console.log(id);
            $location.path('/nota/' + id);
        }

        function getSubString(texto, length) {
            return texto.length > length ? texto.substring(0, length) + "..." : texto;
        }

    }
})();
