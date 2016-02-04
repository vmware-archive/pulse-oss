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
 * This JS File is used for Data View screen
 * 
 */

// This function is the initialization function for Data View screen. It is
// making call to functions defined for different widgets used on this screen
var dataViewRegionTM;
var dataViewWritesPerSecGraph;
var dataViewReadsPerSecGraph;
var clusterDataViewRegions;
var selectedDataViewTM = "";
var memberList;

var gridRegionColHeading = 'Region Name';
var gridRegionPathColHeading = 'Region Path';
var gridWritesColHeading = 'Writes';
var gridReadsColHeading = 'Reads';
var gridWritesRateColHeading = 'Writes Rate';
var gridReadsRateColHeading = 'Reads Rate';

$(document).ready(function() {
  
  // Load Notification HTML  
  generateNotificationsPanel();

  //modify UI text as per requirement
  customizeUI();

  if (CONST_BACKEND_PRODUCT_GEMFIREXD == productname.toLowerCase()) {
    alterHtmlContainer(CONST_BACKEND_PRODUCT_GEMFIREXD);
  } else {
    alterHtmlContainer(CONST_BACKEND_PRODUCT_GEMFIRE);
  }
  
  scanPageForWidgets();
  createClusterRegionGrid(); // create empty cluster region grid
  $("#gridBlocks_Panel").hide();
  createDataViewRegion(); // create empty cluster tree map

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
    
    // Show HTML for following
    $('#subTabQueryStatistics').show();
  }else{
    // Hide HTML for following
    $('#subTabQueryStatistics').hide();

    // Show HTML for following
    
  }
  
}

// function used for creating Empty Cluster Region Tree Map for Data View Screen

