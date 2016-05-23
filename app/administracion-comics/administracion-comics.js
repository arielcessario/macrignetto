(function () {
    'use strict';

    angular.module('acAdministracionComics', [])
        .component('acAdministracionComics', acAdministracionComics())
        .factory('ComicsService', ComicsService);

    function acAdministracionComics() {
        return {
            bindings: {
                searchFunction: '&'
            },
            templateUrl: 'administracion-comics/administracion-comics.html',
            controller: AcComicsController
        }
    }

    AcComicsController.$inject = ['ComicsService', 'UploadVars', 'UploadService', '$scope'];
    /**
     * @constructor
     */
    function AcComicsController(ComicsService, UploadVars, UploadService, $scope) {
        var vm = this;
        vm.comics = [];
        vm.comic = {};
        vm.imagen = {nombre: 'no_image.png'};


        vm.save = save;
        vm.updateFotoProyecto = updateFotoProyecto;


        function updateFotoProyecto(filelist, id, sub_folder) {
            UploadService.addImages(filelist, id, sub_folder, function (data) {
                for (var i = 0; i < UploadVars.uploadsList.length; i++) {
                    if (UploadVars.uploadsList[i].id == 1) {
                        vm.imagen.nombre = UploadVars.uploadsList[i].file.name;
                    }
                }
                $scope.$apply();
                //console.log(data);
            })
        }


        ComicsService.get().then(function (data) {
            console.log(data);
            vm.comics = data;
        });

        function save() {

            vm.comic.imagen = vm.imagen.nombre;

            ComicsService.save(vm.comics, vm.comic).then(function (data) {
                //vm.comic = vm.comics[-1];
                vm.comic = {
                    status: "0",
                    fecha: new Date()
                };

            })
        }
    }

    ComicsService.$inject = ['FireService', 'Model', '$q', 'AcPaginacionVars'];
    function ComicsService(FireService, Model, $q, AcPaginacionVars) {

        var service = this;
        service.get = get;
        service.save = save;
        service.getUltimosComics = getUltimosComics;


        return service;


        function save(arr, obj) {
            var deferred = $q.defer();


            obj.fecha_upd = Firebase.ServerValue.TIMESTAMP;
            if (obj.$id != undefined) {
                deferred.resolve(update(arr, obj));
            } else {
                obj.fecha_crea = Firebase.ServerValue.TIMESTAMP;
                obj.usuario = FireService.getUserData().uid;

                deferred.resolve(create(arr, obj));
            }
            return deferred.promise;
        }

        function get() {
            var refComic = Model.refComics;
            var arrComics = FireService.createArrayRef(refComic);
            return arrComics.$loaded(function (data) {
                AcPaginacionVars.setPaginacion('comics',data.length);

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

        function getUltimosComics() {
            var refComic = Model.refComics;
            var arrComics = FireService.createArrayRef(refComic);
            return arrComics.$loaded(function (data) {
                var list = [];
                var count = 0;
                var destacadaSi = 0;
                var destacadaNo = 0;
                for (var i = 0; i < data.length; i++) {
                    list.push(data[i]);

                    count = count + (data[i].status == 1 ? 1 : 2);
                    destacadaSi = destacadaSi + (data[i].status == 2 ? 1 : 0);
                    destacadaNo = destacadaNo + (data[i].status == 1 ? 1 : 0);
                    if(count >= 8) {
                        if(destacadaSi == 4 && destacadaNo > 0) {
                            for(var j=0; j < list.length; j++) {
                                if(list[j].status == 0) {
                                    list.splice(j,1);
                                    break;
                                }
                            }
                        } else if(destacadaSi == 2 && destacadaNo > 4) {
                            for(var j=0; j < list.length; j++) {
                                if(list[j].status == 0) {
                                    list.splice(j,1);
                                    break;
                                }
                            }
                        }
                        return list;
                    }
                }
                return list;
            });
        }
    }


})();