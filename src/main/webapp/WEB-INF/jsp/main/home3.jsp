<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<% request.setCharacterEncoding("utf-8"); %>
<% response.setContentType("text/html;charset=UTF-8"); %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=10">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Web GIS</title>

<c:import url="../include/css_define.jsp"></c:import>
<c:import url="../include/js_define.jsp"></c:import>

</head>
<body>
	<div id="page-content-wrapper">
		<div id="msg-dim-layer" class="dim-layer">
		    <div class="dimBg"></div>
		    <div id="layer2" class="pop-layer">
		    	<div class="closeX closeXp">x</div>
		        <div class="pop-container">
		            <div class="pop-conts">
		                <p class="ctxt mb20"></p>
		            </div>
		        </div>
		    </div>
		</div>
		<div id="map">
			<canvas id="windyMap" class="fill"></canvas>
			<div id="popup" style="width:100%;"></div>
			<div id="popup" style="width:100%;"></div>
			<div id="pixel_box">
				<div class="closeX">x</div>
				<div id="overlay-ses"></div>
		</div>
	<div id="wrapper" class="toggled">
<!-- 	전체 -->
		<nav id="sidebar-wrapper"> 
<!-- 	위차찾기 -->
			<div class="accordion-group panel">  
				<div class="panel-heading" data-parent="#sidebar-wrapper" href="#collapse1">
					<h4 class="panel-title"><a href="#">  위치 선택</a></h4>
				</div>
				<div id="collapse1" class="collapse in">
					<div class="panel-body">
						<div style="padding-top: 15px" />
						<div style="display: flex; justify-content: space-between;">
							<input id="input0" class="input0" type="text" placeholder="위치" readonly/>
							<input class="button4" type="button" onClick="throwItem();" value=" × "/>
						</div>
						<div style="padding-top: 15px" />
						<input id="input1"  class="input0" type="text" placeholder="위치" readonly/>
						<div style="padding-top: 15px" />
						<input id="input2"  class="input0" type="text" placeholder="위치" value="" readonly style="background-color:black;"/>
						<div style="padding-top: 15px" />
						<input id="input3"  class="input0" type="text" placeholder="위치" value="" readonly style="background-color:black;"/>
						<div style="padding-top: 15px" />
						
						
						<div id="threeButton">
							<button type="button" class="button1" > – </button>
							<button type="button" class="button2" > + </button>
							<input  type="button" class="button3" onClick="goPopup();" value="위치 추가"/>
						</div>
						<br/>
						<input  type="button" class="button5" onClick="searchCenter();" value="위치 탐색"/>
					</div>
				</div>
			</div>
			<br/>
			<br/>
			<div class="accordion-group panel">
				<div class="panel-heading" data-parent="#sidebar-wrapper" href="#collapse2">
					<h4 class="panel-title"><a href="#">장소 정보</a></h4>
				</div>
				<div id="collapse2" class="collapse in">
					<div class="panel-body">
						<div>
							<table style="width:100%">
								<tr>
									<td id="myLocal" style="width:90%; font-size:24px; padding-bottom:10px;">지역명 :</td>
									<td id="accident" style="width:70%; padding-bottom: 10px;"></td>
								</tr>
								
								<tr>
									<td id="myFood" style="width:90%; font-size:24px; padding-bottom:10px;">음식점 :</td>
									<td id="accidentMatrial" style="width:70%; padding-bottom: 10px;"></td>
								</tr>
							</table>
							<br>
							<input  type="button" class="button6" onClick="showPopUp();" value="정보 검색"/>
						</div>
					</div>
				</div>
			</div>
		</nav>
		<button type="button" class="hamburger is-open" data-toggle="offcanvas"></button>
	</div>
</body>
<script>
	plusButton =document.querySelector(".button2");
	plusButton.addEventListener("click", plusInput);
	minusButton =document.querySelector(".button1");
	minusButton.addEventListener("click", minusInput);
    myLocal = document.querySelector('#myLocal');
    myFood = document.querySelector('#myFood');
</script>
</html>
