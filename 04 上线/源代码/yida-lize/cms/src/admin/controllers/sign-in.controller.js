/**
 * Sign In Controller
 */
angular.module('controllers').controller('signIn', ['$scope', '$timeout', '$state', '$http',
  function ($scope, $timeout, $state, $http) {
    'use strict';

    $scope.transmitting = false;
    $scope.username = '';
    $scope.password = '';
    $scope.captchaCode = '';
    $scope.autoSignIn = false;
    $scope.wrongUsernameOrPassword = false;

    function resetUsernameAndPassword () {
      $scope.wrongUsernameOrPassword = false;
    }

    function getCaptcha () {
      $http.get('/api/account/captcha').success( function(response) {
        angular.element("#captcha").html(response); 
      });
    }

    getCaptcha();
    
    $scope.changeCaptcha = function () {
      getCaptcha();
    }

    $scope.$watch('username', resetUsernameAndPassword);
    $scope.$watch('password', resetUsernameAndPassword);

    $scope.signIn = function () {
      $scope.transmitting = true;

      $http.put('/api/account/sign-in', {
        username: $scope.username,
        password: $scope.password,
        autoSignIn: $scope.autoSignIn,
        captchaCode: $scope.captchaCode
      }).then(function () {
        $state.go('main');
      }, function (res) {
        $scope.wrongUsernameOrPassword = true;
        $scope.animateShake = true;
        $timeout(function () {
          $scope.animateShake = false;
          $scope.transmitting = false;
        }, 600);
      });
    };
  }
]);
