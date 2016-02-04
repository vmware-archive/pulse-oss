/*!
 * Copyright (c) 2010-2015 Pivotal Software, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you
 * may not use this file except in compliance with the License. You
 * may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License. See accompanying
 * LICENSE file.
 */

var isThisGoodResolution;
var oldSelectedTab;
var flagActiveTab = ""; // MEM_R_GRAPH, MEM_TREE_MAP, MEM_GRID
var globalJson = '';
var currentActiveNotificationTab = "ALL"; // valid values 'ALL', 'SEVERE', 'ERROR', 'WARNING' 

function checkMedia()

{
	$('.scroll-pane').jScrollPane();/*
																	 * custom scroll bar on body load for 1st tab
																	 */
	$('.scroll-pane_1').jScrollPane();
	$('.pointGridData').jScrollPane();
	$('.regionMembersSearchBlock').jScrollPane();

	$('.ui-jqgrid-bdiv').jScrollPane();

	if (document.getElementById('canvasWidth') != null) {
		var winW, winH;
		if (document.body && document.body.offsetWidth) {
			winW = document.body.offsetWidth;
			winH = document.body.offsetHeight;

		}
		if (document.compatMode == 'CSS1Compat' && document.documentElement
		    && document.documentElement.offsetWidth) {
			winW = document.documentElement.offsetWidth;
			winH = document.documentElement.offsetHeight;
		}
		if (window.innerWidth && window.innerHeight) {
			winW = window.innerWidth;
			winH = window.innerHeight;
		}

		document.getElementById('canvasWidth').style.width = "1258px";
		// alert('Weight: ' + winW );
		// alert('Height: ' + winH );
		if (winW <= 1024) {

			document.getElementById('canvasWidth').style.width = "1002px";
			// document.getElementById("overLapLinkBlock").style.display =
			// 'none';
			/* onload hide first top tab block */
			$('#TopTab_All').hide();
			$('#btnTopTab_All').removeClass('TopTabLinkActive');
			isThisGoodResolution = false;
		} else {

			document.getElementById('canvasWidth').style.width = "1258px";
			isThisGoodResolution = true;
			// document.getElementById("overLapLinkBlock").style.display =
			// 'block';
		}
	}

}
/* About Dropdown */
$(document).ready(function() {
	$(".aboutClicked-Off").click(function(e) {
		e.preventDefault();
		$("div#detailsAbout").toggle();
		$(".aboutClicked-Off").toggleClass("aboutClicked-On");
	});

	$("div#detailsAbout").mouseup(function() {
		return false;
	});
	$(document).mouseup(function(e) {
		if ($(e.target).parent("a.aboutClicked-Off").length == 0) {
			$(".aboutClicked-Off").removeClass("aboutClicked-On");
			$("div#detailsAbout").hide();
		}
	});

});
/* Members name Dropdown */
$(document).ready(function() {
	$(".memberClicked-Off").click(function(e) {
		e.preventDefault();
		$("div#setting").toggle();
		$(".memberClicked-Off").toggleClass("memberClicked-On");
		$('.jsonSuggestScrollFilter').jScrollPane();
	});

	$("div#setting").mouseup(function() {
		return false;
	});
	$(document).mouseup(function(e) {
		if ($(e.target).parent("a.memberClicked-Off").length == 0) {
			$(".memberClicked-Off").removeClass("memberClicked-On");
			$("div#setting").hide();
		}
	});

	/* on off switch */
	$('#membersButton').addClass('switchActive');
	$('#switchLinks').show();

	$("#membersButton").click(function(e) {
		$('#membersButton').addClass('switchActive');
		$('#dataButton').removeClass('switchActive');
		$('#switchLinks').show();
	});

	$("#dataButton").click(function(e) {
		$('#membersButton').removeClass('switchActive');
		$('#dataButton').addClass('switchActive');
		$('#switchLinks').hide();
	});

});
/* show block function */
function showDiv(divSelected) {
	$('#' + divSelected).show();
}

