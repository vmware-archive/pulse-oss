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

// DataBrowserQueryHistory.js
// updateQueryHistory()
function updateQueryHistory(action,queryId) {
  
  requestData = {
    action:action,
    queryId:queryId
  };

  $.getJSON("pulse/dataBrowserQueryHistory", requestData, function(data) {
    
    var queries = new Array();
    if(data.queryHistory != undefined && data.queryHistory != null){
      queries = data.queryHistory;
    }
    var refHistoryConatiner = $("#detailsHistory");
    var queryListHTML = "";
    if(queries.length == 0){
      // no queries found
      queryListHTML = "No Query Found";
    }else{
      queries.sort(dynamicSort("queryDateTime", "desc"));
      for(var i=0; i<queries.length && i<20; i++){
        // add query item
        queryListHTML += "" +
          "<div class=\"container\">" +
            "<div class=\"wrap\">" +
              "<div class=\"read-more\">" +
                "<a href=\"#\" class=\"remore_plus\">&nbsp;</a>" +
              "</div>" +
              "<div class=\"remove\">" +
                "<a href=\"#\" onclick=\"updateQueryHistory('delete','"+ queries[i].queryId +"');\">&nbsp;</a>" +
              "</div>" +
              "<div class=\"wrapHistoryContent\"  ondblclick=\"queryHistoryItemClicked(this);\">" + queries[i].queryText +
              "</div>" +
              "<div class=\"dateTimeHistory\">" + queries[i].queryDateTime +
              "</div>" +
            "</div>" +
          "</div>";
      }
    }
    
    refHistoryConatiner.html(queryListHTML);
    //$('.queryHistoryScroll-pane').jScrollPane();/*Custome scroll*/    
    
  }).error(resErrHandler);
   
}

// This function displays error if occurred 
function resErrHandler(data){
  // Check for unauthorized access
  if (data.status == 401) {
    // redirect user on Login Page
    window.location.href = "Login.html?error=UNAUTH_ACCESS";
  }else{
    console.log(data);
  }
};

// This function is called when any query from history list is double clicked 
function queryHistoryItemClicked(divElement){
  // Set selected query text into Query Editor
  $('#dataBrowserQueryText').val(divElement.innerHTML);
  //Enable Execute button
  onQueryTextChange();
  // fire a click event on document to hide history panel
  $(document).click();
  
  
  
}
