(function () {
    'use strict';
    angular.module('noticias', ['ngRoute', ['revistas/issuu.min.js']])
        .controller('RevistasController', RevistasController);


    RevistasController.$inject = ['$scope', 'Model', 'FireService', 'RevistasService', '$location', '$sce'];
    function RevistasController($scope, Model, FireService, RevistasService, $location, $sce) {

        var vm = this;
        vm.revistas = [];
        vm.links = [];

        //FUNCIONES
        vm.verRevista = verRevista;

        vm.arrComentarios = FireService.cacheFactory(Model.refComentarios);
        vm.arrUsuarios = FireService.cacheFactory(Model.refUsuarios);


        RevistasService.get().then(function (data) {
            //console.log(data);
            vm.revistas = data;

            for (var i = 0; i < data.length; i++) {
                vm.links.push({link:$sce.trustAsResourceUrl('//e.issuu.com/embed.html#' + data[i].link), nombre: data[i].titulo});
            }
        });

        function verRevista(id) {
            console.log(id);
            $location.path('/revista/' + id);
        }



    }
})();
