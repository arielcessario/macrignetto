(function () {
    'use strict';
    angular.module('login', [])
        .controller('LoginController', LoginController)
        .component('acLogin', acLogin());


    LoginController.$inject = [];
    function LoginController() {


    }
    ///// COMPONENTE LOGIN /////
    function acLogin() {
        return {
            bindings: {
                loginOk: '<',
                loginKo: '<'
            },
            template: '<div class="login" ng-if="!$ctrl.isLogged">' +
            '<div class="ingreso" ng-if="!$ctrl.creando">' +
            '<div class="input" >' +
            '<input type="text" ng-model="$ctrl.email">' +
            '<label>Email</label>' +
            '</div>' +
            '<div class="input">' +
            '<input type="password" ng-model="$ctrl.password">' +
            '<label>Password</label>' +
            '</div>' +
            '</div>' +
            '<div class="creacion" ng-if="$ctrl.creando">' +
            '<div class="input"  >' +
            '<input type="text" ng-model="$ctrl.nombre">' +
            '<label>Nombre</label>' +
            '</div>' +
            '<div class="input"  >' +
            '<input type="text" ng-model="$ctrl.email">' +
            '<label>Email</label>' +
            '</div>' +
            '<div class="input">' +
            '<input type="password" ng-model="$ctrl.password">' +
            '<label>Password</label>' +
            '</div>' +
            '</div>' +
            '<div class="botonera">' +
            '<button ng-if="!$ctrl.creando" ng-click="$ctrl.login()">Ingresar</button>' +
            '<button ng-if="!$ctrl.creando" ng-click="$ctrl.creando = true;">Nuevo</button>' +
            '<button ng-if="$ctrl.creando" ng-click="$ctrl.creando = false;">Ingresar</button>' +
            '<button ng-if="$ctrl.creando" ng-click="$ctrl.createUser();">Crear</button>' +
            '</div>' +
            '</div>' +
            '<div  ng-if="$ctrl.isLogged" class="logout">' +
            '<button ng-click="$ctrl.logout()">Salir</button>' +
            '</div> ',
            controller: AcLoginController
        }
    }

    AcLoginController.$inject = ['FireVars', 'Model', '$location', '$scope'];
    /**
     * @constructor
     */
    function AcLoginController(FireVars, Model, $location, $scope) {
        var vm = this;
        vm.email = '';
        vm.password = '';
        vm.nombre = '';
        vm.creando = false;

        vm.isLogged = false;

        vm.login = login;
        vm.logout = logout;
        vm.createUser = createUser;


        function logout(){
            FireVars._FIREREF.unauth();
            vm.isLogged = false;
            $location.path('/main');
        }
        function createUser() {

            Model.refUsuarios.createUser({
                email    : vm.email,
                password : vm.password
            }, function(error, userData) {
                if (error) {
                    console.log("Error creating user:", error);
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);
                    login();
                }
            });
        }

        function authHandler(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
                //$location.path(vm.loginKo);
            } else {
                console.log("Authenticated successfully with payload:", authData);
            }
        }

        function login() {
            FireVars._FIREREF.authWithPassword({
                email: vm.email,
                password: vm.password
            }, authHandler);
        }

        FireVars._FIREREF.onAuth(function (authData) {

            if (authData) {
                var userRef = Model.refUsuarios.child(authData.uid);
                userRef.once("value", function (snapshot) {
                    var exist = snapshot.exists();

                    if (!exist) {
                        // save the user's profile into the database so we can list users,
                        // use them in Security and Firebase Rules, and show profiles
                        Model.refUsuarios.child(authData.uid).set({
                            provider: authData.provider,
                            nombre: getName(authData),
                            email: getEmail(authData),
                            rol: 1
                        });
                    }

                    vm.isLogged = true;
                    //$location.path(vm.loginOk);
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }
        });
        function getEmail(authData) {
            switch (authData.provider) {
                case 'password':
                    return authData.password.email;
                case 'twitter':
                    return authData.twitter.displayName;
                case 'facebook':
                    return authData.facebook.email;
                case 'google':
                    return authData.google.email;
            }
        }

        function getName(authData) {
            switch (authData.provider) {
                case 'password':
                    return authData.password.email.replace(/@.*/, '');
                case 'twitter':
                    return authData.twitter.displayName;
                case 'facebook':
                    return authData.facebook.displayName;
                case 'google':
                    return authData.google.displayName;
            }
        }
    }

})();