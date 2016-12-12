angular.module('starter.services', [])

    /**
     *
     * @desc 公用http服务，用于调用路易斯服务
     */
    .factory('HttpService', function ($http) {
        var httpService = {};

        httpService.myHttp = function (data, method, serverName) {

            !method ? method = 'GET' : method = method.toUpperCase();
            !serverName ? serverName = 'login' : serverName;

             data.user_id = 'xxxxxxxxx'; // todo
//            data.user_id = window.userId;
            // data.user_id = userObject.content.user_id; // todo

            var param = {
                method: method,
                serverName: serverName,
                data: data
            };

            return $http
                 .post('/deej-bussiness/inter/sonneteck_app', param)
//                .post('/inter/sonneteck_app', param)
                //.post('/inter/sonneteck_app', param)
                .then(function (res) {
                    if (!res.data.content) console.log('没有内容', res.data);
                    return res.data;
                }, function (res) {
                    console.log('请求失败', res);
                    return res;
                });
        };
        return httpService;
    })

    /**
     * 区域详情服务
     */
    .factory('Regional', function (HttpService) {

        var regional = {};

        var Regional = {
            get: function () {
                return regional;
            },
            set: function (data) {
                regional = data
            },
            newRegional: function (data) {
                console.log('新建区域时的数据',data)
                return HttpService.myHttp({
                        table_region: [{
                            region_name: data.regionName,
                            gateway_id: data.gatewayId,
                            region_switch: '01',
                            region_value: 'NULL',
                            region_delay: '1',
                        }]
                    }, 'POST', 'region')
                    .then(function (data) {
                        if (data.code !== '0') {
                            console.log('新建失败');
                            return false;
                        }
                        console.log(data);
                        return data.content || true;
                    })
            },
            modify: function (region_guid) {
                return HttpService.myHttp({
                        table_region: [{
                            region_guid: region_guid,
                            region_name: 'one',
                            region_switch: '01',
                            region_value: 'NULL',
                            region_delay: '1000',
                        }]
                    }, 'PUT', 'region')
                    .then(function (data) {
                        if (data.code !== '0') {
                            console.log('修改失败');
                            return false;
                        }
                        return data.content || true;
                    })
            },
            remove: function (regional) {
                console.log('删除区域的区域信息',regional);
                return HttpService.myHttp({
                    table_region : [{
                        region_guid : regional.region_guid,
                        gateway_id : regional.gateway_id,
                        region_addr : regional.region_addr
                    }]
                }, 'DELETE', 'region')
                    .then(function (data) {
                        if (data.code !== '0') {
                            console.log('删除失败');
                            return false;
                        }
                        return data.content || true;
                    })
            },
            /**
             * 获取区域通道
             */
            getChannel: function (param) {

            },
            /**
             * 区域通道控制
             */
            updChannel: function (param) {
                return HttpService.myHttp(param, 'PUT', '/region/controll').then(function (data) {
                    if (data) {
                        return data.content || true;
                    } else {
                        return false;
                    }
                })
            }
        };
        return Regional;
    })
    /**
     * 区域列表服务
     */
    .factory('Regionals', function (HttpService) {

        var Regionals = {
            //查询区域
            all: function () {
                return HttpService.myHttp({}, 'GET', 'region').then(function (data) { // todo 请求成功
                    console.log('data', data);
                    if (data.code == '0') {
                        return data.content;
                    } else {
                        console.log(data);
                        return false;
                    }
                });
                // return regionals;
            },
            remove: function (regional) {
                regionals.splice(regionals.indexOf(regional), 1);
            },
            get: function (regionId) {
                for (var i = 0; i < regionals.length; i++) {
                    if (regionals[i].id === parseInt(regionId)) {
                        return regionals[i];
                    }
                }
                return null;
            },
            push: function (regional) {
                regionals.push(regional);
                console.log(regionals);
            }
        };
        return Regionals;
    })

    /**
     * 设备服务
     */
    .factory('Device', function (HttpService) {
        var devices = {};
        var newDevice = [];
        var Device = {
            //查询区域设备
            all: function (regionId, gatewayId) {
                return HttpService.myHttp({
                    region_guid: regionId,
                    gateway_id: gatewayId,
                }, 'GET', 'region/device').then(function (data) {
                    console.log('region/device', data);
                    if (data.code == '0') {
                        return data.content;
                    } else {
                        return false;
                    }
                })
                // return devices;
            },
            clear: function (menlightu) {
                newDevice = [];
            },
            get: function (lightId) {
                for (var i = 0; i < devices.length; i++) {
                    if (devices[i].device_guid === lightId) {
                        return devices[i];
                    }
                }
                return null;
            },
            /**
             * 获取列表
             */
            getNewLights: function () {
                return newDevice;
            },
            /**
             * 添加或删除设备需要添加的设备信息
             * todo 这个可以保留
             */
            setLightAdd: function (lightId, regional) {

                for (var i = 0; i < devices.length; i++) {
                    if (devices[i].device_guid === lightId) {

                        devices[i].isAdd = !devices[i].isAdd;
                        var tempLight = {
                            region_guid: regional.region_guid,
                            region_addr: regional.region_addr,
                            region_name: regional.region_name,
                            table_device_guid: devices[i].device_guid,
                            gateway_id: devices[i].gateway_id,
                            device_addr: devices[i].device_addr,
                            device_name: devices[i].device_name
                        }

                        devices[i].isAdd ? newDevice.push(tempLight) : newDevice.splice(devices.indexOf(tempLight), 1);
                    }
                }
                console.log('newDevice', newDevice);
            },
            /**
             * 添加或删除设备需要添加的设备信息  组
             */
            setAddGroupDevice: function (lightId, group) {

                for (var i = 0; i < devices.length; i++) {
                    if (devices[i].device_guid === lightId) {

                        devices[i].isAdd = !devices[i].isAdd;
                        var tempLight = {
                            table_group_guid: group.table_group_guid,
                            group_addr: group.group_addr,
                            device_guid: devices[i].device_guid,
                            gateway_id: devices[i].gateway_id,
                            device_addr: devices[i].device_addr,
                            device_name: devices[i].device_name
                        }

                        devices[i].isAdd ? newDevice.push(tempLight) : newDevice.splice(devices.indexOf(tempLight), 1);
                    }
                }
                console.log('newDevice', newDevice);
            },
            /**
             * 添加或删除设备需要添加的设备信息 场景
             */
            setAddSceneDevice: function (lightId, scene, device_value) {

                for (var i = 0; i < devices.length; i++) {
                    if (devices[i].device_guid === lightId) {

                        devices[i].isAdd = !devices[i].isAdd;
                        var tempLight = {
                            table_scene_guid: scene.table_scene_guid,
                            scene_addr: scene.scene_addr,
                            device_delay: '1',
                            device_value: device_value,
                            device_guid: devices[i].device_guid,
                            gateway_id: devices[i].gateway_id,
                            device_addr: devices[i].device_addr,
                            device_name: devices[i].device_name
                        }

                        devices[i].isAdd ? newDevice.push(tempLight) : newDevice.splice(devices.indexOf(tempLight), 1);
                    }
                }
                console.log('newDevice', newDevice);
            },
            // 设置设备列表
            set: function (data) {
                devices = data;
            },
            /**
             * 获取所有设备列表
             */
            getHttpNewLights: function (region_guid) {
                var devProm = HttpService.myHttp({
                    region_guid: region_guid
                }, 'GET', 'table_device');
                return devProm.then(function (data) {
                    if (!data) {
                        console.log('获取设备列表错误');
                        return false;
                    }
                    Device.set(data.content);
                    return data.content || true;
                })
            },
            /**
             * 获取区域下设备列表
             */
            getListToHttp: function (region_guid) {
                var lightsProm = HttpService.myHttp({
                    region_guid: region_guid
                }, 'GET', 'region/device');

                return lightsProm.then(function (data) {
                    if (data.code !== '0') {
                        console.log('获取设备列表错误');
                        return false;
                    }
                    console.log('获取设备信息', data);
                    return data.content || true;
                });
            },
            /**
             *  对区域添加设备
             */
            addLightByRegional: function (gateway_id) {
                var regionalProm = HttpService.myHttp({
                    gateway_id: gateway_id,
                    table_region_device: newDevice
                }, 'POST', 'region/device')

                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('对区域添加设备结果::::', data);

                    if (data.code !== '0') {
                        console.log('添加设备失败');
                        return false
                    }

                    return data.content || true;
                })
            },
            /**
             * 对组添加设备
             */
            addLightByGroup: function (gateway_id) {
                console.log({
                    gateway_id: gateway_id,
                    table_group_members: newDevice
                });
                var regionalProm = HttpService.myHttp({
                    gateway_id: gateway_id,
                    table_group_members: newDevice
                }, 'POST', 'device/group/group_member')

                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('对区域添加设备结果::::', data);

                    if (data.code !== '0') {
                        console.log('添加设备失败');
                        return false
                    }

                    return data.content || true;
                })
            },
            /**
             * 对场景添加设备
             */
            addLightByScene: function (gateway_id) {
                console.log({
                    gateway_id: gateway_id,
                    table_scene_members: newDevice
                });
                var regionalProm = HttpService.myHttp({
                    gateway_id: gateway_id,
                    table_scene_members: newDevice
                }, 'POST', 'device/scene/scene_members')

                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('对区域添加设备结果::::', data);

                    if (data.code !== '0') {
                        console.log('添加设备失败');
                        return false
                    }

                    return data.content || true;
                })
            },
            /**
             * 删除区域设备
             */
            removeLight: function (light, region_guid, gatewayId) {
                console.log('删除设备参数', {
                    region_guid: region_guid,
                    table_device_guid: light.table_device_guid,
                    device_addr: light.device_addr,
                    gateway_id : gatewayId
                });
                var resultProm = HttpService.myHttp({
                    table_region_device: [{
                        region_guid: region_guid,
                        table_device_guid: light.table_device_guid,
                        device_addr: light.device_addr,
                        gateway_id : gatewayId
                    }]
                }, 'DELETE', 'region/device')

                return resultProm.then(function (data) {
                    console.log('删除设备', data);
                    if (data.code !== '0') {
                        console.log('删除设备失败！！');
                        return false;
                    }
                    // for (var i = 0; i < devices.length; i++) {
                    //     if (devices[i].id === parseInt(lightId)) {
                    //         devices.splice(i,1)
                    //     }
                    // }
                    return data.content || true;
                })
            },
            /**
             * 设备下通道控制
             */
            updChannel: function (device_guid, device_addr, device_value, gateway_id) {
                var param = {
                    table_device: [{
                        device_guid: device_guid,
                        device_addr: device_addr,
                        gateway_id: gateway_id,
                        device_value: device_value,
                        device_delay: '1'
                    }]
                }
                console.log(param);
                return HttpService.myHttp(param, 'PUT', '/table_device').then(function (data) {
                    console.log('修改设备通道', data);
                    if (data.code !== '0') {
                        console.log('修改设备通道失败！！');
                        return false;
                    }
                    return data.content || true;
                })
            },
            /**
             * 设备下开关控制
             */
            updSwitch: function (param) {
                console.log('控制区域设备传参',param)
                return HttpService.myHttp(param, 'PUT', '/table_device').then(function (data) {
                    if (data.code !== '0') {
                        console.log('修改设备开关失败！！');
                        return false;
                    }else {
                        return data.content || true;
                    }
                })
            }
        };
        return Device;
    })
    /**
     * 组-服务
     */
    .factory('DeviceGroups', function (HttpService) {
        var groups;
        var Group = {
            /**
             * 创建组
             */
            add: function (data) {
                var regionalProm = HttpService.myHttp({
                    table_group: [{
                        gateway_id: data.gateway.gateway_id,
                        group_name: data.groupName
                    }]
                }, 'POST', 'device/group')
                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('添加组结果', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('添加组失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 修改组信息-不开放
             */
            modify: function () {
                var regionalProm = HttpService.myHttp({
                    table_group: [{
                        group_guid: "6071640ed2ea4ce2bf621517909d0d77",
                        group_name: "group123"
                    }]
                }, 'PUT', 'device/group')
                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('修改组结果', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('修改组失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 删除组信息
             */
            delete: function () {
                var regionalProm = HttpService.myHttp({
                    table_group: [{
                        group_guid: "09698fbe57ec40b4b88192f414db264a"
                    }]
                }, 'DELETE', 'device/group')
                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('删除组结果', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('删除组失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 获取组列表
             */
            get: function () {
                var regionalProm = HttpService.myHttp({
                    gateway_id: "158d000052c779"
                }, 'GET', 'device/group')
                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('获取组列表结果', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('获取组失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 组通道控制
             */
            updChannel: function (group_guid, group_addr, group_value, gateway_id) {
                var param = {
                    table_group: [{
                        group_guid: group_guid,
                        group_addr: group_addr,
                        group_value: group_value,
                        // gateway_id: gateway_id,
                        group_delay: '1'
                    }]
                }

                console.log(param);
                return HttpService.myHttp(param, 'PUT', '/device/group/group_control').then(function (data) {
                    console.log('修改设备通道', data);
                    if (data.code !== '0') {
                        console.log('修改设备通道失败！！');
                        return false;
                    }
                    return data.content || true;
                })
            },
            /**
             * 组开关控制
             */
            updSwitch: function (param) {
                console.log(param);
                return HttpService.myHttp(param, 'PUT', '/device/group/group_control').then(function (data) {
                    console.log('区域组开关控制', data);
                    if (data.code !== '0') {
                        console.log('修改设备通道失败！！');
                        return false;
                    }
                    return data.content || true;
                })
            }
        }

        return Group;
    })
    /**
     * 组-服务
     */
    .factory('RegionGroups', function (HttpService) {
        var groups;
        var Group = {
            /**
             * 添加区域组
             */
            add: function (data) {
                var regionalProm = HttpService.myHttp({
                    table_region_group: [{
                        region_guid: data.regionId,
                        table_group_guid: data.group_guid,
                        group_addr: data.group_addr,
                        group_name: data.group_name,
                        gateway_id: data.gateway_id
                    }]
                }, 'POST', 'region/group')
                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('添加组结果', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('添加组失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 修改组信息-不开放
             */
            modify: function () {
                var regionalProm = HttpService.myHttp({
                    table_group: [{
                        table_group_guid: "6071640ed2ea4ce2bf621517909d0d77",
                        group_name: "group123",
                        gateway_id: "158d000052c779"
                    }]
                }, 'PUT', 'region/group')
                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('修改组结果', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('修改组失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 删除区域组
             */
            delete: function (param) {
                var regionalProm = HttpService.myHttp({
                    table_region_group: param
                }, 'DELETE', 'region/group')
                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('删除组结果', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('删除组失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 获取区域组列表
             */
            getList: function (regionId,gatewayId) {
                var param = {
                    region_guid: regionId,
                    gateway_id : gatewayId
                }
                console.log('查询区域组传参',param)
                var regionalProm = HttpService.myHttp(param, 'GET', 'region/group')
                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('获取组列表结果', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('获取组失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 获取组通道
             */
            getChannel: function (groupId, gatewayId) {
                var param = {
                    table_group_guid: groupId,
                    gateway_id: gatewayId
                }
                // 判断返回结果
                return HttpService.myHttp(param, 'GET', '/device/group/group_channel').then(function (data) {
                    console.log('获取组通道结果', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('获取组通道失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 获取组成员
             */
            getDevice: function (table_group_guid,gateway_id) {
                var param = {
                    table_group_guid: table_group_guid,
                    gateway_id : gateway_id
                }
                return HttpService.myHttp(param, 'GET', 'device/group/group_member').then(function (data) {
                    console.log('获取组成员', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('获取组成员失败');
                        return false
                    }
                    return data.content || [];
                })
            },
            /**
             * 删除组成员
             */
            delDevice: function (table_group_guid, device_guid) {
                var param = {
                    table_group_members: [{
                        table_group_guid: table_group_guid,
                        device_guid: device_guid
                    }]
                }
                console.log(param);
                return HttpService.myHttp(param, 'DELETE', 'device/group/group_member').then(function (data) {
                    console.log('删除组成员', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('删除组成员失败');
                        return false
                    }
                    return data.content || true;
                })
            }
        }

        return Group;
    })
    /**
     * 场景服务
     */
    .factory('DeviceScenes', function (HttpService) {
        var groups;
        var Group = {
            /**
             * 创建场景
             */
            add: function (data) {
                var regionalProm = HttpService.myHttp({
                    table_scene: [{
                        gateway_id: data.gateway.gateway_id,
                        scene_name: data.sceneName
                    }]
                }, 'POST', 'device/scene')
                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('创建场景结果', data);
                    // 清空设备列表
                    if (!data && data.code !== '0') {
                        console.log('创建场景失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 修改场景信息 todo
             */
            modify: function () {
                var regionalProm = HttpService.myHttp({
                    table_scene: [{
                        scene_guid: "7875f10e4d1145c9bf822c21056dcaa2",
                        scene_name: "aaaa"
                    }]
                }, 'PUT', 'device/scene')
                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('修改场景结果', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('修改场景失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 删除场景信息
             */
            delete: function () {
                var regionalProm = HttpService.myHttp({
                    table_scene: [{
                        scene_guid: "7244b062fb9f4003a62785571c08ef4d"
                    }]
                }, 'DELETE', 'device/scene')
                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('删除场景结果', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('删除场景失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 获取场景列表
             */
            get: function () {
                var regionalProm = HttpService.myHttp({
                    gateway_id: "158d000052c779",
                }, 'GET', 'device/scene')
                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('查询场景结果', data);
                    // 清空设备列表
                    if (!data && data.code !== '0') {
                        console.log('查询场景失败');
                        return false
                    }
                    return data.content || true;
                })
            }
        }

        return Group;
    })
    /**
     * 场景服务
     */
    .factory('Scene', function (HttpService) {
        var scenes;
        var Scene = {
            /**
             * 添加场景
             */
            add: function (data) {
                var regionalProm = HttpService.myHttp({
                    table_region_scene: [{
                        region_guid: data.regionId,
                        table_scene_guid: data.scene_guid,
                        gateway_id: data.gateway_id,
                        scene_addr: data.scene_addr,
                        scene_name: data.scene_name
                    }]
                }, 'POST', 'region/scene')
                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('创建场景结果', data);
                    // 清空设备列表
                    if (!data && data.code !== '0') {
                        console.log('创建场景失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 修改场景信息
             */
            modify: function () {
                var regionalProm = HttpService.myHttp({
                    table_region_scene: [{
                        region_scene_guid: "",
                        region_guid: "b6d5131d-67e0-453e-80f4-d1aed510df7c",
                        table_scene_guid: "11cbb9fe00454abd9be6963ea5f40f3d",
                        scene_addr: "ff15::a00c",
                        scene_name: "jjjjj"
                    }]
                }, 'PUT', 'region/scene')
                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('修改场景结果', data);
                    // 清空设备列表
                    if (!data && data.code !== '0') {
                        console.log('修改场景失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 删除场景信息
             */
            delete: function (param) {

                var regionalProm = HttpService.myHttp({
                    table_region_scene: param
                }, 'DELETE', 'region/scene')
                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('删除场景结果', data);
                    // 清空设备列表
                    if (!data && data.code !== '0') {
                        console.log('删除场景失败');
                        return false
                    }
                    return data.content || true;
                })

            },
            /**
             * 获取场景列表
             */
            getList: function (region_guid, gateway_id) {
                var regionalProm = HttpService.myHttp({
                    gateway_id: gateway_id,
                    region_guid: region_guid,
                }, 'GET', 'region/scene')
                // 判断返回结果
                return regionalProm.then(function (data) {
                    console.log('获取场景结果', data);
                    // 清空设备列表
                    if (!data && data.code !== '0') {
                        console.log('获取场景失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 获取场景详情
             */
            getDetail: function (sceneId, gatewayId) {
                var param = {
                    table_scene_guid: sceneId,
                    gateway_id: gatewayId
                }
                // 判断返回结果
                return HttpService.myHttp(param, 'GET', '/device/scene/scene_members').then(function (data) {
                    console.log('获取场景详情结果', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('获取场景详情失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 获取场景成员
             */
            getDevice: function (table_scene_guid, gateway_id) {
                var param = {
                    table_scene_guid: table_scene_guid,
                    gateway_id: gateway_id
                }
                console.log('param', param);
                return HttpService.myHttp(param, 'GET', 'device/scene/scene_members').then(function (data) {
                    console.log('获取组成员', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('获取组成员失败');
                        return false
                    }
                    return data.content || [];
                })
            },
            /**
             * 删除场景成员
             */
            delDevice: function (table_scene_guid, device_guid) {
                var param = {
                    table_group_members: [{
                        table_scene_guid: table_scene_guid,
                        device_guid: device_guid
                    }]
                }
                console.log(param);
                return HttpService.myHttp(param, 'DELETE', 'device/scene/scene_members').then(function (data) {
                    console.log('删除组成员', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('删除组成员失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 场景控制
             */
            updSwitch: function (gatewayId, sceneAddr,sceneId) {
                var param = {
                    table_scene: [{
                        gateway_id: gatewayId,
                        scene_addr: sceneAddr,
                        scene_guid :sceneId,
                        scene_switch: '01' 
                    }]
                }
                console.log(param);
                return HttpService.myHttp(param, 'PUT', '/device/scene/control').then(function (data) {
                    console.log('场景控制返回结果', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('场景控制失败');
                        return false
                    }
                    return data.content || true;
                })
            }
        }

        return Scene;
    })
    /**
     * 条件控制服务
     */
    .factory('Term', function (HttpService) {
        var terms;
        var Term = {
            /**
             * 添加条件控制
             */
            add: function (gateway_id, cdts_name) {
                var param = {
                    table_cdts_list: [{
                        gateway_id: gateway_id,
                        cdts_name: cdts_name
                    }]
                }
                return HttpService.myHttp(param, 'POST', '/device/term').then(function (data) {
                    console.log('查询条件控制', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('查询条件控制');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 添加条件控制的条件
             */
            addRule: function (param) {
                return HttpService.myHttp(param, 'POST', '/device/term/conditions').then(function (data) {
                    console.log('添加条件控制的条件', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('添加条件控制的条件失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 添加条件控制的条件
             */
            addAction: function (param) {
                var param = {
                    asdsadsad: param //to do
                }
                return HttpService.myHttp(param, 'POST', '/device/term/controls').then(function (data) {
                    console.log('添加条件控制的动作', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('添加条件控制的动作失败');
                        return false
                    }
                    return data.content || true;
                })
            },
            /**
             * 修改条件控制信息
             */
            modify: function () {

            },
            /**
             * 删除条件控制信息
             */
            delete: function () {

            },
            /**
             * 获取条件控制列表
             */
            getList: function () {
                return HttpService.myHttp({}, 'GET', '/device/term').then(function (data) {
                    console.log('查询条件控制', data);
                    // 清空设备列表
                    if (data.code !== '0') {
                        console.log('查询条件控制');
                        return false
                    }
                    return data.content || true;
                })
            }
        }

        return Term;
    })
    /**
     * 配方服务
     */
    .factory('Recipe', function (HttpService) {
        var recipes;
        var Recipe = {
            /**
             * 添加条件控制
             */
            add: function () {

            },
            /**
             * 修改条件控制信息
             */
            modify: function () {

            },
            /**
             * 删除条件控制信息
             */
            delete: function () {

            },
            /**
             * 获取条件控制列表
             */
            getList: function () {

            },
            /**
             * 获取条件控制详情
             */
            get: function () {

            }
        }

        return Recipe;
    })




    /**
     * 用户管理服务
     */
    .factory('Users', function (HttpService) {
        // var users = [{
        //     id: 0,
        //     name: 'Ben Sparrow',
        //     lastText: 'You on your way?',
        //     face: 'images/ben.png',
        //     date: '2014-02-02',
        //     pwd: '123456'
        // }];

        return {
            all: function () {
                // return users;
                return HttpService.myHttp({},'GET','user').then(function (data) {
                    if(data.code == '0'){
                        return data.content;
                    }else {
                        return false;
                    }
                })
            },
            remove: function (param) {
                return HttpService.myHttp(param,'DELETE','user').then(function (data) {
                    if(data.code == '0'){
                        return data.content;
                    }else {
                        return false;
                    }
                })
            },
            editUser : function (param) {
                return HttpService.myHttp(param,'PUT','user').then(function (data) {
                    if(data.code == '0'){
                        return data.content;
                    }else {
                        return false;
                    }
                })
            },
            // get: function (userId) {
            //     for (var i = 0; i < users.length; i++) {
            //         if (users[i].id === parseInt(userId)) {
            //             return users[i];
            //         }
            //     }
            //     return null;
            // },
            getGateway: function () {
                return HttpService.myHttp({}, 'GET', 'login/user_info').then(function (data) {
                    if (data.code == '0') {
                        return data.content;
                    } else {
                        return false;
                    }
                })
            }
        };
    })



    .factory("dialogsManager", function ($q, $http, $compile, $timeout, $rootScope) {

        //消息模板
        var megTmp = "<div class='nspop_megcontainer myactive' >" +
            "<div class='main'>" +
            "<div class='textContent' style='color:{{color}}'>{{content}}</div>" +
            "</div>" +
            "</div>";

        var dialog = {
            megs: [],
            showMessage: showMessage,
            alert: alert,  //未实现
            confirm: confirm, //未实现
        };

        //消息展示
        function showMessage(content, color, options) {
            //移除已存在的消息展示
            angular.forEach(dialog.megs, function (item, index) {
                item.remove();
            });
            createMeg(content, color, options);
        };

        //消息创建
        function createMeg(content, color, options) {
            options = angular.extend({
                bottom: 50, //继续下边距离
                scope: $rootScope.$new(), //创建一个继承自根的作用域
                timeout: 1500  //多少秒后自动隐藏
            }, options);
            //消息文本
            options.scope.content = content;
            //字体颜色
            options.scope.color = color;
            var megPromise = $q.when(compileTmp({
                template: megTmp,
                scope: options.scope,
                appendTo: angular.element(document.body)
            }))
            megPromise.then(function (result) {
                dialog.megs.push(result);
                result.css("bottom", options.bottom + "%");
                $timeout(function () {
                    result.remove(); //移除消息展示
                    options.scope.$destroy();  //摧毁作用域
                }, options.timeout);
            })
        }

        //编译模板
        function compileTmp(options) {
            var tem = $compile(options.template)(options.scope);
            if (options.appendTo) {
                options.appendTo.append(tem);
            }
            return tem;
        };
        return dialog;

    })
