(function () {
    'use strict';
    angular.module('revista', ['ngRoute'])
        .controller('RevistaController', RevistaController);


    RevistaController.$inject = ['$scope', 'Model', 'FireService', '$sce'];
    function RevistaController($scope, Model, FireService, $sce) {

        var vm = this;
        vm.fotoSelected = '';
        vm.nota = {};



    }
})();
