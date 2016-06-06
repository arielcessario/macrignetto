(function () {
    'use strict';

    angular.module('acAdministracionRevistas', [])
        .component('acAdministracionRevistas', acAdministracionRevistas())
        .factory('RevistasService', RevistasService);

    function acAdministracionRevistas() {
        return {
            bindings: {
                searchFunction: '&'
            },
            templateUrl: 'administracion-revistas/administracion-revistas.html',
            controller: AcRevistaController
        }
    }

    AcRevistaController.$inject = ['RevistasService', '$scope'];
    /**
     * @constructor
     */
    function AcRevistaController(RevistasService, $scope) {
        var vm = this;
        vm.revistas = [];
        vm.revista = {};

        vm.save = save;


        RevistasService.get().then(function (data) {
            vm.revistas = data;
        });

        function save() {
            RevistasService.save(vm.revistas, vm.revista).then(function (data) {
                vm.revista = {
                    status: "0",
                    fecha: new Date()
                };

            })
        }
    }

    RevistasService.$inject = ['FireService', 'Model', '$q', 'FireVars'];
    function RevistasService(FireService, Model, $q, FireVars) {

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
                obj.usuario = FireVars._FIREREF.getAuth().uid;
                obj.fecha_crea = Firebase.ServerValue.TIMESTAMP;
                obj.usuario = FireService.getUserData().uid;

                deferred.resolve(create(arr, obj));
            }
            return deferred.promise;
        }

        function get() {
            var refRevista = Model.refRevistas;
            var arrRevistas = FireService.createArrayRef(refRevista);
            return arrRevistas.$loaded(function (data) {
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