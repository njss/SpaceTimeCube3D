var bg_width = 500;
var bar_width = 27;
var x_begin = 14;
var x_end = bg_width - x_begin;
var text_offset = 1;

var year_begin = 1960;
var year_end = 2012;

var currentYear = 1985;
var currPosition = 245;
var stop = true;
				
function touchmove_slider()
{
	//console.log("touchmove_slider");
	d3.event.preventDefault();
	var slider_left_bar_id = document.getElementById("slider_left_bar");
	var slider_curr_bar_id = document.getElementById("slider_curr_bar");
	var slider_right_bar_id = document.getElementById("slider_right_bar");
	
	var text_left_bar_id = document.getElementById("text_left_bar");
	var text_curr_bar_id = document.getElementById("text_curr_bar");
	var text_right_bar_id = document.getElementById("text_right_bar");
	
	var slider_left_bar_x = slider_left_bar_id.getAttribute("x");
	var slider_curr_bar_x = slider_curr_bar_id.getAttribute("x");
	var slider_right_bar_x = slider_right_bar_id.getAttribute("x");
	
	//console.log("d3.event.touches.length: "+d3.event.touches[0].target);
	
	var numOfTouches = d3.touches(this).length;
	var evt_x1, evt_x2, evt_test, touch_target;
	switch (numOfTouches){
		case 1:
			evt_x1 = d3.touches(this)[0][0];
			touch_target = d3.event.touches[0].target;
			changeSliderBar(touch_target, evt_x1, slider_left_bar_x, slider_curr_bar_x, slider_right_bar_x);					
			break;
		case 2:
			evt_x1 = d3.touches(this)[0][0];
			touch_target = d3.event.touches[0].target;
			changeSliderBar(touch_target, evt_x1, slider_left_bar_x, slider_curr_bar_x, slider_right_bar_x);
			evt_x1 = d3.touches(this)[1][0];
			touch_target = d3.event.touches[1].target;
			changeSliderBar(touch_target, evt_x1, slider_left_bar_x, slider_curr_bar_x, slider_right_bar_x);					
			break;
		default:
			break;
	}
	
	

}
function changeSliderBar(touch_target, evt_x1, slider_left_bar_x, slider_curr_bar_x, slider_right_bar_x)
{
	if(touch_target == slider_left_bar) {
        if((evt_x1-bar_width / 2)<=(0)) return;
		if(evt_x1 >= slider_right_bar_x - bar_width / 2){
			evt_x1 = slider_right_bar_x - bar_width / 2;
		}
		if(evt_x1 >= slider_curr_bar_x) {
			var slider_curr_bar_id = document.getElementById("slider_curr_bar");
			slider_curr_bar_id.setAttribute("x", evt_x1);
			changeText(slider_curr_bar_id, evt_x1+bar_width / 2);
		}
		touch_target.setAttribute("x", evt_x1 - bar_width / 2);
        slider_left_to_right.setAttribute("x", parseInt(evt_x1)+parseInt(bar_width / 2));
		slider_left_to_right.setAttribute("width", slider_right_bar_x - evt_x1 - bar_width / 2);
		changeText(touch_target, evt_x1);
	} else if (touch_target == slider_curr_bar) {
		if(evt_x1 >= slider_right_bar_x){
			evt_x1 = slider_right_bar_x;
		}
		if(evt_x1 <= parseInt(slider_left_bar_x) + parseInt(bar_width)){
			evt_x1 = parseInt(slider_left_bar_x) + parseInt(bar_width);
		}
		
		touch_target.setAttribute("x", evt_x1 - bar_width / 2);
		changeText(touch_target, evt_x1);
	} else if (touch_target == slider_right_bar) {
        if((evt_x1+bar_width / 2)>=(bg_width)) return;
		if(evt_x1 <= parseInt(slider_left_bar_x) + parseInt(bar_width)){
			evt_x1 = parseInt(slider_left_bar_x) + parseInt(bar_width);
		}
		if(evt_x1 <= parseInt(slider_curr_bar_x) + parseInt(bar_width)) {
			var slider_curr_bar_id = document.getElementById("slider_curr_bar");
			slider_curr_bar_id.setAttribute("x", evt_x1 - bar_width);
			changeText(slider_curr_bar_id, evt_x1-bar_width / 2);
		}
		touch_target.setAttribute("x", evt_x1 - bar_width / 2);
        slider_left_to_right.setAttribute("width", evt_x1 - slider_left_bar_x - bar_width / 2);
		changeText(touch_target, evt_x1);
	}
	
	return evt_x1;
}



