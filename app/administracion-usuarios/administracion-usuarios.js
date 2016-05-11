(function () {
    'use strict';

    angular.module('acAdministracionUsuarios', [])
        .component('acAdministracionUsuarios', acAdministracionUsuarios())
        .factory('UsuariosService', UsuariosService);

    function acAdministracionUsuarios() {
        return {
            bindings: {
                searchFunction: '&'
            },
            templateUrl: 'administracion-usuarios/administracion-usuarios.html',
            controller: AcUsuariosController
        }
    }

    AcUsuariosController.$inject = [];
    /**
     * @constructor
     */
    function AcUsuariosController() {
        var vm = this;
    }

    UsuariosService.$inject = ['$http'];
    function UsuariosService($http){

    }


})();