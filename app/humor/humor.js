(function () {
    'use strict';
    angular.module('humor', ['ngRoute'])
        .controller('HumorController', HumorController);


    HumorController.$inject = ['$scope', 'Model', 'FireService', '$sce', 'ComicsService', '$location'];
    function HumorController($scope, Model, FireService, $sce, ComicsService, $location) {

        var vm = this;
        vm.fotoSelected = '';
        vm.comics = [];

        vm.verComic = verComic;

        ComicsService.get().then(function (data) {
            console.log(data);
            vm.comics = data;
        })

        function verComic(id) {
            console.log(id);
            $location.path('/comic/' + id);
        }

    }
})();