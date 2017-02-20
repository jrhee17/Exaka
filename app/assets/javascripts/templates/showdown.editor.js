(function(){

  var app = angular.module('showdown.editor', ['ng-showdown', 'pageslide-directive', 'ngAnimate', 'ngCookies']);
  
  app.directive('squeeze', ['$animate', function ($animate) {
    return {
      link: function (scope, element, attrs) {
        scope.$watch('checked', function (newValue) {
          if (!scope.firstLoad) {
            if (newValue) {
              $animate.addClass(element, 'squeezed-body');
              element.removeClass('full-body');
            } else {
              $animate.addClass(element, 'full-body');
              element.removeClass('squeezed-body');
            }
          }
        });
      }
    };
  }]);
  
  app.directive('elastic', [function() {
          return {
              restrict: 'A',
              scope: {
                ngModel: '='
              },
              link: function($scope, element, attrs) {
                  var resize = function() {
                      element[0].style.height = $scope.initialHeight;
                      element[0].style.height = "" + element[0].scrollHeight + "px";
                  };
                  $scope.initialHeight = $scope.initialHeight || element[0].style.height;
				  $scope.$watch('ngModel', function(newValue) {
                     resize();
                     console.log('newValue: ' + newValue);
                  });
                  element.keyup(function () {
                     resize();
                     console.log('keyup');
                  });
              }
          }
      }
  ]);
  angular.module('myApp').controller('editorCtrl', ['$scope', '$showdown', '$http', '$cookies', '$timeout', '$uibModal', '$log', '$document',
    function ($scope, $showdown, $http, $cookies, $timeout, $uibModal, $log, $document) {
      $scope.previewVisible = true;

      this.togglePreview = function () {
        $scope.previewVisible = !$scope.previewVisible;
      };

    var saveUpdates = function () {

      var url = '/posts/autosave';
      var dat = $scope.postText;
        
	    var csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

      $scope.autosave = 'Save in progres....!';

      $http({
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN' : csrf_token
        },
        url: url,
        data: dat
      }).then(function () {
        $scope.autosave = 'Saved!';
      }, function () {
        $scope.autosave = 'Saved failed';
      });
    };

    var timeout = null;

    $scope.cachePostInput = function () {
        if(timeout) {
            $timeout.cancel(timeout);
        }
        timeout = $timeout(saveUpdates, 1000);
    };

    var $ctrl = this;

    $ctrl.items = [];

    $ctrl.open = function (size, parentSelector) {
      var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-image-select-title',
        ariaDescribedBy: 'modal-image-select-body',
        templateUrl: 'uploadImageContent.html',
        controller: 'ModalImageUploadCtrl',
        controllerAs: '$ctrl',
        size: size,
        resolve: {
          items: function () {
            return $ctrl.items;
          }
        }
      });

      modalInstance.result.then(function (result) {
        $ctrl.result = result;
        $scope.postText.body = $scope.postText.body + result;
        $scope.cachePostInput();
      }, function () {
        // FIXME: Handle error
      });
    };
  
  }]);

})();
