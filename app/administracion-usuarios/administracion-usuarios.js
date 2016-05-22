(function () {
    'use strict';

    angular.module('acAdministracionUsuarios', [])
        .component('acAdministracionUsuarios', acAdministracionUsuarios())
        .factory('UsuariosService', UsuariosService);


    ///// ADMINISTRACION DE USUARIOS /////
    function acAdministracionUsuarios() {
        return {
            bindings: {
                limit: '<'
            },
            templateUrl: 'administracion-usuarios/administracion-usuarios.html',
            controller: AcUsuariosController
        }
    }

    AcUsuariosController.$inject = ['UsuariosService', '$timeout'];
    /**
     * @constructor
     */
    function AcUsuariosController(UsuariosService, $timeout) {
        var vm = this;
        vm.usuarios = [];
        vm.usuario = {};
        vm.save = save;
        vm.start = 0;
        $timeout(function () {
            vm.limit = (vm.limit == undefined) ? 2 : vm.limit;
        }, 0);

        UsuariosService.get().then(function (data) {
            vm.usuarios = data;
        });

        function save() {
            UsuariosService.save(vm.usuarios, vm.usuario).then(function (data) {
                //vm.usuario = vm.usuarios[-1];
                vm.usuario = {
                    rol: "1",
                    status: "0"
                };

            })
        }
    }

    UsuariosService.$inject = ['FireService', 'Model', '$q', 'AcPaginacionVars'];
    function UsuariosService(FireService, Model, $q, AcPaginacionVars) {

        var service = this;
        service.get = get;
        service.save = save;

        return service;

        function save(arr, obj) {
            var deferred = $q.defer();

            obj.fecha_upd = Firebase.ServerValue.TIMESTAMP;
            if (obj.$id != undefined) {
                deferred.resolve(update(arr, obj));
            } else {
                obj.fecha_crea = Firebase.ServerValue.TIMESTAMP;
                deferred.resolve(create(arr, obj));
            }
            return deferred.promise;
        }

        function get() {
            var refUsuario = Model.refUsuarios;
            var arrUsuarios = FireService.createArrayRef(refUsuario);
            return arrUsuarios.$loaded(function (data) {
                //AcPaginacionVars.setPaginacion('usuarios', data.length);
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