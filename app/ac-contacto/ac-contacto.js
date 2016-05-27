(function () {
    'use strict';

    angular.module('acContacto', [])
        .component('acContacto', acContacto());


    ///// Contactenos /////
    function acContacto() {
        return {
            bindings: {
                limit: '<'
            },
            templateUrl: 'ac-contacto/ac-contacto.html',
            controller: AcContactoController
        }
    }

    AcContactoController.$inject = ['UsuariosService', '$timeout'];
    /**
     * @constructor
     */
    function AcContactoController(UsuariosService, $timeout) {
        var vm = this;
        vm.usuarios = [];
        vm.usuario = {};


    }

})();
