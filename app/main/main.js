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
        //vm.eventos = [];
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
        vm.getLastComment = getLastComment;

        vm.arrComentarios = FireService.cacheFactory(Model.refComentarios);
        vm.arrUsuarios = FireService.cacheFactory(Model.refUsuarios);


        function getLastComment(nota) {
            var comentario = vm.arrComentarios.$load(nota.comentarios);
            nota.comentario = comentario;

            var comment = FireService.createObjectRef(Model.refComentarios.child(nota.comentario[nota.comentario.length - 1].$id));

            comment.$loaded(function (data) {

                var id = {};
                id[data.usuario] = true;
                var usuario = vm.arrUsuarios.$load(id);
                comentario.usuarioResponse = usuario;
            });


            return comentario;
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
                nota.url_id = 'nota/' + data[i].$id;

                vm.notas.push(nota);
            }
        });


        getLastEvento();

        function getLastEvento() {
            EventosService.getLastEvento().then(function (data) {
                var year = vm.anio;
                var month = vm.agendaMes.id;

                var fecha = new Date(data.fecha).format('dd-mm-yyyy');
                year = parseInt(fecha.split('-')[2]);
                month = parseInt(fecha.split('-')[1]) - 1;
                vm.agendaMes = vm.meses[month];

                getEventos(year, month);
            });
        }


        function getEventos(year, month) {

            EventosService.getEventosByFecha(year, month).then(function (data) {
                var diasMes = new Date(year, month + 1, 0).getDate();
                vm.listaEventos = [];
                var event = {};

                for (var i = 0; i < (new Date(year, month, 1).getDay()); i++) {
                    event = {dia: '', evento: undefined};
                    vm.listaEventos.push(event);
                }

                for (var i = 1; i < diasMes + 1; i++) {
                    event = {dia: i, evento: undefined};
                    for (var x = 0; x < data.length; x++) {
                        if ((new Date(data[x].fecha)).getDate() == i) {
                            event.evento = data[x];
                        }
                    }
                    vm.listaEventos.push(event);
                }

                for (var i = diasMes + 2; i < 50; i++) {
                    event = {dia: '', evento: undefined};
                    vm.listaEventos.push(event);
                }

                vm.evento = data[0];
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
            $location.path('/nota/' + id);
        }

        function verComic(id) {
            $location.path('/comic/' + id);
        }

        function selectEvento(evento) {
            if (evento != undefined) {
                vm.evento = evento;
            }
        }

        ComicsService.getUltimosComics().then(function (data) {

            for(var i=0; i < data.length; i++) {
                var comic = {};
                comic = data[i];
                comic.url_id = 'comic/' + data[i].$id;

                vm.comics.push(comic);
            }

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