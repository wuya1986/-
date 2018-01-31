/**
 * 检查用户权限
 */
angular.module('services').factory('checkAuthResolve', ['$rootScope', '$q', '$state', 'account',
  function ($rootScope, $q, $state, account) {
    'use strict';

		return function (category, action) {
			var deferred = $q.defer();

		  return deferred.resolve();
		};
  }
]);
