var avatar = 'on';
var posts = 'on';
var quotes = 'on';

var quoteColors = ['#72C4E5','#FFE496', '#DFC9FF', '#FFD8D8', '#75FFE3']
var count = 0;

function getNextTempColor() { return quoteColors[count++ %5]; }

function highlightuser(user) {
 // just because
    $('.vbmenu_control').css('font-family', 'Arial');
    $x = $("a['.bigusername']:contains('" + user + "')");
    isOn = $x.hasClass('highlightOn');
    if (isOn) 
        $x.removeClass('highlightOn');
    else
        $x.addClass('highlightOn');

    var tempColor = getNextTempColor();
    
    if(avatar == "on" && posts == "on")     
            $x.css('color', isOn?'':'black').parent().parent().parent().children().css('background-color', isOn?'':('' + tempColor + ''));
        
    else
    {
        if(avatar == "on") {
            $x.css('color', isOn?'':'black').parent().parent().css('background-color', isOn?'':('' + tempColor + ''));
        }    
        if(posts == "on") {
            $x.css('color', isOn?'':'black').parent().parent().siblings().css('background-color', isOn?'':('' + tempColor + ''));  
        }           
    }
        
    if(quotes == "on")
    {
        $('div[id^="post_message"] > div > div').find(":contains(" + user +  ")").each(function(){
            $(this).parent().parent().find('td.quotearea').css('background-color', isOn?'':('' + tempColor + ''));
        });
    }
}

function enableHighlightOption() {  
    if (localStorage['highlightEnabled'] !== undefined && localStorage['highlightEnabled'] == 'true')
	{
		$('div[id^="post_message"] > div > div > strong').dblclick(function () { 
		  highlightuser($(this).text());
		});

		$('div[id^="postmenu"] > .bigusername').parent().after('<span style="float: right; position: relative; top: -14px;" class="highlightuser"><img src="http://imgur.com/xA8g8.png"></span>');

		$('.highlightuser').click(function () { 
		highlightuser($(this).prev().children('a').text())  
		});
	}
}
