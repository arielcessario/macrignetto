(function () {
    'use strict';

    angular.module('acFactory', ['ngRoute'])
        .factory('FireService', FireService)
        .factory('FireModel', FireModel)
        .service('FireVars', FireVars);


    FireService.$inject = ['FireVars', '_FIREREF', '$firebaseObject', '$firebaseArray'];
    function FireService(FireVars, _FIREREF, $firebaseObject, $firebaseArray) {
        var service = this;
        service.createObjectRef = createObjectRef;
        service.createArrayRef = createArrayRef;
        service.init = init;
        service.cacheFactory = cacheFactory;
        service.bindTo = bindTo;
        service.getIndex = getIndex;
        service.formatObj = formatObj;
        service.createProvincias = createProvincias;
        service.createLocalidades = createLocalidades;

        return service;

        function createLocalidades() {

            var loc = new Firebase(_FIREREF);
            var contador = 0;

            var locs = [];

            addAnother();

            function addAnother() {
                //loc.child('localidad').push().set({'nombre': '25 de Mayo'});
                loc.child('localidad').push().set({'nombre': locs[contador].nombre});
            }

            loc.child('localidad').on('child_added', function (snap) {

                (new Firebase(_FIREREF)).child('localidad').child(snap.key()).child('provincia').child(locs[contador].provincia).set(true);
                (new Firebase(_FIREREF)).child('provincia').child(locs[contador].provincia).child('localidad').child(snap.key()).set(true);

                contador = contador + 1;
                if (locs.length == contador) {
                    return;
                }
                addAnother();
            });





        }

        function createProvincias() {
            var prov = new Firebase(_FIREREF);
            prov.child('provincia').push().set({'nombre': 'Buenos Aires'});
            prov.child('provincia').push().set({'nombre': 'Buenos Aires-GBA'});
            prov.child('provincia').push().set({'nombre': 'Capital Federal'});
            prov.child('provincia').push().set({'nombre': 'Catamarca'});
            prov.child('provincia').push().set({'nombre': 'Chaco'});
            prov.child('provincia').push().set({'nombre': 'Chubut'});
            prov.child('provincia').push().set({'nombre': 'Córdoba'});
            prov.child('provincia').push().set({'nombre': 'Corrientes'});
            prov.child('provincia').push().set({'nombre': 'Entre Ríos'});
            prov.child('provincia').push().set({'nombre': 'Formosa'});
            prov.child('provincia').push().set({'nombre': 'Jujuy'});
            prov.child('provincia').push().set({'nombre': 'La Pampa'});
            prov.child('provincia').push().set({'nombre': 'La Rioja'});
            prov.child('provincia').push().set({'nombre': 'Mendoza'});
            prov.child('provincia').push().set({'nombre': 'Misiones'});
            prov.child('provincia').push().set({'nombre': 'Neuquén'});
            prov.child('provincia').push().set({'nombre': 'Río Negro'});
            prov.child('provincia').push().set({'nombre': 'Salta'});
            prov.child('provincia').push().set({'nombre': 'San Juan'});
            prov.child('provincia').push().set({'nombre': 'San Luis'});
            prov.child('provincia').push().set({'nombre': 'Santa Cruz'});
            prov.child('provincia').push().set({'nombre': 'Santa Fe'});
            prov.child('provincia').push().set({'nombre': 'Santiago del Estero'});
            prov.child('provincia').push().set({'nombre': 'Tierra del Fuego'});
            prov.child('provincia').push().set({'nombre': 'Tucumán'});


        }


        function init() {
            FireVars._FIREREF = new Firebase(_FIREREF);

        }

        function cacheFactory(ref) {
            var _strCache = ref.path.u[0].toLowerCase();
            var _cache = {};

            if (!FireVars.hasOwnProperty('_cache_' + _strCache)) {
                FireVars['_cache_' + _strCache] = {};
            }

            _cache = FireVars['_cache_' + _strCache];


            _cache.$load = function (_id) {
                var _response = [];
                var ids = (Object.getOwnPropertyNames(_id));

                for (var i = 0; i < ids.length; i++) {

                    if (!_cache.hasOwnProperty(ids[i])) {
                        _cache[ids[i]] = $firebaseObject(ref.child(ids[i]));
                    }
                }

                // Devuelve solos los que pertenecen a ese objeto
                for (var i = 0; i < ids.length; i++) {
                    _response.push(_cache[ids[i]]);
                }
                return _response;
            };
            _cache.$dispose = function () {
                angular.forEach(_cache, function (elem) {
                    elem.$off();
                });
            };
            return _cache;
        }

        function getIndex(key, array) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].$id == key) {
                    return i;
                }
            }
        }

        /**
         * @description formatea objetos que tienen una relación one-to-many, los que son one-to-one los deja igual
         *
         * @param obj
         * @returns {*}
         */
        function formatObj(obj) {
            var props = Object.getOwnPropertyNames(obj);

            for (var i = 0; i < props.length; i++) {
                if (obj[props[i]].hasOwnProperty('$id')) {
                    var key = obj[props[i]].$id;
                    obj[props[i]] = {};
                    obj[props[i]][key] = true;
                }
            }

            return obj;
        }


        /**
         *
         * @param FireObj String del tipo 'nombreController.nombreVar'
         * @param scope
         * @returns {*}
         */
        function bindTo(scope, FireObj) {
            return FireObj.$bindTo(scope, FireObj);
        }

        function createObjectRef(ref) {
            return $firebaseObject(ref);
        }

        function createArrayRef(ref, orderBy, startAt, endAt) {
            if (orderBy == undefined) {

                return $firebaseArray(ref);
            } else {
                var filtered = ref.orderByChild(orderBy).startAt(startAt).endAt(endAt);
                return $firebaseArray(filtered);
            }
        }
    }

    FireVars.$inject = [];
    function FireVars() {

        this._FIREREF = {};

    }


    FireModel.$inject = ['FireVars'];
    /**
     * @description Modelo de datos de la aplicación
     * @returns {FireModel}
     * @constructor
     */
    function FireModel(FireVars) {

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
