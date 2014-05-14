var Blob = function (id) {
    var self = this;

    self.id = id;
    self.on = true;
    self.lastTouch = [0, 0];
    self.transfer = [0, 0];
    self.rotation = 0;
    self.scale = 1;
    self.dis = 0;
    self.offSet = [0, 0];
    self.startPos = [0, 0];
    self.centerPos = [0, 0];
}

var MIN_ZOOM = 0.5,
    MAX_ZOOM = 10,
    MAX_ZINDEX = 3,
    MIN_ZINDEX = 1,
    Blobs = [];

function getIndex(target)
{
    for(var i = 0; i<Blobs.length; i++)
    {
        if(Blobs[i].id==target.id &&
           Blobs[i].on==true)
        {
            //console.log("found");
            return i;
        }
    }
    return -1;
}

function getAllIndex(target)
{
    for(var i = 0; i<Blobs.length; i++)
    {
        if(Blobs[i].id==target.id)
        {
            //console.log("found");
            return i;
        }
    }
    return -1;
}

function getContainingBox(child)
{
    return $("#"+child.id).parent()[0];
}

function touchStart(target, event)
{                 
    var numOfTouches = event.touches.length;
    var numOfChangingTouches = event.changedTouches.length;

  //init the center pos
  for(var k = 0; k<numOfChangingTouches; k++)
  {
    var target = getContainingBox(event.changedTouches[k].target);
    var tIndex = getIndex(target);
    if(tIndex>=0)
    {
        Blobs[tIndex].offSet[0] = event.changedTouches[k].pageX-Blobs[tIndex].centerPos[0];
        Blobs[tIndex].offSet[1] = event.changedTouches[k].pageY-Blobs[tIndex].centerPos[1];
    }
  }
  
  //init the zoom dis, set the zindex
  if(numOfTouches==1)
  { 
    var target1 = getContainingBox(event.touches[0].target);
    if(target==target1)
    {
        //bring front only one translating blob
        updateZIndex(target1);
    }
  }
  if(numOfTouches==2)
  {
    var target1 = getContainingBox(event.touches[0].target);
    var target2 = getContainingBox(event.touches[1].target);
    
    if(target1==target2)
    {
        setDisTarget(target1, event, 0, 1);
                                
        //bring only one zooming blob
        updateZIndex(target1);
    }
  }
  else if(numOfTouches==3)
  {
    var target1 = getContainingBox(event.touches[0].target);
    var target2 = getContainingBox(event.touches[1].target);
    var target3 = getContainingBox(event.touches[2].target);
    
    if(target1==target2)
    {
        setDisTarget(target1, event, 0, 1);
    }
    else if(target1==target3)
    {
        setDisTarget(target1, event, 0, 2);
    }
    else if(target2==target3)
    {
        setDisTarget(target1, event, 1, 2);
    }
  }
  else if (numOfTouches==4)
  {
    var target1 = getContainingBox(event.touches[0].target);
    var target2 = getContainingBox(event.touches[1].target);
    var target3 = getContainingBox(event.touches[2].target);
    var target4 = getContainingBox(event.touches[3].target);
    
    if(target1==target2)
    {
        setDisTarget(target1, event, 0, 1);
    }
    
    if(target1==target3)
    {
        setDisTarget(target1, event, 0, 2);
    }
    
    if(target2==target3)
    {
        setDisTarget(target1, event, 1, 2);
    }
    
    if(target1==target4)
    {
        setDisTarget(target1, event, 0, 3);
    }
    
    if(target2==target4)
    {
        setDisTarget(target1, event, 1, 3);
    }
    
    if(target3==target4)
    {
        setDisTarget(target1, event, 2, 3);
    }
}
else if (numOfTouches==5)
{
    var target1 = getContainingBox(event.touches[0].target);
    var target2 = getContainingBox(event.touches[1].target);
    var target3 = getContainingBox(event.touches[2].target);
    var target4 = getContainingBox(event.touches[3].target);
    var target5 = getContainingBox(event.touches[4].target);
    
    if(target1==target2)
    {
        setDisTarget(target1, event, 0, 1);
    }
    
    if(target1==target3)
    {
        setDisTarget(target1, event, 0, 2);
    }
    
    if(target2==target3)
    {
        setDisTarget(target1, event, 1, 2);
    }
    
    if(target1==target4)
    {
        setDisTarget(target1, event, 0, 3);
    }
    
    if(target2==target4)
    {
        setDisTarget(target1, event, 1, 3);
    }
    
    if(target3==target4)
    {
        setDisTarget(target1, event, 2, 3);
    }
     if(target1==target5)
    {
        setDisTarget(target1, event, 0, 4);
    }
    
    if(target2==target5)
    {
        setDisTarget(target1, event, 1, 4);
    }
    
    if(target3==target5)
    {
        setDisTarget(target1, event, 2, 4);
    }
    
    if(target4==target5)
    {
        setDisTarget(target1, event, 3, 4);
    }        
 }
 if(numOfTouches==6)
  {
    for(var i=0; i<5; i++)
    {
        var targeti = getContainingBox(event.touches[i].target);
        for(var j=i; j<6; j++)
        {
            var targetj = getContainingBox(event.touches[j].target);
            if(targeti==targetj)
            {
                setDisTarget(targeti, event, i, j);
            }
        }
    }
  }
}

