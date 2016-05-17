(function () {
    'use strict';
    angular.module('main', ['ngRoute'])
        .controller('MainController', MainController);


    MainController.$inject = ['$scope', 'NotasService', 'EventosService', '$sce'];
    function MainController($scope, NotasService, EventosService, $sce) {

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

        NotasService.get().then(function (data) {
            //vm.notas = data;
            console.log(vm.notas);

            if(data != null || data.length > 0) {
                for (var i = 0; i < 3; i++) {
                    var nota = {};
                    nota.destacada = data[i].destacada;
                    nota.detalle = $sce.trustAsHtml((data[i].detalle.length > 100 ? data[i].detalle.substring(0, 100) + "....." : data[i].detalle));
                    nota.fotos = data[i].fotos;
                    nota.fuente = data[i].fuente;
                    nota.status = data[i].status;
                    nota.titulo = data[i].titulo.length > 50 ? data[i].titulo.substring(0, 50) + "..." : data[i].titulo;
                    //nota.titulo = $sce.trustAsHtml((data[i].titulo.length > 25 ? data[i].titulo.substring(0, 25) + "....." : data[i].titulo));

                    vm.notas.push(nota);
                }
            }
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
    }
})();