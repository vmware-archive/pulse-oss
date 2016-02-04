/*
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

// MemberDetails.js
var memberRegions;
var membersList = null;
var isMemberListFilterHandlerBound = false;

// initializeMemberDetailsPage: function that initializes all widgets present on
// Member Details Page
$(document).ready(function() {

  // Load Notification HTML
  generateNotificationsPanel();

  // loadResourceBundles();
  // modify UI text as per requirement
  customizeUI();

  if (CONST_BACKEND_PRODUCT_GEMFIREXD == productname.toLowerCase()) {
    alterHtmlContainer(CONST_BACKEND_PRODUCT_GEMFIREXD);
  } else {
    alterHtmlContainer(CONST_BACKEND_PRODUCT_GEMFIRE);
  }

  scanPageForWidgets();
  createMemberRegionsTreeMap();
  createMemberRegionsGrid();
  createMemberClientsGrid(); // creating empty member client grid
  $.ajaxSetup({
    cache : false
  });
});

/*
 * Function to show and hide html elements/components based upon whether product
 * is GemFireXD or GemFire
 */
function alterHtmlContainer(prodname) {
  if (CONST_BACKEND_PRODUCT_GEMFIREXD == prodname.toLowerCase()) {
    // Hide HTML for following

    // Show HTML for following
    $('#subTabQueryStatistics').show();
  } else {
    // Hide HTML for following
    $('#subTabQueryStatistics').hide();

    // Show HTML for following

  }

}

// Function to generate HTML for Members list drop down
function generateMemberListHTML(membersList) {
  var htmlMemberList = '';
  for ( var i = 0; i < membersList.length; i++) {
    htmlMemberList += '<div class="resultItemFilter">'
        + '<a href="MemberDetails.html?member=' + membersList[i].memberId
        + '&memberName=' + membersList[i].name + '">' + membersList[i].name
        + '</a></div>';
  }
  return htmlMemberList;
}

// Handler to filter members list drop down based on user's criteria
var applyFilterOnMembersListDropDown = function(e) {
  var searchKeyword = extractFilterTextFrom('filterMembersBox');
  var filteredMembersList = new Array();
  if (searchKeyword != "") {
    // generate filtered members list
    for ( var i = 0; i < membersList.length; i++) {
      if (membersList[i].name.toLowerCase().indexOf(searchKeyword) !== -1) {
        filteredMembersList.push(membersList[i]);
      }
    }
    var htmlMemberListWithFilter = generateMemberListHTML(filteredMembersList);
    e.preventDefault();
    // $("div#setting").toggle();
    $('#clusterMembersContainer').html(htmlMemberListWithFilter);
    // $("div#setting").toggle();
    $('.jsonSuggestScrollFilter').jScrollPane();
  } else {
    var htmlMemberList = generateMemberListHTML(membersList);
    e.preventDefault();
    // $("div#setting").toggle();
    $('#clusterMembersContainer').html(htmlMemberList);
    // $("div#setting").toggle();
    $('.jsonSuggestScrollFilter').jScrollPane();
  }

};

