(function () {
    'use strict';
    angular.module('main', ['ngRoute'])
        .controller('MainController', MainController);


    MainController.$inject = ['$scope', 'NotasService', 'EventosService', '$sce', '$location'];
    function MainController($scope, NotasService, EventosService, $sce, $location) {

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
        vm.agendaMes = vm.meses[vm.fecha.getMonth()];
        vm.agendaAnio = vm.anio;
        vm.listaEventos = [];
        vm.evento = {};
        vm.eventos = [];

        //FUNCIONES
        vm.prevMonth = prevMonth;
        vm.nextMonth = nextMonth;
        vm.verNoticia = verNoticia;


        NotasService.getUltimasNotas().then(function (data) {
            //console.log(data);
            vm.notas = data;
        });

        EventosService.get().then(function (data) {

            data.sort(function (a, b) {
                return a.fecha - b.fecha;
            });

            vm.eventos = data;
            var year = vm.anio;
            var month = vm.agendaMes.id;

            var max = data.length - 1;
            var fecha = new Date(data[max].fecha);

            year = parseInt(fecha.getFullYear());
            month = parseInt(fecha.getMonth()) - 1;
            getEventos(year, month);
        });

        function getEventos(year, month) {


            var diasMes = new Date(year, month + 1, 0).getTime();
            var diasMesNext = new Date(year, month + 1, 30).getTime();

            vm.listaEventos = [];
            var event = {};

            for (var i = 0; i < vm.eventos.length; i++) {

                event = {dia: i, evento: undefined};
                if (vm.eventos[i].fecha > diasMes && vm.eventos[i].fecha < diasMesNext) {
                    event.evento = {dia: i, evento: vm.eventos[i]};
                }
                vm.listaEventos.push(event);
            }
            console.log(vm.listaEventos);

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
    }
})();