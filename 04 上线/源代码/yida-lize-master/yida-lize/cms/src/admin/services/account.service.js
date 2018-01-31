/**
 * 获取用户信息
 */
angular.module('services').factory('account', ['$rootScope', '$http', '$q', '$cacheFactory',
  function ($rootScope, $http, $q, $cacheFactory) {
    'use strict';

		/**
		 * 定义缓存
		 */
		var cache = $cacheFactory('account');

		/**
		 * 主体
		 */
		return {
			get: function () {
				var deferred = $q.defer();

				if (cache.get('user')) {
					deferred.resolve(cache.get('user'));
				} else {
					$http.get('/api/account')
						.then(function (res) {
							var data = res.data;

							cache.put('user', data);

							deferred.resolve(data);
						}, function (res) {
							deferred.reject(res.data);
						});
				}

				return deferred.promise;
			},
			reset: function () {
				cache.remove('user');
			}
		};
  }
]);
