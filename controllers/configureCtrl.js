angular.module('starter.configure', [])
    /**
     * 区域配置
     */
    .controller('ConfigCtrl',['$scope', '$state', '$rootScope','Regionals' ,'$timeout','$ionicLoading','dialogsManager', function ($scope, $state, $rootScope, Regionals,$timeout, $ionicLoading,dialogsManager) {

        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
            window.js.settingBtnShowOrNot(0);
            // 获取区域列表
            window.queryRegionInfoCallBack = function(result) {
                $ionicLoading.hide();
                 var regions = jQuery.parseJSON(result.replace(/\\/g, ""));
                 if(regions.code == '0'){
                    $scope.regionals = regions.content;
                    dialogsManager.showMessage(regions.message,"green");
                 }else{
                    dialogsManager.showMessage(regions.message,"red");
                 }
            }
            window.js.queryRegionInfo();

        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Region Configure'); // 调用原生提供的修改标题方法。
            }
        }
         //下拉刷新
         $scope.doRefresh = function() {
             $timeout(function() {
                  window.queryRegionInfoCallBack = function(result) {
                  var regions = jQuery.parseJSON(result.replace(/\\/g, ""))
                  if(regions.code == '0'){
                      $scope.regionals = regions.content;
                      dialogsManager.showMessage(regions.message,"green");
                  }else{
                      dialogsManager.showMessage(regions.message,"red");
                  }
             }
             window.js.queryRegionInfo();
            $scope.$broadcast('scroll.refreshComplete');
         }, 1000);
       };

        // 隐藏loading
        document.getElementById('loadding').style.visibility = "hidden";

        // 去区域设置
        $scope.toSetRegional = function (regional) {
            $rootScope.regional = regional
            $state.go('set-regional', {regionId: regional.region_guid, gatewayId: regional.gateway_id, regionAddr: regional.region_addr, regionName: regional.region_name});
        }
        // 向服务端发送请求，创建区域
        $scope.newRegional = function () {
            $state.go('configure-new-regional')
        }
    }])

    /**
     * 创建区域
     */
    .controller('NewRegionalCtrl', function ($scope, $state, $rootScope, Regional, Users, dialogsManager,$timeout, $ionicLoading) {
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('New Region'); // 调用原生提供的修改标题方法。
            }
            if (window.js.settingBtnShowOrNot) {
                        window.js.settingBtnShowOrNot(0);
                    }
        }

        window.url = "";

        $scope.my = {}; // 用于与页面与服务交互
        $scope.my.regionName = ''; // 区域名

        //获取网关列表
        window.getGatewayIDListCallBack = function(result){
            var gateway = jQuery.parseJSON(result.replace(/\\/g, ""));
            $scope.gatewayList = gateway.content;
            $scope.my.gateway = gateway.content[0];
        }
        window.js.getGatewayIDList();
        // 创建区域
        $scope.apply = function () {
            // Setup the loader
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $scope.my.gatewayId = $scope.my.gateway.gateway_id; // 保存用户选择的网关的id
            window.createRegionCallBack = function(result) {
                    $ionicLoading.hide();
                  var createRegionResult = jQuery.parseJSON(result.replace(/\\/g, ""))
                  if(createRegionResult.code == '0'){
                        dialogsManager.showMessage(createRegionResult.message,"green");
                        $state.go('configure')
                  }else{
                        dialogsManager.showMessage(createRegionResult.message,"red");
                        }
                  }
                  var createRegion = {
                        "table_region":[{
                            region_name : $scope.my.regionName,
                            region_switch : "01",
                            region_value : "NULL",
                            region_delay : "1000",
                            gateway_id : $scope.my.gatewayId
                        }]
                  };
                  var createRegionData = JSON.stringify(createRegion);
                  window.js.createRegion(createRegionData);
            }
        })

    /**
     * 区域设置
     */
    .controller('RegionalSettingCtrl', function ($scope, $state, $rootScope, $stateParams, $ionicPopup, Device, dialogsManager,$timeout, $ionicLoading) {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Regional Setting'); // 调用原生提供的修改标题方法。
            }
            if (window.js.settingBtnShowOrNot) {
                window.js.settingBtnShowOrNot(0);
            }
        }

        window.url = "";//返回设置,在index.html中有相关方法

        //接收上页传来的数据
        var regionId = $stateParams.regionId; // 获取设备id
        var regionAddr = $stateParams.regionAddr; // 获取区域地址
        var gatewayId = $stateParams.gatewayId; // 获取网关id
        var regionName = $stateParams.regionName;

        // 查找区域设备
        window.queryRegionDeviceCallBack = function(result) {
            $ionicLoading.hide();
            var regionDevice = jQuery.parseJSON(result.replace(/\\/g, ""));
            if(regionDevice.code == '0'){
                dialogsManager.showMessage(regionDevice.message, "green");
                $scope.devices = regionDevice.content;
            }else{
                dialogsManager.showMessage(regionDevice.message, "red");
            }
        }
        var queryRegionDevice = {
             "table_region_device" : [{
                  "region_guid" : regionId
             }]
        }
        var queryRegionDeviceData = JSON.stringify(queryRegionDevice);