function setDisTarget(target, event, touchIndex1, touchIndex2)
{
    var Index = getIndex(target);
    
    if(Index>=0)
    {
        var amountX = (event.touches[touchIndex1].pageX) - (event.touches[touchIndex2].pageX);
        var amountY = (event.touches[touchIndex1].pageY) - (event.touches[touchIndex2].pageY); 
        var dis = Math.sqrt(amountX*amountX + amountY*amountY);
        Blobs[Index].dis = dis;
    }            
}

function transferTarget(target, event, touchIndex)
{
    //transfer
    var Index = getIndex(target);        
    if(Index>=0 && target.id==getContainingBox(event.target).id)
    {
        var diffX = (event.touches[touchIndex].pageX) - Blobs[Index].startPos[0] - Blobs[Index].offSet[0];
        var diffY = (event.touches[touchIndex].pageY) - Blobs[Index].startPos[1] - Blobs[Index].offSet[1];

        // console.log("diffX " + diffX);
        // console.log("diffY " + diffY);

        // console.log("width " + $(target).width());
        // console.log("height " + $(target).height());

        var unscaledBoxWidthHalf = $(target).width() / 2;
        var unscaledBoxHeightHalf = $(target).height() / 2;
        if (diffX > ($(window).width()-unscaledBoxWidthHalf))
        {
            diffX = $(window).width()-unscaledBoxWidthHalf;
        }
        else if (diffX < -unscaledBoxWidthHalf)
        {
            diffX = -unscaledBoxWidthHalf;
        }

        if (diffY > ($(window).height()-unscaledBoxHeightHalf))
        {
            diffY = $(window).height()-unscaledBoxHeightHalf;
        }
        else if (diffY < -unscaledBoxHeightHalf)
        {
            diffY = -unscaledBoxHeightHalf;
        }

        Blobs[Index].transfer[0] = diffX;
        Blobs[Index].transfer[1] = diffY;

        $(target).css("-webkit-transform",
            "translate("+Blobs[Index].transfer[0] + "px," + Blobs[Index].transfer[1]+"px) " +
            "scaleX(" + Blobs[Index].scale + ") " +
            "scaleY(" + Blobs[Index].scale + ") " +
            "rotateZ(" + Blobs[Index].rotation + "deg)");

        // The scale of the buttons should stay constant
        $(target).find(".lockButton").css("-webkit-transform",
            "scaleX(" + (1.0 / Blobs[Index].scale) + ") " +
            "scaleY(" + (1.0 / Blobs[Index].scale) + ")");

        Blobs[Index].centerPos[0] = $(target).offset().left+$(target).width()*Blobs[Index].scale/2;
        Blobs[Index].centerPos[1] = $(target).offset().top+$(target).height()*Blobs[Index].scale/2;

        // console.log("centerPos[0] " + Blobs[Index].centerPos[0]);
        // console.log("centerPos[1] " + Blobs[Index].centerPos[1]);
    }
}

