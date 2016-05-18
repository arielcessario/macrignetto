(function () {
    'use strict';
    angular.module('humor', ['ngRoute'])
        .controller('HumorController', HumorController);


    HumorController.$inject = ['$scope', 'Model', 'FireService', '$sce'];
    function HumorController($scope, Model, FireService, $sce) {

        var vm = this;
        vm.fotoSelected = '';
        vm.nota = {};



    }
})();