//        alert("查询区域设备传参"+queryRegionDeviceData)
        window.js.queryRegionDevice(queryRegionDeviceData);

        // 删除设备
        $scope.remove = function (light) { // todo 需要测试
            $rootScope.showConfirm('Remove equipment', 'Are you sure to delete this device from '+regionName+'?', function () {
               $ionicLoading.show({
                   content: 'Loading',
                   animation: 'fade-in',
                   showBackdrop: true,
                   maxWidth: 200,
                   showDelay: 0
               });
               window.deleteRegionDeviceCallBack = function(result){
                    $ionicLoading.hide();
                    var deleteRegionalDeviceResult = jQuery.parseJSON(result.replace(/\\/g, ""));
                    if(deleteRegionalDeviceResult.code == '0'){
                        dialogsManager.showMessage(deleteRegionalDeviceResult.message, "green");
                    //删除成功重新查找
                        window.queryRegionDeviceCallBack = function(result) {
                            var regionDevice = jQuery.parseJSON(result.replace(/\\/g, ""));
                            $scope.devices = regionDevice.content;
                        }
                        var queryRegionDevice = {
                            "table_region_device":[{
                                region_guid : regionId
                            }]
                        }
                        var queryRegionDeviceData = JSON.stringify(queryRegionDevice);
                        window.js.queryRegionDevice(queryRegionDeviceData);
                    }else{
                        dialogsManager.showMessage(deleteRegionalDeviceResult.message, "red");
                    }
                }
                var deleteRegionDevice = {
                     "table_region_device":[{
                          region_addr : regionAddr,
                          device_addr : light.device_addr,
                          gateway_id : light.gateway_id
                     }]
                }
                var deleteRegionDeviceData = JSON.stringify(deleteRegionDevice);
                window.js.deleteRegionDevice(deleteRegionDeviceData);
            });
        };

        //删除区域
        $scope.deleteRegion = function(){
            $rootScope.showConfirm('Remove equipment', 'Are you sure to delete '+regionName+'?', function () {
                // Setup the loader
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                 window.deleteRegionCallBack = function(result){
                    $ionicLoading.hide();
                    var deleteRegionalResult = jQuery.parseJSON(result.replace(/\\/g, ""));
                        if(deleteRegionalResult.code == '0'){
                            dialogsManager.showMessage(deleteRegionalResult.message, "green");
                            $state.go('configure')
                        }else {
                            dialogsManager.showMessage(deleteRegionalResult.message, "red");
                        }
                    }
                 var deleteRegion = {
                        "gateway_id":gatewayId,
                        "region_guid":regionId
                 }
                 var deleteRegionData = JSON.stringify(deleteRegion);
//                 alert("删除区域传参"+deleteRegionData)
                 window.js.deleteRegion(deleteRegionData);
            });
        };


        // 去添加设备
        $scope.toAddDevice = function () {
            $state.go('add-device', {type: 'region', regionId: regionId, gatewayId: gatewayId, regionAddr: regionAddr, regionName: regionName});
        }

        // 去组设置
        $scope.toSetGroup = function () {
            $state.go('set-group', {regionId: regionId, gatewayId: gatewayId, regionAddr: regionAddr, regionName: regionName});
        }
        // 去场景设置
        $scope.toSetScene = function () {
            $state.go('set-scene', {regionId: regionId, gatewayId: gatewayId, regionAddr: regionAddr, regionName: regionName});
        }
        // 去条件控制设置
        $scope.toSetTerm = function () {
            $state.go('set-term', {regionId: regionId, gatewayId: gatewayId, regionAddr: regionAddr});
        }
        // 去配方设置
        $scope.toSetRecipe = function () {
            $state.go('set-recipe', {regionId: regionId, gatewayId: gatewayId});
        }
    })

    /**
    * 对区域添加设备
    */
    .controller('AddDeviceCtrl', function ($scope, $state, $stateParams, $rootScope, Device, dialogsManager,$timeout, $ionicLoading) {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Add Regional Device'); // 调用原生提供的修改标题方法。
            }
            if (window.js.settingBtnShowOrNot) {
                window.js.settingBtnShowOrNot(0);
            }
        }
         //接收上页传来的数据
        var gatewayId = $stateParams.gatewayId;
        var regionId = $stateParams.regionId;
        var regionAddr = $stateParams.regionAddr;
        var regionName = $stateParams.regionName;

        window.url = "/regional?regionId=" +regionId+ "&gatewayId=" +gatewayId+ "&regionAddr=" +regionAddr+ "&regionName" +regionName;

        //查找配置网关下的所有设备
        window.queryAllDeviceDetailsCallBack = function(result) {
            $ionicLoading.hide();
             var queryAllDeviceResult = jQuery.parseJSON(result.replace(/\\/g, ""));
             if(queryAllDeviceResult.code == '0'){
                  dialogsManager.showMessage(queryAllDeviceResult.message,"green");
                  $scope.lights = queryAllDeviceResult.content;
             }else{
                  dialogsManager.showMessage(queryAllDeviceResult.message,"red");
             }
        }
        window.js.queryAllDeviceDetails();

        // 对区域添加设备
        $scope.apply = function (light) {
            $rootScope.showConfirm('Add equipment', 'Are you sure to add this device to '+regionName+'?', function () {
                // Setup the loader
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                window.addRegionDeviceCallBack = function(result){
                    $ionicLoading.hide();
                    var addRegionDeviceResult = jQuery.parseJSON(result.replace(/\\/g, ""));
                    if(addRegionDeviceResult.code == '0'){
                        dialogsManager.showMessage(addRegionDeviceResult.message,"green");
                    }else {
                        dialogsManager.showMessage(addRegionDeviceResult.message,"red");
                    }
                 }
                var addRegionDevice = {
                    "table_region_device":[{
                        region_guid : regionId,
                        region_addr : regionAddr,
                        region_name : regionName,
                        table_device_guid : light.device_guid,
                        gateway_id : light.gateway_id,
                        device_addr : light.device_addr,
                        device_name : light.device_name
                    }]
                }
                var addRegionDeviceData = JSON.stringify(addRegionDevice);
//                alert("添加区域设备传参"+addRegionDeviceData)
                window.js.addRegionDevice(addRegionDeviceData);
            });
        }
    })

    /**
     * 组设置
     */
    .controller('GroupSettingCtrl', ['$scope', '$state', '$stateParams', '$rootScope', 'RegionGroups','dialogsManager','$timeout','$ionicLoading',function ($scope, $state, $stateParams, $rootScope, RegionGroups,dialogsManager,$timeout,$ionicLoading) {

        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });


         //接收上页传来的数据
        var regionId = $stateParams.regionId; // 获取区域Id
        var gatewayId = $stateParams.gatewayId;//获取区域网关信息
        var regionAddr = $stateParams.regionAddr;
        var regionName = $stateParams.regionName;

        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Regional Group'); // 调用原生提供的修改标题方法。
            }
        }

        //离线版查询区域组
        window.queryRegionGroupCallBack = function(result) {
            $ionicLoading.hide();
             var regionGroup = jQuery.parseJSON(result.replace(/\\/g, ""));
             if(regionGroup.code == '0'){
                  dialogsManager.showMessage(regionGroup.message,"green");
                  $scope.groupList = regionGroup.content;
             }else {
                  dialogsManager.showMessage(regionGroup.message,"red");
             }
        };
        var queryRegionGroup = {
            "table_region_group":[{
                 "region_guid":regionId
            }]
        }
        var queryRegionGroupData = JSON.stringify(queryRegionGroup);
        window.js.queryRegionGroup(queryRegionGroupData);


        //下拉刷新
        $scope.doRefresh = function() {
            $timeout(function() {
                window.queryRegionGroupCallBack = function(result) {
                    var regionGroup = jQuery.parseJSON(result.replace(/\\/g, ""));
                    if(regionGroup.code == '0'){
                        dialogsManager.showMessage(regionGroup.message,"green");
                        $scope.groupList = regionGroup.content;
                    }else {
                        dialogsManager.showMessage(regionGroup.message,"red");
                    }
                };
                var queryRegionGroup = {
                    "table_region_group":[{
                        "region_guid":regionId
                    }]
                }
                var queryRegionGroupData = JSON.stringify(queryRegionGroup);
//              alert("查询区域组传参"+queryRegionGroupData);
                window.js.queryRegionGroup(queryRegionGroupData);
                        $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };
        // 去组详情设置页面
        $scope.toGroupSetDetail = function (group) {
            $rootScope.group = group;
            $state.go('group-set-detail', {
                 groupId: group.table_group_guid,
                 gatewayId: group.gateway_id,
                 groupName:  group.group_name,
                 groupAddr: group.group_addr,
                 regionName: regionName,
                 regionAddr: regionAddr,
                 regionId: regionId
            });
        }
        // 去新建组页面
        $scope.toAddGroup = function () {
            $state.go('new-group', {regionId: regionId});
        }

        window.url = "/regional?regionId=" + regionId + "&gatewayId=" + gatewayId + "&regionAddr=" + regionAddr + "&regionName=" + regionName;

    }])

    /**
     * 新建组
     */
    .controller('NewGroupCtrl', function ($scope, $state, $rootScope, $stateParams, DeviceGroups, RegionGroups, Users, dialogsManager,$timeout, $ionicLoading) {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('New Regional Group'); // 调用原生提供的修改标题方法。
            }
        }
         //接收上页传来的数据
        var regionId = $stateParams.regionId; // 获取区域Id
        // my 用于页面与服务间的值传递
        $scope.my = {
            groupName: "",
        }
        //获取网关列表
        window.getGatewayIDListCallBack = function(result){
            $ionicLoading.hide();
             var gateway = jQuery.parseJSON(result.replace(/\\/g, ""));
             $scope.gateways = gateway.content;
             $scope.my.gateway = gateway.content[0];
        };
        window.js.getGatewayIDList();

        //新建区域组
        $scope.newGroup = function(){
            // Setup the loader
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            window.createGroupCallBack = function(result){
//                alert("新建组返回信息"+result);
                var newGroupResult = jQuery.parseJSON(result.replace(/\\/g, ""));
                //创建组成功之后添加区域组
                if(newGroupResult.code == '0'){
                    window.addRegionGroupCallBack = function(result){
                        $ionicLoading.hide();
//                        alert("添加区域组返回结果"+result)
                        var addRegionGroupResult = jQuery.parseJSON(result.replace(/\\/g, ""));
                        if(addRegionGroupResult.code == '0'){
                            dialogsManager.showMessage(addRegionGroupResult.message,"green");
                        }else {
                            dialogsManager.showMessage(addRegionGroupResult.message,"red");
                        }
                    }
                    var addRegionGroup = {
                        "table_region_group":[{
                             region_guid : regionId,
                             table_group_guid : newGroupResult.content[0].group_guid,
                             group_addr : newGroupResult.content[0].group_addr,
                             group_name : newGroupResult.content[0].group_name,
                             gateway_id : newGroupResult.content[0].gateway_id
                        }]
                    }
                    var addRegionGroupData = JSON.stringify(addRegionGroup);
//                    alert("添加区域组传参"+addRegionGroupData)
                    window.js.addRegionGroup(addRegionGroupData);
                }else {
                    dialogsManager.showMessage(newGroupResult.message,"red");
                }
            }
            var newGroups = {
                "table_group" : [{
                    group_name : $scope.my.groupName,
                    gateway_id : $scope.my.gateway.gateway_id
                }]
            }
            var newGroupData = JSON.stringify(newGroups);
//            alert("新建组传参"+newGroupData);
            window.js.createGroup(newGroupData);
        };
        window.url = "/group?regionId="+regionId;
    })

    /**
     * 设置组详情
     */
    .controller('groupSetDetailCtrl', function ($scope, $state, $rootScope, $stateParams, Device, RegionGroups, dialogsManager,$timeout, $ionicLoading) {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Regional Group Setting'); // 调用原生提供的修改标题方法。
            }
        }
        //接收上页传来的数据
        var regionId = $stateParams.regionId;
        var gatewayId = $stateParams.gatewayId;
        var groupId = $stateParams.groupId;
        var groupAddr = $stateParams.groupAddr;
        $scope.group_name = $stateParams.groupName; // 获取组名
        var regionName = $stateParams.regionName;
        var regionAddr = $stateParams.regionAddr;

        //删除区域组
        $scope.deleteRegionGroup = function () {
            $rootScope.showConfirm('Confirm Delete', 'Are you want to delete '+ $scope.group_name+'?', function () {
                //删除区域下的场景
                // Setup the loader
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                window.deleteRegionGroupCallBack = function(result){
                    $ionicLoading.hide();
                    var deleteRegionGroupResult = jQuery.parseJSON(result.replace(/\\/g, ""));
                    if(deleteRegionGroupResult.code == '0'){
                        dialogsManager.showMessage(deleteRegionGroupResult.message,"green");
                        $state.go('set-group',{regionId: regionId, gatewayId: gatewayId});
                    }else {
                        dialogsManager.showMessage(deleteRegionGroupResult.message,"red");
                    }
                }
                var deleteRegionGroup = {
                     "table_region_group" : [{
                          region_guid : regionId,
                          table_group_guid : groupId,
                          gateway_id : gatewayId
                     }]
                }
                var deleteRegionGroupData = JSON.stringify(deleteRegionGroup);
                window.js.deleteRegionGroup(deleteRegionGroupData);
            });
        }

        //查找区域组成员
        window.queryGroupMemberInfosCallBack = function(result){
            $ionicLoading.hide();
            var groupMems = jQuery.parseJSON(result.replace(/\\/g, ""));
            if(groupMems.code == '0'){
                dialogsManager.showMessage(groupMems.message,"green");
                $scope.deviceList = groupMems.content;
            }else{
                dialogsManager.showMessage(groupMems.message,"red");
            }
        }
        var queryGroupMem = {
            "table_group_members":[{
                "table_group_guid":groupId,
                "gateway_id":gatewayId
            }]
        }
        var queryGroupMemData = JSON.stringify(queryGroupMem);