function zoomTarget(target, event, touchIndex1, touchIndex2)
{
    //zoom
    var Index = getIndex(target);               
    
    if(Index>=0)
    {
        var amountX = (event.touches[touchIndex1].pageX) - (event.touches[touchIndex2].pageX);
        var amountY = (event.touches[touchIndex1].pageY) - (event.touches[touchIndex2].pageY); 
        
        var dis = Math.sqrt(amountX*amountX + amountY*amountY);
        
        var scaleDiff = Blobs[Index].dis - dis;
        
        Blobs[Index].scale = Blobs[Index].scale * (1-scaleDiff/150);
        Blobs[Index].scale = Math.max(MIN_ZOOM, Math.min(Blobs[Index].scale, MAX_ZOOM));
        Blobs[Index].dis = dis;

        var dir = [ (event.touches[touchIndex1].pageX - event.touches[touchIndex2].pageX),
                         (event.touches[touchIndex1].pageY - event.touches[touchIndex2].pageY)];
        var rAngle = -Math.atan2(dir[0], dir[1]);        
        
        //Blobs[Index].rotation = Blobs[Index].rotation + rAngle;
        
        if(Blobs[Index].lastTouch.length==0)
        {
            Blobs[Index].lastTouch[0] = event.touches[touchIndex1]
            Blobs[Index].lastTouch[1] = event.touches[touchIndex2]
        }
        else
        {
            if(Blobs[Index].lastTouch[0].identifier == event.touches[touchIndex1].identifier && 
            Blobs[Index].lastTouch[1].identifier == event.touches[touchIndex2].identifier)
            {
                
            }            
            else if(Blobs[Index].lastTouch[1].identifier == event.touches[touchIndex1].identifier && 
            Blobs[Index].lastTouch[0].identifier == event.touches[touchIndex2].identifier)
            {
                
            }
            else{
                Blobs[Index].lastTouch[0] = event.touches[touchIndex1]
                Blobs[Index].lastTouch[1] = event.touches[touchIndex2]
            }
        }

        $(target).css("-webkit-transform",
            "translate("+Blobs[Index].transfer[0] + "px," + Blobs[Index].transfer[1] + "px) " +
            "scaleX(" + Blobs[Index].scale + ") " + 
            "scaleY(" + Blobs[Index].scale + ") " + 
            "rotateZ(" + Blobs[Index].rotation + "deg)");

        // The scale of the buttons should stay constant
        $(target).find(".lockButton").css("-webkit-transform",
            "scaleX(" + (1.0 / Blobs[Index].scale) + ") " +
            "scaleY(" + (1.0 / Blobs[Index].scale) + ")");
        
        Blobs[Index].centerPos[0] = $(target).offset().left+$(target).width()*Blobs[Index].scale/2;
        Blobs[Index].centerPos[1] = $(target).offset().top+$(target).height()*Blobs[Index].scale/2
    }
}