function createMemberClientsGrid() {
  jQuery("#memberClientsList").jqGrid(
      {
        datatype : "local",
        height : 180,
        colNames : [ 'Id', 'Name', 'Host', 'Queue Size', 'CPU Usage', 'Uptime',
            'Threads', 'Gets', 'Puts' ],
        colModel : [
            {
              name : 'clientId',
              index : 'clientId',
              width : 70,
              cellattr : function(rowId, val, rawObject, cm, rdata) {
                return 'title="Name ' + rawObject.name + ' , Host '
                    + rawObject.host + ' , Queue Size ' + rawObject.queueSize
                    + ' , CPU Usage ' + rawObject.cpuUsage + ' , Threads '
                    + rawObject.threads + '"';
              },
              sortable : true,
              sorttype : "string"
            },
            {
              name : 'name',
              index : 'name',
              width : 90,
              cellattr : function(rowId, val, rawObject, cm, rdata) {
                return 'title="Name ' + rawObject.name + ' , Host '
                    + rawObject.host + ' , Queue Size ' + rawObject.queueSize
                    + ' , CPU Usage ' + rawObject.cpuUsage + ' , Threads '
                    + rawObject.threads + '"';
              },
              sortable : true,
              sorttype : "string"
            },
            {
              name : 'host',
              index : 'host',
              width : 90,
              cellattr : function(rowId, val, rawObject, cm, rdata) {
                return 'title="Name ' + rawObject.name + ' , Host '
                    + rawObject.host + ' , Queue Size ' + rawObject.queueSize
                    + ' , CPU Usage ' + rawObject.cpuUsage + ' , Threads '
                    + rawObject.threads + '"';
              },
              sortable : true,
              sorttype : "string"
            },
            {
              name : 'queueSize',
              index : 'queueSize',
              width : 80,
              align : 'right',
              cellattr : function(rowId, val, rawObject, cm, rdata) {
                return 'title="Name ' + rawObject.name + ' , Host '
                    + rawObject.host + ' , Queue Size ' + rawObject.queueSize
                    + ' , CPU Usage ' + rawObject.cpuUsage + ' , Threads '
                    + rawObject.threads + '"';
              },
              sortable : true,
              sorttype : "int"
            },
            {
              name : 'cpuUsage',
              index : 'cpuUsage',
              width : 80,
              align : 'right',
              cellattr : function(rowId, val, rawObject, cm, rdata) {
                return 'title="Name ' + rawObject.name + ' , Host '
                    + rawObject.host + ' , Queue Size ' + rawObject.queueSize
                    + ' , CPU Usage ' + rawObject.cpuUsage + ' , Threads '
                    + rawObject.threads + '"';
              },
              sortable : true,
              sorttype : "string"
            },
            {
              name : 'uptime',
              index : 'uptime',
              width : 119,
              cellattr : function(rowId, val, rawObject, cm, rdata) {
                return 'title="Name ' + rawObject.name + ' , Host '
                    + rawObject.host + ' , Queue Size ' + rawObject.queueSize
                    + ' , CPU Usage ' + rawObject.cpuUsage + ' , Threads '
                    + rawObject.threads + '"';
              },
              sortable : true,
              sorttype : "string"
            },
            {
              name : 'threads',
              index : 'threads',
              align : 'right',
              width : 70,
              cellattr : function(rowId, val, rawObject, cm, rdata) {
                return 'title="Name ' + rawObject.name + ' , Host '
                    + rawObject.host + ' , Queue Size ' + rawObject.queueSize
                    + ' , CPU Usage ' + rawObject.cpuUsage + ' , Threads '
                    + rawObject.threads + '"';
              },
              sortable : true,
              sorttype : "string"
            },
            {
              name : 'gets',
              index : 'gets',
              width : 52,
              align : 'right',
              cellattr : function(rowId, val, rawObject, cm, rdata) {
                return 'title="Name ' + rawObject.name + ' , Host '
                    + rawObject.host + ' , Queue Size ' + rawObject.queueSize
                    + ' , CPU Usage ' + rawObject.cpuUsage + ' , Threads '
                    + rawObject.threads + '"';
              },
              sortable : true,
              sorttype : "string"
            },
            {
              name : 'puts',
              index : 'puts',
              width : 51,
              align : 'right',
              cellattr : function(rowId, val, rawObject, cm, rdata) {
                return 'title="Name ' + rawObject.name + ' , Host '
                    + rawObject.host + ' , Queue Size ' + rawObject.queueSize
                    + ' , CPU Usage ' + rawObject.cpuUsage + ' , Threads '
                    + rawObject.threads + '"';
              },
              sortable : true,
              sorttype : "string"
            } ],
        userData : {
          "sortOrder" : "asc",
          "sortColName" : "name"
        },
        onSortCol : function(columnName, columnIndex, sortorder) {
          // Set sort order and sort column in user variables so that
          // periodical updates can maintain the same
          var gridUserData = jQuery("#memberClientsList").getGridParam(
              'userData');
          gridUserData.sortColName = columnName;
          gridUserData.sortOrder = sortorder;
        },
        resizeStop : function(width, index) {
          $('#LargeBlock_2').hide();
          destroyScrollPane('gview_memberClientsList');
          $('#LargeBlock_2').show();
          $('.ui-jqgrid-bdiv').each(function(index) {
            var tempName = $(this).parent().attr('id');
            if (tempName == 'gview_memberClientsList') {
              $(this).jScrollPane({
                maintainPosition : true,
                stickToRight : true
              });
            }
          });
        },
        gridComplete : function() {
          $(".jqgrow").css({
            cursor : 'default'
          });

          var memberRegionsList = $('#gview_memberClientsList');
          var memberRegionsListChild = memberRegionsList
              .children('.ui-jqgrid-bdiv');

          memberRegionsListChild.unbind('jsp-scroll-x');
          memberRegionsListChild.bind('jsp-scroll-x', function(event,
              scrollPositionX, isAtLeft, isAtRight) {
            var mRList = $('#gview_memberClientsList');
            var mRLC = mRList.children('.ui-jqgrid-hdiv').children(
                '.ui-jqgrid-hbox');
            mRLC.css("position", "relative");
            mRLC.css('right', scrollPositionX);
          });
        }
      });
}

