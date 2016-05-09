(function () {
    'use strict';
    angular.module('propiedad', ['ngRoute'])
        .controller('propiedadCtrl', propiedadCtrl);


    propiedadCtrl.$inject = ['DbFactory', 'Factory', '$scope', '$firebaseArray', 'DBGlobals', 'userCache'];
    function propiedadCtrl(DbFactory, Factory, $scope, $firebaseArray, DBGlobals, userCache) {

        var vm = this;
        vm.propiedad = Factory.propiedad;
        vm.direccion = Factory.direccion;
        vm.propiedads = DbFactory.createArrayRef(Factory.refpropiedads);
        vm.direcciones = DbFactory.createArrayRef(Factory.refDirecciones);
        var refpropiedads = new Firebase(DBGlobals.ref + Factory.refpropiedads);

        vm.algo = userCache(refpropiedads);

        //refpropiedads.on('child_added', function (childSnapshotpropiedads, prevChildKey) {
        //
        //    var refpropiedad = new Firebase(DBGlobals.ref + Factory.refpropiedads + childSnapshotpropiedads.key() + '/direcciones/');
        //
        //    refpropiedad.on('child_added', function (childSnapshotpropiedad, prevChildKey) {
        //        var refDir = new Firebase(DBGlobals.ref + Factory.refDirecciones + childSnapshotpropiedad.key());
        //        refDir.on('child_added', function (childSnapshotDir, prevChildKey) {
        //            console.log(childSnapshotDir.val());
        //        });
        //    });
        //});


        //var refDirecciones = new Firebase(DBGlobals.ref + Factory.refDirecciones);
        //var refDirpropiedad = refDirecciones.child('propiedads');
        //refDirecciones.on('child_added', function(childSnapshot, prevChildKey) {
        //    // code to handle new child.
        //    //console.log(childSnapshot.val());
        //});
        //refDirpropiedad.on('child_added', function(childSnapshot, prevChildKey) {
        //    // code to handle new child.
        //    console.log(childSnapshot.val());
        //});


        //var ref = new Firebase(DBGlobals.ref);
        //var nc = new Firebase.util.NormalizedCollection(
        //    ref.child('propiedad'),
        //    ref.child('direccion')
        //).select(
        //    "direcciones.numero",
        //    {key: 'direcciones.propiedads.$key', alias: 'login'}
        //).ref();
        //
        //var join = $firebaseArray(nc);
        //
        //join.$loaded(function (data) {
        //    console.log(data);
        //});


        vm.guardar = guardar;

        function guardar() {

            vm.propiedads.$add(vm.propiedad).then(function (data) {
                console.log(data.key());
                var key = data.key();

                vm.direcciones.$add(vm.direccion).then(
                    function (data) {
                        data.child('propiedads').child(key).set(true);
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            }).catch(function (error) {
                console.log(error);
            });
        }


    }
})();