//        alert("查找区域组成员传参"+queryGroupMemData)
        window.js.queryGroupMemberInfos(queryGroupMemData);


        $scope.toAddDevice = function () {
            $state.go('add-group-device', {
                groupId: groupId,
                gatewayId: gatewayId,
                groupName: $scope.group_name,
                groupAddr : groupAddr,
                regionId : regionId,
                regionName : regionName,
                regionAddr: regionAddr
            });
        }


        window.url = "/group?regionId=" + regionId + "&gatewayId=" + gatewayId + "&regionAddr=" + regionAddr + "&regionName=" + regionName;

        // 删除组成员
        $scope.remove = function (light) {
            $rootScope.showConfirm('Delete equipment', 'Are you sure to delete this device from '+$scope.group_name+'?', function () {
                // Setup the loader
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                window.deleteGroupMemberCallBack = function(result){
                    $ionicLoading.hide();
                    var deleteGroupMemberResult = jQuery.parseJSON(result.replace(/\\/g, ""));
                    if(deleteGroupMemberResult.code == '0'){
                         dialogsManager.showMessage(deleteGroupMemberResult.message,"green");
                         //删除成功后重新查找组成员
                         window.queryGroupMemberInfosCallBack = function(result){
                                var groupMems = jQuery.parseJSON(result.replace(/\\/g, ""));
                                if(groupMems.code == '0'){
                                    $scope.deviceList = groupMems.content;
                                }
                            }
                            var queryGroupMem = {
                                "table_group_members":[{
                                    "table_group_guid":groupId,
                                    "gateway_id":gatewayId
                                }]
                            }
                            var queryGroupMemData = JSON.stringify(queryGroupMem);
//                            alert("查找区域组成员传参"+queryGroupMemData)
                            window.js.queryGroupMemberInfos(queryGroupMemData);
                    }else {
                         dialogsManager.showMessage(deleteGroupMemberResult.message,"red");
                    }
                }
                var deleteGroupMember = {
                    "table_group_members":[{
                         group_addr : groupAddr,
                         device_addr : light.device_addr,
                         gateway_id : light.gateway_id,
                    }]
                }
                var deleteGroupMemberData = JSON.stringify(deleteGroupMember);
//                alert("删除组成员传参"+deleteGroupMemberData)
                window.js.deleteGroupMember(deleteGroupMemberData);
            });
        }
    })

        /**
        * 对组添加设备
        */

       .controller('AddGroupDeviceCtrl', function ($scope, $state, $stateParams, $rootScope, Device, dialogsManager,$timeout, $ionicLoading) {
           // Setup the loader
           $ionicLoading.show({
               content: 'Loading',
               animation: 'fade-in',
               showBackdrop: true,
               maxWidth: 200,
               showDelay: 0
           });

           if (window.js) {
               if (window.js.getHeadTitle) {
                   window.js.getHeadTitle('Add Group Member'); // 调用原生提供的修改标题方法。
               }
           }
           //接收上页传来的数据
           var groupId = $stateParams.groupId;
           var gatewayId = $stateParams.gatewayId;
           var groupName = $stateParams.groupName;
           var groupAddr = $stateParams.groupAddr;
           var regionId = $stateParams.regionId;
           var regionName = $stateParams.regionName;
           var regionAddr = $stateParams.regionAddr;

            //查找配置网关下的所有设备
            window.queryAllDeviceDetailsCallBack = function(result) {
                $ionicLoading.hide();
//                alert("所有设备"+result)
                var queryAllDeviceResult = jQuery.parseJSON(result.replace(/\\/g, ""));
                if(queryAllDeviceResult.code == '0'){
                    $scope.lights = queryAllDeviceResult.content;
                }else{
                    dialogsManager.showMessage("No Device","red");
                }
            }
            window.js.queryAllDeviceDetails();

           // 对组添加设备
           $scope.apply = function (light) {
            $rootScope.showConfirm('Add equipment', 'Are you sure to add this device to '+groupName+'?', function () {
                // Setup the loader
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
               window.addGroupMemberCallBack = function(result){
                    $ionicLoading.hide();
                    var addGroupMemberResult = jQuery.parseJSON(result.replace(/\\/g, ""));
                    if(addGroupMemberResult.code == '0'){
                        dialogsManager.showMessage(addGroupMemberResult.message,"green");
                    }else {
                        dialogsManager.showMessage(addGroupMemberResult.message,"red");
                    }
               }
               var addRegionMember = {
                    "table_group_members":[{
                         table_group_guid :groupId,
                         group_addr : groupAddr,
                         device_addr : light.device_addr,
                         device_guid : light.device_guid,
                         gateway_id : light.gateway_id,
                         device_name : light.device_name
                    }]
               }
               var addRegionMemberData = JSON.stringify(addRegionMember);
               window.js.addGroupMember(addRegionMemberData);
               });
           }
           window.url = "/setgroup/detail?groupId=" +groupId+ "&gatewayId=" +gatewayId+ "&groupName=" +groupName+ "&groupAddr=" +groupAddr+ "&regionId=" +regionId+ "&regionName=" +regionName+ "&regionAddr=" +regionAddr;
       })


    /**
     * 场景设置
     */
    .controller('SceneSettingCtrl', ['$scope', '$state', '$stateParams', '$rootScope', 'Scene','dialogsManager','$timeout','$ionicLoading',function ($scope, $state, $stateParams, $rootScope, Scene,dialogsManager,$timeout,$ionicLoading) {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Regional Scene'); // 调用原生提供的修改标题方法。
            }
        }
        //接收上页传来的数据
        var regionId = $stateParams.regionId; // 获取区域Id
        var gatewayId = $stateParams.gatewayId;// 获取区域Id
        var regionName = $stateParams.regionName;
        var regionAddr = $stateParams.regionAddr;


        //离线版查询区域场景
        window.queryRegionSceneCallBack = function(result) {
            $ionicLoading.hide();
             var regionScene = jQuery.parseJSON(result.replace(/\\/g, ""));
             if(regionScene.code == '0'){
                    dialogsManager.showMessage(regionScene.message,"green");
                    $scope.sceneList = regionScene.content;
             }else {
                  dialogsManager.showMessage(regionScene.message,"red");
             }
        };
        var queryRegionScene = {
             "table_region_scene":[{
                 "region_guid":regionId
             }]
        }
        var queryRegionSceneData = JSON.stringify(queryRegionScene);
        window.js.queryRegionScene(queryRegionSceneData);


        //下拉刷新
        $scope.doRefresh = function() {
            $timeout(function() {
                window.queryRegionSceneCallBack = function(result) {
//                  alert("区域场景信息"+result);
                    var regionScene = jQuery.parseJSON(result.replace(/\\/g, ""));
                     if(regionScene.code == '0'){
                            dialogsManager.showMessage(regionScene.message,"green");
                            $scope.sceneList = regionScene.content;
                     }else {
                          dialogsManager.showMessage(regionScene.message,"red");
                     }
                };
                var queryRegionScene = {
                    "table_region_scene":[{
                        "region_guid":regionId
                    }]
                }
                var queryRegionSceneData = JSON.stringify(queryRegionScene);
//              alert("查找区域场景传参"+queryRegionSceneData)
                window.js.queryRegionScene(queryRegionSceneData);
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };
        // 去场景详情设置页面
        $scope.toSceneSetDetail = function (scene) {
            $state.go('scene-set-detail', {regionId: scene.region_guid, sceneId: scene.table_scene_guid, sceneName: scene.scene_name, gatewayId: scene.gateway_id, sceneAddr: scene.scene_addr, regionAddr: regionAddr, regionName: regionName});
        }
        // 去 新建场景页面
        $scope.toAddScene = function () {
            $state.go('new-scene', {regionId: regionId, gatewayId: gatewayId, regionName: regionName, regionAddr: regionAddr});
        }

        window.url = "/regional?regionId=" + regionId + "&gatewayId=" + gatewayId + "&regionAddr=" + regionAddr + "&regionName=" + regionName;
    }])


    /**
     * 创建场景
     */
    .controller('NewSceneCtrl', function ($scope, $state, $rootScope, $stateParams, DeviceScenes, Scene, Users, dialogsManager,$timeout, $ionicLoading) {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('New Regional Scene'); // 调用原生提供的修改标题方法。
            }
        }
        //接收上页传来的数据
        var regionId = $stateParams.regionId;
        var regionAddr = $stateParams.regionAddr;
        var gatewayId = $stateParams.gatewayId;
        var regionName = $stateParams.regionName;

        window.url ="/scene?regionId=" + regionId + "&regionAddr=" + regionAddr + "&gatewayId=" + gatewayId + "&regionName=" + regionName;

        // my 用于页面与服务间的值传递
        $scope.my = {
            sceneName: "",
        }
        //获取网关列表
        window.getGatewayIDListCallBack = function(result){
            $ionicLoading.hide();
             var gateway = jQuery.parseJSON(result.replace(/\\/g, ""));
             $scope.gateways = gateway.content;
             $scope.my.gateway = gateway.content[0];
        };
        window.js.getGatewayIDList();

        //新建区域场景
        $scope.newScene = function(){
            // Setup the loader
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            window.createSceneCallBack = function(result){
//                alert("新建场景返回信息"+result);
                var newSceneResult = jQuery.parseJSON(result.replace(/\\/g, ""));
                //创建场景成功之后添加区域场景
                if(newSceneResult.code == '0'){
                     window.addRegionSceneCallBack = function(result){
                        $ionicLoading.hide();
                        var addRegionSceneResult = jQuery.parseJSON(result.replace(/\\/g, ""));
                        if(addRegionSceneResult.code == '0'){
                            dialogsManager.showMessage(addRegionSceneResult.message,"green");
                        }else {
                            dialogsManager.showMessage(addRegionSceneResult.message,"red");
                        }
                     }
                     var addRegionScene = {
                         "table_region_scene":[{
                              region_guid : regionId,
                              table_scene_guid : newSceneResult.content[0].scene_guid,
                              scene_addr : newSceneResult.content[0].scene_addr,
                              scene_name : newSceneResult.content[0].scene_name,
                              gateway_id : newSceneResult.content[0].gateway_id
                         }]
                     }
                     var addRegionSceneData = JSON.stringify(addRegionScene);
//                     alert("添加区域场景传参"+addRegionSceneData)
                     window.js.addRegionScene(addRegionSceneData);
                }else {
                     dialogsManager.showMessage("Create Scene Failed","red");
                }
            }
            var newScenes = {
                 "table_scene" : [{
                      scene_name : $scope.my.sceneName,
                      gateway_id : $scope.my.gateway.gateway_id
                 }]
            }
            var newSceneData = JSON.stringify(newScenes);
//            alert("新建场景传参"+newSceneData);
            window.js.createScene(newSceneData);
        };

    })
    /**
     * 场景设置详情
     */
    .controller('SceneSettingDetailCtrl', function ($scope, $state, $rootScope, $stateParams, Scene, dialogsManager,$timeout, $ionicLoading) {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Regional Scene Setting'); // 调用原生提供的修改标题方法。
            }
        }

        var region_guid = $stateParams.regionId; // 获取区域Id
        var table_scene_guid = $stateParams.sceneId; // 获取场景Id
        var gateway_id = $stateParams.gatewayId; // 获取场景网关Id
        $scope.scene_name = $stateParams.sceneName; // 获取场景名
        var sceneAddr = $stateParams.sceneAddr;
        var sceneId = $stateParams.sceneId;
        var regionAddr = $stateParams.regionAddr;
        var regionName = $stateParams.regionName;

        window.url = "/scene?regionId=" + region_guid + "&gatewayId=" + gateway_id + "&regionAddr=" + regionAddr + "&regionName=" + regionName;

        //查询场景成员
        window.querySceneMembersCallBack = function(result){
            $ionicLoading.hide();
            var sceneMemResult = jQuery.parseJSON(result.replace(/\\/g, ""));
            if(sceneMemResult.code == '0'){
                dialogsManager.showMessage(sceneMemResult.message,"green");
                $scope.sceneMemberList = sceneMemResult.content;
            }else{
                dialogsManager.showMessage(sceneMemResult.message,"red");
            }
        }
        var querySceneMem = {
            "table_scene_members": [{
                table_scene_guid : table_scene_guid,
                gateway_id : gateway_id
            }]
        }
        var querySceneMemData = JSON.stringify(querySceneMem);