function touchMove(target, event)
{
  var numOfTouches = event.touches.length;
  var numOfChangingTouches = event.changedTouches.length;
  
  //one
  if(numOfTouches==1)
  {
    var target1 = getContainingBox(event.touches[0].target);
    transferTarget(target1, event, 0);
  }
  else if(numOfTouches==2)
  {
    var target1 = getContainingBox(event.touches[0].target);
    var target2 = getContainingBox(event.touches[1].target);
    
    if(target1==target2)
    {
        //zoom
        zoomTarget(target1, event, 0, 1);
    }
    else 
    {
        //transfer 1
        transferTarget(target1, event, 0);

        //transfer 2
        transferTarget(target2, event, 1);
    }        
  }
  else if(numOfTouches==3)
  {
    var target1 = getContainingBox(event.touches[0].target);
    var target2 = getContainingBox(event.touches[1].target);
    var target3 = getContainingBox(event.touches[2].target);
    
    if(target1==target2)
    {
        //zoom 1,2
        zoomTarget(target1, event, 0, 1);
        
        //transfer 3
        transferTarget(target3, event, 2);
    }
    else if(target1==target3)
    {
        //zoom 1,3 
        zoomTarget(target1, event, 0, 2);                          
        
        //transfer 2
        transferTarget(target2, event, 1);
    }
    else if(target2==target3)
    {
        //zoom 2,3 
        zoomTarget(target2, event, 1, 2);                          
        
        //transfer 1
        transferTarget(target1, event, 0);
    }
    else
    {
        //transfer 1
        transferTarget(target1, event, 0);

        //transfer 2
        transferTarget(target2, event, 1);
          
        //transfer 3
        transferTarget(target3, event, 2);
    }  
  }
  else if(numOfTouches==4)
  {
    var target1 = getContainingBox(event.touches[0].target);
    var target2 = getContainingBox(event.touches[1].target);
    var target3 = getContainingBox(event.touches[2].target);
    var target4 = getContainingBox(event.touches[3].target);
    
    if(target1==target2)
    {
        //zoom 1,2
        zoomTarget(target1, event, 0, 1);
        
        if(target3==target4)
        {
            //zoom 3,4
            zoomTarget(target3, event, 2, 3);                
        }
        else
        {          
            //transfer 3
            transferTarget(target3, event, 2);
            
            //transfer 4
            transferTarget(target4, event, 3);
        }
    }
    else if(target1==target3)
    {
        //zoom 1,3
        zoomTarget(target1, event, 0, 2);
        
        if(target2==target4)
        {
            //zoom 2,4
            zoomTarget(target2, event, 1, 3);                
        }
        else
        {          
            //transfer 2
            transferTarget(target2, event, 1);
            
            //transfer 4
            transferTarget(target4, event, 3);
        }
    }
    else if(target1==target4)
    {
        //zoom 1,4
        zoomTarget(target1, event, 0, 3);
        
        if(target2==target3)
        {
            //zoom 2,3
            zoomTarget(target2, event, 1, 2);                
        }
        else
        {          
            //transfer 2
            transferTarget(target2, event, 1);
            
            //transfer 3
            transferTarget(target3, event, 2);
        }
    }
    else if(target2==target3)
    {
        //zoom 2,3
        zoomTarget(target1, event, 1, 2);
        
        if(target1==target4)
        {
            //zoom 1,4
            zoomTarget(target3, event, 0, 3);                
        }
        else
        {          
            //transfer 1
            transferTarget(target1, event, 0);
            
            //transfer 4
            transferTarget(target4, event, 3);
        }
    }
    else if(target2==target4)
    {
        //zoom 2,4
        zoomTarget(target2, event, 1, 3);
        
        if(target1==target3)
        {
            //zoom 1,3
            zoomTarget(target1, event, 0, 2);                
        }
        else
        {          
            //transfer 1
            transferTarget(target1, event, 0);
            
            //transfer 3
            transferTarget(target3, event, 2);
        }
    }
    else if(target3==target4)
    {
        //zoom 3,4
        zoomTarget(target3, event, 2, 3);
        
        if(target1==target2)
        {
            //zoom 1,2
            zoomTarget(target1, event, 0, 1);                
        }
        else
        {          
            //transfer 1
            transferTarget(target1, event, 0);
            
            //transfer 2
            transferTarget(target2, event, 1);
        }
    }
  }
  else if(numOfTouches==5)
  {
    var target1 = getContainingBox(event.touches[0].target);
    var target2 = getContainingBox(event.touches[1].target);
    var target3 = getContainingBox(event.touches[2].target);
    var target4 = getContainingBox(event.touches[3].target);
    var target5 = getContainingBox(event.touches[4].target);
    
    if(target1!=target2&&target1!=target3&&target1!=target4&&target1!=target5)
    {
        transferTarget(target1, event, 0);            
    }
  
   if(target2!=target1&&target2!=target3&&target2!=target4&&target2!=target5)
    {
        transferTarget(target2, event, 1);            
    }

   if(target3!=target1&&target3!=target2&&target3!=target4&&target3!=target5)
    {
        transferTarget(target3, event, 2);            
    }
   if(target4!=target1&&target4!=target1&&target4!=target3&&target4!=target5)
    {
        transferTarget(target4, event, 3);            
    }

   if(target5!=target1&&target5!=target2&&target5!=target3&&target5!=target4)
    {
        transferTarget(target5, event, 4);            
    }        
    if(target1==target2)
    {
        //zoom 1,2
        zoomTarget(target1, event, 0, 1);
    }
    if(target1==target3)
    {
        //zoom 1,3
        zoomTarget(target1, event, 0, 2);
    }
    if(target1==target4)
    {
        //zoom 1,4
        zoomTarget(target1, event, 0, 3);
    }
    if(target1==target5)
    {
        //zoom 1,5
        zoomTarget(target1, event, 0, 4);
    }
    if(target2==target3)
    {
        //zoom 2,3
        zoomTarget(target2, event, 1, 2);
    }
    if(target2==target4)
    {
        //zoom 2,4
        zoomTarget(target2, event, 1, 3);
    }
    if(target2==target5)
    {
        //zoom 2,5
        zoomTarget(target2, event, 1, 4);
    }
    if(target3==target4)
    {
        //zoom 3,4
        zoomTarget(target3, event, 2, 3);  
    }
    if(target3==target5)            
    {
        //zoom 3,5
        zoomTarget(target3, event, 2, 4);                      
    }
    if(target4==target5)
    {
        //zoom 4,5
        zoomTarget(target4, event, 3, 4);                     
    }
  }  
  else if(numOfTouches==6)
  {
    return;
    //to do
    for(var i=0; i<5; i++)
    {
        var targeti = getContainingBox(event.touches[i].target);
        for(var j=i; j<6; j++)
        {
            var targetj = getContainingBox(event.touches[j].target);
            if(targeti==targetj)
            {
                zoomTarget(targeti, event, i, j); 
            }
        }
    }
  }
  //console.log("xxleft: " + event.changedTouches[0].pageX + " xxtop: " + event.changedTouches[0].pageY );
}

