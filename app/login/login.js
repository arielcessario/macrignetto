(function () {
    'use strict';
    angular.module('login', [])
        .component('acLogin', acLogin())
        .service('LoginService', LoginService);

    ///// COMPONENTE LOGIN /////
    function acLogin() {
        return {
            bindings: {
                loginOk: '<',
                loginKo: '<'
            },
            templateUrl: 'login/login.html',
            controller: AcLoginController
        }
    }

    AcLoginController.$inject = ['FireVars', 'Model', '$location', '$scope', 'LoginService'];
    /**
     * @constructor
     */
    function AcLoginController(FireVars, Model, $location, $scope, LoginService) {
        var vm = this;
        vm.email = '';
        vm.password = '';
        vm.oldPassword = '';
        vm.newPassword = '';
        vm.nombre = '';
        vm.apellido = '';
        vm.panel = 1;

        vm.isLogged = false;

        //FUNCIONES
        vm.login = login;
        vm.logout = logout;
        vm.createUser = createUser;
        vm.resetPassword = resetPassword;
        vm.changePassword = changePassword;

        LoginService.listen(function(){
            vm.showLoginPanel = LoginService.showLoginPanel;
        });

        function changePassword() {
            FireVars._FIREREF.changePassword({
                email       : vm.email,
                oldPassword : vm.oldPassword,
                newPassword : vm.newPassword
            }, function(error) {
                if (error) {
                    switch (error.code) {
                        case "INVALID_PASSWORD":
                            console.log("The specified user account password is incorrect.");
                            break;
                        case "INVALID_USER":
                            console.log("The specified user account does not exist.");
                            break;
                        default:
                            console.log("Error changing password:", error);
                    }
                } else {
                    vm.oldPassword = '';
                    vm.newPassword = '';
                    console.log("User password changed successfully!");
                }
            });
        }

        function resetPassword() {
            console.log(vm.email);
            var credentials = {email: vm.email};
            FireVars._FIREREF.resetPassword(credentials, function(error) {
                console.log(error);
                if (error) {
                    switch (error.code) {
                        case "INVALID_USER":
                            console.log("The specified user account does not exist.");
                            break;
                        default :
                            console.log("Error resetting password:", error);
                    }
                } else {
                    vm.email = '';
                    console.log("Password reset email sent successfully");
                }
            });
        }


        function logout(){
            FireVars._FIREREF.unauth();
            vm.isLogged = false;
            vm.showLoginPanel = false;
            LoginService.isLogged = false;
            $location.path('/main');
            LoginService.broadcast();
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
                vm.email = '';
                vm.password = '';
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
                    LoginService.isLogged = true;
                    vm.usuario = getName(authData);
                    //$location.path(vm.loginOk);
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    LoginService.broadcast();
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
                    //return authData.password.email.replace(/@.*/, '');
                    return authData.password.email;
                case 'twitter':
                    return authData.twitter.displayName;
                case 'facebook':
                    return authData.facebook.displayName;
                case 'google':
                    return authData.google.displayName;
            }
        }
    }

    LoginService.$inject = ['$rootScope'];
    function LoginService($rootScope) {
        this.isLogged = false;
        this.showLoginPanel = false;
        this.origen = '/main';

        this.listen = function (callback) {
            $rootScope.$on('login', callback);
        };

        this.broadcast = function () {
            $rootScope.$broadcast('login');
        };

    }

})();