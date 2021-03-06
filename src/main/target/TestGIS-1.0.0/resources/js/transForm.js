let centerXY;

function wmsImage() {
  layer = new ol.layer.Image({
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
  map.addLayer(layer);
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
	
	destinationCenterMove()
	}
	
}


function centerView(centerXY){
	//view 이동
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
	// 선택 위치 모두 표시
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
	        scale: 1.5,
	        anchor: [0.5, 64],
	        anchorXUnits: 'fraction',
	        anchorYUnits: 'pixels',
	        src: 'resources/images/current_location.png',
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
	switch (addressXY.length) {
   		 case 2 :
    		centerFeature = new ol.Feature({
				geometry: new ol.geom.Point([[Number(addressXY[0].X), Number(addressXY[0].Y)], [Number(addressXY[1].X), Number(addressXY[1].Y)]])
			});
			map.getView().fit(getExtentOfCoord(centerFeature.getGeometry().getCoordinates()), {size:map.getSize(), maxZoom:16, duration: 1000});
			markCenter(getCenterOfCoord(centerFeature.getGeometry().getCoordinates())[0], getCenterOfCoord(centerFeature.getGeometry().getCoordinates())[1]);
    		break;
  		case 3 :
			centerXY = {
				X:(Number(addressXY[0].X)+Number(addressXY[1].X)+Number(addressXY[2].X))/3,
				Y:(Number(addressXY[0].Y)+Number(addressXY[1].Y)+Number(addressXY[2].Y))/3,
			};
			centerView(centerXY);
			markCenter(centerXY);
	   		break;
	 	case 4 :
 			let arrX= [];
 			let arrY= [];
 			for(i=0; i<addressXY.length; i++){
				arrX.push(addressXY[i].X)
				arrY.push(addressXY[i].Y)
			}
 			arrX.sort();
 			arrY.sort();
 			centerXY = {
				X: arrX[0] +((arrX[3] - arrX[0])/2),
				Y: arrY[0] +((arrY[3] - arrY[0])/2),
			};
			
			
//			centerView(centerXY);
			markCenter(centerXY);
			map.getView().fit([arrX[0],arrY[0],arrX[3],arrY[3]], {size:map.getSize(), maxZoom:16, duration: 1000});
	    	break;
	    }
}