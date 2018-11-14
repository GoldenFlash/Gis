<template>
    <div id="mapView" style="width:100%; height:100vh"></div>
</template>
<script>
import esriLoader from "esri-loader"
esriLoader.loadCss('https://js.arcgis.com/4.9/esri/css/main.css');
export default {
    name: "mapView",
    data() {
        return {

        }
    },
    mounted() {
        this.creatMap()
    },
    methods: {
        creatMap() {
            let portalItem = "fb84ad313bd3432983488ed1ba1d5bf3"; //行政图
            esriLoader.loadModules([
                    'esri/views/MapView',
                    'esri/WebMap',
                    "esri/Map",
                    "esri/widgets/Expand",
                    "esri/geometry/Extent",
                    "esri/layers/FeatureLayer",


                    "dojo/domReady!"
                ])
                .then(([MapView, WebMap, Map, Expand, Extent, FeatureLayer]) => {
                    var webmap = new WebMap({
                        portalItem: { // autocasts as new PortalItem()
                            id: portalItem
                        }
                    });
                    var map = new Map({
                        basemap: "topo-vector"
                    }); //地图类型（light-gray-vector, dark-gray-vector, satellite, streets-relief-vector, and streets-navigation-vector）
                    var view = new MapView({
                        map: webmap,
                        container: 'mapView',
                        center: [106.42, 26.35], //地图中心经纬度
                        zoom: 7.5 //地图缩放倍数
                    });

                    var featureLayer = new FeatureLayer({
                        url: "http://192.168.1.102:6080/arcgis/rest/services/guizhou/MapServer/3?f=pjson"
                        // url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0"
                    });
                    console.log("featureLayer", featureLayer)
                    webmap.add(featureLayer);


                    // view.constraints = {
                    //     minScale: 18830831,
                    //     maxScale: 0,
                    //     rotationEnabled: false
                    // };

                    //       view.extent = new Extent({
                    //   xmax: 110.80625835489191,
                    //   xmin: 103.37749785210809,
                    //   ymax: 30.06581712073908,
                    //   ymin: 24.301851667260912,
                    //   spatialReference: {
                    //     wkid: 4326
                    //   }
                    // });
                    // var provicelyr = new FeatureLayer({
                    //   url: 'http://192.168.1.102:6080/arcgis/rest/services/guizhou/MapServer/3'
                    // });
                })
                .catch(err => {
                    console.error(err);
                });
        },
        setSectionSymbol(pWaterParams) {
            console.log("pWaterParams", pWaterParams)
            var _this = this;
            _this.highlightpts = []; //先清空高亮闪烁的点
            if (this.map.findLayerById("idRegion") != undefined) {
                this.map.remove(this.map.findLayerById("idRegion"));
            }
            var river = new River();
            loadModules([
                "esri/layers/GraphicsLayer",
                "esri/Graphic",
                "esri/tasks/support/Query",
                "esri/layers/FeatureLayer",
            ]).then(([GraphicsLayer, Graphic, Query, FeatureLayer]) => {
                _this.Eqiw_SectionGL.removeAll(); //先清除上次的Graphics
                let itemcode1 = "301,302,315,314,316,317,311,313,434,435,318,319,320,438,436,323,437,325,326,327,328,467";
                let list = [
                    //this.Apieqiw.GetEQIW_R_Data(pWaterParams.TimeType, pWaterParams.BeginDate, pWaterParams.EndDate, "", "", 0, "-1", 'GB 3838-2002', "3", itemcode1, 0, 0, 0, 0, 1, 0, 2, 3, 0, 1, 0),
                    this.Apieqiw.GetEQIW_RL_Data_Middle("SectionStat", pWaterParams.TimeType, "-1", pWaterParams.BeginDate, pWaterParams.EndDate, 0, null, null, "均值", "河流", null, null, null, null, null)
                ];
                axios.all(list).then(axios.spread((acct) => {
                        let data = acct.data.data.dangqi;
                        var year = pWaterParams.BeginDate.slice(0, 4)
                        var reportdata = [];
                        var datas = [];
                        var apicom1 = new Apieqiw();
                        var rindex = pWaterParams.rindex
                        var list = [
                            apicom1.GetSqlServer_R_Point(
                                "EntityContext",
                                "Select",
                                "*",
                                "tblEQIW_R_Section",
                                "fldYear =" + year)
                        ]
                        axios.all(list).then(axios.spread((res) => {
                            var rpdata = res.data.Select_Data;
                            //console.log("data", rpdata)
                            var name = "";
                            rpdata.map((item) => {
                                if (item.fldSTName != "外省城市") {
                                    if (name != item.fldRSName) {
                                        name = item.fldRSName;
                                        if (rindex == 0) {
                                            reportdata.push(item)
                                        }
                                        if (item.fldSLevel == 1 && rindex == 1) {
                                            reportdata.push(item)
                                        }
                                        if (item.fldSLevel == 2 && rindex == 2) {
                                            reportdata.push(item)
                                        }
                                        if (item.fldSLevel == 3 && rindex == 3) {
                                            reportdata.push(item)
                                        }
                                        if (item.fldSLevel == 5 && rindex == 4) {
                                            reportdata.push(item)
                                        }

                                    }

                                }
                            })
                            var arr = [];
                            console.log("reportdata断面", reportdata)
                            reportdata.map((ft, index) => {
                                datas.push({
                                    longitude: parseInt(ft.fldLOD) + ft.fldLOM / 60 + ft.fldLOS / 3600,
                                    latitude: parseInt(ft.fldLAD) + ft.fldLAM / 60 + ft.fldLAS / 3600,
                                })

                                let style = { size: "15px", style: "circle" };
                                let pi = data.find(val => {
                                    if (val.fldSTName != "外省城市") {
                                        if (val.fldRSCode == ft.fldRSCode && val.fldRCode == ft.fldRCode && val.fldSTCode == ft.fldSTCode) {
                                            return val;
                                        }
                                    }
                                })
                                arr.push(pi);
                                if (pi != undefined) {

                                    _this.getEQIWRPointGraphic(pWaterParams, datas[index].longitude, datas[index].latitude, pi.fldStage, pi, style, reportdata);
                                } else {
                                    _this.getEQIWRPointGraphic(pWaterParams, datas[index].longitude, datas[index].latitude, "", {
                                        fldStage: "",
                                        fldStand: "",
                                        fldSTCode: ft.fldSTCode,
                                        fldSTName: ft.fldSTName,
                                        fldSectionApp: '',
                                        fldRSCode: ft.fldRSCode,
                                        fldRSName: ft.fldRSName,
                                        fldRName: ft.fldRName,
                                        fldRCode: ft.fldRCode
                                    }, style, reportdata);
                                }
                            })
                            arr = JSON.stringify(arr),
                                datas = JSON.stringify(datas),
                                sessionStorage.setItem('arrpoint', arr),
                                sessionStorage.setItem('arrpointcoordinate', datas)
                            // console.log('88888888', reportdata, a, data,datas);
                        }))

                    })),
                    _this.map.add(_this.Eqiw_SectionGL);
                //若选择城市，则定位
                if (pWaterParams.STCode != "-1") {
                    _this.CommonMap.gotoCity(pWaterParams.STName, 15);
                    _this.Eqiw_SectionGL.visible = true;
                } else {
                    _this.Eqiw_SectionGL.visible = true;
                }
                // console.log('sss',_this.highlightpts);
                //高亮闪烁点位,针对污染严重的报警闪烁
                // _this.CommonMap.drawhighlightPoint2(_this.highlightpts, _this.bflashing);


            });
        }
    }
}
</script>