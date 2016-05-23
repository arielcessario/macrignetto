(function () {
    'use strict';

    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;

    angular.module('main', ['ngRoute'])
        .controller('MainController', MainController);


    MainController.$inject = ['$scope', 'NotasService', 'EventosService', '$sce', '$location', 'ContactsService', 'ComicsService'];
    function MainController($scope, NotasService, EventosService, $sce, $location, ContactsService, ComicsService) {

        var vm = this;
        vm.notas = [];
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
        vm.agendaMes = vm.meses[vm.fecha.getMonth() + 1];
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
        vm.sendMail = sendMail;
        vm.selectEvento = selectEvento;


        NotasService.getUltimasNotas().then(function (data) {
            //console.log(data);
            vm.notas = data;
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

            var diasMes = new Date(year, month, 0).getDate();
            vm.listaEventos = [];
            var event = {};
            for (var i = 1; i < diasMes + 1; i++) {
                event = {dia: i, evento: undefined};
                vm.listaEventos.push(event);
            }

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

            vm.evento = vm.listaEventos[0];
            if(vm.listaEventos[0].evento != undefined) {
                vm.evento.detalle = $sce.trustAsHtml(vm.listaEventos[0].evento.detalle);
                vm.evento.titulo = vm.listaEventos[0].evento.titulo;
                vm.evento.fotos = vm.listaEventos[0].evento.fotos;
            }

            //console.log(vm.evento);
            if(vm.evento.evento == undefined) {
                getLastEvento();
            }
        }

        function getLastEvento() {
            EventosService.getLastEvento().then(function (data) {
                data.sort(function (a, b) {
                    return a.fecha - b.fecha;
                });

                //console.log(data[data.length - 1]);

                vm.evento.detalle = $sce.trustAsHtml(data[data.length - 1].detalle);
                vm.evento.titulo = data[data.length - 1].titulo;
                vm.evento.fotos = data[data.length - 1].fotos;
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
            $location.path('/noticias/' + id);
        }

        function selectEvento(evento) {
            console.log(evento);
            if (evento != undefined) {
                vm.evento = evento;
                vm.evento.detalle = $sce.trustAsHtml(evento.detalle);
            }
        }

        /*
         ComicsService.get().then(function (data) {
         console.log(data);
         vm.comics = data;
         })
         */
        ComicsService.getUltimosComics().then(function (data) {
            console.log(data);
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
    }
})();