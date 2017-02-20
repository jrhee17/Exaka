(function(){
  angular.module('myApp', ['templates', 'showdown.editor', 'angularFileUpload', 'ui.bootstrap']);

//  angular.module('myApp')
//    .constant('myExt',
//      function myExt() {
//        var matches = [];
//        return [
//            { 
//                type: 'lang',
//                regex: /%start%([^]+?)%end%/gi,
//                replace: function(s, match) { 
//                    matches.push(match);
//                    var n = matches.length - 1;
//                    return '%PLACEHOLDER' + n + '%';
//                }
//            },
//            {
//                type: 'output',
//                filter: function (text) {
//                    for (var i=0; i< matches.length; ++i) {
//                        var pat = '<p>%PLACEHOLDER' + i + '% *<\/p>';
//                        text = text.replace(new RegExp(pat, 'gi'), matches[i]);
//                    }
//                    //reset array
//                    matches = [];
//                    return text;
//                }
//            }
//        ]
//      })
//      .config(function($showdownProvider, myExt) {
//        $showdownProvider.setOption('tables', true);
//        $showdownProvider.loadExtension(myExt);
//      });
//
})();
