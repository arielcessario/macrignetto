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

    AcUsuariosController.$inject = ['UsuariosService'];
    /**
     * @constructor
     */
    function AcUsuariosController(UsuariosService) {
        var vm = this;
        vm.usuarios = [];
        vm.usuario = {};
        vm.save = save;

        UsuariosService.get().then(function (data) {
            vm.usuarios = data;
        });

        function save() {
            UsuariosService.save(vm.usuarios, vm.usuario).then(function (data) {
                console.log(data);
            })
        }
    }

    UsuariosService.$inject = ['FireService', 'Model', '$q'];
    function UsuariosService(FireService, Model, $q) {

        var service = this;
        service.get = get;
        service.save = save;


        return service;


        function save(arr, obj) {
            var deferred = $q.defer();

            if (obj.$id != undefined) {
                deferred.resolve(update(arr, obj));
            } else {
                deferred.resolve(create(arr, obj));
            }
            return deferred.promise;
        }

        function get() {
            var refUsuario = Model.refUsuarios;
            var arrUsuarios = FireService.createArrayRef(refUsuario);
            return arrUsuarios.$loaded(function (data) {
                return data;
            });
        }

        function create(arr, obj) {
            return arr.$add(FireService.formatObj(obj)).then(function (data) {
                return data;
            });
        }

        function update(arr, obj) {
            return arr.$save(FireService.formatObj(obj)).then(function (data) {
                return data;
            });
        }
    }


})();