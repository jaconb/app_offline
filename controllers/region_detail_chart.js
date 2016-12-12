angular.module('starter.regionChart',[])
    .controller('chartTest',function ($stateParams,$scope,HttpService) {
        var regionName = $stateParams.regionName;
        var regionId = $stateParams.regionId;
        var gatewayId = $stateParams.gatewayId;

        //默认显示时间:24小时时间
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        var second = d.getSeconds();
        if(month >= 1 && month <= 9){
            month = "0"+month;
        }
        if (hour >= 0 && hour <= 9) {
            hour = "0" + hour;
        }
        if (day >= 0 && day <= 9) {
            day = "0" + day;
        }
        if (minute >= 0 && minute <= 9) {
            minute = "0" + minute;
        }
        if (second >= 0 && second <= 9) {
            second = "0" + second;
        }
        $scope.default_endTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        $scope.default_startTime = year + "-" + month + "-" + day + " " + "00" + ":" + "00" + ":" + "00";

        //离线版查询区域组详情
        window.getChartParamtersCallBack = function(result) {
             var regionChartInfo = jQuery.parseJSON(result.replace(/\\/g, ""));

             if(regionChartInfo.code == '0' && regionChartInfo.content.time && regionChartInfo.content.data){
                 $scope.dataContent = regionChartInfo.content;
                 $('#container').highcharts({
                    title: {
                        text: 'Sensor History Data',
                        x: -20 //center
                    },
                    subtitle: {
                        text: '',
                        x: -20
                    },
                    credits: {
                        enabled:false
                    },
                    noData:{ //无数据显示
                       position: {
                       },
                       attr: {
                       },
                       style: {
                       }
                    },
                    // exporting : {
                    //     enabled : false
                    // },       //右上角打印按钮隐藏
                    xAxis: {
                         categories : $scope.dataContent.time,
                         // labels : {
                         //     enabled : false  //X不显示数值
                    // }
                    tickInterval: 359  //X每隔xx个显示数值
                    },
                    yAxis: {
                         title: {
                         text: ''
                    },
                    plotLines: [{
                         value: 0,
                         width: 1,
                         color: '#808080'
                        }]
                    },
                    tooltip: {
                         valueSuffix: ''
                    },
                    legend: {
                         // layout: 'vertical',
                         align: 'center',
                         verticalAlign: 'bottom',
                         borderWidth: 0
                    },
                         series : $scope.dataContent.data
                    });
             }else {
                    $scope.dataContent = 'noData';
             }
        };
        // 获取统计图(传感器历史数据)
        var data = {
            gateway_id: gatewayId,
            region_guid: regionId,
            start_time : encodeURI($scope.default_startTime),
            end_time : encodeURI($scope.default_endTime),
            type: "history",
            size: '360'
        }
        var regionChartData = JSON.stringify(data);
        window.js.getChartParamters(regionChartData);
})
