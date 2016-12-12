angular.module('starter.user', [])
/**
 * 用户
 */
.controller('UsersCtrl', function($scope, Users,HttpService,dialogsManager,$state) {
    // console.log('timeoutID', window.myLoad.timeoutID);
    // window.myLoad.num = 99;

    document.getElementById('loadding').style.visibility="hidden";
    // window.GetUserInfoCallBack = function(result){
    //     alert(result)
    // }
    // if(window.js) {
    //     if(window.js.getHeadTitle) {
    //         window.js.getHeadTitle('testTitle'); // 测试调用原生提供的修改标题方法。
    //     }
    //     if(window.js.settingBtnShowOrNot) {
    //         window.js.settingBtnShowOrNot(0);
    //     }
    //     if(window.js.backBtnShowOrNot) {
    //         window.js.backBtnShowOrNot(0)
    //     }
    //     if(window.js.getUserInfo) window.js.getUserInfo();
    // }
    if (window.js) {
        if (window.js.getHeadTitle) {
            window.js.getHeadTitle('User'); // 调用原生提供的修改标题方法。
        }
        if(window.js.settingBtnShowOrNot) {
            window.js.settingBtnShowOrNot(0);
        }
        if(window.js.backBtnShowOrNot) {
            window.js.backBtnShowOrNot(0)
        }
        // if(window.js.queryRegionInfo){
        //     window.js.queryRegionInfo();
        // }
    }

  // $scope.users = Users.all();
    Users.all().then(function (data) {
        if(!data || data.length == 0){
            dialogsManager.showMessage("No User","red");
        }else {
            $scope.users = data;
            console.log('$scope.users',$scope.users)
        }
    })
  //   console.log('$scope.users',$scope.users)
  //   var userProm = HttpService.myHttp({},'GET','user').then(function (data) {
  //       $scope.users = data.content;
  //       console.log('$scope.users',$scope.users)
  //   })
  $scope.remove = function(user) {
    Users.remove(user);
  };
   
    $scope.toUserDetail = function (user) {
        $state.go('user-detail', {userId: user.user_id,userName: user.user_name,userPhone: user.phone,userPwd: user.password,userCoun: user.country,userRole: user.user_authorization,UserEMail: user.e_mail});
    }
})

/**
 * 用户详情
 */
.controller('UserDetailCtrl', function($scope, $state, $stateParams, $ionicPopup, Users,dialogsManager) {
    if (window.js) {
        if (window.js.getHeadTitle) {
            window.js.getHeadTitle('User Detail'); // 调用原生提供的修改标题方法。
        }
        if (window.js.settingBtnShowOrNot) {
            window.js.settingBtnShowOrNot(0);
        }
        if (window.js.backBtnShowOrNot) {
            window.js.backBtnShowOrNot(1)
        }
    }

    var userId = $stateParams.userId;
    var userEMail = $stateParams.UserEMail;
    $scope.userName = $stateParams.userName;
    $scope.userPhone = $stateParams.userPhone;
    $scope.userPwd = $stateParams.userPwd;
    $scope.userCoun = $stateParams.userCoun;
    $scope.userRole = $stateParams.userRole;


    $scope.toReName = function() {
        $state.go('user-rename', {userId: userId,userName: $scope.userName,userPhone: $scope.userPhone,userPwd: $scope.userPwd,userCoun: $scope.userCoun,userRole: $scope.userRole,UserEMail: userEMail});
    }
    $scope.toRePwd = function() {
        console.log('11');
        $state.go('user-repwd', {userId: userId,userName: $scope.userName,userPhone: $scope.userPhone,userPwd: $scope.userPwd,userCoun: $scope.userCoun,userRole: $scope.userRole,UserEMail: userEMail});
    }
    // 禁用用户提示框
    $scope.disableConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'prompt',
            template: 'Do you want to disable this user?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                console.log('yes');
                var disableUserData = {
                    "child_user_id":userId,
                    "user_name":$scope.userName,
                    "password":$scope.userPwd,
                    "e_mail":userEMail,
                    "phone":$scope.userPhone,
                    "user_authorization":'0'
                }
                console.log('禁用子用户传参',disableUserData);
                Users.editUser(disableUserData).then(function (data) {
                    if(!data){
                        dialogsManager.showMessage("Disabled Failed","red");
                    }else {
                        Users.all().then(function (data) {
                            for(var i = 0;i<data.length;i++){
                                if(data[i].user_id == userId){
                                    $scope.userRole = data[i].user_authorization;
                                }
                            }
                        })
                    }
                })

            } else {
                console.log('no');
            }
        });
    };
    //启用用户提示框
    $scope.enableConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'prompt',
            template: 'Do you want to enable this user?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                console.log('yes');
                var enableUserData = {
                    "child_user_id":userId,
                    "user_name":$scope.userName,
                    "password":$scope.userPwd,
                    "e_mail":userEMail,
                    "phone":$scope.userPhone,
                    "user_authorization":'1'
                }
                console.log('启用子用户传参',enableUserData);
                Users.editUser(enableUserData).then(function (data) {
                    if(!data){
                        dialogsManager.showMessage("Disabled Failed","red");
                    }else {
                        Users.all().then(function (data) {
                            for(var i = 0;i<data.length;i++){
                                if(data[i].user_id == userId){
                                    $scope.userRole = data[i].user_authorization;
                                }
                            }
                        })
                    }
                })
            } else {
                console.log('no');
            }
        });
    };
    //删除用户提示框
    $scope.deleteConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'prompt',
            template: 'Do you want to delete this user?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                console.log('yes');
                var deleteUserData = {
                    "child_user_id":userId
                }
                Users.remove(deleteUserData).then(function (data) {
                    if(!data){
                        dialogsManager.showMessage("Delete User Failed","red");
                    }else {
                        $state.go('users')
                    }
                })
            } else {
                console.log('no');
            }
        });
    };
    $scope.disableUser = function(){
        $scope.disableConfirm();
    };
    $scope.enableUser = function () {
        $scope.enableConfirm();
    };
    $scope.deleteUser = function () {
        $scope.deleteConfirm();
    }
})

