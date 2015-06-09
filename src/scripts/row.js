
/* global angular */
angular.module('adf')
  .directive('adfDashboardRow', function ($compile, adfTemplatePath, columnTemplate) {
    'use strict';

    return {
      restrict: 'E',
      replace: true,
      scope: {
        row: '=',
        adfModel: '=',
        editMode: '=',
        options: '='
      },
      templateUrl: adfTemplatePath + 'dashboard-row.html',
      link: function ($scope, $element) {
        if (angular.isDefined($scope.row.columns) && angular.isArray($scope.row.columns)) {
          $compile(columnTemplate)($scope, function(cloned) {
            $element.append(cloned);
          });
        }
      }
    };
  });
