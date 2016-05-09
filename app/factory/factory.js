(function () {
    'use strict';

    angular.module('inmobiliarias.factory', ['ngRoute'])

        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/factory', {
                templateUrl: 'factory/factory.html',
                controller: 'FactoryCtrl'
            });
        }])

        .controller('FactoryCtrl', FactoryCtrl)
        .service('Factory', Factory);

    function FactoryCtrl() {

    }

    Factory.$inject = [];
    function Factory() {

        var factory = this;

        factory.casa = {
            titulo: '',
            descripcion: '',
            direccion: {},
            fotos: {},
            superficie: '',
            precio: 0.0,
            moneda: {},
            habitaciones: 0,
            banos: 0,
            tipo_propiedad: '',
            servicios_basicos: {},
            generales: {},
            otros: {},
            inmobiliaria: {},
            status: 0,
            fecha_alta: Firebase.ServerValue.TIMESTAMP
        };

        factory.refCasas = 'casa/';

        factory.inmobiliaria = {
            nombre: '',
            direccion: {},
            web: '',
            casas: {},
            usuarios: {}
        };

        factory.refInmobiliarias = 'inmobiliaria/';

        factory.otro = {
            nombre: '',
            casas: {}
        };

        factory.refOtros = 'otro/';

        factory.general = {
            nombre: '',
            casas: {}
        };

        factory.refGenerales = 'general/';

        factory.servicioBasico = {
            nombre: '',
            casas: {}
        };

        factory.refServiciosBasicos = 'servicio_basico/';

        factory.tipoPropiedad = {
            nombre: '',
            casas: {}
        };

        factory.refTiposPropiedad = 'tipo_propiedad/';

        factory.foto = {
            nombre: '',
            main: false,
            casas: {}
        };

        factory.refFotos = 'foto/';

        factory.moneda = {
            nombre: '',
            cambio: 0.0,
            casas: {}
        };

        factory.refMonedas = 'moneda/';

        factory.direccion = {
            nombre: '',
            tipo: {},
            numero: '',
            piso: '',
            puerta: '',
            torre: '',
            cp: '',
            lng: '',
            lat: '',
            localidad: {},
            casas: {}
        };

        factory.refDirecciones = 'direccion/';

        factory.localidad = {
            nombre: '',
            provincia: {},
            direccion: {}
        };

        factory.refLocalidades = 'localidad/';

        factory.provincia = {
            nombre: '',
            localidad: {}
        };

        factory.refProvincias = 'provincia/';

        factory.usuario = {
            nombre: '',
            mail: '',
            inmobiliaria: {}
        };

        factory.refUsuarios = 'usuario/';

        return factory;
    }

})();

