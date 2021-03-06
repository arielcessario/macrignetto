(function () {
    'use strict';

    angular.module('acAdministracionEventos', [])
        .component('acAdministracionEventos', acAdministracionEventos())
        .factory('EventosService', EventosService);

    function acAdministracionEventos() {
        return {
            bindings: {
                searchFunction: '&'
            },
            templateUrl: 'administracion-eventos/administracion-eventos.html',
            controller: AcEventosController
        }
    }

    AcEventosController.$inject = ['$scope', 'EventosService', 'UploadVars', 'UploadService', 'taOptions'];
    /**
     * @constructor
     */
    function AcEventosController($scope, EventosService, UploadVars, UploadService, taOptions) {
        var vm = this;
        vm.eventos = [];
        vm.evento = {};
        vm.foto_01 = {nombre: 'no_image.png'};
        vm.foto_02 = {nombre: 'no_image.png'};
        vm.foto_03 = {nombre: 'no_image.png'};
        vm.foto_04 = {nombre: 'no_image.png'};
        vm.fecha = new Date();

        taOptions.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote', 'bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear',
                'justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent', 'html', 'insertLink', 'wordcount', 'charcount']
        ];

        vm.save = save;
        vm.select = select;
        vm.nuevo = nuevo;
        vm.updateFotoProyecto = updateFotoProyecto;


        function nuevo() {
            vm.fecha = new Date();
            vm.evento = {};
            document.getElementById('fecha-box').focus();
        }

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

        function select(row) {
            vm.evento = row;
            vm.fecha = new Date(vm.evento.fecha);
            vm.foto_01.nombre = row.fotos[0].nombre;
            vm.foto_02.nombre = row.fotos[1].nombre;
            vm.foto_03.nombre = row.fotos[2].nombre;
            vm.foto_04.nombre = row.fotos[3].nombre;
        }

        EventosService.get().then(function (data) {
            data.sort(function (a, b) {
                return b.fecha - a.fecha;
            });

            vm.eventos = data;
        });

        function save() {

            vm.evento.fotos = [];
            vm.evento.fotos[0] = vm.foto_01;
            vm.evento.fotos[1] = vm.foto_02;
            vm.evento.fotos[2] = vm.foto_03;
            vm.evento.fotos[3] = vm.foto_04;

            vm.evento.fecha = new Date(vm.fecha).getTime();

            EventosService.save(vm.eventos, vm.evento).then(function (data) {
                //vm.evento = vm.eventos[-1];
                vm.evento = {
                    status: "0",
                    fecha: new Date()
                };

            })
        }
    }

    EventosService.$inject = ['FireService', 'Model', '$q', 'FireVars'];
    function EventosService(FireService, Model, $q, FireVars) {

        var service = this;
        service.get = get;
        service.save = save;
        service.getLastEvento = getLastEvento;
        service.getEventosByFecha = getEventosByFecha;

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
            var refEvento = Model.refEventos;
            var arrEventos = FireService.createArrayRef(refEvento);
            return arrEventos.$loaded(function (data) {
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

        function getLastEvento() {
            var refEvento = Model.refEventos;
            var arrEventos = FireService.createArrayRef(refEvento);

            return arrEventos.$loaded(function (data) {
                data.sort(function (a, b) {
                    return a.fecha - b.fecha;
                });

                var evento = {};
                var mostRecent= 0;
                var now = new Date().getTime();
                for(var i=0; i < data.length; i++){
                    var curDate = data[i].fecha;
                    if (curDate > mostRecent && curDate < now) {
                        mostRecent = curDate;
                        evento = data[i];
                    }
                }

                return evento;
            });
        }

        function getEventosByFecha(year, month) {
            var refEvento = Model.refEventos;
            var arrEventos = FireService.createArrayRef(refEvento);

            return arrEventos.$loaded(function (data) {
                var initMonth = new Date(year, month, 1);
                var diasMes = new Date(year, month + 1, 0).getDate();
                var finishMonth = new Date(year, month, diasMes);
                var eventos = [];

                for(var i=0; i < data.length; i++){
                    if (data[i].fecha > initMonth.getTime() && data[i].fecha < finishMonth.getTime()) {
                        eventos.push(data[i]);
                    }
                }

                return eventos;
            });
        }
    }


})();