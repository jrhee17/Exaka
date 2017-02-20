/**
 * Created by john on 20/02/2017.
 */
(function () {
  angular.module('myApp')
    .controller('ImageUploadCtrl', ImageUploadCtrl)
    .controller('ModalImageUploadCtrl', ModalImageUploadCtrl)
    .directive('ngThumb', ngThumb);

  ImageUploadCtrl.$inject = ['$uibModal', '$log', '$document', '$scope'];
  function ImageUploadCtrl($uibModal, $log, $document, $scope) {
    // var $ctrl = this;
    //
    // $ctrl.items = [];
    //
    // $ctrl.open = function (size, parentSelector) {
    //   var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    //   var modalInstance = $uibModal.open({
    //     animation: true,
    //     ariaLabelledBy: 'modal-image-select-title',
    //     ariaDescribedBy: 'modal-image-select-body',
    //     templateUrl: 'uploadImageContent.html',
    //     controller: 'ModalImageUploadCtrl',
    //     controllerAs: '$ctrl',
    //     size: size,
    //     resolve: {
    //       items: function () {
    //         return $ctrl.items;
    //       }
    //     }
    //   });
    //
    //   modalInstance.result.then(function (result) {
    //     $ctrl.result = result;
    //     $scope.text = $scope.text + result;
    //     postText.body = postText.body + result;
    //   }, function () {
    //     // FIXME: Handle error
    //   });
    // };
  }


  ModalImageUploadCtrl.$inject = ['$scope', 'FileUploader', '$uibModalInstance', 'items'];
  function ModalImageUploadCtrl($scope, FileUploader, $uibModalInstance, items) {
    var $ctrl = this;
    $ctrl.items = items;
    $ctrl.selected = {
      item: $ctrl.items[0]
    };
    $scope.loading = false;

    $ctrl.ok = function () {
      $uibModalInstance.close($ctrl.selected.item);
    };

    $ctrl.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };


    var csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    var uploader = $scope.uploader = new FileUploader({
      headers: {
        'X-CSRF-TOKEN' : csrf_token
      },
      url: '/posts/upload_image',
    });

    // a sync filter
    uploader.filters.push({
      name: 'syncFilter',
      fn: function(item /*{File|FileLikeObject}*/, options) {
        console.log('syncFilter');
        if(this.queue.length > 0) {
          uploader.clearQueue();
        }
        return true;
      }
    });

    // an async filter
    uploader.filters.push({
      name: 'asyncFilter',
      fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
        console.log('asyncFilter');
        setTimeout(deferred.resolve, 1e3);
      }
    });

    // CALLBACKS
    uploader.onBeforeUploadItem = function(item) {
      $scope.loading = true;
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      const img_path = window.location.origin + response.postImage.url;
      const md_img = "\n<img src=\"" + img_path + "\" width=\"100%\">\n";
      $ctrl.result = md_img;
      $uibModalInstance.close($ctrl.result);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
      $ctrl.notice = response.errors[0];
    };
    uploader.onCompleteAll = function() {
      $scope.loading = false;
    };
  }

  ngThumb.$inject = ['$window'];
  function ngThumb($window) {
    var helper = {
      support: !!($window.FileReader && $window.CanvasRenderingContext2D),
      isFile: function (item) {
        return angular.isObject(item) && item instanceof $window.File;
      },
      isImage: function (file) {
        var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    };

    return {
      restrict: 'A',
      template: '<canvas/>',
      link: function (scope, element, attributes) {
        if (!helper.support) return;

        var params = scope.$eval(attributes.ngThumb);

        if (!helper.isFile(params.file)) return;
        if (!helper.isImage(params.file)) return;

        var canvas = element.find('canvas');
        var reader = new FileReader();

        reader.onload = onLoadFile;
        reader.readAsDataURL(params.file);

        function onLoadFile(event) {
          var img = new Image();
          img.onload = onLoadImage;
          img.src = event.target.result;
        }

        function onLoadImage() {
          var width = params.width || this.width / this.height * params.height;
          var height = params.height || this.height / this.width * params.width;
          canvas.attr({width: width, height: height});
          canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
        }
      }
    };
  }


})();