// function used for creating empty member region tree map
function createMemberRegionsTreeMap() {

  var dataVal = {
    "$area" : 1
  };
  var json = {
    "children" : {},
    "data" : dataVal,
    "id" : "root",
    "name" : "Regions"
  };

  memberRegionsTreeMap = new $jit.TM.Squarified(
      {

        injectInto : 'memberRegionSummary',
        levelsToShow : 1,
        titleHeight : 0,
        background : '#8c9aab',
        offset : 2,
        Label : {
          type : 'HTML',
          size : 1
        },
        Node : {
          CanvasStyles : {
            shadowBlur : 0
          }
        },
        Events : {
          enable : true,
          onMouseEnter : function(node, eventInfo) {
            if (node) {
              node.setCanvasStyle('shadowBlur', 7);
              node.setData('border', '#ffffff');
              selecetdClusterTMNodeId = "";
              memberRegionsTreeMap.fx.plotNode(node,
                  memberRegionsTreeMap.canvas);
              memberRegionsTreeMap.labels.plotLabel(
                  memberRegionsTreeMap.canvas, node);
            }
          },
          onMouseLeave : function(node) {
            if (node) {
              node.removeData('border', '#ffffff');
              node.removeCanvasStyle('shadowBlur');
              memberRegionsTreeMap.plot();
            }
          }
        },

        Tips : {
          enable : true,
          offsetX : 20,
          offsetY : 20,
          onShow : function(tip, node, isLeaf, domElement) {

            var data = node.data;
            var html = "";
            if (data.regionType) {
              html = "<div class=\"tip-title\"><div><div class='popupHeading'>"
                  + node.id
                  + "</div>"
                  + "<div class='popupFirstRow'><div class='popupRowBorder borderBottomZero'>"
                  + "<div class='labeltext left display-block width-45'><span class='left'>"
                  + "Type</span></div><div class='right width-55'>"
                  + "<div class='color-d2d5d7 font-size14 popInnerBlockEllipsis'>"
                  + data.regionType
                  + "</div>"
                  + "</div></div><div class='popupRowBorder borderBottomZero'><div class='labeltext left display-block width-45'>"
                  + "<span class='left'>"
                  + jQuery.i18n.prop('pulse-entrycount-custom')
                  + "</span></div><div class='right width-55'>"
                  + "<div class='color-d2d5d7 font-size14'>"
                  + data.entryCount
                  + "</div>"
                  + "</div></div><div class='popupRowBorder borderBottomZero'><div class='labeltext left display-block width-45'>"
                  + "<span class='left'>"
                  + jQuery.i18n.prop('pulse-entrysize-custom')
                  + "</span></div><div class='right width-55'>"
                  + "<div class='color-d2d5d7 font-size14'>" + data.entrySize
                  + "</div></div></div></div></div>" + "</div>";
            } else {
              html = "<div class=\"tip-title\"><div><div class='popupHeading'>No "
                  + jQuery.i18n.prop('pulse-regiontabletooltip-custom')
                  + " Found</div>";
            }
            tip.innerHTML = html;
          }
        },
        onCreateLabel : function(domElement, node) {
          domElement.style.opacity = 0.01;
        }
      });
  memberRegionsTreeMap.loadJSON(json);
  memberRegionsTreeMap.refresh();
}

