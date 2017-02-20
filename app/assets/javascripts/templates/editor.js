(function() {
  'use strict';
  var app = angular.module('ng-showdown', ['ngSanitize', 'ngCookies']);

  angular.module('myApp')
    .directive('markdownToHtml', ['$showdown', '$sanitize', '$sce', '$rootScope', markdownToHtmlDirective])
    .filter('sdStripHtml', ['$showdown', stripHtmlFilter]) //<-- DEPRECATED: will be removed in the next major version release
    .filter('stripHtml', ['$showdown', stripHtmlFilter]);

  function markdownToHtmlDirective($showdown, $sanitize, $sce, $rootScope) {

    console.log('markdownToHtmlDirective: ' + this);



    return {
      // restrict: 'A',
      link: getLinkFn($showdown, $sanitize, $sce, $rootScope),
      scope: {
        model: '=markdownToHtml',
        previewVisible: '=?'
      },
      template: '<div ng-bind-html="trustedHtml"></div>previewVisible: {{previewVisible}}'
    };
  }

  function getLinkFn($showdown, $sanitize, $sce, $rootScope) {
    return function (scope, element, attrs) {

      scope.mjRunning = scope.mjPending = false;

      scope.PreviewDone = function () {
        scope.mjRunning = scope.mjPending = false;

        scope.previewVisible = true;


      };

      $rootScope.$watch(function(){
        if(scope.mjPending) return;
        if(scope.mjRunning) {
          scope.mjPending = true;
          MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        } else {
          scope.mjRunning = true;
          scope.previewVisible = false;
          MathJax.Hub.Queue(["Typeset",MathJax.Hub], ["PreviewDone", scope]);
        }
      });
      scope.$watch('model', function (newValue) {
        var showdownHTML;
        if (typeof newValue === 'string') {
          showdownHTML = $showdown.makeHtml(newValue);
          scope.trustedHtml = ($showdown.getOption('sanitize')) ? $sanitize(showdownHTML) : $sce.trustAsHtml(showdownHTML);
        } else if (newValue == null) {
            scope.trustedHtml = null;
        } else {
          scope.trustedHtml = typeof newValue;
        }
      });
    };
  }

  /**
   * AngularJS Filter to Strip HTML tags from text
   *
   * @returns {Function}
   */
  function stripHtmlFilter($showdown) {
    return function (text) {
      return $showdown.stripHtml(text);
    };
  }
})();
