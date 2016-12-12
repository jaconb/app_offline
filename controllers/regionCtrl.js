angular.module('starter.region', [])
/**
 * 区域控制器
 */
.controller('RegionalCtrl', ['$scope', '$state', '$rootScope', '$ionicLoading', 'Regionals', 'HttpService','$timeout','$ionicLoading','dialogsManager',function($scope, $state, $rootScope, $ionicLoading, Regionals, HttpService,$timeout,$ionicLoading,dialogsManager) {

    // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

    window.queryRegionInfoCallBack = function(result) {
        $ionicLoading.hide();
        var regions = jQuery.parseJSON(result.replace(/\\/g, ""));
        if(regions.code == '0'){
            dialogsManager.showMessage(regions.message,"green");
            $scope.regionals = regions.content;
        }else{
            dialogsManager.showMessage(regions.message,"red");
        }
    }
    window.js.queryRegionInfo();

    if (window.js) {
        if (window.js.getHeadTitle) {
            window.js.getHeadTitle('Region'); // 调用原生提供的修改标题方法。
        }
        if (window.js.settingBtnShowOrNot) {
            window.js.settingBtnShowOrNot(1);
        }
    }

    //下拉刷新
        $scope.doRefresh = function() {
            $timeout(function() {
                //simulate async response
                window.queryRegionInfoCallBack = function(result) {
                    var regions = jQuery.parseJSON(result.replace(/\\/g, ""))
                    if(regions.code == '0'){
                        dialogsManager.showMessage(regions.message,"green");
                        $scope.regionals = regions.content;
                    }else{
                        dialogsManager.showMessage(regions.message,"red");
                    }
                }
                window.js.queryRegionInfo();
                $scope.$broadcast('scroll.refreshComplete');

            }, 1000);
        };
    // 去区域详情
    $scope.toRegional = function(region) {
        $state.go('regional-detail', {regionId : region.region_guid, gatewayId: region.gateway_id, regionName: region.region_name, regionAddr: region.region_addr, regionValue: region.region_value});
    }
}])

/**
 * 区域详情
 */
