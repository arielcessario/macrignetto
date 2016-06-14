(function () {
    'use strict';
    angular.module('humor', ['ngRoute'])
        .controller('HumorController', HumorController);


    HumorController.$inject = ['$scope', 'Model', 'FireService', '$sce', 'ComicsService', '$location'];
    function HumorController($scope, Model, FireService, $sce, ComicsService, $location) {

        var vm = this;
        vm.fotoSelected = '';
        vm.comics = [];

        //Funciones
        vm.verComic = verComic;

        ComicsService.get().then(function (data) {

            for(var i=0; i < data.length; i++) {
                var comic = {};
                comic = data[i];
                comic.url_id = 'comic/' + data[i].$id;

                vm.comics.push(comic);
            }

        });

        function verComic(id) {
            $location.path('/comic/' + id);
        }

    }
})();