//        alert("查询场景成员传参"+querySceneMemData)
        window.js.querySceneMembers(querySceneMemData);


        //删除区域场景
        $scope.deleteRegionScene = function () {
            $rootScope.showConfirm('Confirm Delete', 'Are you want to delete '+ $scope.scene_name+'?', function () {
                // Setup the loader
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                //删除区域下的场景
                window.deleteRegionSceneCallBack = function(result){
                    $ionicLoading.hide();
                    var deleteRegionSceneResult = jQuery.parseJSON(result.replace(/\\/g, ""));
                    if(deleteRegionSceneResult.code == '0'){
                        dialogsManager.showMessage(deleteRegionSceneResult.message,"green");
                        $state.go('set-scene',{regionId: region_guid, gatewayId: gateway_id});
                    }else {
                        dialogsManager.showMessage(deleteRegionSceneResult.message,"red");
                    }
                }
                var deleteRegionScene = {
                    "table_region_scene" : [{
                        region_guid : region_guid,
                        table_scene_guid : table_scene_guid,
                        gateway_id : gateway_id
                    }]
                }
                var deleteRegionSceneData = JSON.stringify(deleteRegionScene);
//                alert("删除区域场景传参"+deleteRegionSceneData)
                window.js.deleteRegionScene(deleteRegionSceneData);
            });
        };

        // 去添加设备
        $scope.toAddDevice = function () {
            $state.go('add-scene-device', {
                regionId: region_guid,
                gateway: gateway_id,
                sceneAddr: sceneAddr,
                sceneId: sceneId,
                regionAddr: regionAddr,
                regionName: regionName,
                sceneName: $scope.scene_name
            });
        }

        // 删除场景成员
        $scope.remove = function (light) { // todo 需要测试
            $rootScope.showConfirm('Delete equipment', 'Are you sure to delete this device from '+$scope.scene_name+'?', function () {
                // Setup the loader
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                window.deleteSceneMembersCallBack = function(result){
//                    alert("删除场景成员结果"+result)
                    $ionicLoading.hide();
                    var deleteSceneMemberResult = jQuery.parseJSON(result.replace(/\\/g, ""));
                    if(deleteSceneMemberResult.code == '0'){
                        dialogsManager.showMessage(deleteSceneMemberResult.message,"green");
                        window.querySceneMembersCallBack = function(result){
//                            alert("查询场景成员返回信息"+result);
                            var sceneMemResult = jQuery.parseJSON(result.replace(/\\/g, ""));
                            if(sceneMemResult.code == '0'){
                                $scope.sceneMemberList = sceneMemResult.content;
                                }
                            }
                            var querySceneMem = {
                                "table_scene_members": [{
                                    table_scene_guid : table_scene_guid,
                                    gateway_id : gateway_id
                                }]
                            }
                            var querySceneMemData = JSON.stringify(querySceneMem);
//                            alert("查询场景成员传参"+querySceneMemData)
                            window.js.querySceneMembers(querySceneMemData);
                    }else {
                        dialogsManager.showMessage(deleteSceneMemberResult.message,"red");
                        }
                    }
                    var deleteSceneMember = {
                        "table_scene_members":[{
                            scene_addr : sceneAddr,
                            device_addr : light.device_addr,
                            gateway_id : light.gateway_id
                        }]
                    }
                    var deleteSceneMemberData = JSON.stringify(deleteSceneMember);
//                    alert("删除场景成员传参"+deleteSceneMemberData)
                    window.js.deleteSceneMembers(deleteSceneMemberData);
            });
        }
    })

     /**
     * 对场景添加设备
     */
    .controller('AddSceneDeviceCtrl', function ($scope, $state, $stateParams, $rootScope, Device, dialogsManager,$timeout, $ionicLoading) {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        if (window.js) {
            if (window.js.getHeadTitle) {
                window.js.getHeadTitle('Add New Scene Member'); // 调用原生提供的修改标题方法。
            }
        }

        var regionId = $stateParams.regionId;
        var gateway = $stateParams.gateway;
        var sceneAddr = $stateParams.sceneAddr;
        var sceneId = $stateParams.sceneId;
        var regionAddr = $stateParams.regionAddr;
        var regionName = $stateParams.regionName;
        var sceneName = $stateParams.sceneName;

        $scope.my = {};

        window.url = "/scene/detail?regionId=" + regionId + "&sceneId=" + sceneId + "&sceneName=" + sceneName + "&gatewayId=" + gateway + "&sceneAddr=" + sceneAddr + "&regionAddr=" + regionAddr+ "&regionName=" + regionName;

        //查找配置网关下的所有设备
        window.queryAllDeviceDetailsCallBack = function(result) {
//            alert("所有设备"+result)
            $ionicLoading.hide();
            var queryAllDeviceResult = jQuery.parseJSON(result.replace(/\\/g, ""));
            $scope.devices = queryAllDeviceResult.content;
            $scope.my.device = queryAllDeviceResult.content[0];

            $scope.my.device_channel = [];
            for(var i=0;i<queryAllDeviceResult.content[0].device_channel.length;i++){
                $scope.my.device_channel[i] = {};
                $scope.my.device_channel[i].channel_number = queryAllDeviceResult.content[0].device_channel[i].channel_number;
                $scope.my.device_channel[i].channel_name = queryAllDeviceResult.content[0].device_channel[i].channel_name;
                $scope.my.device_channel[i].channel_value = Math.round(queryAllDeviceResult.content[0].device_channel[i].channel_value*100/255);
            }
//            alert('$scope.my.device_channel'+JSON.stringify($scope.my.device_channel))
        }
        window.js.queryAllDeviceDetails();


                    //监听设备变化，通道也跟着变化。
                    $scope.deviceChange = function(device) {
                        if ($scope.my.device && $scope.my.device.device_channel) {
                            $scope.my.device_channel = [];
                            for(var i=0;i<$scope.my.device.device_channel.length;i++){
                                $scope.my.device_channel[i] = {};
                                $scope.my.device_channel[i].channel_number = $scope.my.device.device_channel[i].channel_number;
                                $scope.my.device_channel[i].channel_name = $scope.my.device.device_channel[i].channel_name;
                                $scope.my.device_channel[i].channel_value = Math.round($scope.my.device.device_channel[i].channel_value*100/255);
                            }
                        }else{
                            $scope.my.device_channel = [];
                        }
                    }

//         var channelValueList = {};
        // 对场景添加设备
        $scope.apply = function () {
            $rootScope.showConfirm('Add equipment', 'Are you sure to add this device ?', function () {
                // Setup the loader
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                window.addSceneMembersCallBack = function(result){
//                    alert("添加场景成员结果"+result)
                    $ionicLoading.hide();
                    var addSceneMembersResult = jQuery.parseJSON(result.replace(/\\/g, ""));
                    if(addSceneMembersResult.code == '0'){
                         dialogsManager.showMessage(addSceneMembersResult.message,"green");
                    }else {
                         dialogsManager.showMessage(addSceneMembersResult.message,"red");
                    }
                }
                var Device = $scope.my.device;
                var deviceChannel = $scope.my.device_channel
                $scope.channelValue = [];
                for(var i=0;i<deviceChannel.length;i++){
                    $scope.channelValue[i] = {};
                    $scope.channelValue[i].channel_number = deviceChannel[i].channel_number;
                    $scope.channelValue[i].channel_value = ""+Math.round(deviceChannel[i].channel_value*255/100);
                }
                var addSceneMembers = {
                    "table_scene_members":[{
                         table_scene_guid : sceneId,
                         scene_addr : sceneAddr,
                         device_addr : Device.device_addr,
                         device_value : $scope.channelValue,
                         device_delay : "1",
                         device_guid : Device.device_guid,
                         device_name : Device.device_name,
                         gateway_id : Device.gateway_id
                    }]
                }
                var addSceneMembersData = JSON.stringify(addSceneMembers);
//                alert("添加场景成员传参"+addSceneMembersData)
                window.js.addSceneMembers(addSceneMembersData);
            });
        }

    })
































