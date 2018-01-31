/**
 * Feature Models Controller
 */
angular.module('controllers').controller('featureModels', ['$scope', '$http', 'account',
  function ($scope, $http, account) {
    'use strict';

    /**
     * 初始化变量
     */
    $scope.transmitting = false;
    $scope.models = [];
    $scope.deleteModelId = '';
    $scope.systemKey = [
      {
        name: 'sort',
        value: '排序'
      },
      {
        name: 'thumbnail',
        value: '缩略图'
      },
      {
        name: 'title',
        value: '标题'
      },
      {
        name: 'url',
        value: '链接'
      }
    ];
    $scope.editAuth = true;

    /**
     * 读取内容模型列表
     */
    $http.get('/api/models', {
      params: { type: 'feature' }
    }).then(function (res) {
      $scope.models = res.data;
    }, function () {
      $scope.$emit('notification', {
        type: 'danger',
        message: '读取内容模型失败'
      });
    });

    /**
     * 删除推荐位模型
     */
    $scope.deleteModel = function () {
      $scope.transmitting = true;

      $http.delete('/api/models/' + $scope.deleteModelId)
        .then(function () {
          for (var i = 0; i < $scope.models.length; i++) {
            if ($scope.deleteModelId === $scope.models[i]._id) {
              $scope.models.splice(i, 1);

              $('#deleteModal').modal('hide');

              $scope.transmitting = false;

              return $scope.$emit('notification', {
                type: 'success',
                message: '删除推荐位成功'
              });
            }
          }
        }, function () {
          $scope.$emit('notification', {
            type: 'danger',
            message: '删除推荐位失败'
          });
        });
    };
  }
]);
