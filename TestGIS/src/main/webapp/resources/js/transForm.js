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
	
	var centerView = [Number(addressXY[0].X),Number(addressXY[0].Y)];
	
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