/**
 * 修改用户名
 */
    .controller('UserRenameCtrl', function($scope, $state, $stateParams, $ionicPopup, Users,dialogsManager){
        if (window.js) {
            if (window.js.getHeadTitle) {
                    window.js.getHeadTitle('Rename'); // 调用原生提供的修改标题方法。
            }
            if (window.js.settingBtnShowOrNot) {
                window.js.settingBtnShowOrNot(0);
            }
            if (window.js.backBtnShowOrNot) {
                window.js.backBtnShowOrNot(1)
            }
        }
        $scope.user = {
            userId : $stateParams.userId,
            userEMail :$stateParams.UserEMail,
            userName : $stateParams.userName,
            userPhone : $stateParams.userPhone,
            userPwd : $stateParams.userPwd,
            userCoun : $stateParams.userCoun,
            userRole : $stateParams.userRole
        }
        console.log('修改用户名页面收到的信息',$scope.user)
        //修改用户名提示框
        $scope.renameConfirm = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'prompt',
                template: 'Do you want to rename this user?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    console.log('yes');
                    var renameUserData = {
                        "child_user_id":$scope.user.userId,
                        "user_name":$scope.user.userName,
                        "password":$scope.user.userPwd,
                        "e_mail":$scope.user.userEMail,
                        "phone":$scope.user.userPhone,
                        "country" : $scope.user.userCoun,
                        "user_authorization":$scope.user.userRole
                    }
                    Users.editUser(renameUserData).then(function (data) {
                        if(!data){
                            dialogsManager.showMessage("Rename User Failed","red");
                        }else {
                            $state.go('users')
                        }
                    })
                } else {
                    console.log('no');
                }
            });
        };
        $scope.rename = function () {
            $scope.renameConfirm();
        }
    })

/**
 * 修改子用户密码
 */
    .controller('UserRepwdCtrl', function($scope, $state, $stateParams, $ionicPopup, Users,dialogsManager){
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Reset Password'); // 调用原生提供的修改标题方法。
            }
            if (window.js.settingBtnShowOrNot) {
                window.js.settingBtnShowOrNot(0);
            }
            if (window.js.backBtnShowOrNot) {
                window.js.backBtnShowOrNot(1)
            }
        }
        $scope.user = {
            userId : $stateParams.userId,
            userEMail :$stateParams.UserEMail,
            userName : $stateParams.userName,
            userPhone : $stateParams.userPhone,
            userPwd : $stateParams.userPwd,
            userCoun : $stateParams.userCoun,
            userRole : $stateParams.userRole,
            newPwd : '',
            repeatPwd :''
        }
        //修改用户名提示框
        $scope.repwdConfirm = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'prompt',
                template: 'Do you want to set password?'
            });

            confirmPopup.then(function(res) {
                if(res) {
                    console.log('yes');
                    var repwdUserData = {
                        "child_user_id":$scope.user.userId,
                        "user_name":$scope.user.userName,
                        "password":$scope.user.newPwd,
                        "e_mail":$scope.user.userEMail,
                        "phone":$scope.user.userPhone,
                        "country" : $scope.user.userCoun,
                        "user_authorization":$scope.user.userRole
                    }
                    Users.editUser(repwdUserData).then(function (data) {
                        if(!data){
                            dialogsManager.showMessage("Rename User Failed","red");
                        }else {
                            $state.go('users')
                        }
                    })
                } else {
                    console.log('no');
                }
            });
        };
        $scope.repwd = function () {
            console.log('修改密码信息',$scope.user.newPwd)
            console.log('修改密码信息',$scope.user.repeatPwd)
            if($scope.user.newPwd  !== $scope.user.repeatPwd){
                dialogsManager.showMessage("The two passwords differ","red");
            }else if($scope.newPwd == '' || $scope.repeatPwd == ''){
                dialogsManager.showMessage("Password can not be null","red");
            }else {
                $scope.repwdConfirm();
            }
        }
    })