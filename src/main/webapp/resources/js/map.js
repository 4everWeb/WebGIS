var map, popup, selectSingleClick, baseMap, olview, spread_accident_layer, road_layer, current_pos_Layer, accident_pos_Layer, destination_pos_Layer, umd_layer
var spread_accident_heatmap_blur = 60;
var spread_accident_heatmap_radius = 10;

//var ServerUrl = "https://121.140.146.242:15534/MapPrimeServer/";
var ServerUrl = "http://121.140.9.42:3004/MapPrimeServer/";
var element;
var result_bool = false;
var timeClick_bool = false;

var windy;
var canvas;
var accident_alarm, accident_running_time;
var accident_alarm_cnt = 0;
var accident_task = 1;
var currentTime;
const setFood = "음식점 :";
const setLocal = "지역명 :";
let url = "https://www.naver.com/";

$(function() {

	//proj4.defs("EPSG:5179", "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
	element = document.getElementById('popup');
	baseMap = new ol.layer.Tile({
		source : new ol.source.XYZ({
			url : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
		})
	});

	var overviewMap = new ol.control.OverviewMap({
		className : 'ol-overviewmap ol-custom-overviewmap',
		layers : [ baseMap ],
		collapseLabel : '\u00BB',
		label : '\u00AB',
		collapsed : false
	});

	var scaleLine = new ol.control.ScaleLine();

	var mousePosition = new ol.control.MousePosition({
		undefinedHTML : '',
		projection : 'EPSG:4326',
		coordinateFormat : function(coordinate) {
			return ol.coordinate.format(coordinate, '{x}, {y}', 4);
		}
	});

	var zoomslider = new ol.control.ZoomSlider();

	//시작 위치 설정
	olview = new ol.View({
		center : ol.proj.transform([ 126.9782, 37.5654 ], 'EPSG:4326',
				'EPSG:3857'),
		zoom : 13,
		minZoom : 1,
		maxZoom : 18
	});

	//map
	map = new ol.Map({
		target : 'map',
		layers : [ baseMap ],
		interactions : ol.interaction.defaults({}),
		view : olview,
		controls : ol.control.defaults({
			attribution : false
		}).extend([ overviewMap, scaleLine, mousePosition, zoomslider ])
	});

	map.getView().on(
			'change:resolution',
			function(evt) {
				if (typeof spread_accident_layer != "undefined") {
					spread_accident_layer.setBlur(parseInt(376 / parseInt(map
							.getView().getResolution())));
					spread_accident_layer.setRadius(parseInt(72 / parseInt(map
							.getView().getResolution())));
				}
			});

	//myfeature.O.wardname >>함흥냉면
	//myfeature.O.sig_kor_nm >> 중구
	popup = new ol.Overlay({
		element : element,
		positioning : 'bottom-center',
		stopEvent : false,
		offset : [ 0, -20 ]
	});
	map.addOverlay(popup);

	selectSingleClick = new ol.interaction.Select();
	map.addInteraction(selectSingleClick);

	function readFeature(features) {
		var myfeature = features.item(0);
		if (myfeature.O.wardname != undefined) {
			//		alert("음식점: " +myfeature.O.wardname+"  지역: "+ myfeature.O.sig_kor_nm);
			if (myfeature) {
				var coordinates = myfeature.getGeometry().getCoordinates();
				popup.setPosition(coordinates);
				$(element).attr('data-placement', 'top');
				$(element).attr('data-html', true);

				myLocal.innerText = setLocal + myfeature.get('sig_kor_nm');
				myFood.innerText = setFood + myfeature.get('wardname');

				$(element).attr(
						'data-content',
						'안녕하세요 ' + myfeature.get('sig_kor_nm') + '에 위치한 '
								+ myfeature.get('wardname') + "" + ' 입니다.');

				$(element).popover('show');
				var example = $(element).attr('data-content');
				console.log(example);
			} else {
				$(element).popover('destroy');
			}
		}
	}

	map.on('singleclick', function(e) {
		foodLayer.once('precompose', function(e) {
			var selectedFeatures = selectSingleClick.getFeatures();
			readFeature(selectedFeatures);
		});
	});

	//
	//	map.on('click', function (e) {
	//		var coord = map.getCoordinateFromPixel(e.pixel);
	//		var cord1 = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
	//		alert(cord1[0] + ", " + cord1[1]);
	//	});

});

function pan(x, y) {

	var location = [ Number(x), Number(y) ];

	location_maker(location);

	olview.animate({
		center : location,
		duration : 2000
	});
	olview.animate({
		zoom : olview.getZoom(),
		duration : 1000
	}, {
		zoom : 14,
		duration : 1000
	});

}

function location_maker(xy, gbn) {

	var imgsrc = 'resources/images/current_location.png';

	if (gbn == 'normal') {
		//안전지역
		imgsrc = 'resources/images/safe_place.png';
	} else if (gbn == 'rapid') {
		//긴급대피
		imgsrc = 'resources/images/rapid_place.png';
	}

	if (typeof markerLayer != "undefined") {
		map.removeLayer(markerLayer);
	}

	var iconStyle = new ol.style.Style({
		image : new ol.style.Icon(({
			scale : 0.5,
			anchor : [ 0.5, 64 ],
			anchorXUnits : 'fraction',
			anchorYUnits : 'pixels',
			src : imgsrc
		}))
	});

	var iconFeature = new ol.Feature({
		geometry : new ol.geom.Point(xy)
	});

	iconFeature.setStyle(iconStyle);

	var vectorSource = new ol.source.Vector({
		features : [ iconFeature ]
	});

	markerLayer = new ol.layer.Vector({
		source : vectorSource,
		zIndex : 2
	});

	map.addLayer(markerLayer);
}

function getCenterOfCoord(coord) {

	var x = Math.abs(coord[0][0] - (coord[0][0] - coord[1][0]) / 2);
	var y = Math.abs(coord[0][1] - (coord[0][1] - coord[1][1]) / 2);

	return [ x, y ];
}

function getExtentOfCoord(coord) {

	var minx = (coord[0][0] >= coord[1][0]) ? coord[1][0] : coord[0][0];
	var maxx = (coord[0][0] >= coord[1][0]) ? coord[0][0] : coord[1][0];
	var miny = (coord[0][1] >= coord[1][1]) ? coord[1][1] : coord[0][1];
	var maxy = (coord[0][1] >= coord[1][1]) ? coord[0][1] : coord[1][1];

	return [ minx, miny, maxx, maxy ];
}
