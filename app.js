// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
                           'starter.services', 
                           'starter.configure', 
                           'starter.region', 
                           'starter.user',
                           'starter.regionChart'])

.run(function($ionicPlatform, $rootScope, $ionicPopup) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
      
    document.getElementById('loadding').style.visibility="hidden"; // todo，暂时先放在这里，需要对白屏问题的加载做出解决。
    
    // 提示框
    $rootScope.promptBox = function(title, template, callback) {
    var alertPopup = $ionicPopup.alert({
            title: title,
            template: template
        });

        alertPopup.then(function(res) {
            if(callback) callback()
            // console.log('Thank you for not eating my delicious ice cream cone');
        });
    };
    
    // 删除设备提示-确认/取消删除
    $rootScope.showConfirm = function(title, template, callback) { // 提示窗口
        var confirmPopup = $ionicPopup.confirm({
            title: title,
            template: template
        });

        confirmPopup.then(function(res) {
            if(res) {
                if(callback) callback();
            } else {
                console.log('no');
            }
        });
    };

    // 利用回调方法获取登录用户信息
//    window.GetUserInfoCallBack = function (result) {
//        alert("用户信息"+result)
//        var user = jQuery.parseJSON(result.replace(/\r\n|\n/g, ""));
//        window.userId = user.content.user_id;
//    }
//    window.js.getUserInfo();

})
.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(5);

  // note that you can also chain configs
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center');

})
