let centerXY;
let layerSeoul,foodLayer;
let arrX,arrY;
let circleLayer;
let centerDestination, userDestination;
//centerXY
//{X: 14128855.106469607, Y: 4512000.282362949}
//126.9384 /37.5600
//"map/wfs?SERVICE=WFS&REQUEST=GetFeature&TYPENAME=tilemaker:cjw_food&VERSION=1.0.0&outputFormat=application/json&cql_filter=DWITHIN(geom,POINT(126.9384 37.5600),5000,meters)",
//2500 , 2000


function addCircle(centerXY) {
	//목표지점 원 그리기
	if(typeof circleLayer!="undefined"){
		map.removeLayer(circleLayer);
	}
		
	var changePoints = [centerXY.X, centerXY.Y];
	
	var source = new ol.source.Vector();  
	var vector = new ol.layer.Vector({ 
	  source: source
	});
	
	var vectorSource = new ol.source.Vector({projection: 'EPSG:4326'}); //새로운 벡터 생성
	var circle = new ol.geom.Circle(changePoints, 3140);  //좌표, 반경 넓이
	var CircleFeature = new ol.Feature(circle); //구조체로 형성
	vectorSource.addFeatures([CircleFeature]); // 벡터소스에 추가
	
	  circleLayer =new ol.layer.Vector({  //추가할 벡터레이어
	  source: vectorSource,
	  style: [
	  new ol.style.Style({
	      stroke: new ol.style.Stroke({   //두께
	          color: 'rgba( 240, 79, 79 ,0.9)',
	          width: 2
	      }),
	      fill: new ol.style.Fill({  //채우기
	          color: 'rgba( 230, 237, 230 ,0.5)'
	      }),
	      text : new ol.style.Text({  //텍스트
	        text: '여기서 만나자!',
	        textAlign: 'center',
	        font: '15px roboto,sans-serif'          
	      })
	  })]
	});
	map.addLayer(circleLayer); //만들어진 벡터를 추가
	
}

function getWMS() {
	//WMS
	if(typeof layerSeoul!="undefined"){
		map.removeLayer(layerSeoul);
	}
	//web map service
  layerSeoul = new ol.layer.Image({
    source: new ol.source.ImageWMS({
      ratio: 1,
      url: ServerUrl + "map/wms",
      params: {
        FORMAT: "image/png",
        VERSION: "1.1.1",
        tiled: true,
        STYLES: "",
        LAYERS: "tilemaker:cjw_seoul",
      },
      projection: "EPSG:3857",
    }),
    opacity: 0.7,
    zIndex: 1,
  });
  map.addLayer(layerSeoul);
}

function getWFS() {
	//WFS
	if(typeof foodLayer!="undefined"){
		map.removeLayer(foodLayer);
	}
	//web feature service
	let centerWFS = [centerXY.X, centerXY.Y];
	let transXY = ol.proj.transform(centerWFS, 'EPSG:3857', 'EPSG:4326');
	
	var myStyle = new ol.style.Style({
	  image: new ol.style.Icon(({
        scale: 0.1,
        anchor: [0.5, 67],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'resources/images/foodfood.png',
      })),
	});
	  foodLayer = new ol.layer.Vector({
	  source: new ol.source.Vector({
	    url:
	      ServerUrl +
	      "map/wfs?SERVICE=WFS&REQUEST=GetFeature&TYPENAME=tilemaker:cjw_food&VERSION=1.0.0&outputFormat=application/json&cql_filter=DWITHIN(geom,POINT(" + String(transXY[0]) + " "  +String(transXY[1]) +"),2000,meters)",
	    format: new ol.format.GeoJSON(),
	  }),
	  style: myStyle,
	  visible: true,
	});
	map.addLayer(foodLayer);
}

function searchCenter(){
	//무게 중심 이동 
	if(indexLocal != inputNum){
		alert("위치를 입력해주세요.");
	}
	else{
	if(typeof markerLayer!="undefined"){
		map.removeLayer(markerLayer);
		}
	markUserDestination();
	//유저 선택위치
	destinationCenterMove()
	//무게중심 마크
	}
	
}


function centerView(centerXY){
	//view 중심 이동 사용안함
	var centerView = [Number(centerXY.X),Number(centerXY.Y)];
	
	olview.animate({
		center: centerView,
        duration: 2000
	});
	olview.animate({
		zoom: olview.getZoom(),
        duration: 1000
	}, {
		zoom: 14,
        duration: 1000
	});

	
}


