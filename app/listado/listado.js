(function () {
    'use strict';
    angular.module('listado', ['ngRoute'])
        .controller('ListadoCtrl', ListadoCtrl);


    ListadoCtrl.$inject = ['FireService', 'FireModel', '$timeout'];
    function ListadoCtrl(FireService, FireModel, $timeout) {

        var vm = this;
        vm.propiedades = [];
        vm.filteredPropiedades = FireService.createArrayRef(FireModel.refPropiedades);
        vm.direcciones = FireService.cacheFactory(FireModel.refDirecciones);
        vm.monedas = FireService.cacheFactory(FireModel.refMonedas);

        vm.text = '';

        vm.filteredPropiedades.$loaded(function (data) {
            vm.propiedades = vm.filteredPropiedades;

            for (var i = 0; i < data.length; i++) {
                vm.filteredPropiedades[i].direcciones = vm.direcciones.$load(data[i].direccion);
            }
            for (var i = 0; i < data.length; i++) {
                vm.filteredPropiedades[i].monedas = vm.monedas.$load(data[i].moneda);

                vm.filteredPropiedades[i].monedas[0].$loaded(function(data){
                    console.log(data.nombre);
                });

            }
        });


        vm.moneda = {};
        vm.arrMonedas = FireService.createArrayRef(FireModel.refMonedas, 'status', 'true', 'true');
        vm.arrMonedas.$loaded(function (data) {
            vm.moneda = data[0];
        });

        vm.filtro = "";
        vm.filtrar = function () {
            console.log(vm.text);
            vm.filteredPropiedades = vm.propiedades.filter(function (e, i, a) {
                console.log(e.titulo.indexOf(vm.text) > -1);
                return (e.titulo.indexOf(vm.text) > -1) ? e : null;
            });

            console.log(vm.filteredPropiedades);
        };


        //vm.direcciones = FireService.cacheFactory();


        //vm.casa = Factory.casa;
        //vm.direccion = Factory.direccion;
        //vm.casas = DbFactory.createArrayRef(Factory.refCasas);
        //vm.direcciones = DbFactory.createArrayRef(Factory.refDirecciones);
        //
        //vm.dirs = dirCache(DBGlobals.fb.child('/direccion/'));
        //
        //FbVars.cachedDirecciones = [];
        //vm.test = FbService.cacheFactory(FbModel.refDirecciones, FbVars.cachedDirecciones);
        //
        //console.log(vm.test);


        //
        //var refPrueba = new Firebase('https://inmobiliarias.firebaseio.com/casa/-KAozsPqNiZ3cGbiFNIh');
        //var prueba = $firebaseObject(refPrueba);
        //prueba.$bindTo($scope, "listadoCtrl.prueba");


    }
})();