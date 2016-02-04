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

package com.pivotal.gemfire.tools.pulse.internal.service;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.pivotal.gemfire.tools.pulse.internal.controllers.PulseController;
import com.pivotal.gemfire.tools.pulse.internal.data.Cluster;
import com.pivotal.gemfire.tools.pulse.internal.data.PulseConstants;
import com.pivotal.gemfire.tools.pulse.internal.data.Repository;
import com.pivotal.gemfire.tools.pulse.internal.util.TimeUtils;

/**
 * Class ClusterMemberService
 * 
 * This class contains implementations of getting Cluster Member's details
 * 
 * @since version 7.5
 */
@Component
// @Service("ClusterMember")
@Service("ClusterMembers")
@Scope("singleton")
public class ClusterMemberService implements PulseService {

  private final String HEAP_USAGE = "heapUsage";

  public JSONObject execute(final HttpServletRequest request) throws Exception {

    // get cluster object
    Cluster cluster = Repository.get().getCluster();

    // json object to be sent as response
    JSONObject responseJSON = new JSONObject();

    Cluster.Member[] clusterMembersList = cluster.getMembers();

    // create members json
    List<JSONObject> memberListJson = new ArrayList<JSONObject>();
    try {
      for (Cluster.Member clusterMember : clusterMembersList) {
        JSONObject memberJSON = new JSONObject();
        // getting members detail
        memberJSON.put("memberId", clusterMember.getId());
        memberJSON.put("name", clusterMember.getName());
        memberJSON.put("host", clusterMember.getHost());

        DecimalFormat df2 = new DecimalFormat(
            PulseConstants.DECIMAL_FORMAT_PATTERN);

        long usedHeapSize = cluster.getUsedHeapSize();
        long currentHeap = clusterMember.getCurrentHeapSize();
        if (usedHeapSize > 0) {
          float heapUsage = ((float) currentHeap / (float) usedHeapSize) * 100;
          memberJSON
              .put(this.HEAP_USAGE, Double.valueOf(df2.format(heapUsage)));
        } else {
          memberJSON.put(this.HEAP_USAGE, 0);
        }
        Float currentCPUUsage = clusterMember.getCpuUsage();

        memberJSON.put("cpuUsage", Float.valueOf(df2.format(currentCPUUsage)));
        memberJSON.put("currentHeapUsage", clusterMember.getCurrentHeapSize());
        memberJSON.put("isManager", clusterMember.isManager());
        memberJSON.put("uptime",
            TimeUtils.convertTimeSecondsToHMS(clusterMember.getUptime()));
        memberJSON.put("loadAvg", clusterMember.getLoadAverage());
        memberJSON.put("sockets", clusterMember.getTotalFileDescriptorOpen());
        memberJSON.put("openFDs", clusterMember.getTotalFileDescriptorOpen());
        memberJSON.put("threads", clusterMember.getNumThreads());

        // Number of member clients
        if (PulseController.getPulseProductSupport().equalsIgnoreCase(
            PulseConstants.PRODUCT_NAME_GEMFIREXD)){
          memberJSON.put("clients", clusterMember.getNumGemFireXDClients());
        }else{
          memberJSON.put("clients", clusterMember.getMemberClientsHMap().size());
        }
        memberJSON.put("queues", clusterMember.getQueueBacklog());

        memberListJson.add(memberJSON);
      }
      // clucter's Members
      responseJSON.put("members", memberListJson);
      // Send json response
      return responseJSON;
    } catch (JSONException e) {
      throw new Exception(e);
    }
  }
}
