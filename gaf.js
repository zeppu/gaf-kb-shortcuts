var currentPage = null;
var prevKey;

const version = "1.9";

const link_OT = "forumdisplay.php?f=3";
const link_GA = "forumdisplay.php?f=2";
const link_CO = "forumdisplay.php?f=8";
const link_CP = "usercp.php";
const link_SU = "subscription.php";
const link_SR = "search.php";

var _posts={
	$posts : null,
	count: 0,
	resetField: function() {
		$posts = $('#posts .page');
		if ($posts.length == 0) return;
		$pos = $($posts[this.count]).position();
		while (window.pageYOffset > $pos.top)
				$pos = $($posts[++this.count]).position();		
	},
	keyHandler: function(e) {
		var newTab = false;
		switch(e.which)
		{
			case 97:	this.showPreviousPost();
						break;	
						
			case 115:	this.showNextPost();
						break;
			
			case 113-32:	newTab = true;			
			case 113:	this.quoteCurrentPost(newTab);
						break;		
			
			case 114-32:	newTab = true;
			case 114:	this.gotoReply(newTab);
						break;
            
			case 119-32:	newTab = true;
            		case 119: 	this.gotoBoard(newTab);
						break;

			case 88:	this.showSpoilers();
						break;
			
			case 101-32:	newTab=true;			
			case 101:	this.editCurrentPost(newTab);
						break;		

			case 116: 	this.startSubscriptionQuery(); 
						break;
			case 104:	this.highlightPost();
						break;
			
			case 106:	this.toggleNumbers();
						break;
			
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57:	this.handleNumber(e.which);
						break;
			
			default: return false;

		}
		return true;
	},
	showPreviousPost : function () {
		if ($posts.length == 0) return;
	
		if (this.count > 0) this.count--
		else this.showTopBar();
		
		this.selectPost();
	
	},
	showNextPost : function () {
		if ($posts.length == 0) return;
		
		if ($('.arrow').length != 0)
		if (this.count < $posts.length-1) this.count++;
		else {
			gotoNextPage();
		}
		
		this.selectPost();		
	},
	selectPost : function() {
		$pos = $($posts[this.count]).position();		
		$('.arrow').remove();
		$('.numLink').remove();
		$($posts[this.count]).prepend('<span class="arrow" style="display: inline; position: absolute; left: 5px; ">»</span>');
		window.scroll(0,$pos.top);
	},
	quoteCurrentPost : function(newTab) {
		if ($posts.length == 0) return;
		redirect($($posts[this.count]).find('a:contains("Quote")').attr('href'), newTab);
	},
	editCurrentPost : function(newTab) {
		if ($posts.length == 0) return;
		$link = $($posts[this.count]).find('a:contains("Edit")');
		if ($link.length > 0)
			redirect($link.attr('href'), newTab);
	},
	gotoReply : function (newTab) {
		redirect($('img[title^="Reply"]').parent().attr('href'), newTab);
	},
	gotoBoard : function(newTab) {
		redirect($('.activetab > a').attr('href'), newTab);
	},
	showSpoilers : function() {
		if ($posts.length == 0) return;
		$($posts[this.count]).find('span.spoiler').toggleClass('spoilme');
	},
	selectFirst : function() {
		if ($posts.length == 0) return;
		
		this.count = 0;
		this.selectPost();
	},
	selectLast : function() {
		if ($posts.length == 0) return;
		
		this.count = $posts.length-1;		
		this.selectPost();
	},
	showTopBar : function() {
		if ($("#topBar").length == 0)
			$("body").prepend('<div id="topBar">&nbsp;</div>');

		$("#topBar").show().fadeOut("slow");
		
	},
	highlightPost : function() {
		if ($posts.length == 0) return;
			$($posts[this.count]).find('.highlightuser').click();
	},
	subscribeToThread : function(data) {	
		securitytoken = $(data).find('[name="securitytoken"]').attr('value');
		threadID = $(data).find('[name="threadid"]').attr('value');
		$.ajax( {
			type : 'POST',
			url : link_SU,
			data: {'do' : 'doaddsubscription', 'threadid' : threadID, 'securitytoken':securitytoken},
			success: function(){
			$('#subscribePopup').text('Subscribed to thread').delay(2000).fadeOut(2000);
		  }
		});
	
	},
	startSubscriptionQuery : function() {
		// find thread ID
		$url = $('td.tcat a[href^="showthread.php"]:last').attr('href');
		$threadID = $url.substring($url.indexOf('t=')+2);
		
		$("body").prepend("<div id='subscribePopup' class='popup'>...</div>");	
		$('#subscribePopup').fadeIn(50).delay(50);

		$.get(link_SU, { 'do':'addsubscription', 't': $threadID }, this.subscribeToThread);
			
	},
	handleNumber : function(e) {
		if ($('.numLink').length > 0) {
				redirect($(".numLink.linkNo" + String.fromCharCode(e)).next().attr('href'), true);
		}
	},
	toggleNumbers : function() {
		if ($('.numLink').length > 0) {
			$('.numLink').remove();
		}
		else {
			linkCount = 0;
			$($posts[this.count]).find('.post a[target="_blank"]').each(function(index) {
				if (++ linkCount < 10) {
					$(this).before('<span class="numLink linkNo' + linkCount + '">' + linkCount + '</span>');
				}
			});
		}
	}
}	

