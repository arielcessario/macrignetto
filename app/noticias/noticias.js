(function () {
    'use strict';
    angular.module('noticias', ['ngRoute'])
        .controller('NoticiasController', NoticiasController);


    NoticiasController.$inject = ['$scope', '$routeParams', 'Model', 'FireService', '$sce'];
    function NoticiasController($scope, $routeParams, Model, FireService, $sce) {

        var vm = this;
        vm.fotoSelected = '';
        vm.nota = {};

        vm.comentarios = FireService.cacheFactory(Model.refComentarios);

        vm.id = $routeParams.id;

        if (vm.id.length > 0) {
            var nota = Model.refNotas.child(vm.id);

            nota.on('value', function(snap){
                vm.nota = snap.val();

            });

        }
    }
})();
