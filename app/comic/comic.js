(function () {
    'use strict';
    angular.module('nota', ['ngRoute'])
        .controller('ComicController', ComicController);


    ComicController.$inject = ['$scope', '$routeParams', 'Model', 'FireService', '$sce'];
    function ComicController($scope, $routeParams, Model, FireService, $sce) {

        var vm = this;
        vm.fotoSelected = '';
        vm.comic = {};
        vm.objComic = {};
        vm.comentarios = [];
        vm.id = $routeParams.id;

        if (vm.id.length > 0) {
            console.log(vm.id);

            vm.objComic = FireService.createObjectRef(Model.refComics.child(vm.id));
            vm.objComic.$loaded(function (data) {
                console.log(data);
                vm.comic = data;
                //vm.comic.detalle = $sce.trustAsHtml(data.detalle);
            });
        }
    }

})();