.controller('RegionalDetailCtrl', function($scope, $state, $stateParams, $rootScope, Regional, HttpService, dialogsManager, $timeout, $ionicLoading) {

        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

    // 获取区域id
    var regionId = $stateParams.regionId;
    var gatewayId = $stateParams.gatewayId;
    $scope.regionName = $stateParams.regionName;
    var regionAddr = $stateParams.regionAddr;
    var regionValue = $stateParams.regionValue;

    if (window.js) {
        if (window.js.getHeadTitle) {
            window.js.getHeadTitle('Regional Detail'); // 调用原生提供的修改标题方法。
        }
        if (window.js.settingBtnShowOrNot) {
            window.js.settingBtnShowOrNot(0);
        }
    }

    //获取区域通道信息
    window.getChannelListCallBack = function(result) {
            $ionicLoading.hide();
            var regionChannel = jQuery.parseJSON(result.replace(/\\/g, ""));
            if(regionChannel.code == '0'){
                dialogsManager.showMessage(regionChannel.message,"green");
                $scope.channelList = [];
                for(var i=0;i<regionChannel.content.length;i++){
                    $scope.channelList[i] = {};
                    $scope.channelList[i].channel_name = regionChannel.content[i].channel_name;
                    $scope.channelList[i].channel_number = regionChannel.content[i].channel_number;
                    $scope.channelList[i].channel_value = Math.round(regionChannel.content[i].channel_value*100/255);
                    $scope.channelList[i].gateway_id = regionChannel.content[i].gateway_id;
                }
            }else{
                dialogsManager.showMessage(regionChannel.message,"red");
            }
    }
    var queryRegionChannel = {
            "table_region_device" : [{
                "gateway_id" : gatewayId,
                "region_value" : regionValue,
                "region_guid" : regionId
        }]
    }
    var queryRegionChannelData = JSON.stringify(queryRegionChannel);
    window.js.getChannelList(queryRegionChannelData);

    //下拉刷新
    $scope.doRefresh = function() {
       $timeout(function() {
           window.getChannelListCallBack = function(result) {
               var regionChannel = jQuery.parseJSON(result.replace(/\\/g, ""));
               if(regionChannel.code == '0'){
                    dialogsManager.showMessage(regionChannel.message,"green");
                    $scope.channelList = [];
                    for(var i=0;i<regionChannel.content.length;i++){
                        $scope.channelList[i] = {};
                        $scope.channelList[i].channel_name = regionChannel.content[i].channel_name;
                        $scope.channelList[i].channel_number = regionChannel.content[i].channel_number;
                        $scope.channelList[i].channel_value = Math.round(regionChannel.content[i].channel_value*100/255);
                        $scope.channelList[i].gateway_id = regionChannel.content[i].gateway_id;
                    }
               }else{
                    dialogsManager.showMessage(regionChannel.message,"red");
               }
           }
           var queryRegionChannel = {
               "table_region_device" : [{
                    "gateway_id" : gatewayId,
                    "region_value" : regionValue,
                    "region_guid" : regionId
               }]
           }
           var queryRegionChannelData = JSON.stringify(queryRegionChannel);
           window.js.getChannelList(queryRegionChannelData);
           $scope.$broadcast('scroll.refreshComplete');
       }, 1000);
    };


    //一键白开（以控制通道的形式实现）
    $scope.ctrlRegionWhiteOn = function(){
        $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
        });
        window.controlRegionCallBack = function(result) {
            $ionicLoading.hide();
            var controlRegionWhiteOnRs = jQuery.parseJSON(result.replace(/\\/g, ""))
            if(controlRegionWhiteOnRs.code == '0'){
                dialogsManager.showMessage(controlRegionWhiteOnRs.message,"green");
            }else{
                dialogsManager.showMessage(controlRegionWhiteOnRs.message,"red");
            }
        }
        $scope.whiteOnChannelList = [];
        for(var i = 0;i < $scope.channelList.length; i++){
            $scope.whiteOnChannelList[i] = {};
            if($scope.channelList[i].channel_name == 'White'){
                $scope.whiteOnChannelList[i].channel_number = $scope.channelList[i].channel_number;
                $scope.whiteOnChannelList[i].channel_value = "" + 255;
            }else {
                $scope.whiteOnChannelList[i].channel_number = $scope.channelList[i].channel_number;
                $scope.whiteOnChannelList[i].channel_value = "" + 0;
            }
        }
        var controlRegionWhiteOn = {
            "table_region":[{
                region_addr: regionAddr,
                gateway_id: gatewayId,
                region_guid: regionId,
                region_value: $scope.whiteOnChannelList,
                region_delay: "0"
            }]
        }
        var controlRegionWhiteOnData = JSON.stringify(controlRegionWhiteOn);
        window.js.controlRegion(controlRegionWhiteOnData);
    }
    //一键白关（以控制通道的形式实现）
    $scope.ctrlRegionWhiteOff = function(){
        $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
        });
        window.controlRegionCallBack = function(result) {
            $ionicLoading.hide();
            var controlRegionWhiteOffRs = jQuery.parseJSON(result.replace(/\\/g, ""))
            if(controlRegionWhiteOffRs.code == '0'){
                dialogsManager.showMessage(controlRegionWhiteOffRs.message,"green");
            }else{
                dialogsManager.showMessage(controlRegionWhiteOffRs.message,"red");
            }
        }
        $scope.whiteOffChannelList = [];
        for(var i = 0 ; i < $scope.channelList.length; i ++){
            $scope.whiteOffChannelList[i] = {};
            $scope.whiteOffChannelList[i].channel_number = $scope.channelList[i].channel_number;
            $scope.whiteOffChannelList[i].channel_value = "" + 255;
        }
        var controlRegionWhiteOff = {
            "table_region":[{
                region_addr: regionAddr,
                gateway_id: gatewayId,
                region_guid: regionId,
                region_value: $scope.whiteOffChannelList,
                region_delay: "0"
            }]
        }
        var controlRegionWhiteOffData = JSON.stringify(controlRegionWhiteOff);
        window.js.controlRegion(controlRegionWhiteOffData);
    }







    // 控制区域开关
    $scope.ctrlRegionOn = function () {
       $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
       });
        window.controlRegionCallBack = function(result) {
              $ionicLoading.hide();
              var controlRegionOn = jQuery.parseJSON(result.replace(/\\/g, ""))
              if(controlRegionOn.code == '0'){
                    dialogsManager.showMessage(controlRegionOn.message,"green");
              }else{
                    dialogsManager.showMessage(controlRegionOn.message,"red");
              }
        }
        var controlRegionOn = {
            "table_region":[{
                region_addr: regionAddr,
                gateway_id: gatewayId,
                region_guid: regionId,
                region_switch: '01',
                region_delay: "1"
            }]
        }
        var controlRegionOnData = JSON.stringify(controlRegionOn);
        window.js.controlRegion(controlRegionOnData);
    };
