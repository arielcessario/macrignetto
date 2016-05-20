(function () {
    'use strict';

    angular.module('acAdministracionNotas', [])
        .component('acAdministracionNotas', acAdministracionNotas())
        .factory('NotasService', NotasService);

    function acAdministracionNotas() {
        return {
            bindings: {
                searchFunction: '&'
            },
            templateUrl: 'administracion-notas/administracion-notas.html',
            controller: AcNotasController
        }
    }

    AcNotasController.$inject = ['NotasService', 'UploadVars', 'UploadService', 'taOptions'];
    /**
     * @constructor
     */
    function AcNotasController(NotasService, UploadVars, UploadService, taOptions) {
        var vm = this;
        vm.notas = [];
        vm.nota = {};
        vm.foto_01 = {nombre: 'no_image.png'};
        vm.foto_02 = {nombre: 'no_image.png'};
        vm.foto_03 = {nombre: 'no_image.png'};
        vm.foto_04 = {nombre: 'no_image.png'};

        taOptions.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote', 'bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear',
                'justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent', 'html', 'insertLink', 'wordcount', 'charcount']
        ];

        vm.save = save;
        vm.updateFotoProyecto = updateFotoProyecto;


        function updateFotoProyecto(filelist, id, sub_folder) {
            UploadService.addImages(filelist, id, sub_folder, function (data) {
                for (var i = 0; i < UploadVars.uploadsList.length; i++) {
                    if (UploadVars.uploadsList[i].id == 1) {
                        vm.foto_01.nombre = UploadVars.uploadsList[i].file.name;
                    }
                    if (UploadVars.uploadsList[i].id == 2) {
                        vm.foto_02.nombre = UploadVars.uploadsList[i].file.name;
                    }
                    if (UploadVars.uploadsList[i].id == 3) {
                        vm.foto_03.nombre = UploadVars.uploadsList[i].file.name;
                    }
                    if (UploadVars.uploadsList[i].id == 4) {
                        vm.foto_04.nombre = UploadVars.uploadsList[i].file.name;
                    }

                }
                $scope.$apply();
                //console.log(data);
            })
        }

        NotasService.get().then(function (data) {
            vm.notas = data;
        });

        function save() {

            vm.nota.fotos = [];
            vm.nota.fotos[0] = vm.foto_01;
            vm.nota.fotos[1] = vm.foto_02;
            vm.nota.fotos[2] = vm.foto_03;
            vm.nota.fotos[3] = vm.foto_04;

            NotasService.save(vm.notas, vm.nota).then(function (data) {
                //vm.nota = vm.notas[-1];
                vm.nota = {
                    status: "0"
                };

            })
        }
    }

    NotasService.$inject = ['FireService', 'Model', '$q', '$sce'];
    function NotasService(FireService, Model, $q, $sce) {

        var service = this;
        service.get = get;
        service.save = save;
        service.getUltimasNotas = getUltimasNotas;

        return service;


        function save(arr, obj) {
            var deferred = $q.defer();


            obj.fecha_upd = Firebase.ServerValue.TIMESTAMP;
            if (obj.$id != undefined) {
                deferred.resolve(update(arr, obj));
            } else {
                obj.fecha = Firebase.ServerValue.TIMESTAMP;
                deferred.resolve(create(arr, obj));
            }
            return deferred.promise;
        }

        function get() {
            var refNota = Model.refNotas;
            var arrNotas = FireService.createArrayRef(refNota);
            return arrNotas.$loaded(function (data) {
                return data;
            });
        }

        function getUltimasNotas() {
            var refNota = Model.refNotas;
            var arrNotas = FireService.createArrayRef(refNota);
            return arrNotas.$loaded(function (data) {
                var list = [];
                var count = 0;
                var destacadaSi = 0;
                var destacadaNo = 0;
                for (var i = 0; i < data.length; i++) {
                    var nota = {};
                    nota.id = data[i].$id;
                    nota.destacada = data[i].destacada;
                    nota.detalle = $sce.trustAsHtml(getSubString(data[i].detalle, 100));
                    nota.fecha = timeConverter(data[i].fecha);
                    nota.fotos = data[i].fotos;
                    nota.fuente = data[i].fuente;
                    nota.status = data[i].status;
                    nota.titulo = getSubString(data[i].titulo, 50);

                    list.push(nota);

                    count = count + (data[i].destacada == 1 ? 2 : 1);
                    destacadaSi = destacadaSi + (data[i].destacada == 1 ? 1 : 0);
                    destacadaNo = destacadaNo + (data[i].destacada == 0 ? 1 : 0);
                    if(count >= 8) {
                        //console.log(count);
                        //console.log(destacadaSi);
                        //console.log(destacadaNo);
                        if(destacadaSi == 4 && destacadaNo > 0) {
                            for(var j=0; j < list.length; j++) {
                                if(list[j].destacada == 0) {
                                    list.splice(j,1);
                                    break;
                                }
                            }
                        } else if(destacadaSi == 2 && destacadaNo > 4) {
                            for(var j=0; j < list.length; j++) {
                                if(list[j].destacada == 0) {
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

        function getSubString(texto, length) {
            return texto.length > length ? texto.substring(0, length) + "..." : texto;
        }

        function timeConverter(timestamp){
            var date = new Date(timestamp);
            //console.log(date);
            //console.log(date.toDateString());
            //console.log(date.toTimeString());
            //console.log(date.toLocaleDateString());
            //console.log(date.toLocaleTimeString());

            return date.toLocaleString();
        }
    }


})();