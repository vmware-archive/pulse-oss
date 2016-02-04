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

/**
 * This JS File is used for Cluster Details screen
 * 
 */

// This function is the initialization function for Cluster Details screen. It
// is
// making call to functions defined for different widgets used on this screen
$(document).ready(function() {

  // Load Notification HTML  
  generateNotificationsPanel();

  // modify UI text as per requirement
  customizeUI();

  if (CONST_BACKEND_PRODUCT_GEMFIREXD == productname.toLowerCase()) {
    alterHtmlContainer(CONST_BACKEND_PRODUCT_GEMFIREXD);

    // "ClusterDetails" service callback handler
    getClusterDetailsBack = getClusterDetailsGemFireXDBack;

    // "ClusterKeyStatistics" service callback handler
    getClusterKeyStatisticsBack = getClusterKeyStatisticsGemFireXDBack;

  } else {
    alterHtmlContainer(CONST_BACKEND_PRODUCT_GEMFIRE);
    
    // "ClusterDetails" service callback handler
    getClusterDetailsBack = getClusterDetailsGemFireBack;

    // "ClusterKeyStatistics" service callback handler
    getClusterKeyStatisticsBack = getClusterKeyStatisticsGemFireBack;
  }

  scanPageForWidgets();
  // creating blank cluster tree map
  createClusterTreeMap();
  $('#chartBlocks_Panel').hide();
  // creating blank cluster member grid
  createMemberGrid();
  // creating blank R Graph for all members associated with defined cluster
  createClusteRGraph();

  $.ajaxSetup({
    cache : false
  });
});

/*
 * Function to show and hide html elements/components based upon whether product
 * is GemFireXD or GemFire 
 */
function alterHtmlContainer(prodname){
  if(CONST_BACKEND_PRODUCT_GEMFIREXD == prodname.toLowerCase()){
    // Hide HTML for following
    $('#clusterUniqueCQsContainer').hide();
    $('#SubscriptionsContainer').hide();
    $('#queriesPerSecContainer').hide();
    
    // Show HTML for following
    $('#subTabQueryStatistics').show();
    $('#TxnCommittedContainer').show();
    $('#TxnRollbackContainer').show(); 
  }else{
    // Hide HTML for following
    $('#subTabQueryStatistics').hide();
    $('#TxnCommittedContainer').hide();
    $('#TxnRollbackContainer').hide();

    // Show HTML for following
    $('#clusterUniqueCQsContainer').show();
    $('#SubscriptionsContainer').show();
    $('#queriesPerSecContainer').show();
  }
  
}

// Start: This functions are used for selecting tabs for Cluster TreeMap, RGraph
// and Grid
function tabGraph() {
  flagActiveTab = "MEM_R_GRAPH"; // MEM_R_GRAPH, MEM_TREE_MAP, MEM_GRID
  updateRGraphFlags();

  // populateMemberRGraph using pulseUpdate
  var pulseData = new Object();
  pulseData.ClusterMembersRGraph = "";
  ajaxPost("pulse/pulseUpdate", pulseData, translateGetClusterMemberRGraphBack);

  $('#gridBlocks_Panel').hide();
  $('#chartBlocks_Panel').hide();
  $('#graphBlocks_Panel').show();
  $('#rGraph').show();
  $('#btngridIcon').addClass('gridIcon');
  $('#btngridIcon').removeClass('gridIconActive');

  $('#btnchartIcon').addClass('chartIcon');
  $('#btnchartIcon').removeClass('chartIconActive');

  $('#btngraphIcon').addClass('graphIconActive');
  $('#btngraphIcon').removeClass('graphIcon');
}

function tabClusterGrid() {
  flagActiveTab = "MEM_GRID"; // MEM_R_GRAPH, MEM_TREE_MAP, MEM_GRID

  // populateMemberGrid using pulseUpdate
  var pulseData = new Object();
  pulseData.ClusterMembers = ""; // getClusterMembersBack
  ajaxPost("pulse/pulseUpdate", pulseData, translateGetClusterMemberBack);

  $('#rGraph').hide();
  tabGridNew('gview_memberList');
}

function tabTreeMap() {
  flagActiveTab = "MEM_TREE_MAP"; // MEM_R_GRAPH, MEM_TREE_MAP, MEM_GRID

  // populateMemberTreeMap using pulseUpdate
  var pulseData = new Object();
  pulseData.ClusterMembers = "";
  ajaxPost("pulse/pulseUpdate", pulseData, translateGetClusterMemberBack);

  $('#rGraph').hide();
  tabChart();
  clusterMemberTreeMap.loadJSON(globalJson);
  clusterMemberTreeMap.refresh();
}

function translateGetClusterMemberBack(data) {
  getClusterMembersBack(data.ClusterMembers);
}

function translateGetClusterMemberRGraphBack(data) {
  getClusterMembersRGraphBack(data.ClusterMembersRGraph);
}

// End: This functions are used for selecting tabs for Cluster TreeMap, RGraph
// and Grid

