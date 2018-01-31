/**
 * 检查用户是否登录
 */
angular.module('services').factory('checkSignIn', ['$rootScope', '$state', 'ipCookie',
  function ($rootScope, $state, ipCookie) {
    'use strict';
    
    return function () {
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if (!ipCookie('lizecmsSid') && toState.name !== 'signIn') {
          event.preventDefault();
          $state.go('signIn');
        }
      });
    };
  }
]);
