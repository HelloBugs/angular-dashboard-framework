
'use strict';

angular.module('adf')
  .directive('adfWidget', function($log, $modal, dashboard, adfTemplatePath) {

    function preLink($scope){
      var definition = $scope.definition;
      if (definition) {
        var w = dashboard.widgets[definition.type];
        if (w) {
          // pass title
          if (!definition.title){
            definition.title = w.title;
          }

          // set id for sortable
          if (!definition.wid){
            definition.wid = dashboard.id();
          }

          // pass copy of widget to scope
          $scope.widget = angular.copy(w);

          // create config object
          var config = definition.config;
          if (config) {
            if (angular.isString(config)) {
              config = angular.fromJson(config);
            }
          } else {
            config = {};
          }

          // pass config to scope
          $scope.config = config;

          // collapse
          $scope.isCollapsed = false;
        } else {
          $log.warn('could not find widget ' + definition.type);
        }
      } else {
        $log.debug('definition not specified, widget was probably removed');
      }
    }

    function postLink($scope, $element) {
      var definition = $scope.definition;
      if (definition) {
        // bind close function
        $scope.close = function() {
          var column = $scope.col;
          if (column) {
            var index = column.widgets.indexOf(definition);
            if (index >= 0) {
              column.widgets.splice(index, 1);
            }
          }
          $element.remove();
        };

        // bind reload function
        $scope.reload = function(){
          $scope.$broadcast('widgetReload');
        };

        // bind edit function
        $scope.edit = function() {
          var editScope = $scope.$new();

          var opts = {
            scope: editScope,
            templateUrl: adfTemplatePath + 'widget-edit.html',
            backdrop: 'static'
          };

          var instance = $modal.open(opts);
          editScope.closeDialog = function() {
            instance.close();
            editScope.$destroy();

            var widget = $scope.widget;
            if (widget.edit && widget.edit.reload){
              // reload content after edit dialog is closed
              $scope.$broadcast('widgetConfigChanged');
            }
          };
        };
      } else {
        $log.debug('widget not found');
      }
    }

    return {
      replace: true,
      restrict: 'EA',
      transclude: false,
      templateUrl: adfTemplatePath + 'widget.html',
      scope: {
        definition: '=',
        col: '=column',
        editMode: '=',
        options: '='
      },

      controller: function ($scope) {
        $scope.openFullScreen = function() {
          var definition = $scope.definition;
          var fullScreenScope = $scope.$new();
          var opts = {
            scope: fullScreenScope,
            templateUrl: adfTemplatePath + 'widget-fullscreen.html',
            size: definition.modalSize || 'lg', // 'sm', 'lg'
            backdrop: 'static',
            windowClass: (definition.fullScreen) ? 'dashboard-modal widget-fullscreen' : 'dashboard-modal'
          };

          var instance = $modal.open(opts);
          fullScreenScope.closeDialog = function () {
            instance.close();
            fullScreenScope.$destroy();
          };
        };
      },

      compile: function compile(){

        /**
         * use pre link, because link of widget-content
         * is executed before post link widget
         */
        return {
          pre: preLink,
          post: postLink
        };
      }
    };

  });
