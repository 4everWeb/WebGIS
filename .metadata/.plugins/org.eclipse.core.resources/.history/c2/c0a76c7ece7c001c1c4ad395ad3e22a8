// 주소 객체를 담을 배열

var indexLocal = 0;
var inputNum = 2;
var firstProjection = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs"; //from
var secondProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"; 
let addressXY =[];
let address = [];

function goPopup(){
	// 주소검색 팝업 페이지 호출
	if(indexLocal < inputNum){
		var pop = window.open('popup.do',"pop","width=570,height=420, scrollbars=yes, resizable=yes"); 
	}
	else{
		alert("더 이상 추가 할 수 없습니다.");
	}
}

function plusInput(){
	//inputbox 추가
	if(inputNum<4){
		const inputBox = document.querySelectorAll(".input0")[inputNum];
		inputNum = inputNum+1;
		inputBox.style = null;
	}
	else{
		alert("더 이상 추가 할 수 없습니다.");
	}
}

function minusInput(){
	//inputbox 삭제
	if(inputNum>2){
		inputNum = inputNum-1;
		const inputBox = document.querySelectorAll(".input0")[inputNum];
		if(inputBox.value !== ""){
			inputNum = inputNum+1;
			alert("더 이상 제거 할 수 없습니다.");
		}
		else{
		inputBox.style.backgroundColor = "black";
		}
	}
	else{
		alert("더 이상 제거 할 수 없습니다.");
	}
}

function thorwItem(){
	// 인풋박스 값 제거
	for(let i =0; i<address.length; i++){
		if(address[i] == null || address[i] =="" || address[i] == undefined){
			break;
		}
		else{
			let input =document.querySelectorAll(".input0");
			input[i].value = "";
		}
	}
	address.length = 0; 
	addressXY.length = 0;
	indexLocal = 0;
	map.removeLayer(markerLayer);
	map.removeLayer(userDestination);
}

function fillIn(address){
	// 위치 선택 시 인풋박스에 정보 입력
	for(let i =0; i<address.length; i++){
		if(address[i] == null || address[i] =="" || address[i] == undefined){
			break;
		}
		else{
			let input =document.querySelectorAll(".input0");
			input[i].value = address[i].addr;
		}
	}
	
}

function jusoCallBack(roadFullAddr,roadAddrPart1,addrDetail,roadAddrPart2,engAddr, jibunAddr, zipNo, admCd, rnMgtSn, bdMgtSn,detBdNmList,bdNm,bdKdcd,siNm,sggNm,emdNm,liNm,rn,udrtYn,buldMnnm,buldSlno,mtYn,lnbrMnnm,lnbrSlno,emdNo,entX,entY){
		// 팝업페이지에서 본페이지로 데이터 받음
		indexLocal = indexLocal+1;
		let local = {
		 addr : roadFullAddr,
		 X : entX,
		 Y : entY,
		};
		
		address.push(local);
		console.log(address);
		
		movePan(local);
		fillIn(address);
}

function movePan(local) {
	//위치 선택 시 위치 이동
	let xyToLat = proj4(firstProjection, secondProjection, [local.X, local.Y]);
	let latToXy = ol.proj.transform([xyToLat[0], xyToLat[1]], 'EPSG:4326', 'EPSG:3857');
	pan(latToXy[0], latToXy[1]);
	let positionUser = {
		X : latToXy[0],
		Y : latToXy[1]
	};
	addressXY.push(positionUser);
}

function findroad(){
	
	var roadSource;
	var feature;
	
		feature = new ol.Feature({
	        geometry: new ol.geom.LineString([
		    	[14144142.43805873, 4461322.092581252],[14143993.545000171, 4461413.259601108],[14143911.534487171, 4461458.644086652],[14143449.125130663, 4461463.036704018],[14143435.589431202, 4461967.839620842],[14143408.517959384, 4462008.446810342],[14143394.5841747, 4462786.750950777],[14143404.138803236, 4462824.9694649195],[14143398.565245626, 4463033.578842468],[14143361.14293838, 4463172.91716313],[14143322.924424235, 4463254.927749026],[14143213.449585572, 4463410.575196084],[14143829.72312612, 4463834.163752129],[14143945.971155236, 4463987.0378086995],[14143627.483440185, 4464189.277494637],[14143226.18896879, 4464506.172650104],[14142972.991312595, 4464819.883014438]
				])
	    });
	    
	    roadSource = new ol.source.Vector();
	    roadSource.addFeature(feature);
    
	road_layer = new ol.layer.Vector({
	    source: roadSource,
	    style: new ol.style.Style({
	        stroke: new ol.style.Stroke({
	            //color: 'rgba(0, 255, 0, 1.0)',
	        	color: 'rgba(255, 0, 0, 1.0)',
	            width: 4
	        }),
	        fill: new ol.style.Fill({
	            //color: 'rgba(0,255,0,0.4)'
	            color: 'rgba(255,0,0,0.4)'
	        })
	    })
	});
    
    map.addLayer(road_layer);
    
    destination_center_mov2();
}

function destination_center_mov2(){
	var location;

	var feature;
	
		feature = new ol.Feature({
			geometry: new ol.geom.Point([[Number(944484.1389591177), Number(1949170.1368464632)], [Number(947762.3561765733), Number(1946649.8220331902)], [Number(950165.1336871658), Number(1946682.8209917857)]])
		});
	
	map.getView().fit(getExtentOfCoord(feature.getGeometry().getCoordinates()), {size:map.getSize(), maxZoom:16, duration: 1000});
}



// 좌표 변환 
//var firstProjection = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs"; //from
//var secondProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"; //to
////I'm not going to redefine those two in latter examples.
//console.log(proj4(firstProjection, secondProjection, [document.getElementById("entX").value,document.getElementById("entY").value])); // Convert 하려는 좌표
//ol.proj.transform([127.0000, 37.5317], 'EPSG:4326', 'EPSG:3857');
//pan(,)
