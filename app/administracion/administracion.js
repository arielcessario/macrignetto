(function () {
    'use strict';
    angular.module('administracion', ['ngRoute'])
        .controller('AdministracionCtrl', AdministracionCtrl);


    AdministracionCtrl.$inject = ['FireModel', 'FireService', '$scope'];
    function AdministracionCtrl(FireModel, FireService, $scope) {

        var vm = this;
        vm.panel = 'user.html';

        vm.datosGenerales = false;
        vm.especificaciones = false;
        vm.ubicacion = false;
        vm.fotos = false;
        vm.isUpdate = false;

        //Modelos
        vm.refPropiedad = FireModel.refPropiedades;
        vm.arrPropiedad = FireService.createArrayRef(vm.refPropiedad);
        vm.propiedad = {};
        vm.refDireccion = FireModel.refDirecciones;
        vm.arrDireccion = FireService.createArrayRef(vm.refDireccion);
        vm.direccion = {};

        vm.arrOtro = FireService.createArrayRef(FireModel.refOtros);
        vm.arrOtroActivo = FireService.createArrayRef(FireModel.refOtros, 'status', 'true', 'true');
        vm.otro = {};

        vm.arrServicio = FireService.createArrayRef(FireModel.refServicios);
        vm.arrServicioActivo = FireService.createArrayRef(FireModel.refServicios, 'status', 'true', 'true');
        vm.servicio = {};

        vm.arrGeneral = FireService.createArrayRef(FireModel.refGenerales);
        vm.arrGeneralActivo = FireService.createArrayRef(FireModel.refGenerales, 'status', 'true', 'true');
        vm.general = {};

        vm.arrMoneda = FireService.createArrayRef(FireModel.refMonedas);
        vm.arrMonedaActivo = FireService.createArrayRef(FireModel.refMonedas, 'status', 'true', 'true');
        vm.moneda = {};

        vm.arrTipoPropiedad = FireService.createArrayRef(FireModel.refTiposPropiedad);
        vm.arrTipoPropiedadActivo = FireService.createArrayRef(FireModel.refTiposPropiedad, 'status', 'true', 'true');
        vm.tipoPropiedad = {};

        vm.arrTipoCalle = FireService.createArrayRef(FireModel.refTiposCalle);
        vm.arrTipoCalleActivo = FireService.createArrayRef(FireModel.refTiposCalle, 'status', 'true', 'true');
        vm.tipoCalle = {};

        // Eventos de carga

        vm.arrServicioActivo.$loaded(function (data) {
            console.log(data);
        });

        vm.loadedMonedas = vm.arrMonedaActivo.$loaded(function (data) {
            vm.propiedad.moneda = data[0].$id;
        });

        vm.loadedTiposPropiedad = vm.arrTipoPropiedadActivo.$loaded(function (data) {
            vm.propiedad.tipoPropiedad = data[0].$id;
        });

        vm.loadedTiposCalle = vm.arrTipoCalleActivo.$loaded(function (data) {
            vm.propiedad.tipoCalle = data[0].$id;
        });

        vm.loadedOtro = vm.arrOtro.$loaded(function (data) {

        });

        vm.log = function () {
            //console.log(vm.propiedad);
        };

        $scope.$watch('administracionCtrl.panel', function () {

            vm.datosGenerales = true;
            vm.especificaciones = false;
            vm.ubicacion = false;
            vm.fotos = false;
        });


        vm.savePropiedad = savePropiedad;
        vm.navPropiedad = navPropiedad;


        function savePropiedad() {

            if(vm.isUpdate){
                console.log('entra');
                vm.arrPropiedad.$save(vm.propiedad).then(function(data){
                    console.log(data);
                }).catch(function(data){
                    console.log(data);
                });

            }else{
                vm.arrPropiedad.$add(FireService.formatObj(vm.propiedad)).then(function (data) {
                    var propiedad = data;
                    var key = data.key();

                    vm.arrDireccion.$add(vm.direccion).then(
                        function (data) {
                            data.child('propiedad').child(key).set(true);
                            propiedad.child('direccion').child(data.key()).set(true);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });


                    for(var i = 0; i< Object.getOwnPropertyNames(vm.propiedad.moneda).length; i++){
                        FireModel.refMonedas.child(Object.getOwnPropertyNames(vm.propiedad.moneda)[i]).child('propiedad').child(key).set(true);
                    }

                    for(var i = 0; i< Object.getOwnPropertyNames(vm.propiedad.tipoPropiedad).length; i++){
                        FireModel.refTiposPropiedad.child(Object.getOwnPropertyNames(vm.propiedad.tipoPropiedad)[i]).child('propiedad').child(key).set(true);
                    }

                    for(var i = 0; i< Object.getOwnPropertyNames(vm.propiedad.tipoCalle).length; i++){
                        FireModel.refTiposCalle.child(Object.getOwnPropertyNames(vm.propiedad.tipoCalle)[i]).child('propiedad').child(key).set(true);
                    }

                    for(var i = 0; i< Object.getOwnPropertyNames(vm.propiedad.otro).length; i++){
                        FireModel.refOtros.child(Object.getOwnPropertyNames(vm.propiedad.otro)[i]).child('propiedad').child(key).set(true);
                    }

                    for(var i = 0; i< Object.getOwnPropertyNames(vm.propiedad.servicio).length; i++){
                        FireModel.refServicios.child(Object.getOwnPropertyNames(vm.propiedad.servicio)[i]).child('propiedad').child(key).set(true);
                    }

                    for(var i = 0; i< Object.getOwnPropertyNames(vm.propiedad.general).length; i++){
                        FireModel.refGenerales.child(Object.getOwnPropertyNames(vm.propiedad.general)[i]).child('propiedad').child(key).set(true);
                    }


                }).catch(function (error) {
                    console.log(error);
                });
            }

            vm.isUpdate = false;



        }

        function navPropiedad() {

            if (vm.datosGenerales) {
                vm.datosGenerales = false;
                vm.especificaciones = true;
                vm.ubicacion = false;
                vm.fotos = false;
                return;
            }
            if (vm.especificaciones) {
                vm.datosGenerales = false;
                vm.especificaciones = false;
                vm.ubicacion = true;
                vm.fotos = false;
                return;
            }
            if (vm.ubicacion) {
                vm.datosGenerales = false;
                vm.especificaciones = false;
                vm.ubicacion = false;
                vm.fotos = true;
                return;
            }


        }


    }
})();