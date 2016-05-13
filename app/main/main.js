(function () {
    'use strict';
    angular.module('main', ['ngRoute'])
        .controller('MainController', MainController);


    MainController.$inject = ['NotasService'];
    function MainController(NotasService) {

        var vm = this;
        NotasService.get().then(function (data) {
            vm.notas = data;
            console.log(vm.notas);
        });
    }
})();