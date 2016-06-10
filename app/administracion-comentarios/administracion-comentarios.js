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

    AcComentariosController.$inject = ['ComentariosService', 'FireService', 'FireVars', 'Model', 'LoginService'];
    /**
     * @constructor
     */
    function AcComentariosController(ComentariosService, FireService, FireVars, Model, LoginService) {
        var vm = this;
        vm.comentarios = [];
        vm.comentario = {};
        vm.img = 'trash.png';
        vm.save = save;
        vm.remove = remove;
        vm.start = 0;
        vm.arrComentarios = FireService.cacheFactory(Model.refComentarios);
        vm.usuario = (FireVars._FIREREF.getAuth() == null) ? null : FireVars._FIREREF.getAuth().uid;

        vm.obj.$loaded(function () {
            vm.comentarios = vm.arrComentarios.$load(vm.obj.comentarios != undefined ? vm.obj.comentarios : {});

        });

        function remove(obj) {


            ComentariosService.remove(obj).then(function () {
                vm.comentario = {};
                vm.comentarios = vm.arrComentarios.$load(vm.obj.comentarios);
            });
        }

        function save() {
            if(LoginService.isLogged) {
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
                        Model.refUsuarios.child(vm.usuario).child('comentarios').child(data.key()).set(true);

                        return vm.obj.$save()
                    })
                    .then(function (data) {
                        vm.comentario = {};
                        vm.comentarios = vm.arrComentarios.$load(vm.obj.comentarios);
                    });
            } else {
                LoginService.showLoginPanel = true;
                LoginService.broadcast();
            }

        }

    }

    ComentariosService.$inject = ['FireService', 'Model', '$q', 'FireVars'];
    function ComentariosService(FireService, Model, $q, FireVars) {

        var service = this;
        service.get = get;
        service.save = save;
        service.remove = remove;

        return service;

        function save(arr, obj) {
            var deferred = $q.defer();

            obj.fecha_upd = Firebase.ServerValue.TIMESTAMP;
            if (obj.$id != undefined) {
                deferred.resolve(update(arr, obj));
            } else {
                obj.usuario = FireVars._FIREREF.getAuth().uid;
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

        function remove(obj) {


            var deferred = $q.defer();
            var refNoticia = Model.refNotas.child(Object.getOwnPropertyNames(obj.nota)[0]).child('comentarios').child(obj.$id);
            var refComentario = Model.refComentarios.child(obj.$id);

            refNoticia.remove(removeNoticiaCallback);

            function removeNoticiaCallback() {
                refComentario.remove(removeComentarioCallback);
            }

            function removeComentarioCallback() {
                deferred.resolve();
            }

            return deferred.promise;
        }
    }


})();