(function () {
    'use strict';

    angular.module('acContacto', [])
        .component('acContacto', acContacto());


    ///// Contactenos /////
    function acContacto() {
        return {
            templateUrl: 'ac-contacto/ac-contacto.html',
            controller: AcContactoController
        }
    }

    AcContactoController.$inject = ['ContactsService'];
    /**
     * @constructor
     */
    function AcContactoController(ContactsService) {
        var vm = this;
        vm.email = '';
        vm.nombre = '';
        vm.mensaje = '';
        vm.asunto = '';
        vm.enviado = false;
        vm.enviando = false;

        //FUNCIONES
        vm.sendMail = sendMail;


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