//
    //关闭区域
    $scope.ctrlRegionOff = function () {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        window.controlRegionCallBack = function(result) {
            $ionicLoading.hide();
            var controlRegionOff = jQuery.parseJSON(result.replace(/\\/g, ""))
                  if(controlRegionOff.code == '0'){
                     dialogsManager.showMessage(controlRegionOff.message,"green");
                  }else{
                     dialogsManager.showMessage(controlRegionOff.message,"red");
                  }
            }
            var controlRegionOff = {
                 "table_region":[{
                     region_addr: regionAddr,
                     gateway_id: gatewayId,
                     region_guid: regionId,
                     region_switch: '00',
                     region_delay: "1"
                 }]
            }
            var controlRegionOffData = JSON.stringify(controlRegionOff);
            window.js.controlRegion(controlRegionOffData);
    };

//    // 控制区域通道
    $scope.ctrlChannel = function (channelList) {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        window.controlRegionCallBack = function(result) {
            $ionicLoading.hide();
             var controlRegionChannel = jQuery.parseJSON(result.replace(/\\/g, ""))
             if(controlRegionChannel.code == '0'){
                   dialogsManager.showMessage(controlRegionChannel.message,"green");
             }else{
                   dialogsManager.showMessage(controlRegionChannel.message,"red");
             }
        }

        $scope.regionChannels = [];
        for(var i = 0;i<channelList.length;i++){
            $scope.regionChannels[i] = {};
            $scope.regionChannels[i].channel_number = channelList[i].channel_number;
            $scope.regionChannels[i].channel_value = ""+Math.round(channelList[i].channel_value*255/100);
        }
        var controlRegionChannel = {
            "table_region":[{
                region_addr: regionAddr,
                gateway_id: gatewayId,
                region_guid: regionId,
                region_value: $scope.regionChannels,
                region_delay: "1"
            }]
        }
        var controlRegionChannelData = JSON.stringify(controlRegionChannel);
//        alert('区域通道控制传参'+controlRegionChannelData)
        window.js.controlRegion(controlRegionChannelData);
    };


    // 去设备控制
    $scope.toDeviceCtrl = function() {
        $state.go('regional-device', {
            regionId: regionId,
            gatewayId: gatewayId,
            regionValue: regionValue
        })
    }
    // 去组控制
    $scope.toGroupCtrl = function() {
        $state.go('regional-group', {
            regionId: regionId,
            gatewayId: gatewayId
        })
    }
    // 去场景控制
    $scope.toSceneCtrl = function() {
        $state.go('regional-scene', {
            regionId: regionId,
            gatewayId: gatewayId
        })
    }
})

/**
 * 区域->设备控制
 */