/* hide block function */
function hideDiv(divSelected) {
	$('#' + divSelected).hide();
}
/* Toggle Top Tab */
function toggleTab(divSelected) {
	/*
	 * $(document).mouseup(function(e) { $('#'+divSelected).hide(); });
	 */

	if (!isThisGoodResolution) {
		$('#' + divSelected).toggle();
		$('.scroll-pane').jScrollPane();
		if (oldSelectedTab == divSelected) {
			$('#' + 'btn' + oldSelectedTab).removeClass('TopTabLinkActive');
			oldSelectedTab = "";

		} else {
			oldSelectedTab = divSelected;
		}

	}

}

/* toggle block function */
function toggleDiv(divSelected) {
	$('#' + divSelected).toggle();
	if ($('#' + 'btn' + divSelected).hasClass('minusIcon')) {
		$('#' + 'btn' + divSelected).addClass('plusIcon');
		$('#' + 'btn' + divSelected).removeClass('minusIcon');
	} else {
		$('#' + 'btn' + divSelected).addClass('minusIcon');
		$('#' + 'btn' + divSelected).removeClass('plusIcon');
	}

}

/*---Accordion-----*/
function accordion() {
	// onload keep open
	$('.accordion .heading').not('.active').addClass('inactive');
	$('.accordion .heading.active').next().show();

	$('.accordion .heading').prepend('<span class="spriteArrow"></span>');
	$('.accordion .heading').click(
	    function() {
		    var accordionId = $(this).parent().parent().attr('id');
		    accordionId = ('#' + accordionId);

		    if ($(this).is('.inactive')) {
			    $(accordionId + ' .active').toggleClass('active').toggleClass(
			        'inactive').next().slideToggle();
			    $(this).toggleClass('active').toggleClass('inactive');
			    $(this).next().slideToggle();
		    }

		    else {
			    $(this).toggleClass('active').toggleClass('inactive');
			    $(this).next().slideToggle();

		    }
		    /* custom scroll bar */
		    $('.ScrollPaneBlock').jScrollPane();
	    });
}

/*---Accordion Nested-----*/
function accordionNested() {
	// onload keep open
	$('.accordionNested .n-heading').not('.n-active').addClass('n-inactive');
	$('.accordionNested .n-heading.n-active').next().show();
	/* Custom scroll */
	$('.ui-jqgrid-bdiv').jScrollPane();

	$('.accordionNested .n-heading').prepend(
	    '<span class="n-spriteArrow"></span>');
	$('.accordionNested .n-heading').click(
	    function() {
		    /* Custom scroll */
		    var accordionIdNested = $(this).parent().parent().attr('id');
		    accordionIdNested = ('#' + accordionIdNested);

		    if ($(this).is('.n-inactive')) {
			    $(accordionIdNested + ' .n-active').toggleClass('n-active')
			        .toggleClass('n-inactive').next().slideToggle();
			    $(this).toggleClass('n-active').toggleClass('n-inactive');
			    $(this).next().slideToggle();
			    /* Custom scroll */
			    $('.ui-jqgrid-bdiv').jScrollPane();
		    }

		    else {
			    $(this).toggleClass('n-active').toggleClass('n-inactive');
			    $(this).next().slideToggle();

		    }

	    });
}

/* show panel */
function tabGridNew(parentId) {
  $('#gridBlocks_Panel').hide();
  destroyScrollPane(parentId);
  $('#gridBlocks_Panel').show();
  $('#chartBlocks_Panel').hide();
  $('#graphBlocks_Panel').hide();
  /* Custom scroll */

  $('.ui-jqgrid-bdiv').each(function(index) {
    var tempName = $(this).parent().attr('id');
    if (tempName == parentId) {
      $(this).jScrollPane({maintainPosition : true, stickToRight : true});  
    }
  });

  $('#btngridIcon').addClass('gridIconActive');
  $('#btngridIcon').removeClass('gridIcon');

  $('#btnchartIcon').addClass('chartIcon');
  $('#btnchartIcon').removeClass('chartIconActive');

  $('#btngraphIcon').addClass('graphIcon');
  $('#btngraphIcon').removeClass('graphIconActive');
}

function tabChart() {

	$('#gridBlocks_Panel').hide();
	$('#chartBlocks_Panel').show();
	$('#graphBlocks_Panel').hide();

	$('#btngridIcon').addClass('gridIcon');
	$('#btngridIcon').removeClass('gridIconActive');

	$('#btnchartIcon').addClass('chartIconActive');
	$('#btnchartIcon').removeClass('chartIcon');

	$('#btngraphIcon').addClass('graphIcon');
	$('#btngraphIcon').removeClass('graphIconActive');
}