function createDataViewRegion() {
  var dataVal = {
    "$area" : 1
  };
  var json = {
    "children" : {},
    "data" : dataVal,
    "id" : "root",
    "name" : "Regions"
  };

  dataViewRegionTM = new $jit.TM.Squarified(
      {
        injectInto : 'clusterRegionTM',
        levelsToShow : 1,
        titleHeight : 0,
        background : '#8c9aab',
        offset : 2,
        Label : {
          type : 'Native',
          size : 9
        },
        Node : {
          CanvasStyles : {
            shadowBlur : 0
          }
        },
        Events : {
          enable : true,
          onMouseEnter : function(node, eventInfo) {
            if (node && node.id != "root") {
              node.setCanvasStyle('shadowBlur', 7);
              node.setData('border', '#ffffff');
              dataViewRegionTM.fx.plotNode(node, dataViewRegionTM.canvas);
              dataViewRegionTM.labels.plotLabel(dataViewRegionTM.canvas, node);
            }
          },
          onMouseLeave : function(node) {
            if (node && node.id != "root") {
              node.removeData('border', '#ffffff');
              node.removeCanvasStyle('shadowBlur');
              dataViewRegionTM.plot();
            }
          },
          onClick : function(node) {
            if (node.id != "root") {
              if (selectedDataViewTM != "") {
                var previousSelNode = dataViewRegionTM.graph
                    .getNode(selectedDataViewTM);

                if(previousSelNode.data.systemRegionEntryCount == 0){
                  previousSelNode.setData('color', colorCodeForZeroEntryCountRegions);
                }else{
                  previousSelNode.setData('color', colorCodeForRegions);
                }

                dataViewRegionTM.fx.plotNode(previousSelNode,
                    dataViewRegionTM.canvas);
                dataViewRegionTM.labels.plotLabel(dataViewRegionTM.canvas,
                    previousSelNode);
              }
              node.setData('color', colorCodeForSelectedRegion);
              dataViewRegionTM.fx.plotNode(node, dataViewRegionTM.canvas);
              dataViewRegionTM.labels.plotLabel(dataViewRegionTM.canvas, node);
              var data = node.data;
              selectedDataViewTM = data.id;
              displayRegionDetails(data); // updating data of the
              // screen according to
              // the selected region
            }
          }
        },
        Tips : {
          enable : true,
          offsetX : 5,
          offsetY : 5,
          onShow : function(tip, node, isLeaf, domElement) {

            var data = node.data;
            var html = "";
            if (data.type) {
              html = "<div class=\"tip-title\"><div><div class='popupHeading'>"
                  + node.id
                  + "</div>"
                  + "<div class='popupFirstRow'><div class='popupRowBorder borderBottomZero'>"
                  + "<div class='labeltext left display-block width-45'><span class='left'>"
                  + "Type</span></div><div class='right width-55'>"
                  + "<div class='color-d2d5d7 font-size14 popInnerBlockEllipsis'>"
                  + data.type
                  + "</div>"
                  + "</div></div><div class='popupRowBorder borderBottomZero'><div class='labeltext left display-block width-45'>"
                  + "<span class='left'>" + jQuery.i18n.prop('pulse-entrycount-custom') + "</span></div><div class='right width-55'>"
                  + "<div class='color-d2d5d7 font-size14'>"
                  + data.systemRegionEntryCount
                  + "</div>"
                  + "</div></div><div class='popupRowBorder borderBottomZero'><div class='labeltext left display-block width-45'>"
                  + "<span class='left'>" + jQuery.i18n.prop('pulse-entrysize-custom') + "</span></div><div class='right width-55'>"
                  + "<div class='color-d2d5d7 font-size14'>" 
                  + data.entrySize
                  + "</div>"
                  /*+ "</div></div><div class='popupRowBorder borderBottomZero'><div class='labeltext left display-block width-45'>"
                  + "<span class='left'>Compression Codec</span></div><div class='right width-55'>"
                  + "<div class='color-d2d5d7 font-size14'>"
                  + data.compressionCodec
                  + "</div>"*/
                  + "</div></div></div></div>" + "</div>";
            } else {
              html = "<div class=\"tip-title\"><div><div class='popupHeading'>No " + jQuery.i18n.prop('pulse-regiontabletooltip-custom') + " Found</div>";
            }

            tip.innerHTML = html;
          }
        },
        onCreateLabel : function(domElement, node) {
          domElement.innerHTML = node.name;
          var style = domElement.style;
          style.cursor = 'default';
          style.border = '1px solid';

          style.background = 'none repeat scroll 0 0 #606060';
          domElement.onmouseover = function() {
            style.border = '1px solid #9FD4FF';
            style.background = 'none repeat scroll 0 0 #9FD4FF';
          };
          domElement.onmouseout = function() {
            style.border = '1px solid';
            style.background = 'none repeat scroll 0 0 #606060';
          };

        }
      });
  dataViewRegionTM.loadJSON(json);
  dataViewRegionTM.refresh();

}
// function used for creating Empty Cluster Region Grid for Data View Screen
function createClusterRegionGrid() {
  jQuery("#regionList")
      .jqGrid(
          {
            datatype : "local",
            height : 650,
            rowNum : 1000,
            colNames : [ 'Region Name', 'Type', 'Entry Count', 'Entry Size',
                         'Region Path', 'Member Count', 'Read Rates', 'Write Rates',
                         'Persistence', 'Entry Count', 'Empty Nodes', 'Data Usage',
                         'Total Data Usage', 'Memory Usage', 'Total Memory',
                         'Member Names', 'Writes', 'Reads','Off Heap Enabled',
                         'Compression Codec','HDFS Write Only' ],
            colModel : [ {
              name : 'name',
              index : 'name',
              width : 120,
              sortable : true,
              sorttype : "string"
            }, {
              name : 'type',
              index : 'type',
              width : 120,
              sortable : true,
              sorttype : "string"
            }, {
              name : 'systemRegionEntryCount',
              index : 'systemRegionEntryCount',
              width : 80,
              align : 'right',
              sortable : true,
              sorttype : "int"
            }, {
              name : 'entrySize',
              index : 'entrySize',
              width : 80,
              align : 'right',
              sortable : true,
              sorttype : "int"
            }, {
              name : 'regionPath',
              index : 'regionPath',
              hidden : true
            }, {
              name : 'memberCount',
              index : 'memberCount',
              hidden : true
            }, {
              name : 'getsRate',
              index : 'getsRate',
              hidden : true
            }, {
              name : 'putsRate',
              index : 'putsRate',
              hidden : true
            }, {
              name : 'persistence',
              index : 'persistence',
              hidden : true
            }, {
              name : 'systemRegionEntryCount',
              index : 'systemRegionEntryCount',
              hidden : true
            }, {
              name : 'emptyNodes',
              index : 'emptyNodes',
              hidden : true
            }, {
              name : 'dataUsage',
              index : 'dataUsage',
              hidden : true
            }, {
              name : 'totalDataUsage',
              index : 'totalDataUsage',
              hidden : true
            }, {
              name : 'memoryUsage',
              index : 'memoryUsage',
              hidden : true
            }, {
              name : 'totalMemory',
              index : 'totalMemory',
              hidden : true
            }, {
              name : 'memberNames',
              index : 'memberNames',
              hidden : true
            }, {
              name : 'writes',
              index : 'writes',
              hidden : true
            }, {
              name : 'reads',
              index : 'reads',
              hidden : true
            }, {
              name : 'isEnableOffHeapMemory',
              index : 'isEnableOffHeapMemory',
              hidden : true
            }, {
              name : 'compressionCodec',
              index : 'compressionCodec',
              hidden : true
            }, {
              name : 'isHDFSWriteOnly',
              index : 'isHDFSWriteOnly',
              hidden : true
            }

            ],
            userData : {"sortOrder":"asc","sortColName":"name"},
            onSortCol:function(columnName, columnIndex, sortorder) {
              // Set sort order and sort column in user variables so that
              // periodical updates can maintain the same
              var gridUserData = jQuery("#regionList").getGridParam('userData');
              gridUserData.sortColName = columnName;
              gridUserData.sortOrder = sortorder;
            },
            onSelectRow : function(rowid) {
              var row = $("#regionList").getRowData(rowid);

              // setting values
              selectedDataViewTM = row.regionPath;
              displayRegionDetails(row);
            },
            resizeStop : function(width, index) {
            	
            	var memberRegionsList = $('#gview_regionList');
    		      var memberRegionsListChild = memberRegionsList
    		          .children('.ui-jqgrid-bdiv');
    		      var api = memberRegionsListChild.data('jsp');
				      api.reinitialise();

				      $('#btngridIcon').click();
				      refreshTheGrid($('#btngridIcon'));
    	      },
    	      gridComplete : function() {
    		      $(".jqgrow").css({
    			      cursor : 'default'
    		      });

    		      var memberRegionsList = $('#gview_regionList');
    		      var memberRegionsListChild = memberRegionsList
    		          .children('.ui-jqgrid-bdiv');

    		      memberRegionsListChild.unbind('jsp-scroll-x');
    		      memberRegionsListChild.bind('jsp-scroll-x', function(event,
    		          scrollPositionX, isAtLeft, isAtRight) {
    			      var mRList = $('#gview_regionList');
    			      var mRLC = mRList.children('.ui-jqgrid-hdiv').children(
    			          '.ui-jqgrid-hbox');
    			      mRLC.css("position", "relative");
    			      mRLC.css('right', scrollPositionX);
    		      });
    		      
    		      // change col names depend on product
    		      if(CONST_BACKEND_PRODUCT_GEMFIREXD == productname.toLowerCase()){
    		        jQuery("#regionList").jqGrid('setLabel', 'name', jQuery.i18n.prop('pulse-regiontableName-custom'));
    		        jQuery("#regionList").jqGrid('setLabel', 'regionPath', jQuery.i18n.prop('pulse-regiontablePathColName-custom'));
    		        jQuery("#regionList").jqGrid('setLabel', 'getsRate', jQuery.i18n.prop('pulse-readsRate-custom'));
    		        jQuery("#regionList").jqGrid('setLabel', 'putsRate', jQuery.i18n.prop('pulse-writesRate-custom'));
    		        jQuery("#regionList").jqGrid('setLabel', 'writes', jQuery.i18n.prop('pulse-writes-custom'));
    		        jQuery("#regionList").jqGrid('setLabel', 'reads', jQuery.i18n.prop('pulse-reads-custom'));
    		        jQuery("#regionList").jqGrid('setLabel', 'systemRegionEntryCount', jQuery.i18n.prop('pulse-entrycount-custom'));
    		        jQuery("#regionList").jqGrid('setLabel', 'entrySize', jQuery.i18n.prop('pulse-entrysize-custom'));
    		      }
    	      }
          });
};