.controller('RegionalDeviceCtrl', function($scope, $stateParams, $rootScope, dialogsManager,$timeout, $ionicLoading) {
// Setup the loader
$ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
});

    var regionId = $stateParams.regionId;
    var gatewayId = $stateParams.gatewayId;

    if (window.js) {
        if (window.js.getHeadTitle) {
            window.js.getHeadTitle('Device Control'); // 调用原生提供的修改标题方法。
        }
        if (window.js.settingBtnShowOrNot) {
            window.js.settingBtnShowOrNot(0);
        }
    }
    $scope.my = {};

    //离线版查询区域设备
    window.queryRegionDeviceCallBack = function(result) {
        $ionicLoading.hide();
//        alert("区域设备"+result)
        var regionDevice = jQuery.parseJSON(result.replace(/\\/g, ""))
        $scope.devices = regionDevice.content;
        //设置默认显示第一个设备及通道信息
        $scope.my.device = regionDevice.content[0];
        $scope.my.device_channel = [];
        for(var i=0;i<regionDevice.content[0].device_channel.length;i++){
            $scope.my.device_channel[i] = {};
            $scope.my.device_channel[i].channel_number = regionDevice.content[0].device_channel[i].channel_number;
            $scope.my.device_channel[i].channel_name = regionDevice.content[0].device_channel[i].channel_name;
            $scope.my.device_channel[i].channel_value = Math.round(regionDevice.content[0].device_channel[i].channel_value*100/255);
        }
//        $scope.my.device_channel = regionDevice.content[0].device_channel;
    }
    var queryRegionDevices = {
        "table_region_device" : [{
            "region_guid" : regionId
        }]
    }
    var queryRegionDeviceData = JSON.stringify(queryRegionDevices);
    window.js.queryRegionDevice(queryRegionDeviceData);

            //监听设备变化，通道也跟着变化
            $scope.deviceChange = function() {
                if ($scope.my.device && $scope.my.device.device_channel) {
                    $scope.my.device_channel = [];
                    for(var i=0;i<$scope.my.device.device_channel.length;i++){
                        $scope.my.device_channel[i] = {};
                        $scope.my.device_channel[i].channel_number = $scope.my.device.device_channel[i].channel_number;
                        $scope.my.device_channel[i].channel_name = $scope.my.device.device_channel[i].channel_name;
                        $scope.my.device_channel[i].channel_value = Math.round($scope.my.device.device_channel[i].channel_value*100/255);
                    }
                } else {
                    $scope.my.device_channel = [];
                }
            }

    // 控制设备开关
    //设备开
    $scope.ctrlDeviceOn = function () {
    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
        var device = $scope.my.device;
        window.controlDeviceCallBack = function(result) {
            $ionicLoading.hide();
            var controlDeviceSwitch = jQuery.parseJSON(result.replace(/\\/g, ""))
                  if(controlDeviceSwitch.code == '0'){
                     dialogsManager.showMessage(controlDeviceSwitch.message,"green");
                  }else{
                     dialogsManager.showMessage(controlDeviceSwitch.message,"red");
                  }
            }
        var ctrlDeviceOn = {
            "table_device" : [{
                device_guid: device.table_device_guid,
                device_addr: device.device_addr,
                gateway_id: device.gateway_id,
                device_switch: "01",
                device_type : "bulb",//TODO 静态值，后期要改
                device_delay: "1"
            }]
        }
        var controlDeviceOnData = JSON.stringify(ctrlDeviceOn);
//        alert("打开区域设备传参"+controlDeviceOnData)
        window.js.controlDevice(controlDeviceOnData);
    };