function changeText(touch_target, evt_x1){
	var slider_left_bar_id = document.getElementById("slider_left_bar");
	var slider_curr_bar_id = document.getElementById("slider_curr_bar");
	var slider_right_bar_id = document.getElementById("slider_right_bar");
	
	var text_left_bar_id = document.getElementById("text_left_bar");
	var text_curr_bar_id = document.getElementById("text_curr_bar");
	var text_right_bar_id = document.getElementById("text_right_bar");
	
	var x = evt_x1;
	var a = x_begin;
	var b = x_end;
	var c = year_begin;
	var d = year_end;
	var y = (b - x) * c / (b - a) + (x - a)*d/(b - a); 
	y = Math.round(y);
			
	if(touch_target == slider_left_bar_id)
	{
		//console.log("xScale: "+ xScale(evt_x1));
		text_left_bar_id.setAttribute("x", evt_x1 - bar_width / 2 + parseInt(text_offset));
		svg.select("#text_left_bar")
			.text(y);
        yearInit = y;
        $("#slider").slider("option", "min", yearInit);
        updateYear();
	} else if (touch_target == slider_curr_bar_id)
	{
		text_curr_bar_id.setAttribute("x", evt_x1 - bar_width / 2+ parseInt(text_offset));
		svg.select("#text_curr_bar")
			.text(y);
        playerCurrentYear = y;
        currentYear = y;
        
    
        	
		currPosition = evt_x1;
        updateYear();
        updateCurYear(y);
            if (currentYear>=yearEnd-1)
        	stopTimeAuto();
	} else if (touch_target == slider_right_bar_id)
	{
		text_right_bar_id.setAttribute("x", evt_x1 - bar_width / 2+ parseInt(text_offset));
		svg.select("#text_right_bar")
			.text(y);
        yearEnd = y;
        updateYear();
        
        $("#slider").slider("option", "min", yearEnd);
	}
}


function myTimer(slider)
{	
	var slider_left_bar_id = document.getElementById("slider_left_bar");
	var slider_curr_bar_id = document.getElementById("slider_curr_bar");	
	var slider_right_bar_id = document.getElementById("slider_right_bar");	
	var slider_left_bar_x = slider_left_bar_id.getAttribute("x");
	var slider_curr_bar_x = slider_curr_bar_id.getAttribute("x");
	var slider_right_bar_x = slider_right_bar_id.getAttribute("x"); 
	
	
	if (currPosition >= slider_right_bar_x)
	{			
			stopTimeAuto(); 		
			
			return;
	}
		
				
		//alert (currPosition + ' ' + slider_right_bar_x);
		currPosition = parseInt(currPosition) + parseInt(9);
		if(currPosition >= slider_right_bar_x){
			currPosition = slider_right_bar_x;
		}
		//currentYear +=1;
		//alert (currPosition);
		//alert(currPosition);
		//changeText(slider, currPosition);
		changeSliderBar(slider_curr_bar, currPosition, slider_left_bar_x, slider_curr_bar_x, slider_right_bar_x);

		//alert(currentYear);	
		//alert(currentYear + ' ' + (yearEnd));	
}


function playTime(curYear, stepYear)
{
	
	var slider_left_bar_id = document.getElementById("slider_left_bar");
	var slider_curr_bar_id = document.getElementById("slider_curr_bar");	
	var slider_right_bar_id = document.getElementById("slider_right_bar");
	
	var text_left_bar_id = document.getElementById("text_left_bar");
	
	var text_curr_bar_id = document.getElementById("text_curr_bar");
	var text_right_bar_id = document.getElementById("text_right_bar");

		

	//alert(currPosition);
	//for (i=curYear;i<year_end; i=i+stepYear)
	//{			
	//}		
	stop = false;
	
	
	myVarTimer = null;
	myVarTimer = setInterval(function(){myTimer(slider_curr_bar_id)},1000);
		

}
