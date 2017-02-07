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
  
  app.controller('editorCtrl', ['$scope', '$showdown', '$http', '$cookies', 'postText', '$timeout', function ($scope, $showdown, $http, $cookies, postText, $timeout) {
  
    var hack = true;
  
    $scope.postText = postText;
    $scope.versions = ['develop', 'master'];
    $scope.version = $cookies.get('version') || 'develop';
    $scope.showModal = false;
    $scope.hashTxt = '';
    $scope.checked = false;
    $scope.firstLoad = true;
    $scope.text = '';
    $scope.checkOpts = [];
    $scope.numOpts = [];
    $scope.textOpts = [];
  
    var savedCheckOpts = $cookies.getObject('checkOpts') || [];
    var savedNumOpts = $cookies.getObject('numOpts') || [];
    var savedTextOpts = $cookies.getObject('textOpts') || [];
    var defaultOpts = $showdown.getDefaultOptions(false);
    var checkOpts = {
      'omitExtraWLInCodeBlocks': true,
      'noHeaderId': false,
      'parseImgDimensions': true,
      'simplifiedAutoLink': true,
      'literalMidWordUnderscores': true,
      'strikethrough': true,
      'tables': true,
      'tablesHeaderId': false,
      'ghCodeBlocks': true,
      'tasklists': true,
      'smoothLivePreview': true,
      'prefixHeaderId': false,
      'disableForced4SpacesIndentedSublists': false,
      'ghCompatibleHeaderId': true,
      'smartIndentationFix': false
    };
    var numOpts = {
      'headerLevelStart': 3
    };
    var textOpts = {};
  
    if (defaultOpts !== null) {
      for (var opt in defaultOpts) {
        if (defaultOpts.hasOwnProperty(opt)) {
          var nOpt = (defaultOpts[opt].hasOwnProperty('defaultValue')) ? defaultOpts[opt].defaultValue : true;
          if (defaultOpts[opt].type === 'boolean') {
            if (!checkOpts.hasOwnProperty(opt)) {
              checkOpts[opt] = nOpt;
            }
          } else if (defaultOpts[opt].type === 'integer') {
            if (!numOpts.hasOwnProperty(opt)) {
              numOpts[opt] = nOpt;
            }
          } else {
            if (!textOpts.hasOwnProperty(opt)) {
              // fix bug in showdown's older version that specifies 'ghCompatibleHeaderId' as a string instead of boolean
              if (opt === 'ghCompatibleHeaderId') {
                continue;
              }
              if (!nOpt) {
                nOpt = '';
              }
              textOpts[opt] = nOpt;
            }
          }
        }
      }
    }
  
    for (opt in checkOpts) {
      if (checkOpts.hasOwnProperty(opt)) {
        $scope.checkOpts.push({name: opt, value: checkOpts[opt]});
      }
    }
  
    for (opt in numOpts) {
      if (numOpts.hasOwnProperty(opt)) {
        $scope.numOpts.push({name: opt, value: numOpts[opt]});
      }
    }
  
    for (opt in textOpts) {
      if (textOpts.hasOwnProperty(opt)) {
        $scope.textOpts.push({name: opt, value: textOpts[opt]});
      }
    }
  
    for (var i = 0; i < $scope.checkOpts.length; ++i) {
    	for (var ii = 0; ii < savedCheckOpts.length; ++ii) {
    		if ($scope.checkOpts[i].name === savedCheckOpts[ii].name) {
    			$scope.checkOpts[i].value = savedCheckOpts[ii].value;
    			break;
    		}
    	}
    }
  
    for (i = 0; i < $scope.numOpts.length; ++i) {
      for (ii = 0; ii < savedNumOpts.length; ++ii) {
        if ($scope.numOpts[i].name === savedNumOpts[ii].name) {
          $scope.numOpts[i].value = savedNumOpts[ii].value;
          break;
        }
      }
    }
  
    for (i = 0; i < $scope.textOpts.length; ++i) {
      for (ii = 0; ii < savedTextOpts.length; ++ii) {
        if ($scope.textOpts[i].name === savedTextOpts[ii].name) {
          $scope.textOpts[i].value = savedTextOpts[ii].value;
          break;
        }
      }
    }

    var saveUpdates = function () {
        console.log('saveUpdates(): ' + postText.text);
        console.log('saveUpdates(): ' + Object.keys(postText));

        var url = '/posts/autosave';
        var dat = postText;
        
	    var csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        $http({
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN' : csrf_token
            },
            url: url,
            data: dat
        }).success(function () {});
        
        $scope.autosave = 'Saved!';
    }

    var timeout = null;
    $scope.cachePostInput = function () {
        $scope.autosave = 'Save in progress....';
        if(timeout) {
            $timeout.cancel(timeout);
        }
        console.log('$timeout: ' + $timeout);
        timeout = $timeout(saveUpdates, 1000);
    }
  
    $scope.toggleMenu = function () {
      $scope.firstLoad = false;
      $scope.checked = !$scope.checked;
    };
  
    $scope.getHash = function () {
      $scope.hashTxt = document.location.origin + document.location.pathname + '#/' + encodeURIComponent($scope.text);
      $scope.showModal = true;
    };
  
    $scope.closeModal = function () {
      $scope.showModal = false;
    };
  
    $scope.loadVersion = function () {
      $cookies.put('version', $scope.version);
      sessionStorage.setItem("text", $scope.text);
      location.reload();
    };
  
    $scope.updateOptions = function () {
      for (var i = 0; i < $scope.checkOpts.length; ++i) {
        $showdown.setOption($scope.checkOpts[i].name, $scope.checkOpts[i].value);
      }
  
      for (i = 0; i < $scope.numOpts.length; ++i) {
        if ($scope.numOpts[i].name === 'headerLevelStart') {
          if (isNaN($scope.numOpts[i].value) || $scope.numOpts[i].value < 1) {
            $scope.numOpts[i].value = 1;
          } else if ($scope.numOpts[i].value > 6) {
            $scope.numOpts[i].value = 6;
          }
        }
        $showdown.setOption($scope.numOpts[i].name, $scope.numOpts[i].value);
      }
  
      for (i = 0; i < $scope.textOpts.length; ++i) {
        $showdown.setOption($scope.textOpts[i].name, $scope.textOpts[i].value);
      }
  
      // trigger text repaint (hackish way)
      $scope.text = $scope.text.replace(/\u200B/, '');
      if (hack) {
        $scope.text = '\u200B' + $scope.text;
      } else {
        $scope.text = $scope.text + '\u200B';
      }
  
      hack = !hack;
      $cookies.putObject('checkOpts', $scope.checkOpts);
      $cookies.putObject('numOpts', $scope.numOpts);
      $cookies.putObject('textOpts', $scope.textOpts);
    };
  
    $scope.updateOptions();
  
    // get text from URL or load the default text
//    if (window.location.hash) {
//      var hashText = window.location.hash.replace(/^#(\/)?/, '');
//      hashText = decodeURIComponent(hashText);
//      $scope.text = hashText;
//    } else if (sessionStorage.getItem('text')) {
//      $scope.text = sessionStorage.getItem('text');
//    } else {
//      $scope.text = '';
//    }
//
//    if ($cookies.get('postCacheText')) {
//      $scope.text = $cookies.get('postCacheText');
//    }

  
  }]);

})();