//
    //设备关
    $scope.ctrlDeviceOff = function () {

// Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var device = $scope.my.device;
        window.controlDeviceCallBack = function(result) {
            $ionicLoading.hide();
            var controlDeviceSwitch = jQuery.parseJSON(result.replace(/\\/g, ""))
            if(controlDeviceSwitch.code == '0'){
                 dialogsManager.showMessage(controlDeviceSwitch.message,"green");
            }else{
                 dialogsManager.showMessage(controlDeviceSwitch.message,"red");
                 }
            }
            var ctrlDeviceOff = {
                "table_device" : [{
                    device_guid: device.table_device_guid,
                    device_addr: device.device_addr,
                    gateway_id: device.gateway_id,
                    device_switch: "00",
                    device_type : "bulb",
                    device_delay: "1"
                }]
            };
            var ctrlDeviceOffData = JSON.stringify(ctrlDeviceOff);
//            alert("关闭区域设备传参"+ctrlDeviceOffData)
            window.js.controlDevice(ctrlDeviceOffData);
    };

    // 控制设备通道
    $scope.ctrlChannel = function (channelList) {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var device = $scope.my.device;
        window.controlDeviceCallBack = function(result) {
            $ionicLoading.hide();
            var controlDeviceChannel = jQuery.parseJSON(result.replace(/\\/g, ""))
            if(controlDeviceChannel.code == '0'){
                  dialogsManager.showMessage(controlDeviceChannel.message,"green");
            }else{
                  dialogsManager.showMessage(controlDeviceChannel.message,"red");
                  }
        }

        $scope.deviceChannels = [];
        for(var i = 0;i<channelList.length;i++){
             $scope.deviceChannels[i] = {};
             $scope.deviceChannels[i].channel_number = channelList[i].channel_number;
             $scope.deviceChannels[i].channel_value = ""+Math.round(channelList[i].channel_value*255/100);
        }
            var ctrlDeviceChannel = {
                 "table_device" : [{
                      device_guid: device.table_device_guid,
                      device_addr: device.device_addr,
                      gateway_id: device.gateway_id,

                      device_value : $scope.deviceChannels,

                      device_type : "bulb",
                      device_delay: "1"
                 }]
            };
            var ctrlDeviceChannelData = JSON.stringify(ctrlDeviceChannel);
//            alert("区域设备通道控制"+ctrlDeviceChannelData)
            window.js.controlDevice(ctrlDeviceChannelData);
        };
    })

/**
 * 区域->组控制
 */