function tabGraph() {
	$('#gridBlocks_Panel').hide();
	$('#chartBlocks_Panel').hide();
	$('#graphBlocks_Panel').show();

	$('#btngridIcon').addClass('gridIcon');
	$('#btngridIcon').removeClass('gridIconActive');

	$('#btnchartIcon').addClass('chartIcon');
	$('#btnchartIcon').removeClass('chartIconActive');

	$('#btngraphIcon').addClass('graphIconActive');
	$('#btngraphIcon').removeClass('graphIcon');
}
/* Top tab Panel */
function tabAll() {
  // update currentActiveNotificationTab value
  currentActiveNotificationTab = "ALL";
  if (isThisGoodResolution) {
    $('#TopTab_All').show();
  }
  $('#TopTab_Error').hide();
  $('#TopTab_Warning').hide();
  $('#TopTab_Severe').hide();

  $('#btnTopTab_All').addClass('TopTabLinkActive');
  $('#btnTopTab_Error').removeClass('TopTabLinkActive');
  $('#btnTopTab_Warning').removeClass('TopTabLinkActive');
  $('#btnTopTab_Severe').removeClass('TopTabLinkActive');
  $('.scroll-pane').jScrollPane();
}
function tabError() {
  // update currentActiveNotificationTab value
  currentActiveNotificationTab = "ERROR";
  $('#TopTab_All').hide();
  if (isThisGoodResolution) {
    $('#TopTab_Error').show();
  }
  $('#TopTab_Warning').hide();
  $('#TopTab_Severe').hide();

  $('#btnTopTab_All').removeClass('TopTabLinkActive');
  $('#btnTopTab_Error').addClass('TopTabLinkActive');
  $('#btnTopTab_Warning').removeClass('TopTabLinkActive');
  $('#btnTopTab_Severe').removeClass('TopTabLinkActive');
  $('.scroll-pane').jScrollPane();
}

function tabWarning() {
  // update currentActiveNotificationTab value
  currentActiveNotificationTab = "WARNING";
  $('#TopTab_All').hide();
  $('#TopTab_Error').hide();
  if (isThisGoodResolution) {
    $('#TopTab_Warning').show();
  }
  $('#TopTab_Severe').hide();

  $('#btnTopTab_All').removeClass('TopTabLinkActive');
  $('#btnTopTab_Error').removeClass('TopTabLinkActive');
  $('#btnTopTab_Warning').addClass('TopTabLinkActive');
  $('#btnTopTab_Severe').removeClass('TopTabLinkActive');
  $('.scroll-pane').jScrollPane();
}

function tabSevere() {
  // update currentActiveNotificationTab value
  currentActiveNotificationTab = "SEVERE";
  $('#TopTab_All').hide();
  $('#TopTab_Error').hide();
  $('#TopTab_Warning').hide();
  if (isThisGoodResolution) {
    $('#TopTab_Severe').show();
  }

  $('#btnTopTab_All').removeClass('TopTabLinkActive');
  $('#btnTopTab_Error').removeClass('TopTabLinkActive');
  $('#btnTopTab_Warning').removeClass('TopTabLinkActive');
  $('#btnTopTab_Severe').addClass('TopTabLinkActive');
  $('.scroll-pane').jScrollPane();
}
/* Auto Complete box */
/**
 * function used for opening Cluster View
 */
function openClusterDetail() {
	location.href = 'clusterDetail.html';
}
/**
 * function used for opening Data View
 */
function openDataView() {
	location.href = 'dataView.html';
}
/**
 * function used for opening Data Browser
 */
function openDataBrowser() {
	location.href = 'DataBrowser.html';
}

/**
 * function used for opening Query statistics
 */
function openQueryStatistics() {
  location.href = 'QueryStatistics.html';
}

function destroyScrollPane(scrollPaneParentId) {
    $('.ui-jqgrid-bdiv').each(function(index) {
      var tempName = $(this).parent().attr('id');
      if (tempName == scrollPaneParentId) {
        var api = $(this).data('jsp');
        if(undefined != api){
          api.destroy();
        }
      }
    });
}