var _threads={
	$threads : null,
	count: -1,
	resetField: function() {
		$threads = $('td[id^="td_threadtitle"]').parent();
		if ($threads.length == 0) return;
	},
	keyHandler: function(e) {
		var newTab = false;
		switch(e.which)
		{
			case 97:	this.selectPrevThread();
						break;	
						
			case 115:	this.selectNextThread();
						break;
			
			case 87 :	newTab = true;
			case 119: 	this.gotoFirstPage(newTab);
						break;

			case 81 :	newTab = true;
			case 113: 	this.gotoFirstUnread(newTab);
						break;
						
			case 69 :	newTab = true;			
			case 101: 	this.gotoLastPage(newTab);
						break;
			
			default: return false;

		}
		return true;
	},
	selectPrevThread : function () {
		if ($threads.length == 0) return;
		
		if (this.count > 0) this.count--; else this.count = 0;
		
		this.setNewPosition();
		if (window.pageYOffset > $pos.top)
			window.scroll(0,$pos.top);
	
	},
	selectNextThread : function (noPageSkip) {
		if ($threads.length == 0) return;
		
		if (this.count < $threads.length-1) this.count++;
		else if (!noPageSkip) {
			gotoNextPage();
		}
		
		this.setNewPosition();
		if (window.pageYOffset + (window.innerHeight / 2) < $pos.top)
			window.scroll(0,window.pageYOffset + $('.currentSelected').height());
	},
	gotoFirstPage : function(newTab) {
		redirect($(".currentSelected' [id^='thread_title_']").attr('href'), newTab);
	},
	gotoFirstUnread : function(newTab) {
		$link = $(".currentSelected [id^='td_threadstatusicon_'] > a");
		if ($link.length > 0)
			redirect($link.attr('href'), newTab);
	},
	gotoLastPage : function(newTab) {
		redirect($(".currentSelected [id^='td_threadtitle_'] div:first a:last").attr('href'), newTab);
	},
	selectFirst : function() {
		if ($threads.length == 0) return;
		
		this.count = 0;
		this.setNewPosition();
		window.scroll(0,$pos.top);
	},
	selectLast : function() {
		if ($threads.length == 0) return;
		
		this.count = $threads.length-1;		
		this.setNewPosition();
		window.scroll(0,$pos.top);

	},
	setNewPosition : function() {
		$pos = $($threads[this.count]).position(); 
		$('.arrow').remove();
		$('.currentSelected').removeClass("currentSelected");
		$($threads[this.count]).addClass("currentSelected");
		$($($threads[this.count]).children()).first().prepend('<span class="arrow" style="display: inline; position: absolute; margin-left: -16px; padding-top: 5px;">»</span>');
	}
}

function gotoPrevPage() {
	if ($('a[title^="Prev Page"]').length != 0)
	{
		redirect($('a[title^="Prev Page"]').attr('href'));
	}
}

function gotoNextPage() {
	if ($('a[title^="Next Page"]').length != 0)
	{
		redirect($('a[title^="Next Page"]').attr('href'));
	}
}

function detectPageType(e) {
	if (document.location.href.search(/forumdisplay.php|usercp.php|subscription.php/i) != -1) {
		currentPage = _threads;
		currentPage.resetField();
		return;
	}
	
	if (document.location.href.search(/showthread.php/i) != -1) {
		currentPage = _posts;
		currentPage.resetField();
		return;
	}
	
	currentPage = -1;
	
}

function redirect(url, newTab) {

	if (url != null) {
		if (newTab) {
			window.open(url);
			self.focus();
			currentPage.selectNextThread(true);
		} 
		else 
			window.location = url;

	}

}

function showSearch() {
	$('#navbar_search').click();
	$("#navbar_search_menu").addClass('searchPopup').removeAttr('style');
	$("#navbar_search_menu .bginput").focus();
}