.controller('RegionalGroupCtrl', ['$scope', '$state', '$stateParams', '$rootScope', 'RegionGroups', 'HttpService', 'dialogsManager','$timeout','$ionicLoading',function($scope, $state, $stateParams, $rootScope, RegionGroups, HttpService, dialogsManager,$timeout,$ionicLoading) {

    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
    var regionId = $stateParams.regionId;
    var gatewayId = $stateParams.gatewayId;

    if (window.js) {
        if (window.js.getHeadTitle) {
            window.js.getHeadTitle('Regional Group'); // 调用原生提供的修改标题方法。
        }
        if (window.js.settingBtnShowOrNot) {
            window.js.settingBtnShowOrNot(0);
        }
    }

    //离线版查询区域组
    window.queryRegionGroupCallBack = function(result) {
        $ionicLoading.hide();
//        alert("区域组查询结果"+result)
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
//    alert("查询区域组传参"+queryRegionGroupData);
    window.js.queryRegionGroup(queryRegionGroupData);

    //下拉刷新
    $scope.doRefresh = function() {
        $timeout(function() {
          //simulate async response
              window.queryRegionGroupCallBack = function(result) {
//                  alert("区域组查询结果"+result)
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
          //    alert("查询区域组传参"+queryRegionGroupData);
              window.js.queryRegionGroup(queryRegionGroupData);
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000);
    };
    // 去组详情
    $scope.toGroupDetail = function(group) {
        $rootScope.group = group;
        $state.go('regional-group-detail', {
            groupId: group.table_group_guid,
            gatewayId: gatewayId,
            regionId: regionId,
            groupAddr: group.group_addr
        })
    };
}])

/**
 * 区域-组-详情
 */
.controller('RegionalGroupDetailCtrl', function($scope, $rootScope, $stateParams, DeviceGroups, RegionGroups, HttpService, dialogsManager,$timeout, $ionicLoading) {
    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    var groupId = $stateParams.groupId;
    var regionId = $stateParams.regionId;
    var gatewayId = $stateParams.gatewayId;
    var groupAddr = $stateParams.groupAddr;

    if (window.js) {
        if (window.js.getHeadTitle) {
            window.js.getHeadTitle('Group Control'); // 调用原生提供的修改标题方法。
        }
        if (window.js.settingBtnShowOrNot) {
            window.js.settingBtnShowOrNot(0);
        }
    }

    //离线版查询区域组详情
    window.queryGroupInfosCallBack = function(result) {
        $ionicLoading.hide();
        var regionGroupInfo = jQuery.parseJSON(result.replace(/\\/g, ""));
        if(regionGroupInfo.code == '0'){
            dialogsManager.showMessage(regionGroupInfo.message,"green");
            $scope.channelList = [];
            for(var i=0;i<regionGroupInfo.content.length;i++){
                $scope.channelList[i] = {};
                $scope.channelList[i].channel_number = regionGroupInfo.content[i].channel_number;
                $scope.channelList[i].channel_name = regionGroupInfo.content[i].channel_name;
                $scope.channelList[i].channel_value = Math.round(regionGroupInfo.content[i].channel_value*100/255);
            }
        }else{
            dialogsManager.showMessage(regionGroupInfo.message,"red");
        }
    };
        var queryGroupInfo = {
             "table_group_members":[{
                    "table_group_guid":groupId,
                    "gateway_id":gatewayId
             }]
        }
        var queryGroupInfoData = JSON.stringify(queryGroupInfo);
//        alert("查询区域组详情传参"+queryGroupInfoData)
        window.js.queryGroupInfos(queryGroupInfoData);


    //控制区域组开关
    $scope.ctrlGroupOn = function () {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        window.controlGroupCallBack = function(result) {
            $ionicLoading.hide();
            var controlGroupSwitch = jQuery.parseJSON(result.replace(/\\/g, ""))
            if(controlGroupSwitch.code == '0'){
                dialogsManager.showMessage(controlGroupSwitch.message,"green");
            }else{
                dialogsManager.showMessage(controlGroupSwitch.message,"red");
            }
        }
        var ctrlGroupOn = {
                "table_group":[{
                    "gateway_id":gatewayId,
                    "group_guid":groupId,
                    "group_addr":groupAddr,
                    "group_delay":"1",
                    "group_switch":"01"
              }]
        }
        var ctrlGroupOnData = JSON.stringify(ctrlGroupOn);
//        alert("打开区域组传参"+ctrlGroupOnData)
        window.js.controlGroup(ctrlGroupOnData);
    };

    $scope.ctrlGroupOff = function () {
            // Setup the loader
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        window.controlGroupCallBack = function(result) {
            $ionicLoading.hide();
            var controlGroupSwitch = jQuery.parseJSON(result.replace(/\\/g, ""));
            if(controlGroupSwitch.code == '0'){
                     dialogsManager.showMessage(controlGroupSwitch.message,"green");
            }else{
                dialogsManager.showMessage(controlGroupSwitch.message,"red");
            }
        }
        var ctrlGroupOff = {
            "table_group":[{
                "gateway_id":gatewayId,
                "group_guid":groupId,
                "group_addr":groupAddr,
                "group_delay":"1",
                "group_switch":"00"
            }]
        }
        var ctrlGroupOffData = JSON.stringify(ctrlGroupOff);
//        alert("关闭区域组传参"+ctrlGroupOffData)
        window.js.controlGroup(ctrlGroupOffData);
    };
//
    // 组-控制设备通道
    $scope.ctrlChannel = function (channelList) {
    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });
       window.controlGroupCallBack = function(result) {
            $ionicLoading.hide();
            var controlGroupChannel = jQuery.parseJSON(result.replace(/\\/g, ""));
            if(controlGroupChannel.code == '0'){
                  dialogsManager.showMessage(controlGroupChannel.message,"green");
            }else{
                  dialogsManager.showMessage(controlGroupChannel.message,"red");
               }
       }
       $scope.groupChannels = [];
       for(var i = 0;i<channelList.length;i++){
           $scope.groupChannels[i] = {};
           $scope.groupChannels[i].channel_number = channelList[i].channel_number;
           $scope.groupChannels[i].channel_value = ""+Math.round(channelList[i].channel_value*255/100);
                   // groupChannels.push(groupChannelList);
       }
       var ctrlGroupChannel = {
            "table_group":[{
                "gateway_id":gatewayId,
                "group_guid":groupId,
                "group_addr":groupAddr,
                "group_delay":"1",
                "group_value":$scope.groupChannels
          }]
       }
       var ctrlGroupChannelData = JSON.stringify(ctrlGroupChannel);
//       alert("控制区域组通道传参"+ctrlGroupChannelData)
       window.js.controlGroup(ctrlGroupChannelData);
        }
    })

/**
 * 区域-场景
 */
.controller('RegionalSceneCtrl', ['$scope', '$state', '$stateParams', 'Scene','dialogsManager','$timeout','$ionicLoading',function($scope, $state, $stateParams, Scene,dialogsManager,$timeout, $ionicLoading) {

    // Setup the loader
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    var regionId = $stateParams.regionId;
    var gatewayId = $stateParams.gatewayId;

    if (window.js) {
        if (window.js.getHeadTitle) {
            window.js.getHeadTitle('Regional Scene'); // 调用原生提供的修改标题方法。
        }
        if (window.js.settingBtnShowOrNot) {
            window.js.settingBtnShowOrNot(0);
        }
    }

    //离线版查询区域场景
    window.queryRegionSceneCallBack = function(result) {
        $ionicLoading.hide();
         var regionScene = jQuery.parseJSON(result.replace(/\\/g, ""));
         if(regionScene.code == '0'){
            dialogsManager.showMessage(regionScene.message,"green");
            $scope.sceneList = regionScene.content;
         }else{
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
              //simulate async response
              window.queryRegionSceneCallBack = function(result) {
                  var regionScene = jQuery.parseJSON(result.replace(/\\/g, ""));
                  if(regionScene.code == '0'){
                        dialogsManager.showMessage(regionScene.message,"green");
                        $scope.sceneList = regionScene.content;
                  }else{
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
              $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };

    // 去场景详情
    $scope.toSceneDetail = function(scene) {
        $state.go('regional-scene-detail', {
            sceneId: scene.table_scene_guid,
            gatewayId: gatewayId,
            regionId: regionId,
            sceneAddr: scene.scene_addr
        });
    }
}])

/**
 * 区域-场景-详情
 */
.controller('RegionalSceneDetailCtrl', function($scope, $rootScope, $stateParams, Scene, dialogsManager,$ionicLoading) {
    var sceneId = $stateParams.sceneId;
    var regionId = $stateParams.regionId;
    var sceneAddr = $stateParams.sceneAddr;
    var gatewayId = $stateParams.gatewayId;

    if (window.js) {
        if (window.js.getHeadTitle) {
            window.js.getHeadTitle('Scene Control'); // 调用原生提供的修改标题方法。
        }
        if (window.js.settingBtnShowOrNot) {
            window.js.settingBtnShowOrNot(0);
        }
    }
    
    // 场景控制
    $scope.sceneSwitch = function() {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        window.controlSceneCallBack = function(result) {
            $ionicLoading.hide();
            var controlSceneInfo = jQuery.parseJSON(result.replace(/\\/g, ""));
            if(controlSceneInfo.code == '0'){
                  dialogsManager.showMessage(controlSceneInfo.message,"green");
            }else {
                  dialogsManager.showMessage(controlSceneInfo.message,"red");
               }
            }
            var ctrlScene = {
                "table_scene":[{
                    "gateway_id":gatewayId,
                    "scene_guid":sceneId,
                    "scene_addr":sceneAddr,
                    "scene_switch":"01"
                }]
            }
            var ctrlSceneData = JSON.stringify(ctrlScene);
            window.js.controlScene(ctrlSceneData);
    }
})