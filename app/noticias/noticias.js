(function () {
    'use strict';
    angular.module('noticias', ['ngRoute'])
        .controller('NoticiasController', NoticiasController);


    NoticiasController.$inject = ['$scope', '$routeParams', 'NotasService', '$sce'];
    function NoticiasController($scope, $routeParams, NotasService, $sce) {

        var vm = this;
        vm.nota = {};

        vm.id = $routeParams.id;

        if (vm.id > 0) {
            console.log(vm.id);
        }

    }
})();
