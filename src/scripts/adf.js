'use strict';

angular.module('adf', ['adf.provider', 'ui.bootstrap'])
  .value('adfTemplatePath', '../src/templates/')
  .value('rowTemplate', '<adf-dashboard-row row="row" adf-model="adfModel" options="options" edit-mode="editMode" ng-repeat="row in column.rows" />')
  .value('columnTemplate', '<adf-dashboard-column column="column" adf-model="adfModel" options="options" edit-mode="editMode" ng-repeat="column in row.columns" />')
  .value('adfVersion', '<<adfVersion>>');