function markUserDestination(){
	// 선택 위치 표시
	
	if(typeof userDestination!="undefined"){
		map.removeLayer(userDestination);
	}
	
	var iconStyle = new ol.style.Style({
		image: new ol.style.Icon(({
	        scale: 0.5,
	        anchor: [0.5, 64],
	        anchorXUnits: 'fraction',
	        anchorYUnits: 'pixels',
	        src: 'resources/images/current_location.png',
        }))
	});
	var vectorSource = new ol.source.Vector();
	
	for(i=0; i<addressXY.length; i++){
		window['iconFeature'+i] = new ol.Feature({
		geometry: new ol.geom.Point([Number(addressXY[i].X),Number(addressXY[i].Y)])
		});
		
		window["iconFeature" + i].setStyle(iconStyle);
		vectorSource.addFeature(window["iconFeature" + i]);
	}
	userDestination = new ol.layer.Vector({
		source: vectorSource,
		zIndex: 2
	});
	map.addLayer(userDestination);
}



function markCenter(centerXY){
	// 선택 위치 모두 표시
	
	if(typeof centerDestination!="undefined"){
		map.removeLayer(centerDestination);
	}
	
	
	var iconStyle = new ol.style.Style({
		image: new ol.style.Icon(({
	        scale: 0.5,
	        anchor: [0.5, 64],
	        anchorXUnits: 'fraction',
	        anchorYUnits: 'pixels',
	        src: 'resources/images/current_location2.png',
        }))
	});
		var vectorSource = new ol.source.Vector();
		let iconFeatureCenter;
		if(Object.keys(centerXY).length == 0){
			iconFeatureCenter = new ol.Feature({
				geometry: new ol.geom.Point([Number(getCenterOfCoord(centerFeature.getGeometry().getCoordinates())[0]),Number(getCenterOfCoord(centerFeature.getGeometry().getCoordinates())[1])])
			});
		}
		else{
			iconFeatureCenter = new ol.Feature({
				geometry: new ol.geom.Point([centerXY.X,centerXY.Y])
			});
		}
		iconFeatureCenter.setStyle(iconStyle);
		vectorSource.addFeature(iconFeatureCenter);
	
	centerDestination = new ol.layer.Vector({
		source: vectorSource,
		zIndex: 2
	});
	map.addLayer(centerDestination);
}

function destinationCenterMove(){
	// 무게중심으로 view 이동
	switch (addressXY.length) {
   		 case 2 :
    		centerXY = {
				X:(Number(addressXY[0].X)+Number(addressXY[1].X))/2,
				Y:(Number(addressXY[0].Y)+Number(addressXY[1].Y))/2,
			};
			arrX= [];
 			arrY= [];
			for(i=0; i<addressXY.length; i++){
				arrX.push(addressXY[i].X)
				arrY.push(addressXY[i].Y)
			};
			arrX.sort();
 			arrY.sort();
 			
			
 			addCircle(centerXY);
 			markCenter(centerXY);
 			
			getWMS();
			getWFS();
			
			map.getView().fit([arrX[0],arrY[0],arrX[1],arrY[1]], {size:map.getSize(), maxZoom:16, duration: 1000});
    		break;
  		case 3 :
			centerXY = {
				X:(Number(addressXY[0].X)+Number(addressXY[1].X)+Number(addressXY[2].X))/3,
				Y:(Number(addressXY[0].Y)+Number(addressXY[1].Y)+Number(addressXY[2].Y))/3,
			};
			arrX= [];
 			arrY= [];
			for(i=0; i<addressXY.length; i++){
				arrX.push(addressXY[i].X)
				arrY.push(addressXY[i].Y)
			};
			arrX.sort();
 			arrY.sort();
 			
		
			
			addCircle(centerXY);
			markCenter(centerXY);
			
			
			getWMS();
			getWFS();
			
			map.getView().fit([arrX[0],arrY[0],arrX[2],arrY[2]], {size:map.getSize(), maxZoom:16, duration: 1000});
			
	   		break;
	 	case 4 :
 			arrX= [];
 			arrY= [];
 			for(i=0; i<addressXY.length; i++){
				arrX.push(addressXY[i].X)
				arrY.push(addressXY[i].Y)
			};
 			arrX.sort();
 			arrY.sort();
 			centerXY = {
				X: arrX[0] +((arrX[3] - arrX[0])/2),
				Y: arrY[0] +((arrY[3] - arrY[0])/2),
			};
			
			addCircle(centerXY);
			markCenter(centerXY);
			
			getWMS();
			getWFS();
			map.getView().fit([arrX[0],arrY[0],arrX[3],arrY[3]], {size:map.getSize(), maxZoom:16, duration: 1000});
	    	break;
	    }
}