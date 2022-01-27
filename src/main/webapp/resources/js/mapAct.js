var indexLocal = 0;
var inputNum = 2;
var firstProjection = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs"; // from
var secondProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"; 
let addressXY =[];
let address = [];
let centerFeature;


function showPopUp() {
	
	// 창 크기 지정
	var width = 1200;
	var height = 900;
	
	// pc화면기준 가운데 정렬
	var left = (window.screen.width / 2) - (width/2);
	var top = (window.screen.height / 4);
	
    	// 윈도우 속성 지정
	var windowStatus = 'width='+width+', height='+height+', left='+left+', top='+top+', scrollbars=no, status=no, resizable=no, titlebar=no';
	
    	// 연결하고싶은url
    	const url = "https://www.naver.com/";

	// 등록된 url 및 window 속성 기준으로 팝업창을 연다.
	window.open(url, "Search Info", windowStatus);
}



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
	// inputbox 추가
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
	// inputbox 삭제
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

function throwItem(){
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
	map.removeLayer(centerDestination);
	map.removeLayer(circleLayer);
  	map.removeLayer(layerSeoul);
  	map.removeLayer(foodLayer);
  
	delete centerXY.X;
	delete centerXY.Y;
	
	
	// 팝업 지우고 다시 셋팅 >> 위치 탐색할때도 필요
	deletePopup();
}

function deletePopup() {
	//사이드바 제거
    myLocal.innerText = "지역명 : ";
    myFood.innerText = "음식점 : ";
	//팝업 다시 셋팅 
	map.removeOverlay(popup);
  	map.removeInteraction(selectSingleClick);
	selectSingleClick = new ol.interaction.Select();
	map.addInteraction(selectSingleClick);
	
	popup = new ol.Overlay({
		element: element,
	    positioning: 'bottom-center',
	    stopEvent: false,
	    offset: [0, -20]
	});
	map.addOverlay(popup);
	
	
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
	// 위치 선택 시 위치 이동
	let xyToLat = proj4(firstProjection, secondProjection, [local.X, local.Y]);
	let latToXy = ol.proj.transform([xyToLat[0], xyToLat[1]], 'EPSG:4326', 'EPSG:3857');
	pan(latToXy[0], latToXy[1]);
	let positionUser = {
		X : latToXy[0],
		Y : latToXy[1]
	};
	addressXY.push(positionUser);
}



// centerXY
// {X: 14128855.106469607, Y: 4512000.282362949}
// 126.9384 /37.5600
// "map/wfs?SERVICE=WFS&REQUEST=GetFeature&TYPENAME=tilemaker:cjw_food&VERSION=1.0.0&outputFormat=application/json&cql_filter=DWITHIN(geom,POINT(126.9384
// 37.5600),5000,meters)",
// 2500 , 2000

// 좌표 변환
// var firstProjection = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996
// +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs"; //from
// var secondProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
// //to
// //I'm not going to redefine those two in latter examples.
// console.log(proj4(firstProjection, secondProjection,
// [document.getElementById("entX").value,document.getElementById("entY").value]));
// // Convert 하려는 좌표
// ol.proj.transform([127.0000, 37.5317], 'EPSG:4326', 'EPSG:3857');
// pan(,)
