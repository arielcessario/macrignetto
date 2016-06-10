(function () {
    'use strict';

    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;

    angular.module('main', ['ngRoute'])
        .controller('MainController', MainController)
        .service('MainService', MainService);


    MainController.$inject = ['$scope', 'NotasService', 'EventosService', '$location', 'ContactsService',
        'ComicsService', 'FireService', 'Model', 'MainService', '$timeout'];
    function MainController($scope, NotasService, EventosService, $location, ContactsService,
                            ComicsService, FireService, Model, MainService, $timeout) {

        var vm = this;
        vm.notas = [];
        vm.textFiltro = '';
        vm.fecha = new Date();
        vm.anio = vm.fecha.getFullYear();
        vm.mes = '' + vm.fecha.getMonth();
        vm.meses = [
            {id: 0, nombre: 'ENERO'},
            {id: 1, nombre: 'FEBRERO'},
            {id: 2, nombre: 'MARZO'},
            {id: 3, nombre: 'ABRIL'},
            {id: 4, nombre: 'MAYO'},
            {id: 5, nombre: 'JUNIO'},
            {id: 6, nombre: 'JULIO'},
            {id: 7, nombre: 'AGOSTO'},
            {id: 8, nombre: 'SEPTIEMBRE'},
            {id: 9, nombre: 'OCTUBRE'},
            {id: 10, nombre: 'NOVIEMBRE'},
            {id: 11, nombre: 'DICIEMBRE'}];
        vm.agendaMes = vm.meses[vm.fecha.getMonth()];
        vm.agendaAnio = vm.anio;
        vm.listaEventos = [];
        vm.evento = {};
        vm.eventos = [];
        vm.comics = [];

        vm.email = '';
        vm.nombre = '';
        vm.mensaje = '';
        vm.asunto = '';
        vm.enviado = false;
        vm.enviando = false;


        //FUNCIONES
        vm.prevMonth = prevMonth;
        vm.nextMonth = nextMonth;
        vm.verNoticia = verNoticia;
        vm.verComic = verComic;
        vm.sendMail = sendMail;
        vm.selectEvento = selectEvento;
        vm.getUsuario = getUsuario;

        vm.arrComentarios = FireService.cacheFactory(Model.refComentarios);
        vm.arrUsuarios = FireService.cacheFactory(Model.refUsuarios);


        /*
        function getUsuario(comentario) {
            var usuario = {};
            if(comentario != undefined) {
                comentario.$loaded().then(function () {
                    //console.log(comentario.usuario);
                    usuario = FireService.createObjectRef(Model.refUsuarios.child(comentario.usuario));
                    //console.log(usuario);
                    comentario.usuario = usuario;
                    //console.log(comentario.usuario);
                });
            }
        }
        */

        function getUsuario(comentario) {
            var usuario = {};
            if(comentario != undefined) {
                comentario.$loaded().then(function () {
                    console.log(comentario.usuario);
                    usuario = vm.arrUsuarios.$load(comentario.usuario);
                    console.log(usuario);
                });
            }
            return usuario;
        }

        NotasService.getUltimasNotas().then(function (data) {
            for (var i = 0; i < data.length; i++) {
                var nota = {};
                nota.id = data[i].$id;
                nota.destacada = data[i].destacada;
                nota.detalle = data[i].detalle != undefined ? getSubString(data[i].detalle, 100) : '';
                nota.fecha = data[i].fecha;
                nota.fotos = data[i].fotos;
                nota.fuente = data[i].fuente;
                nota.status = data[i].status;
                nota.titulo = getSubString(data[i].titulo, 50);
                nota.comentarios = (data[i].comentarios != undefined) ? data[i].comentarios : {};
                nota.color = (i % 2 == 0) ? 1 : 2;

                vm.notas.push(nota);
            }
        });


        EventosService.get().then(function (data) {
            data.sort(function (a, b) {
                return a.fecha - b.fecha;
            });
            //console.log(data);

            vm.eventos = data;
            var year = vm.anio;
            var month = vm.agendaMes.id;

            var max = data.length - 1;
            var fecha = new Date(data[max].fecha);

            year = parseInt(fecha.getFullYear());
            month = parseInt(fecha.getMonth()) + 1;

            getEventos(year, month);
        });

        function getEventos(year, month) {
            //console.log(year);
            //console.log(month);

            var diasMes = new Date(year, month + 1, 0).getDate();
            //console.log(diasMes);
            vm.listaEventos = [];
            var event = {};
            for (var i = 1; i < diasMes + 1; i++) {
                event = {dia: i, evento: undefined};
                vm.listaEventos.push(event);
            }
            //console.log(vm.listaEventos);

            for (var i in vm.eventos) {
                // Conseguir el día del evento
                // comparar con el día del listEventos
                if (typeof vm.eventos[i] === "object") {
                    var anioEvento = (new Date(vm.eventos[i].fecha)).getFullYear();
                    var mesEvento = (new Date(vm.eventos[i].fecha)).getMonth() + 1;
                    if (anioEvento == year && mesEvento == month) {
                        vm.listaEventos[(new Date(vm.eventos[i].fecha)).getDate() - 1].evento = vm.eventos[i];
                    }
                }
            }

            //vm.evento = vm.listaEventos[0].evento;
            if(vm.listaEventos[0].evento != undefined) {
                vm.evento.detalle = vm.listaEventos[0].evento.detalle;
                vm.evento.titulo = getSubString(vm.listaEventos[0].evento.titulo, 20);
                vm.evento.fotos = vm.listaEventos[0].evento.fotos;
            } else {
                //console.log('Recupero el ultimo evento');
                getLastEvento();
            }
        }

        function getLastEvento() {
            EventosService.getLastEvento().then(function (data) {
                //console.log(data);
                data.sort(function (a, b) {
                    return a.fecha - b.fecha;
                });

                //console.log(data[data.length - 1]);
                if(data[data.length - 1] != undefined) {
                    vm.evento.detalle = data[data.length - 1].detalle;
                    vm.evento.titulo = getSubString(data[data.length - 1].titulo, 20);
                    vm.evento.fotos = data[data.length - 1].fotos;
                }
            });
        }

        function nextMonth() {
            vm.agendaMes = (vm.agendaMes.id == 11) ? vm.meses[0] : vm.meses[vm.agendaMes.id + 1];
            vm.agendaAnio = (vm.agendaMes.id == 0) ? vm.agendaAnio + 1 : vm.agendaAnio;
            getEventos(vm.agendaAnio, vm.agendaMes.id);
        }

        function prevMonth() {
            vm.agendaMes = (vm.agendaMes.id == 0) ? vm.meses[11] : vm.meses[vm.agendaMes.id - 1];
            vm.agendaAnio = (vm.agendaMes.id == 11) ? vm.agendaAnio - 1 : vm.agendaAnio;
            getEventos(vm.agendaAnio, vm.agendaMes.id);
        }

        function verNoticia(id) {
            console.log(id);
            $location.path('/nota/' + id);
        }

        function verComic(id) {
            console.log(id);
            $location.path('/comic/' + id);
        }

        function selectEvento(evento) {
            console.log(evento);
            if (evento != undefined) {
                vm.evento = evento;
                vm.evento.detalle = evento.detalle;
                vm.evento.titulo = getSubString(evento.titulo, 20);
                vm.evento.fotos = evento.fotos;
            }
        }

        ComicsService.getUltimosComics().then(function (data) {
            vm.comics = data;
        });

        function sendMail() {
            if (vm.enviando) {
                return;
            }
            vm.enviando = true;

            ContactsService.sendMail(vm.email,
                [{mail: 'arielcessario@gmail.com'}, {mail: 'mmaneff@gmail.com'}, {mail: 'diegoyankelevich@gmail.com'}],
                vm.nombre,
                vm.asunto,
                vm.mensaje,
                function (data, result) {
                    console.log(data);
                    console.log(result);
                    vm.enviando = false;

                    vm.email = '';
                    vm.nombre = '';
                    vm.asunto = '';
                    vm.mensaje = '';
                });

        }

        function getSubString(texto, length) {
            return texto.length > length ? texto.substring(0, length) + "..." : texto;
        }

        $scope.$watch('mainCtrl.textFiltro', function (newVal, oldVal) {
            if (newVal != oldVal && newVal != undefined) {
                filterByText();
                console.log(vm.textFiltro);
            }
        });

        function filterByText() {
            MainService.search = vm.textFiltro;
            $location.path('/resultados');

            $timeout(function () {
                vm.textFiltro = '';
            }, 1000);
        }
    }

    MainService.$inject = ['$rootScope'];
    function MainService($rootScope) {
        this.search = '';
        this.origen = '/main';

        this.listen = function (callback) {
            $rootScope.$on('result', callback);
        };

        this.broadcast = function () {
            $rootScope.$broadcast('result');
        };

    }

})();