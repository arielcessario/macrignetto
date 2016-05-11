(function () {
    'use strict';

    angular.module('Model', [])
        .factory('Model', Model);

    Model.$inject = ['FireVars'];
    /**
     * @description Modelo de datos de la aplicación
     * @returns {Model}
     * @constructor
     */
    function Model(FireVars) {

        var factory = this;

        factory.propiedad = {
            titulo: '',
            descripcion: '',
            direccion: {},
            fotos: {},
            superficie_total: '',
            superficie_cubierta: '',
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

        factory.refPropiedades = FireVars._FIREREF.child('/propiedad/');

        factory.inmobiliaria = {
            nombre: '',
            direccion: {},
            web: '',
            propiedades: {},
            usuarios: {}
        };

        factory.refInmobiliarias = FireVars._FIREREF.child('/inmobiliaria/');

        factory.otro = {
            nombre: '',
            status: true,
            propiedades: {}
        };

        factory.refOtros = FireVars._FIREREF.child('/otro/');

        factory.general = {
            nombre: '',
            status: true,
            propiedades: {}
        };

        factory.refGenerales = FireVars._FIREREF.child('/general/');

        factory.servicio = {
            nombre: '',
            status: true,
            propiedades: {}
        };

        factory.refServicios = FireVars._FIREREF.child('/servicio/');

        factory.tipoPropiedad = {
            nombre: '',
            status: true,
            propiedades: {}
        };

        factory.refTiposPropiedad = FireVars._FIREREF.child('/tipo_propiedad/');

        factory.foto = {
            nombre: '',
            main: false,
            propiedades: {}
        };

        factory.refFotos = FireVars._FIREREF.child('/foto/');

        factory.moneda = {
            nombre: '',
            cambio: 0.0,
            propiedades: {}
        };

        factory.refMonedas = FireVars._FIREREF.child('/moneda/');

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
            propiedades: {}
        };

        factory.refDirecciones = FireVars._FIREREF.child('/direccion/');

        factory.localidad = {
            nombre: '',
            provincia: {},
            direccion: {}
        };

        factory.refLocalidades = FireVars._FIREREF.child('/localidad/');

        factory.provincia = {
            nombre: '',
            localidad: {}
        };

        factory.refProvincias = FireVars._FIREREF.child('/provincia/');

        factory.tiposCalle = {
            nombre: '',
            status: true
        };

        factory.refTiposCalle = FireVars._FIREREF.child('/tipos_calle/');

        factory.usuario = {
            nombre: '',
            mail: '',
            inmobiliaria: {}
        };

        factory.refUsuarios = FireVars._FIREREF.child('/usuario/');

        return factory;
    }

})();

/**
 * Created by QTI on 26/2/2016.
 */