// function used for creating blank grids for member's region list
// for member details screen
function createMemberRegionsGrid() {
  jQuery("#memberRegionsList").jqGrid(
      {
        datatype : "local",
        height : 180,
        rowNum : 1000,
        colNames : [ 'Name', 'Type', 'Entry Count', 'Entry Size', 'Scope',
            'Disk Store Name', 'Disk Synchronous', 'Gateway Enabled' ],
        colModel : [
            {
              name : 'name',
              index : 'name',
              width : 100,
              cellattr : function(rowId, val, rawObject, cm, rdata) {
                return 'title="Name ' + rawObject.name + ' , Type '
                    + rawObject.type + ' , '
                    + jQuery.i18n.prop('pulse-entrycount-custom') + ' '
                    + rawObject.entryCount + ' , Scope ' + rawObject.scope
                    + ' , Disk Store Name ' + rawObject.diskStoreName
                    + ' , Disk Synchronous ' + rawObject.diskSynchronous
                    + ' , ' + jQuery.i18n.prop('pulse-entrysize-custom') + ' '
                    + rawObject.entrySize + '"';
              },
              sortable : true,
              sorttype : "string"
            },
            {
              name : 'type',
              index : 'type',
              width : 100,
              cellattr : function(rowId, val, rawObject, cm, rdata) {
                return 'title="Name ' + rawObject.name + ' , Type '
                    + rawObject.type + ' , '
                    + jQuery.i18n.prop('pulse-entrycount-custom') + ' '
                    + rawObject.entryCount + ' , Scope ' + rawObject.scope
                    + ' , Disk Store Name ' + rawObject.diskStoreName
                    + ' , Disk Synchronous ' + rawObject.diskSynchronous
                    + ' , ' + jQuery.i18n.prop('pulse-entrysize-custom') + ' '
                    + rawObject.entrySize + '"';
              },
              sortable : true,
              sorttype : "string"
            },
            {
              name : 'entryCount',
              index : 'entryCount',
              width : 90,
              align : 'right',
              cellattr : function(rowId, val, rawObject, cm, rdata) {
                return 'title="Name ' + rawObject.name + ' , Type '
                    + rawObject.type + ' , '
                    + jQuery.i18n.prop('pulse-entrycount-custom') + ' '
                    + rawObject.entryCount + ' , Scope ' + rawObject.scope
                    + ' , Disk Store Name ' + rawObject.diskStoreName
                    + ' , Disk Synchronous ' + rawObject.diskSynchronous
                    + ' , ' + jQuery.i18n.prop('pulse-entrysize-custom') + ' '
                    + rawObject.entrySize + '"';
              },
              sortable : true,
              sorttype : "int"
            },
            {
              name : 'entrySize',
              index : 'entrySize',
              width : 70,
              align : 'right',
              cellattr : function(rowId, val, rawObject, cm, rdata) {
                return 'title="Name ' + rawObject.name + ' , Type '
                    + rawObject.type + ' , '
                    + jQuery.i18n.prop('pulse-entrycount-custom') + ' '
                    + rawObject.entryCount + ' , Scope ' + rawObject.scope
                    + ' , Disk Store Name ' + rawObject.diskStoreName
                    + ' , Disk Synchronous ' + rawObject.diskSynchronous
                    + ' , ' + jQuery.i18n.prop('pulse-entrysize-custom') + ' '
                    + rawObject.entrySize + '"';
              },
              sortable : true,
              sorttype : "int"
            },
            {
              name : 'scope',
              index : 'scope',
              width : 50,
              cellattr : function(rowId, val, rawObject, cm, rdata) {
                return 'title="Name ' + rawObject.name + ' , Type '
                    + rawObject.type + ' , '
                    + jQuery.i18n.prop('pulse-entrycount-custom') + ' '
                    + rawObject.entryCount + ' , Scope ' + rawObject.scope
                    + ' , Disk Store Name ' + rawObject.diskStoreName
                    + ' , Disk Synchronous ' + rawObject.diskSynchronous
                    + ' , ' + jQuery.i18n.prop('pulse-entrysize-custom') + ' '
                    + rawObject.entrySize + '"';
              },
              sortable : true,
              sorttype : "string"
            },
            {
              name : 'diskStoreName',
              index : 'diskStoreName',
              width : 100,
              cellattr : function(rowId, val, rawObject, cm, rdata) {
                return 'title="Name ' + rawObject.name + ' , Type '
                    + rawObject.type + ' , '
                    + jQuery.i18n.prop('pulse-entrycount-custom') + ' '
                    + rawObject.entryCount + ' , Scope ' + rawObject.scope
                    + ' , Disk Store Name ' + rawObject.diskStoreName
                    + ' , Disk Synchronous ' + rawObject.diskSynchronous
                    + ' , ' + jQuery.i18n.prop('pulse-entrysize-custom') + ' '
                    + rawObject.entrySize + '"';
              },
              sortable : true,
              sorttype : "string"
            },
            {
              name : 'diskSynchronous',
              index : 'diskSynchronous',
              width : 100,
              cellattr : function(rowId, val, rawObject, cm, rdata) {
                return 'title="Name ' + rawObject.name + ' , Type '
                    + rawObject.type + ' , '
                    + jQuery.i18n.prop('pulse-entrycount-custom') + ' '
                    + rawObject.entryCount + ' , Scope ' + rawObject.scope
                    + ' , Disk Store Name ' + rawObject.diskStoreName
                    + ' , Disk Synchronous ' + rawObject.diskSynchronous
                    + ' , ' + jQuery.i18n.prop('pulse-entrysize-custom') + ' '
                    + rawObject.entrySize + '"';
              },
              sortable : true,
              sorttype : "string"
            },
            {
              name : 'gatewayEnabled',
              index : 'gatewayEnabled',
              width : 100,
              cellattr : function(rowId, val, rawObject, cm, rdata) {
                return 'title="Name ' + rawObject.name + ' , Type '
                    + rawObject.type + ' , '
                    + jQuery.i18n.prop('pulse-entrycount-custom') + ' '
                    + rawObject.entryCount + ' , Scope ' + rawObject.scope
                    + ' , Disk Store Name ' + rawObject.diskStoreName
                    + ' , Disk Synchronous ' + rawObject.diskSynchronous
                    + ' , ' + jQuery.i18n.prop('pulse-entrysize-custom') + ' '
                    + rawObject.entrySize + '"';
              },
              sortable : true,
              sorttype : "string"
            } ],
        userData : {
          "sortOrder" : "asc",
          "sortColName" : "name"
        },
        onSortCol : function(columnName, columnIndex, sortorder) {
          // Set sort order and sort column in user variables so that
          // periodical updates can maintain the same
          var gridUserData = jQuery("#memberRegionsList").getGridParam(
              'userData');
          gridUserData.sortColName = columnName;
          gridUserData.sortOrder = sortorder;
        },
        resizeStop : function(width, index) {
          $('#btngridIcon').click();
          refreshTheGrid($('#btngridIcon'));
        },
        gridComplete : function() {
          $(".jqgrow").css({
            cursor : 'default'
          });

          var memberRegionsList = $('#gview_memberRegionsList');
          var memberRegionsListChild = memberRegionsList
              .children('.ui-jqgrid-bdiv');

          memberRegionsListChild.unbind('jsp-scroll-x');
          memberRegionsListChild.bind('jsp-scroll-x', function(event,
              scrollPositionX, isAtLeft, isAtRight) {
            var mRList = $('#gview_memberRegionsList');
            var mRLC = mRList.children('.ui-jqgrid-hdiv').children(
                '.ui-jqgrid-hbox');
            mRLC.css("position", "relative");
            mRLC.css('right', scrollPositionX);
          });

          // change col names depend on product
          if (CONST_BACKEND_PRODUCT_GEMFIREXD == productname.toLowerCase()) {
            jQuery("#memberRegionsList").jqGrid('setLabel', 'entryCount',
                jQuery.i18n.prop('pulse-entrycount-custom'));
            jQuery("#memberRegionsList").jqGrid('setLabel', 'entrySize',
                jQuery.i18n.prop('pulse-entrysize-custom'));
          }
        }
      });
}

function refreshTheGrid(gridDiv) {
  setTimeout(function() {
    gridDiv.click();
  }, 300);
}

function refreshTheGridByToggle(gridDiv) {
  setTimeout(function() {
    gridDiv.toggle();
  }, 300);
}
