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

        //FUNCIONES
        vm.prevMonth = prevMonth;
        vm.nextMonth = nextMonth;
        vm.verNoticia = verNoticia;

        /*
        NotasService.get().then(function (data) {
            console.log(data);
        });
        */

        NotasService.getUltimasNotas().then(function(data){
            console.log(data);
            vm.notas = data;
        });

        EventosService.get().then(function (data) {
            vm.listaEventos = data;
            console.log(vm.listaEventos);

            /*
             var year = vm.anio;
             var month = vm.agendaMes.id;

             var fecha = data.fecha.format('dd-mm-yyyy');
             year = parseInt(fecha.split('-')[2]);
             month = parseInt(fecha.split('-')[1]) - 1;
             vm.agendaMes = vm.meses[month];
             */

            getEventos(2016, 5);
        });

        function getEventos(year, month) {
            var diasMes = new Date(year, month + 1, 0).getDate();
            vm.listaEventos = [];
            var event = {};

            for (var i = 1; i < diasMes + 1; i++) {

                event = {dia: i, evento: undefined};
                for (var x = 0; x < 29; x++) {
                    event.evento = {dia: i, evento: undefined};
                }
                vm.listaEventos.push(event);
            }
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