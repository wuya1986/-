/**
 * Account Controller
 */
angular.module('controllers').controller('account', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'account',
  function ($scope, $rootScope, $state, $stateParams, $http, account) {
    'use strict';

    /**
     * 初始化变量
     */
    $scope.transmitting = true;
    $scope.username = '';
    $scope.oldUsername = '';
    $scope.fullname = '';
    $scope.password = '';
    $scope.confirmpwd = '';
    $scope.editAuth = false;

    /**
     * 获取个人信息
     */
    account.get()
      .then(function (user) {
        $scope.username = user.username;
        $scope.oldUsername = user.username;
        $scope.fullname = user.fullname;

        $scope.transmitting = false;
      }, function () {
        $scope.$emit('notification', {
          type: 'danger',
          message: '帐号更新失败'
        });
      });

    /**
     * 更新个人信息
     */
    $scope.update = function () {
      $scope.transmitting = true;

      var user = {
        fullname: $scope.fullname,
        username: $scope.username
      };

      if ($scope.password) user.password = $scope.password;

      $http.put('/api/account', user)
        .then(function () {
          account.reset();

          $scope.$emit('mainUserUpdate');

          $scope.transmitting = false;

          $scope.$emit('notification', {
            type: 'success',
            message: '帐号更新成功'
          });
        }, function () {
          $scope.transmitting = false;

          $scope.$emit('notification', {
            type: 'danger',
            message: '帐号更新失败'
          });
        });
    };
  }
]);
