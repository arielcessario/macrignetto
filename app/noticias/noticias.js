(function () {
    'use strict';
    angular.module('noticias', ['ngRoute'])
        .controller('NoticiasController', NoticiasController);


    NoticiasController.$inject = ['$scope', '$routeParams', 'Model', 'FireService', '$sce'];
    function NoticiasController($scope, $routeParams, Model, FireService, $sce) {

        var vm = this;
        vm.fotoSelected = '';
        vm.nota = {};

        vm.id = $routeParams.id;

        if (vm.id.length > 0) {
            var refNota = Model.refNotas;
            var arrNotas = FireService.createArrayRef(refNota);

            var aux = arrNotas.$loaded(function (data) {
                //console.log(data);
                vm.nota = data.$getRecord(vm.id);
                console.log(vm.nota);
                return data;
            });
        }

        //console.log(vm.nota);


    }
})();
