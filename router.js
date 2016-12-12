
angular.module('starter')
    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            /** 
             * 首页
             */
            .state('regional', {
                url: '/regional',
                templateUrl: 'pages/regional.html',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(0)
                        }
                    }
                },
                controller: 'RegionalCtrl'
            })

                .state('regional-detail', {
                    url: '/regional/detail?regionId&gatewayId&regionValue&regionName&regionAddr',
                    resolve: {
                        back: function() {
                            if(window.js && window.js.backBtnShowOrNot) {
                                window.js.backBtnShowOrNot(1)
                            }
                        }
                    },
                    templateUrl: 'pages/regional-detail.html',
                    controller: 'RegionalDetailCtrl'
                })

                    .state('regional-device', {
                        url: '/regional/device?regionId&gatewayId&regionValue',
                        resolve: {
                            back: function() {
                                if(window.js && window.js.backBtnShowOrNot) {
                                    window.js.backBtnShowOrNot(1)
                                }
                            }
                        },
                        templateUrl: 'pages/regional-device.html',
                        controller: 'RegionalDeviceCtrl'
                    })

                    .state('regional-scene', {
                        url: '/regional/scene?regionId&gatewayId',
                        resolve: {
                            back: function() {
                                if(window.js && window.js.backBtnShowOrNot) {
                                    window.js.backBtnShowOrNot(1)
                                }
                            }
                        },
                        templateUrl: 'pages/regional-scene.html',
                        controller: 'RegionalSceneCtrl'
                    })

                    .state('regional-group', {
                        url: '/regional/group?regionId&gatewayId',
                        resolve: {
                            back: function() {
                                if(window.js && window.js.backBtnShowOrNot) {
                                    window.js.backBtnShowOrNot(1)
                                }
                            }
                        },
                        templateUrl: 'pages/regional-group.html',
                        controller: 'RegionalGroupCtrl'
                    })

                        .state('regional-group-detail', {
                            url: '/regional/group/detail?gatewayId&groupId&regionId&groupAddr',
                            resolve: {
                                back: function() {
                                    if(window.js && window.js.backBtnShowOrNot) {
                                        window.js.backBtnShowOrNot(1)
                                    }
                                }
                            },
                            templateUrl: 'pages/regional-group-detail.html',
                            controller: 'RegionalGroupDetailCtrl'
                        })

                        .state('regional-scene-detail', {
                            url: '/regional/scene/detail?gatewayId&sceneId&regionId&sceneAddr',
                            resolve: {
                                back: function() {
                                    if(window.js && window.js.backBtnShowOrNot) {
                                        window.js.backBtnShowOrNot(1)
                                    }
                                }
                            },
                            templateUrl: 'pages/regional-scene-detail.html',
                            controller: 'RegionalSceneDetailCtrl'
                        })
            /**
             * 用户
             */
            .state('users', {
                url: '/users',
                templateUrl: 'pages/users.html',
                controller: 'UsersCtrl'
            })
            .state('user-detail', {
                url: '/users/detail?userId&userName&userPhone&userPwd&userCoun&userRole&UserEMail',
                templateUrl: 'pages/user-detail.html',
                controller: 'UserDetailCtrl'
            })
            .state('user-rename', {
                url: '/rename?userId&userName&userPhone&userPwd&userCoun&userRole&UserEMail',
                templateUrl: 'pages/user-rename.html',
                controller: 'UserRenameCtrl'
            })
            .state('user-repwd', {
                url: '/repwd?userId&userName&userPhone&userPwd&userCoun&userRole&UserEMail',
                templateUrl: 'pages/user-repwd.html',
                controller: 'UserRepwdCtrl'
            })


            /**
             * 高级配置
             */
            .state('configure', {
                url: '/configure',
                templateUrl: 'pages/configure.html',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(0)
                        }
                    }
                },
                controller: 'ConfigCtrl'
            })
            .state('configure-new-regional', {
                url: '/new',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/new-regional.html',
                controller: 'NewRegionalCtrl'
            })
            .state('set-regional', {
                url: '/configure/regional?regionId&gatewayId&regionAddr&regionName',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/regional-setting.html',
                controller: 'RegionalSettingCtrl'
            })
            /* 组配置 */
            .state('set-group', {
                url: '/configure/group?regionId&gatewayId&regionAddr&regionName',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/setting-group.html',
                controller: 'GroupSettingCtrl'
            })
            .state('new-group', {
                url: '/configure/group/new?regionId',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/new-group.html',
                controller: 'NewGroupCtrl'
            })
            .state('group-set-detail', {
                url: '/configure/setgroup/detail?groupId&gatewayId&groupName&groupAddr&regionName&regionAddr&regionId',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/setting-group-detail.html',
                controller: 'groupSetDetailCtrl'
            })
            /* 场景配置 */
            .state('set-scene', {
                url: '/configure/scene?regionId&gatewayId&regionAddr&regionName',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/setting-scene.html',
                controller: 'SceneSettingCtrl'
            })
            .state('new-scene', {
                url: '/configure/scene/new?regionId&gatewayId&regionName&regionAddr',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/new-scene.html',
                controller: 'NewSceneCtrl'
            })
            .state('scene-set-detail', {
                url: '/configure/scene/detail?regionId&sceneId&sceneName&gatewayId&sceneAddr&regionAddr&regionName',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/setting-scene-detail.html',
                controller: 'SceneSettingDetailCtrl'
            })
            /* 条件控制 */
            .state('set-term', {
                url: '/configure/term?regionId&gatewayId&regionAddr',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/setting-term.html',
                controller: 'TermSettingCtrl'
            })
            .state('new-term', {
                url: '/configure/term/new?regionId&gatewayId',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/new-term.html',
                controller: 'NewTermCtrl'
            })
            .state('set-term-detail', {
                url: '/configure/term/detail?regionId&gatewayId&regionAddr',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/setting-term-detail.html',
                controller: 'TermSettingDetailCtrl'
            })
            .state('add-term-rule', {
                url: '/configure/term/rule?regionId&gatewayId',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/add-term-rule.html',
                controller: 'AddTermRuleCtrl'
            })
            .state('add-term-action', {
                url: '/configure/term/action?regionId&gatewayId&regionAddr',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/add-term-action.html',
                controller: 'AddTermActionCtrl'
            })
            .state('add-term-sequence-detail', {
                url: '/configure/term/sequence/detail?regionId&gatewayId',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/term-sequence-detail.html',
                controller: 'AddTermSequenceDetailCtrl'
            })
            /* 配方 */
            .state('set-recipe', {
                url: '/configure/recipe?regionId',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/setting-recipe.html',
                controller: 'RecipeSettingCtrl'
            })
            .state('add-recipe-term', {
                url: '/configure/recipe/term?regionId',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/add-recipe-term.html',
                controller: 'AddRecipeTermCtrl'
            })
            .state('add-recipe-action', {
                url: '/configure/recipe/action?regionId',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/add-recipe-action.html',
                controller: 'AddRecipeActionCtrl'
     
            })
            // 添加设备
            .state('add-device', {
                url: '/add/device?regionId&gatewayId&regionAddr&regionName',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/addRegionDevice.html',
                controller: 'AddDeviceCtrl'
            })
            
            .state('add-group-device', {
                url: '/add/device?groupId&gatewayId&groupName&groupAddr&regionId&regionAddr&regionName',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/addGroupDevice.html',
                controller: 'AddGroupDeviceCtrl'
            })
            
            .state('add-scene-device', {
                url: '/add/device?regionId&gateway&sceneAddr&sceneId&regionAddr&regionName&sceneName',
                resolve: {
                    back: function() {
                        if(window.js && window.js.backBtnShowOrNot) {
                            window.js.backBtnShowOrNot(1)
                        }
                    }
                },
                templateUrl: 'pages/addSceneDevice.html',
                controller: 'AddSceneDeviceCtrl'
            })
            // if none of the above states are matched, use this as the fallback
//             $urlRouterProvider.otherwise('/regional');
//             $urlRouterProvider.otherwise('/configure');
    });
