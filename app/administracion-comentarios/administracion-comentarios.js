(function () {
    'use strict';

    angular.module('acAdministracionComentarios', [])
        .component('acAdministracionComentarios', acAdministracionComentarios())
        .factory('ComentariosService', ComentariosService);


    ///// ADMINISTRACION DE COMENTARIOS /////
    function acAdministracionComentarios() {
        return {
            bindings: {
                obj: '='
            },
            templateUrl: 'administracion-comentarios/administracion-comentarios.html',
            controller: AcComentariosController
        }
    }

    AcComentariosController.$inject = ['ComentariosService', 'FireService', '$scope', 'Model'];
    /**
     * @constructor
     */
    function AcComentariosController(ComentariosService, FireService, $scope, Model) {
        var vm = this;
        vm.comentarios = [];
        vm.comentario = {};
        vm.save = save;
        vm.start = 0;
        vm.arrComentarios = FireService.cacheFactory(Model.refComentarios);

        vm.obj.$loaded(function () {
            vm.comentarios = vm.arrComentarios.$load(vm.obj.comentarios);

        });


        function save() {

            if (!vm.comentario.hasOwnProperty('nota')) {
                vm.comentario.nota = {};
            }
            vm.comentario.nota[vm.obj.$id] = true;

            ComentariosService.save(FireService.createArrayRef(Model.refComentarios), vm.comentario)
                .then(function (data) {
                    if (!vm.obj.hasOwnProperty('comentarios')) {
                        vm.obj.comentarios = {}
                    }
                    vm.obj.comentarios[data.key()] = true;
                    return vm.obj.$save()
                })
                .then(function (data) {
                    vm.comentario = {};
                    vm.comentarios = vm.arrComentarios.$load(vm.obj.comentarios);
                });
        }

    }

    ComentariosService.$inject = ['FireService', 'Model', '$q'];
    function ComentariosService(FireService, Model, $q) {

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
            var refComentario = Model.refComentarios;
            var arrComentarios = FireService.createArrayRef(refComentario);
            return arrComentarios.$loaded(function (data) {
                //AcPaginacionVars.setPaginacion('comentarios', data.length);
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