function globalKeyHandler(e) {
	switch (e.which) {
		case 65:	gotoPrevPage();
					break;
		
		case 83:	gotoNextPage();
					break;

		case 103:	prevKey = true;
					break;
		
		case 102:	showSearch();  return false;
		
		case 63:	showHelp();
					break;
					

	}
}

function multikeyHandler(e) {
	switch (e.which) {
		case 111:	redirect(link_OT);
					break;
		
		case 103:	redirect(link_GA);
					break;
					
		case 99:	redirect(link_CO);
					break;
		
		case 117:	redirect(link_CP);
					break;
					
		case 115 : 	redirect(link_SU);
					break;

		case 102 :	redirect(link_SR); 
					break;
		
		case 116:	if (currentPage != null && currentPage != -1)
						currentPage.selectFirst();
					break;
		
		case 98:	if (currentPage != null && currentPage != -1)
						currentPage.selectLast();
					break;
		default: 	return false;
	}
	
	return true;
}

function highlightPostsChanged() {
	localStorage['highlightEnabled'] = $(this).is(':checked');
	if (localStorage['highlightEnabled'] == 'true')
		$('#highlightHelp').show();
	else
		$('#highlightHelp').hide();
}

function showHelp() {
	if ($("#helpBox").length == 0) {
		$("body").prepend(helpHTML);
		$("#hideHelp").click(function() { $("#helpBox").hide(); });
		$('#highlightPosts').change(highlightPostsChanged);
		$(".new").prepend("<span class=show>new! </span>");
		
		if (localStorage['highlightEnabled'] == 'true') {	
			$('#highlightHelp').show();
			$('#highlightPosts').attr('checked', 'true');
		}
		else
			$('#highlightHelp').hide();

	} else {
		$("#helpBox").toggle();
	}
}

$(document).keypress(function(e)
	{	
		if (e.target.nodeName == 'INPUT' || e.target.nodeName == 'TEXTAREA') return;
		if (currentPage == null)
			detectPageType();

		if (prevKey) {
			prevKey = false;
			if (multikeyHandler(e)) return;
		}
	
		if (currentPage != null && currentPage != -1) {
			if (!currentPage.keyHandler(e))
				return globalKeyHandler(e);
		}
		else return globalKeyHandler(e);
		
	});

$(document).ready(function() 
{
	if (document.location.href.search(/newthread.php/i) != -1) {
		$('input[name="subject"]').focus();	
	}

	if (document.location.href.search(/newreply.php|editpost.php/i) != -1) {
		$('textarea[name="message"]').focus();	
	}	
	
	if (localStorage["latest"] == null || localStorage["latest"] != version) {
		showHelp();
		$('#message').show();
		localStorage["latest"] = version;
	}		
	enableHighlightOption();
});

