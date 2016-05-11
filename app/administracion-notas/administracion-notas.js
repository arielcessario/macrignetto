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

    NotasService.$inject = ['FireService', 'Model', '$q'];
    function NotasService(FireService, Model, $q) {

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