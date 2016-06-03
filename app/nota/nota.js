(function () {
    'use strict';
    angular.module('nota', ['ngRoute'])
        .controller('NotaController', NotaController);


    NotaController.$inject = ['$scope', '$routeParams', 'Model', 'FireService', '$sce'];
    function NotaController($scope, $routeParams, Model, FireService, $sce) {

        var vm = this;
        vm.fotoSelected = '';
        vm.nota = {};
        vm.objNota = {};
        vm.comentarios = [];
        vm.id = $routeParams.id;

        if (vm.id.length > 0) {
            vm.objNota = FireService.createObjectRef(Model.refNotas.child(vm.id));
            vm.objNota.$loaded(function (data) {
                vm.nota = data;
                //vm.nota.detalle = $sce.trustAsHtml(data.detalle);
            });
        }


    }
})();