//    /**
//     * 条件控制
//     */
//    .controller('TermSettingCtrl', function ($scope, $state, $stateParams, $rootScope, Term) {
//        if (window.js) {
//            if (window.js.getHeadTitle) {
//                window.js.getHeadTitle('Regional Term'); // 调用原生提供的修改标题方法。
//            }
//        }
//
//        var regionId = $stateParams.regionId; // 获取区域Id
//        var regionAddr = $stateParams.regionAddr; // 获取区域地址
//        var gatewayId = $stateParams.gatewayId || $rootScope.gatewayId; // 获取区域Id
//
//        window.url = "/regional?regionId=" + regionId + "&gatewayId=" + gatewayId + "&regionAddr=" + gatewayId;
//
//        // 查询配方信息
//        Term.getList().then(function (data) {
//            $scope.termList = data;
//        })
//        // 去条件控制详情
//        $scope.toSetTermDetail = function (term) {
//            $rootScope.term = term;
//            $state.go('set-term-detail', {regionId: regionId, gatewayId: gatewayId, regionAddr: regionAddr})
//        }
//        $scope.toAddTerm = function () {
//            $state.go('new-term', {regionId: regionId, gatewayId: gatewayId});
//        }
//    })
//    /**
//     * 创建条件控制
//     */
//    .controller('NewTermCtrl', function ($scope, $state, $rootScope, $stateParams, Term, Users, dialogsManager) {
//        if (window.js) {
//            if (window.js.getHeadTitle) {
//                window.js.getHeadTitle('New Regional Term'); // 调用原生提供的修改标题方法。
//            }
//        }
//
//        var regionId = $stateParams.regionId; // 获取区域Id
//        var gatewayId = $stateParams.gatewayId || $rootScope.gatewayId; // 获取区域Id
//        // my 用于页面与服务间的值传递
//        $scope.my = {
//            termName: "",
//        }
//        // 获取网关列表
//        Users.getGateway().then(function (data) {
//            $scope.gateways = data;
//            $scope.my.gateway = data[0]
//        })
//        // 新建组
//        $scope.newTerm = function () {
//            // 添加条件控制
//            Term.add($scope.my.gateway.gateway_id, $scope.my.termName).then(function (data) {
//                if (data) {
//                    //$rootScope.promptBox('success', 'Add Term Success', function() {
//                    //    $state.go('set-term', {regionId: regionId, gatewayId: gatewayId});
//                    //})
//                    dialogsManager.showMessage("Add Term Success", "green");
//                    $state.go('set-term', {regionId: regionId, gatewayId: gatewayId});
//                } else {
//                    //$rootScope.promptBox('Fail', 'Add Term Fail', function() {
//                    //    $state.go('set-term', {regionId: regionId, gatewayId: gatewayId});
//                    //})
//                    dialogsManager.showMessage("Add Term Fail", "red");
//                }
//            });
//        }
//        window.url = "/term?regionId=" + $rootScope.regionId + "&gatewayId=" + $rootScope.gatewayId + "&regionAddr=" + $rootScope.regionAddr;
//
//    })
//
//    /**
//     * 条件控制详情
//     */
//    .controller('TermSettingDetailCtrl', function ($scope, $state, $rootScope, $stateParams, Term) {
//        if (window.js) {
//            if (window.js.getHeadTitle) {
//                window.js.getHeadTitle('Regional Term Setting'); // 调用原生提供的修改标题方法。
//            }
//        }
//
//        var regionId = $stateParams.regionId; // 获取区域Id
//        var regionAddr = $stateParams.regionAddr; // 获取区域地址
//        var gatewayId = $stateParams.gatewayId || $rootScope.gatewayId; // 获取区域Id
//        var term = $rootScope.term;
//
//        window.url = "/term?regionId=" + regionId + "&gatewayId=" + gatewayId + "&regionAddr=" + regionAddr;
//
//        if (term) {
//            $scope.ruleList = term.conditions || [];
//            $scope.actionList = term.ctrl_sequence || [];
//        }
//        // 去添加条件
//        $scope.toAddRule = function () {
//            $state.go('add-term-rule', {regionId: regionId, gatewayId: gatewayId});
//        }
//        // 去添加序列
//        $scope.toAddAction = function () {
//            $state.go('add-term-action', {regionId: regionId, gatewayId: gatewayId, regionAddr: regionAddr});
//        }
//        // 去序列详情
//        $scope.toActionDetail = function (action) {
//            $rootScope.actionDetail = action;
//            console.log('action', action);
//            $state.go('add-term-sequence-detail', {regionId: regionId, gatewayId: gatewayId});
//        }
//    })
//
//    /**
//     * 条件控制动作详情
//     */
//    .controller('AddTermSequenceDetailCtrl', function ($scope, $state, $rootScope, Term) {
//        $scope.actionDetail = $rootScope.actionDetail;
//    })
//
//    /**
//     * 条件控制 - 添加条件
//     */
//    .controller('AddTermRuleCtrl', function ($scope, $state, $stateParams, $rootScope, Device, Term, dialogsManager) {
//        if (window.js) {
//            if (window.js.getHeadTitle) {
//                window.js.getHeadTitle('Add New Term Rule'); // 调用原生提供的修改标题方法。
//            }
//        }
//        var regionId = $stateParams.regionId; // 获取区域Id
//        var gatewayId = $stateParams.gatewayId || $rootScope.gatewayId; // 获取区域Id
//
//        window.url = "/term/detail?regionId=" + regionId + "&gatewayId=" + gatewayId + "&regionAddr=" + $rootScope.regionAddr;
//
//        $scope.my = {}
//        Device.all(regionId, gatewayId).then(function (data) {
//            console.log(data);
//            $scope.deviceList = data;
//            $scope.my.device = data[0];
//            $scope.channelList = data[0].channel;
//            // console.log( $scope.channelList);
//            $scope.my.channel = $scope.channelList[0];
//
//            // 监听设备变化，通道也跟着变化。
//            $scope.deviceChange = function () {
//                if ($scope.my.device && $scope.my.device.channel) {
//                    $scope.channelList = $scope.my.device.channel;
//                } else {
//                    $scope.my.channelList = [];
//                }
//            }
//        })
//
//        $scope.addRule = function () {
//            var term = $rootScope.term;
//
//            var param = {
//                table_conditons: [{
//                    cdts_list_guid: term.cdts_list_guid,
//                    gateway_id: $scope.my.channel.gateway_id,
//                    table_device_guid: $scope.my.channel.table_device_guid,
//                    channel_class: $scope.my.channel.channel_class,
//                    channel_type: $scope.my.channel.channel_type,
//                    channel_bit_num: $scope.my.channel.channel_bit_num,
//                    compare_val: $scope.my.putVaule,
//                    offset_val: '0',
//                }]
//            }
//            Term.addRule(param).then(function (data) {
//                if (data) {
//                    //$rootScope.promptBox('success', 'Add Rule Success', function() {
//                    //    $state.go('set-term-detail', {regionId: regionId, gatewayId: gatewayId});
//                    //})
//                    dialogsManager.showMessage("Add Rule Success", "green");
//                    $state.go('set-term-detail', {regionId: regionId, gatewayId: gatewayId});
//                } else {
//                    //$rootScope.promptBox('success', 'Add Rule Success', function() {
//                    //    $state.go('set-term-detail', {regionId: regionId, gatewayId: gatewayId});
//                    //})
//                    dialogsManager.showMessage("Add Rule Fail", "red");
//                }
//            });
//        }
//    })
//    /**
//     * 条件控制 - 添加动作
//     */
//    .controller('AddTermActionCtrl', function ($scope, $state, $rootScope, $stateParams, Device, Term, RegionGroups, Regional, Scene) {
//        var regionId = $stateParams.regionId; // 获取区域Id
//        var regionAddr = $stateParams.regionAddr; // 获取区域地址
//        var gatewayId = $stateParams.gatewayId || $rootScope.gatewayId; // 获取区域Id
//
//        window.url = "/term/detail?regionId=" + regionId + "&gatewayId=" + gatewayId + "&regionAddr=" + regionAddr;
//
//        if (window.js) {
//            if (window.js.getHeadTitle) {
//                window.js.getHeadTitle('Add New Term Action'); // 调用原生提供的修改标题方法。
//            }
//        }
//
//        $scope.typeList = [
//            {
//                name: 'Region',
//                key: 'region',
//                targetList: [
//                    {
//                        name: 'Channel',
//                        key: 'channel'
//                    },
//                    {
//                        name: 'Switch',
//                        key: 'switch'
//                    }
//                ]
//            },
//            {
//                name: 'Group',
//                key: 'group',
//                targetList: [
//                    {
//                        name: 'Channel',
//                        key: 'channel'
//                    },
//                    {
//                        name: 'Switch',
//                        key: 'switch'
//                    }
//                ]
//            },
//            {
//                name: 'Scene',
//                key: 'scene',
//                targetList: [
//                    {
//                        name: 'Switch',
//                        key: 'switch'
//                    }
//                ]
//            },
//            {
//                name: 'Device',
//                key: 'device',
//                targetList: [
//                    {
//                        name: 'Channel',
//                        key: 'channel'
//                    },
//                    {
//                        name: 'Switch',
//                        key: 'switch'
//                    }
//                ]
//            }];
//
//        $scope.my = {};
//
//        $scope.my.type = $scope.typeList[0]; // 获取选择的类型
//        $scope.my.target = $scope.my.type.targetList[0]; // 获取选择的目标
//        $scope.my.dataTime = ''; // 到下个序列的时间
//        $scope.my.switchValue = '00'; // 开关动作的值
//        $scope.my.channelValue = ''; // 通道值
//        $scope.my.sequenceList = [];
//        $scope.my.channelList = [] // 选择的通道数组
//        $scope.my.channel = {}; // 选择的通道对象
//        $scope.my.objList = [{name: regionId}]; // 操作对象列表，默认显示区域
//        $scope.my.obj = $scope.my.objList[0] // 选择的操作对象，默认为区域id
//
//        Regional.getChannel(regionId, gatewayId).then(function (data) {
//            $scope.my.channelList = data;
//            $scope.my.channel = data[0]; // 通道动作
//        });
//
//        // 改变类型是改变对象值与通道值
//        $scope.typeChange = function () {
//            switch ($scope.my.type.key) {
//                case 'region' :
//                    $scope.my.objList = [{name: regionId}];
//                    $scope.my.obj = $scope.my.objList[0];
//                    // 刷新区域下的通道
//                    Regional.getChannel(regionId, gatewayId).then(function (data) {
//                        $scope.my.channelList = data;
//                        $scope.my.channel = data[0];
//                    });
//                    break;
//
//                case 'device' :
//                    Device.all(regionId, gatewayId).then(function (data) {
//                        $scope.my.objList = data; //查询device
//                        $scope.my.obj = $scope.my.objList[0];
//                        $scope.my.channelList = data[0].channel;
//                        $scope.my.channel = data[0].channel[0];
//                        $scope.my.channel.channel_number = $scope.my.channel.channel_bit_num; // 目前没有 channel_number，用channel.channel_bit_num代替，为了统一字段，这里重新赋值
//                    });
//                    break;
//
//                case 'group' :
//                    RegionGroups.getList(regionId).then(function (data) {
//                        $scope.my.objList = data; //查询device
//                        $scope.my.obj = $scope.my.objList[0];
//                    })
//                    break;
//
//                case 'scene' :
//                    Scene.getList(regionId, gatewayId).then(function (data) {
//                        $scope.my.objList = data; //查询device
//                        $scope.my.obj = $scope.my.objList[0];
//                    })
//                    break;
//            }
//
//            $scope.my.target = $scope.my.type.targetList[0]; // 控制目标切换为type对应的目标
//        }
//        // 添加动作
//        $scope.addAction = function () {
//            var action = {
//                type_name: $scope.my.type.name,
//                region_name: $scope.my.obj.name,
//                device_name: $scope.my.obj.device_name,
//                group_name: $scope.my.obj.group_name,
//                scene_name: $scope.my.obj.scene_name,
//                group_id: $scope.my.obj.table_device_guid || $scope.my.obj.table_group_guid || $scope.my.obj.region_scene_guid || regionId,
//                address: $scope.my.obj.group_addr || $scope.my.obj.device_addr || $scope.my.obj.scene_addr || regionAddr,
//                gateway_id: $scope.my.obj.gateway_id || gatewayId,
//                channel_number: $scope.my.channel.channel_number,
//                channel_value: $scope.my.channelValue,
//                switchValue: $scope.my.switchValue,
//                target: $scope.my.target.key
//            }
//            $scope.my.sequenceList.push(action)
//            console.log(action);
//        }
//        // 添加序列
//        $scope.addSequence = function () {
//            var term = $rootScope.term;
//            var ctrl_sqn_guid = '先创建序列，得到序列id后添加动作'; // /device/term/sequence
//            // var ctrl_sqn_guid = term.ctrl_sequence && ctrl_sequence.length > 1? ctrl_sequence.length + 1 : 1;
//            // var sequence = {};
//            var sequenceParam = [];
//            for (var i = 0; i < $scope.my.sequenceList.length; i++) {
//                var sequence = {
//                    ctrl_sqn_guid: ctrl_sqn_guid,
//                    main_table_name: "table_device", // 根据区域，组，场景切换
//                    dcgs_guid: $scope.my.sequenceList[i].group_id,
//                    gateway_id: $scope.my.sequenceList[i].gateway_id,
//                    m_address: $scope.my.sequenceList[i].address,
//                    channel_bit_num: $scope.my.sequenceList[i].channel_number,
//                    m_value: $scope.my.sequenceList[i].channelValue,
//                    m_switch: $scope.my.sequenceList[i].switchValue,
//                    m_delay: "1"
//                }
//                sequenceParam.push(sequence);
//            }
//
//
//            console.log(sequenceParam);
//        }
//    })
//
//    /**
//     * 配方
//     */
//    .controller('RecipeSettingCtrl', function ($scope, $state) {
//        $scope.toAddTerm = function () {
//            $state.go('add-recipe-term');
//        }
//        $scope.toAddAction = function () {
//            $state.go('add-recipe-action');
//        }
//    })
//    /**
//     * 配方 - 添加条件控制
//     */
//    .controller('AddRecipeTermCtrl', function ($scope, $state) {
//
//    })
//    /**
//     * 配方 - 添加动作
//     */
//    .controller('AddRecipeActionCtrl', function ($scope, $state) {
//
//    })