// function used for creating blank TreeMap for member's on Cluster Details
// Screen
function createClusterTreeMap() {
  var dataVal = {
    "$area" : 1,
    "initial" : true
  };
  var json = {
    "children" : {},
    "data" : dataVal,
    "id" : "root",
    "name" : "Members"
  };

  clusterMemberTreeMap = new $jit.TM.Squarified(
      {

        injectInto : 'GraphTreeMap',
        levelsToShow : 1,
        titleHeight : 0,
        background : '#a0c44a',
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

              clusterMemberTreeMap.fx.plotNode(node,
                  clusterMemberTreeMap.canvas);
              clusterMemberTreeMap.labels.plotLabel(
                  clusterMemberTreeMap.canvas, node);
            }
          },
          onMouseLeave : function(node) {
            if (node) {
              node.removeData('border', '#ffffff');
              node.removeCanvasStyle('shadowBlur');
              clusterMemberTreeMap.plot();
            }
          },
          onClick : function(node) {
            if (!node.data.initial) {
              location.href = 'MemberDetails.html?member=' + node.id
                  + '&memberName=' + node.name;
            }
          }
        },

        Tips : {
          enable : true,
          offsetX : 5,
          offsetY : 5,
          onShow : function(tip, node, isLeaf, domElement) {
            var html = "";
            var data = node.data;
            if (!data.initial) {
              html = "<div class=\"tip-title\"><div><div class='popupHeading'>"
                  + node.name
                  + "</div>"
                  + "<div class='popupFirstRow'><div class='popupRowBorder borderBottomZero'>"
                  + "<div class='labeltext left display-block width-70'><span class='left'>CPU Usage</span></div><div class='right width-30'>"
                  + "<div class='color-d2d5d7 font-size14'>"
                  + data.cpuUsage
                  + "<span class='fontSize15'>%</span></span></div>"
                  + "</div></div>"
                  + "<div class='popupRowBorder borderBottomZero'>"
                  + "<div class='labeltext left display-block width-70'>"
                  + "<span class='left'>Memory Usage</span></div><div class='right width-30'>"
                  + "<div class='color-d2d5d7 font-size14'>"
                  + data.heapUsage
                  + "<span class='font-size15 paddingL5'>MB</span>"
                  + "</div></div></div>"
                  + "<div class='popupRowBorder borderBottomZero'>"
                  + "<div class='labeltext left display-block width-70'>"
                  + "<span class='left'>Load Avg.</span></div><div class='right width-30'>"
                  + "<div class='color-d2d5d7 font-size14'>"
                  + applyNotApplicableCheck(data.loadAvg)
                  + "</div></div></div>"
                  + "<div class='popupRowBorder borderBottomZero'>"
                  + "<div class='labeltext left display-block width-70'>"
                  + "<span class='left'>Threads</span></div><div class='right width-30'>"
                  + "<div class='color-d2d5d7 font-size14'>"
                  + data.threads
                  + "</div></div></div>" /*
                  + "<div class='popupRowBorder borderBottomZero'>"
                  + "<div class='labeltext left display-block width-70'>"
                  + "<span class='left'>Sockets</span></div><div class='right width-30'>"
                  + "<div class='color-d2d5d7 font-size14'>"
                  + applyNotApplicableCheck(data.sockets)
                  + "</div></div></div>" */
                  + "<div class='popupRowBorder borderBottomZero'>"
                  + "<div class='labeltext left display-block width-70'>"
                  + "<span class='left'>Open FDs</span></div><div class='right width-30'>"
                  + "<div class='color-d2d5d7 font-size14'>"
                  + applyNotApplicableCheck(data.openFDs)
                  + "</div></div></div>"
                  + "</div></div></div>";
            } else {
              html = "<div class=\"tip-title\"><div><div class='popupHeading'>Loading</div>";
            }
            tip.innerHTML = html;
          }
        },
        onCreateLabel : function(domElement, node) {
          domElement.style.opacity = 0.01;

        }
      });
  clusterMemberTreeMap.loadJSON(json);
  clusterMemberTreeMap.refresh();
}

// function used for creating blank grids for member list for Cluster Details
// Screen