function touchEnd(target, event)
{
  var numOfChangingTouches = event.touches.length;
  for(var k = 0; k<numOfChangingTouches; k++)
  {
    var target = getContainingBox(event.touches[k].target);
    var tIndex = getIndex(target);
    if(tIndex>=0)
    {
        Blobs[tIndex].offSet[0] = event.touches[k].pageX-Blobs[tIndex].centerPos[0];
        Blobs[tIndex].offSet[1] = event.touches[k].pageY-Blobs[tIndex].centerPos[1];
    }
  }
}

function touchLockButton(target, event)
{
    var parent = target.parentNode;
    var index = getAllIndex(parent);
    if(index>=0)
    {
        var blob = $("#"+Blobs[index].id);
        blob.on = !blob.on;
        if($(target).hasClass('lockButtonLocked'))
        {
            $(target).addClass('lockButtonUnlocked').removeClass('lockButtonLocked');
            blob.find(".boxCover").css("display", "block");
        }
        else
        {
            $(target).addClass('lockButtonLocked').removeClass('lockButtonUnlocked');
            blob.find(".boxCover").css("display", "none");
            
            //bring front the just enabled blob
            updateZIndex(parent);
        }
    }        
}

function updateZIndex(target)
{
    var index = getAllIndex(target);
    if(index>=0)
    {
        var hitZIndex = parseInt($(target).css("zIndex"));
        
        //bring back the blobs infront of the hitted blob
        var blob;
        var blobZIndex;
        for(var i = 0; i<Blobs.length; i++)
        {
            blob = $("#"+Blobs[i].id);
            blobZIndex = parseInt(blob.css("zIndex"));
            if(blobZIndex > hitZIndex)
            {
                blob.css("zIndex",(blobZIndex-1)); 
            }    
        }
        
        //set the hitted blob on top
        $(target).css("zIndex", MAX_ZINDEX); 
    }
}

function bringFrontByChild(boxid)
{
    var hitted = $("#"+boxid);
    
    var hitZIndex = parseInt(hitted.css("zIndex"));
    
    //bring back the blobs infront of the hitted blob
    var blob;
    var blobZIndex;
    for(var i = 0; i<Blobs.length; i++)
    {
        blob = $("#"+Blobs[i].id);
        blobZIndex = parseInt(blob.css("zIndex"));
        if(blobZIndex > hitZIndex)
        {
            blob.css("zIndex",(blobZIndex-1)); 
        }    
    }
    
    //set the hitted blob on top
    hitted.css("zIndex", MAX_ZINDEX);         
}