function refreshTheGrid(gridDiv) {
  setTimeout(function(){gridDiv.click();}, 300);
}

// function used for updating the screen fields on select of region from
// tree map or on load of the screen with region at 0th index
var displayRegionDetails = function(data) {
  var selectedRegion = null;
  for(var ctr=0; ctr < clusterDataViewRegions.length; ctr++){
    if(data.regionPath == clusterDataViewRegions[ctr].regionPath){
      selectedRegion = clusterDataViewRegions[ctr];
    }
  }
  
  $('.regionMembersSearchBlock').jScrollPane();
  // document.getElementById("regionName").innerHTML = selectedRegion.name;
  // document.getElementById("regionName").title = selectedRegion.name;
  document.getElementById("regionPath").innerHTML = selectedRegion.regionPath;
  document.getElementById("regionPath").title = selectedRegion.regionPath;
  document.getElementById("regionMembers").innerHTML = selectedRegion.memberCount;
  document.getElementById("regionType").innerHTML = selectedRegion.type;
  document.getElementById("regionType").title = selectedRegion.type;
  // document.getElementById("regionWrites").innerHTML = selectedRegion.writes;
  // document.getElementById("regionReads").innerHTML = selectedRegion.reads;
  document.getElementById("regionPersistence").innerHTML = selectedRegion.persistence;
  document.getElementById("regionIsEnableOffHeapMemory").innerHTML = selectedRegion.isEnableOffHeapMemory;
  // document.getElementById("regionCompressionCodec").innerHTML =
  // selectedRegion.compressionCodec;
  document.getElementById("regionIsHdfsWriteOnly").innerHTML = selectedRegion.isHDFSWriteOnly;
  document.getElementById("regionEmptyNodes").innerHTML = selectedRegion.emptyNodes;
  document.getElementById("regionEntryCount").innerHTML = applyNotApplicableCheck(selectedRegion.systemRegionEntryCount);

  if(selectedRegion.dataUsage >= 0){
    var regionDataUsage = convertBytesToMBorGB(selectedRegion.dataUsage);
    document.getElementById("regionDiskUsage").innerHTML = 
      regionDataUsage[0] + " " + regionDataUsage[1];
  }else{
    document.getElementById("regionDiskUsage").innerHTML = 
      applyNotApplicableCheck(selectedRegion.dataUsage);
  }

  $('#memoryUsageDiv').show();
  var memoryUsagePer = (selectedRegion.memoryUsage / selectedRegion.totalMemory) * 100;
  memoryUsagePer = isNaN(memoryUsagePer) ? 0 : memoryUsagePer;
  var memPer = memoryUsagePer + "%";
  document.getElementById("memoryUsage").style.width = memPer;

  memoryUsagePer = parseFloat(memoryUsagePer);
  $('#memoryUsageVal').html(memoryUsagePer.toFixed(4));

  if (selectedRegion.memoryUsage == 0) {
    document.getElementById("memoryUsed").innerHTML = "-";
    document.getElementById("memoryUsedMBSpan").innerHTML = "";
  } else
    document.getElementById("memoryUsed").innerHTML = selectedRegion.memoryUsage;
  document.getElementById("totalMemory").innerHTML = selectedRegion.totalMemory;

  memberList = selectedRegion.memberNames;
  
  applyFilterOnMembersList();

  // add filter functionality
  $('#filterMembersListBox')
      .bind("keyup", memberList, applyFilterOnMembersList);

  var sparklineOptions = {
    width : '250px',
    height : '72px',
    lineColor : '#FAB948',
    fillColor : false,
    spotRadius : 2.5,
    labelPosition : 'left',
    spotColor : false,
    minSpotColor : false,
    maxSpotColor : false,
    lineWidth : 2
  };

  var reads = selectedRegion.memoryReadsTrend;
  var diskReads = selectedRegion.diskReadsTrend;
  //var writes = selectedRegion.memoryWritesTrend;
  var writes = selectedRegion.averageWritesTrend;
  var diskWrites = selectedRegion.diskWritesTrend;
  
  // Reads trends  
  $('#readsPerSecTrend').sparkline(reads, sparklineOptions);
  $('#diskReadsPerSecTrend').sparkline(diskReads, sparklineOptions);
  
  // Writes trends
  sparklineOptions.lineColor = '#2e84bb';
  $('#writesPerSecTrend').sparkline(writes, sparklineOptions);
  $('#diskWritesPerSecTrend').sparkline(diskWrites, sparklineOptions);  

  var sumReads = 0;
  var avgReads = 0;
  if (reads.length > 0) {
    for ( var i = 0; i < reads.length; i++) {
      sumReads += parseFloat(reads[i]);
    }
    avgReads = sumReads / reads.length;
  }
  $('#currentReadsPerSec').html(applyNotApplicableCheck(avgReads.toFixed(2)));  

  var sumDiskReads = 0;
  var avgDiskReads = 0;
  if (diskReads.length > 0) {
    for ( var i = 0; i < diskReads.length; i++) {
      sumDiskReads += parseFloat(diskReads[i]);
    }
    avgDiskReads = sumDiskReads / diskReads.length;
  }
  $('#currentDiskReadsPerSec').html(
      applyNotApplicableCheck(avgDiskReads.toFixed(2)));
  
  var sumWrites = 0;
  var avgWrites = 0;
  if (writes.length > 0) {
    for ( var i = 0; i < writes.length; i++) {
      sumWrites += parseFloat(writes[i]);
    }
    avgWrites = sumWrites / writes.length;
  }
  $('#currentWritesPerSec').html(applyNotApplicableCheck(avgWrites.toFixed(2)));

  
  var sumDiskWrites = 0;
  var avgDiskWrites = 0;
  if (diskWrites.length > 0) {
    for ( var i = 0; i < diskWrites.length; i++) {
      sumDiskWrites += parseFloat(diskWrites[i]);
    }
    avgDiskWrites = sumDiskWrites / diskWrites.length;
  }
  $('#currentDiskWritesPerSec').html(
      applyNotApplicableCheck(avgDiskWrites.toFixed(2)));
};
