// 주소 객체를 담을 배열
let address = [];
let index = 0;
let inputNum = 2;

function goPopup(){
	// 주소검색 팝업 페이지 호출
	if(index < inputNum){
		index = index+1;
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
	address.length=0; 
	index = 0;
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
		
		let local = {
		 addr : roadFullAddr,
		 X : entX,
		 Y : entY,
		};
		
		address.push(local);
		console.log(address);
		
		fillIn(address);
}



// 좌표 변환 

//var firstProjection = "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs"; //from
//var secondProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"; //to
////I'm not going to redefine those two in latter examples.
//console.log(proj4(firstProjection, secondProjection, [document.getElementById("entX").value,document.getElementById("entY").value])); // Convert 하려는 좌표
//ol.proj.transform([127.0000, 37.5317], 'EPSG:4326', 'EPSG:3857');
//pan(,)
