/**
 * Main Controller
 */
angular.module('controllers').controller('main', ['$scope', '$http',
	function ($scope, $http) {
		'use strict';

		/**
		 * 初始化变量
		 */
		$scope.website = {
			hostname: window.location.hostname,
			origin: window.location.origin
		};
		$scope.systemInfo = {};
		$scope.officialSystemInfo = {};
		$scope.nodeInfo = {};
		$scope.databaseInfo = {};
		$scope.contentsTotal = '';
		$scope.mediaTotal = '';
		$scope.readingList = {};
		$scope.versionIsLatest = true;
    $scope.sponsor = 99;

		$http.get('/api/dashboard')
			.then(function (res) {
				var data = res.data;

				$scope.systemInfo = data.systemInfo;
				$scope.nodeInfo = data.nodeInfo;
				$scope.databaseInfo = data.databaseInfo;
				$scope.contentsTotal = data.contentsTotal;
				$scope.mediaTotal = data.mediaTotal;
				$scope.readingList = data.readingList;
			}, function () {
				$scope.$emit('notification', {
					type: 'danger',
					message: '读取控制面板数据失败'
				});
			});

		/**
		 * 统计
		 */
		$http.put('/api/statistics', {
			hostname: $scope.website.hostname
		});
	}
]);