var helpHTML = "<div id='helpBox' class='popup'>" +
        "<h2>Keyboard Shortcuts - v" + version + "</h2>" +
        "<div id='hideHelp'>close [<a href='http://www.neogaf.com/forum/showthread.php?t=417524' title='Bugs? Need help? Click here.'>?</a>]</div>" +
        "<table class='listing'>" +
	"<tr><td class='w10'>&nbsp;</td><td class='w5'></td><td class='w40 action'>Global</td>		<td class='w10'>&nbsp;</td><td class='w5'></td><td class='w40 action'>Thread List</td></tr>" +
	"<tr><td class='w10 action'>shift<span class='tiny'> + </span>a</td><td class='w5'></td><td class='w40'>Previous page</td>	<td class='w10 action'>a</td><td class='w5'></td><td class='w40'>Select previous thread</td></tr>" +
	"<tr><td class='w10 action'>shift<span class='tiny'> + </span>s</td><td class='w5'></td><td class='w40'>Next page</td>		<td class='w10 action'>s</td><td class='w5'></td><td class='w40'>Select next thread</td></tr>" +
    "<tr><td class='w10 action'>g<span class='tiny'> then </span>g</td>		<td class='w5'></td><td class='w40'>Go to Gaming board</td><td class='w10 action'>q</td><td class='w5 note'>*</td><td class='w40'>Go to first unread post</td></tr>" +
    "<tr><td class='w10 action'>g<span class='tiny'> then </span>o</td>		<td class='w5'></td><td class='w40'>Go to Off-Topic board</td><td class='w10 action'>w</td><td class='w5 note'>*</td><td class='w40'>Go to first page of selected thread</td></tr>" +
    "<tr><td class='w10 action'>g<span class='tiny'> then </span>c</td>		<td class='w5'></td><td class='w40'>Go to Community board</td><td class='w10 action'>e</td><td class='w5 note'>*</td><td class='w40'>Go to last page of selected thread</td></tr>" +
    "<tr><td class='w10 action'>g<span class='tiny'> then </span>s</td>		<td class='w5'></td><td class='w40'>Go to Subscriptions</td><td class='w10'>&nbsp;</td><td class='w5'></td><td class='w40'>&nbsp;</td></tr>" +
    "<tr><td class='w10 action'>g<span class='tiny'> then </span>u</td>		<td class='w5'></td><td class='w40'>Go to User CP</td><td class='w10'>&nbsp;</td><td class='w5'></td><td class='w40 action'>Thread View</td></tr>" +
    "<tr><td class='w10 action'>g<span class='tiny'> then </span>f</td><td class='w5'></td><td class='w40'>Go to Search</td>		<td class='w10 action'>a</td><td class='w5'></td><td class='w40'>Select previous post</td></tr>" +
    "<tr><td class='w10 action'>&nbsp;<td class='w5'></td><td class='w40'>&nbsp;</td>		<td class='w10 action'>s</td><td class='w5'></td><td class='w40'>Select next post</td></tr>" +
    "<tr><td class='w10 action'>g<span class='tiny'> then </span>t</td><td class='w5'></td><td class='w40'>Select top item (if available)</td>		<td class='w10 action'>q</td><td class='w5 note'>*</td><td class='w40'>Quote selected post</td></tr>" +
   	"<tr><td class='w10 action'>g<span class='tiny'> then </span>b</td><td class='w5'></td><td class='w40'>Select bottom item (if available)</td>	<td class='w10 action'>e</td><td class='w5 note'>*</td><td class='w40'>Edit selected post</td></tr>" +
	 "<tr><td class='w10 action'></td><td class='w5'></td><td class='w40'></td>		<td class='w10 action'>shift<span class='tiny'> + </span>x</td><td class='w5'></td><td class='w40'>Expose spoilers in selected post (toggle)</td></tr>" +
    "<tr><td class='w10 action'>?</td><td class='w5'></td><td class='w40'>Command list (toggle)</td>		<td class='w10 action'>r</td><td class='w5 note'>*</td><td class='w40'>Reply to thread</td></tr>" +
    "<tr><td class='w10 action'>&nbsp;</td><td class='w5'></td><td class='w40'>&nbsp;</td>		<td class='w10 action'>w</td><td class='w5 note'>*</td><td class='w40'>Go to parent forum</td></tr>" +
	"<tr><td class='w10 action'>&nbsp;</td><td class='w5'></td><td class='w40'>&nbsp;</td>		<td class='w10 action'>h</td><td class='w5 note'>†</td><td class='w40'>Highlight posts and quotes of current poster</td></tr>" +
	"<tr><td class='w10 action'>&nbsp;</td><td class='w5'></td><td class='w40'>&nbsp;</td>		<td class='w10 action'>t</td><td class='w5 note'></td><td class='w40'>Subscribe to thread</td></tr>" +
	"<tr><td class='w10 action'>&nbsp;</td><td class='w5'></td><td class='w40'>&nbsp;</td>		<td class='w10 action'>j</td><td class='w5 note'></td><td class='w40'>Jump to link in selected post (<span class='key'>1</span>..<span class='key'>9</span> to select link)</td></tr>" +
    "<tr><td colspan='6'>&nbsp;</td></tr>" +
    "<tr><td class='w10'>*</td><td class='w5'></td><td class='w40'>Shift + &lt;command&gt; opens result in a new tab</td><td class='w10'>†</td><td class='w5'></td><td class='w40'>Post highlight must be enabled</td></tr>" +
	"<tr><td colspan='6'>&nbsp;</td></tr>" +
	"<tr><td class='w10'><input type='checkbox' id='highlightPosts'></td><td class='w5'></td><td class='w40' colspan='5'>Enable post highlight (requires refresh)</td></tr>" +
	"<tr id='highlightHelp' class='hidden'><td class='w10 action'></td><td class='w5'></td><td class='w40' colspan='5'>Highlight posts and quotes of current user by pressing <span class='key'>h</span>, clicking on the bulb or double clicking on username above quoted text</td></tr>" +
	"<tr id='message' class='hidden'><td colspan='6'>Like it? Doesn't work? Suggestions? Want to make me happy today? Just post <a href='http://www.neogaf.com/forum/showthread.php?t=417524'>here</a></td></tr>" +
"</table>" + 

        "</div>";
