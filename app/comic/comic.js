(function () {
    'use strict';
    angular.module('nota', ['ngRoute'])
        .controller('ComicController', ComicController);


    ComicController.$inject = ['$scope', '$routeParams', 'Model', 'FireService', 'ComicsService'];
    function ComicController($scope, $routeParams, Model, FireService, ComicsService) {

        var vm = this;
        vm.fotoSelected = '';
        vm.comic = {};
        vm.objComic = {};
        vm.comics = [];
        vm.comentarios = [];
        vm.id = $routeParams.id;

        if (vm.id.length > 0) {
            vm.objComic = FireService.createObjectRef(Model.refComics.child(vm.id));
            vm.objComic.$loaded(function (data) {
                //console.log(data);
                vm.comic = data;
                vm.fotoSelected = data.imagen;
            });
        }

        ComicsService.get().then(function (data) {
            //console.log(data);
            if(data.length > 5) {
                for(var i=0; i < 5; i++) {
                    vm.comics.push(data[i]);
                }
            } else {
                vm.comics = data;
            }
        });

    }

})();
