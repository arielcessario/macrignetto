(function () {
    'use strict';
    angular.module('humor', ['ngRoute'])
        .controller('HumorController', HumorController);


    HumorController.$inject = ['$scope', 'Model', 'FireService', '$sce', 'ComicsService'];
    function HumorController($scope, Model, FireService, $sce, ComicsService) {

        var vm = this;
        vm.fotoSelected = '';
        vm.comics = [];

        ComicsService.get().then(function (data) {
            console.log(data);
            vm.comics = data;
        })

    }
})();