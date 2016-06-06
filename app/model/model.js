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

        factory.usuario = {
            nombre: '',
            apellido: '',
            email: '',
            rol: '',
            comentarios: '',
            notas: '',
            status: 1,
            fecha: Firebase.ServerValue.TIMESTAMP
        };

        factory.refUsuarios = FireVars._FIREREF.child('/usuarios/');

        factory.evento = {
            titulo: '',
            detalle: '',
            fotos: '',
            status: 1,
            fecha: Firebase.ServerValue.TIMESTAMP,
            usuario: ''
        };

        factory.refEventos = FireVars._FIREREF.child('/eventos/');

        factory.comic = {
            fecha: Firebase.ServerValue.TIMESTAMP,
            imagen: '',
            comentarios: '',
            usuario: '',

            status: 1
        };

        factory.refComics = FireVars._FIREREF.child('/comics/');

        factory.nota = {
            titulo: '',
            detalle: '',
            fuente: '',
            fotos: '',
            comentarios: '',
            fecha: Firebase.ServerValue.TIMESTAMP,
            destacada: false,
            status: 1,
            usuario: '',
            categoria: ''
        };

        factory.refNotas = FireVars._FIREREF.child('/notas/');

        factory.comentario = {
            titulo: '',
            detalles: '',
            usuario: '',
            padre: '',
            fecha: Firebase.ServerValue.TIMESTAMP,
            status: true
        };

        factory.refComentarios = FireVars._FIREREF.child('/comentarios/');

        factory.revista = {
            titulo: '',
            edicion: '',
            link: '',
            usuario: '',
            fecha: Firebase.ServerValue.TIMESTAMP
        };

        factory.refRevistas = FireVars._FIREREF.child('/revistas/');

        return factory;
    }

})();

/**
 * Created by QTI on 26/2/2016.
 */