function initBoxes()
{
    $("#boxes").find(".box").each(function(index) {
        // Reset the state of the box
        $(this).offset().left = 0; 
        $(this).offset().top = 0;
        $(this).css("zIndex", 1);
        $(this).css("-webkit-transform",
            "translate(0,0) " +
            "scaleX(1) " +
            "scaleY(1) " +
            "rotateZ(0)");
        $(this).find(".lockButton").css(
            "-webkit-transform", "scaleX(1) scaleY(1)");

        // Create a blob for each box
        Blobs[index] = new Blob(this.id);
        Blobs[index].startPos[0] = $(this).offset().left + $(this).width()/2; 
        Blobs[index].startPos[1] = $(this).offset().top + $(this).height()/2; 
        Blobs[index].centerPos[0] = $(this).offset().left + $(this).width()/2; 
        Blobs[index].centerPos[1] = $(this).offset().top + $(this).height()/2;
    });
}

function initEventListeners()
{
    // Add the touch event listeners to all buttons and boxCovers of all
    // boxes
    $("#boxes").children().each(function(index) {
        var button = $(this).find(".lockButton")[0];
        var boxCover = $(this).find(".boxCover")[0];

        //console.log(button);
        //console.log(boxCover);

        button.addEventListener("touchstart", function(event) {
            event.preventDefault();
            touchLockButton(this, event);
        }, false);

        boxCover.addEventListener("touchstart", function(event) {
            event.preventDefault();
            event.stopPropagation();
            touchStart(this, event);
        }, false);
        boxCover.addEventListener("touchmove", function(event) {
            event.preventDefault();
            event.stopPropagation();
            touchMove(this, event);
        }, false);
        boxCover.addEventListener("touchend", function(event) {
            event.preventDefault();
            event.stopPropagation();
            touchEnd(this, event);
        }, false);
    });

    // Add touch event listeners to the buttons for toggling the visiblity
    // of the Indicator and Region window
    var toggleIndicatorSelectorVisibilityButtonCover = $("#indicatorSelectorButton1Cover")[0];
    toggleIndicatorSelectorVisibilityButtonCover.addEventListener("touchstart", function(event) {
        event.preventDefault();
        toggleIndicatorSelectorVisibility();
    }, false);

    var toggleRegionSelectorVisibilityButtonCover = $("#regionSelectorButton1Cover")[0];
    toggleRegionSelectorVisibilityButtonCover.addEventListener("touchstart", function(event) {
        event.preventDefault();
        toggleRegionSelectorVisibility();
    }, false);

    // Add a touch evenet listener to the IDM logo
    var idmLogo = $("#idmLogo")[0];
    idmLogo.addEventListener("touchstart", function(event) {
        // Reset the window position, if there are two touches on the logo
        if (event.touches.length == 2)
        {
            if (event.touches[0].target == event.touches[1].target)
            {
                event.preventDefault();
                initBoxes();
            }
        }
        // Reload the whole page, if there are three touches on the logo
        else if (event.touches.length == 3)
        {
            if (event.touches[0].target == event.touches[1].target &&
                event.touches[1].target == event.touches[2].target)
            {
                event.preventDefault();
                location.reload();
            }
        }
    }, false);
}

function init()
{
    initBoxes();
    initEventListeners();
}

$(function($) {
    init();
    initQT();
});

function toggleIndicatorSelectorVisibility()
{
    if ($("#indicatorSelectorButton1").hasClass("indicatorSelectorButtonUnselected"))
    {
        $("#indicatorSelectorButton1")
            .removeClass("indicatorSelectorButtonUnselected")
            .addClass("indicatorSelectorButtonSelected");

        $("#bubbleBox").fadeIn(250);

        //console.log("indicatorSelectorButtonSelected");
    }
    else
    {
        $("#indicatorSelectorButton1")
            .removeClass("indicatorSelectorButtonSelected")
            .addClass("indicatorSelectorButtonUnselected");

        $("#bubbleBox").fadeOut(250);

        //console.log("indicatorSelectorButtonUnselected");
    }
}

function toggleRegionSelectorVisibility()
{
    if ($("#regionSelectorButton1").hasClass("regionSelectorButtonUnselected"))
    {
        $("#regionSelectorButton1")
            .addClass("regionSelectorButtonSelected")
            .removeClass("regionSelectorButtonUnselected");

        $("#countryBox").fadeIn(250);

        //console.log("indicatorSelectorButtonSelected");
    }
    else
    {
        $("#regionSelectorButton1")
            .addClass("regionSelectorButtonUnselected")
            .removeClass("regionSelectorButtonSelected");

        $("#countryBox").fadeOut(250);

        //console.log("indicatorSelectorButtonUnselected");
    }
}