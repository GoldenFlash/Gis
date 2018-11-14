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
                .then(([MapView, WebMap,Map,Expand,Extent,FeatureLayer]) => {
              //   	esriConfig.workers.loaderConfig = {
		            //   has: {
		            //     "esri-featurelayer-webgl": 1
		            //   }
		            // };
                    console.log("23123")
                    var webmap = new WebMap({
                        portalItem: { // autocasts as new PortalItem()
                            id: portalItem
                        }
                    });
                    var map = new Map({
					  basemap: "topo-vector"
					});//地图类型（light-gray-vector, dark-gray-vector, satellite, streets-relief-vector, and streets-navigation-vector）
                    var view = new MapView({
                        map: webmap,
                        container: 'mapView',
                        center: [106.42,26.35],//地图中心经纬度
                        zoom: 7//地图缩放倍数
               //          highlightOptions: {
			            // 	color: "red",
			            //   	fillOpacity: 0.4
			            // }
                    });

                    var featureLayer = new FeatureLayer({
					    url: "http://192.168.1.102:6080/arcgis/rest/services/guizhou/MapServer/3?f=pjson"
					});
                    console.log("featureLayer",featureLayer)
					// webmap.add(featureLayer);


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
        }
    }
}
</script>