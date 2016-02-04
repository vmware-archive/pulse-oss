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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.pivotal.gemfire.tools.pulse.internal.data.Cluster;
import com.pivotal.gemfire.tools.pulse.internal.data.Repository;
import com.pivotal.gemfire.tools.pulse.internal.util.StringUtils;

/**
 * Class MemberGatewayHubService
 * 
 * This class contains implementations of getting Gateway Receivers and Senders
 * details of Cluster Member.
 * 
 * @since version 7.5
 */
@Component
@Service("MemberGatewayHub")
@Scope("singleton")
public class MemberGatewayHubService implements PulseService {

  public JSONObject execute(final HttpServletRequest request) throws Exception {

    // get cluster object
    Cluster cluster = Repository.get().getCluster();

    // json object to be sent as response
    JSONObject responseJSON = new JSONObject();

    try {

      JSONObject requestDataJSON = new JSONObject(
          request.getParameter("pulseData"));
      String memberName = requestDataJSON.getJSONObject("MemberGatewayHub")
          .getString("memberName");

      Cluster.Member clusterMember = cluster.getMember(StringUtils
          .makeCompliantName(memberName));

      if (clusterMember != null) {
        // response
        // get gateway receiver
        Cluster.GatewayReceiver gatewayReceiver = clusterMember
            .getGatewayReceiver();

        Boolean isGateway = false;

        if (gatewayReceiver != null) {
          responseJSON.put("isGatewayReceiver", true);
          responseJSON.put("listeningPort", gatewayReceiver.getListeningPort());
          responseJSON
              .put("linkTroughput", gatewayReceiver.getLinkThroughput());
          responseJSON.put("avgBatchLatency",
              gatewayReceiver.getAvgBatchProcessingTime());
        } else {
          responseJSON.put("isGatewayReceiver", false);
        }

        // get gateway senders
        Cluster.GatewaySender[] gatewaySenders = clusterMember
            .getMemberGatewaySenders();

        if (gatewaySenders.length > 0) {
          isGateway = true;
        }
        responseJSON.put("isGatewaySender", isGateway);
        // Senders
        JSONArray gatewaySendersJsonList = new JSONArray();

        for (Cluster.GatewaySender gatewaySender : gatewaySenders) {
          JSONObject gatewaySenderJSON = new JSONObject();
          gatewaySenderJSON.put("id", gatewaySender.getId());
          gatewaySenderJSON.put("queueSize", gatewaySender.getQueueSize());
          gatewaySenderJSON.put("status", gatewaySender.getStatus());
          gatewaySenderJSON.put("primary", gatewaySender.getPrimary());
          gatewaySenderJSON.put("senderType", gatewaySender.getSenderType());
          gatewaySenderJSON.put("batchSize", gatewaySender.getBatchSize());
          gatewaySenderJSON.put("PersistenceEnabled",
              gatewaySender.getPersistenceEnabled());

          gatewaySendersJsonList.put(gatewaySenderJSON);
        }
        // senders response
        responseJSON.put("gatewaySenders", gatewaySendersJsonList);

        Map<String,Cluster.Region> clusterRegions = cluster.getClusterRegions();

        List<Cluster.Region> clusterRegionsList = new ArrayList<Cluster.Region>();
        clusterRegionsList.addAll(clusterRegions.values());
        
        JSONArray regionsList = new JSONArray();

        for (Cluster.Region region : clusterRegionsList) {
          if (region.getWanEnabled()) {
            JSONObject regionJSON = new JSONObject();
            regionJSON.put("name", region.getName());
            regionsList.put(regionJSON);
          }
        }
        responseJSON.put("regionsInvolved", regionsList);
      }
      // Send json response
      return responseJSON;
    } catch (JSONException e) {
      throw new Exception(e);
    }
  }
}