function createMemberGrid() {
  
  jQuery("#memberList").jqGrid(
      {
        datatype : "local",
        height : 360,
        width : 740,
        rowNum : 200,
        shrinkToFit : false,
        colNames : [ 'ID', 'Name', 'Host', 'Heap Usage (MB)', 'CPU Usage (%)',
            'Uptime', 'Clients', 'CurrentHeapSize', 'Load Avg', 'Threads',
            'Sockets', 'Open FDs'],
        colModel : [
            {
              name : 'memberId',
              index : 'memberId',
              width : 170,
              sorttype : "string",
              cellattr : function(rowId, val, rowObject, cm, rdata) {
                return generateGridRowTooltip(rowObject);
              },
              sortable : true
            },
            {
              name : 'name',
              index : 'name',
              width : 150,
              cellattr : function(rowId, val, rowObject, cm, rdata) {
                return generateGridRowTooltip(rowObject);
              },
              sortable : true,
              sorttype : "string"
            },
            {
              name : 'host',
              index : 'host',
              width : 100,
              cellattr : function(rowId, val, rowObject, cm, rdata) {
                return generateGridRowTooltip(rowObject);
              },
              sortable : true,
              sorttype : "string"
            },
            {
              name : 'heapUsage',
              index : 'heapUsage',
              width : 100,
              align : 'right',
              cellattr : function(rowId, val, rowObject, cm, rdata) {
                return generateGridRowTooltip(rowObject);
              },
              sortable : true,
              sorttype : "float"
            },
            {
              name : 'cpuUsage',
              index : 'cpuUsage',
              align : 'right',
              width : 100,
              cellattr : function(rowId, val, rowObject, cm, rdata) {
                return generateGridRowTooltip(rowObject);
              },
              sortable : true,
              sorttype : "float"
            },
            {
              name : 'uptime',
              index : 'uptime',
              width : 100,
              cellattr : function(rowId, val, rowObject, cm, rdata) {
                return generateGridRowTooltip(rowObject);
              },
              sortable : true,
              sorttype : "int"
            },
            {
              name : 'clients',
              index : 'clients',
              width : 100,
              align : 'right',
              cellattr : function(rowId, val, rowObject, cm, rdata) {
                return generateGridRowTooltip(rowObject);
              },
              sortable : true,
              sorttype : "int"
            }, {
              name : 'currentHeapUsage',
              index : 'currentHeapUsage',
              align : 'center',
              width : 0,
              hidden : true
            }, {
              name : 'loadAvg',
              index : 'loadAvg',
              align : 'center',
              width : 0,
              hidden : true
            }, {
              name : 'threads',
              index : 'threads',
              align : 'center',
              width : 0,
              hidden : true
            }, {
              name : 'sockets',
              index : 'sockets',
              align : 'center',
              width : 0,
              hidden : true
            }, {
              name : 'openFDs',
              index : 'openFDs',
              align : 'center',
              width : 0,
              hidden : true
            } ],
        userData : {
          "sortOrder" : "asc",
          "sortColName" : "name"
        },
        onSortCol : function(columnName, columnIndex, sortorder) {
          // Set sort order and sort column in user variables so that
          // periodical updates can maintain the same
          var gridUserData = jQuery("#memberList").getGridParam('userData');
          gridUserData.sortColName = columnName;
          gridUserData.sortOrder = sortorder;
        },
        onSelectRow : function(rowid) {
          var member = rowid.split("&");
          location.href = 'MemberDetails.html?member=' + member[0]
              + '&memberName=' + member[1];
        },
        resizeStop : function(width, index) {

          var memberRegionsList = $('#gview_memberList');
          var memberRegionsListChild = memberRegionsList
              .children('.ui-jqgrid-bdiv');
          var api = memberRegionsListChild.data('jsp');
          api.reinitialise();

          memberRegionsList = $('#gview_memberList');
          memberRegionsListChild = memberRegionsList
              .children('.ui-jqgrid-bdiv');
          memberRegionsListChild.unbind('jsp-scroll-x');
          memberRegionsListChild.bind('jsp-scroll-x', function(event,
              scrollPositionX, isAtLeft, isAtRight) {
            var mRList = $('#gview_memberList');
            var mRLC = mRList.children('.ui-jqgrid-hdiv').children(
                '.ui-jqgrid-hbox');
            mRLC.css("position", "relative");
            mRLC.css('right', scrollPositionX);
          });
          
          $('#btngridIcon').click();
          refreshTheGrid($('#btngridIcon'));
        },
        gridComplete : function() {
          $(".jqgrow").css({
            cursor : 'default'
          });

          var memberRegionsList = $('#gview_memberList');
          var memberRegionsListChild = memberRegionsList
              .children('.ui-jqgrid-bdiv');

          memberRegionsListChild.unbind('jsp-scroll-x');
          memberRegionsListChild.bind('jsp-scroll-x', function(event,
              scrollPositionX, isAtLeft, isAtRight) {
            var mRList = $('#gview_memberList');
            var mRLC = mRList.children('.ui-jqgrid-hdiv').children(
                '.ui-jqgrid-hbox');
            mRLC.css("position", "relative");
            mRLC.css('right', scrollPositionX);
          });
        }
      });
}

function refreshTheGrid(gridDiv) {
  setTimeout(function(){gridDiv.click();}, 300);
}

function generateGridRowTooltip(rowObject) {
  return 'title="Name ' + rowObject.name + ' , CPU Usage ' + rowObject.cpuUsage
      + ' , Memory Usage ' + rowObject.currentHeapUsage + ' , Load Avg. '
      + applyNotApplicableCheck(rowObject.loadAvg) + ' , Threads '
      + rowObject.threads + ' , open FDs '
      + applyNotApplicableCheck(rowObject.openFDs) + '"';
}
