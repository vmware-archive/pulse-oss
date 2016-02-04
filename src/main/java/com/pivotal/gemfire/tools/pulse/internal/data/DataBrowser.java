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

package com.pivotal.gemfire.tools.pulse.internal.data;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;
import java.util.Properties;
import java.util.ResourceBundle;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.pivotal.gemfire.tools.pulse.internal.log.PulseLogWriter;
import com.pivotal.gemfire.tools.pulse.internal.util.StringUtils;

/**
 * Class DataBrowser This class contains Data browser functionalities for
 * managing queries and histories.
 * 
 * @since version 7.5.Beta 2013-03-25
 */
public class DataBrowser {

  private final PulseLogWriter LOGGER = PulseLogWriter.getLogger();
  private final ResourceBundle resourceBundle = Repository.get()
      .getResourceBundle();

  private final String queryHistoryFile = PulseConstants.PULSE_QUERY_HISTORY_FILE_LOCATION
      + System.getProperty("file.separator")
      + PulseConstants.PULSE_QUERY_HISTORY_FILE_NAME;

  private SimpleDateFormat simpleDateFormat = new SimpleDateFormat(
      PulseConstants.PULSE_QUERY_HISTORY_DATE_PATTERN);

  /**
   * addQueryInHistory method adds user's query into query history file
   * 
   * @param userId
   *          Logged in User's Id
   * @param queryText
   *          Query text to execute
   */
  public boolean addQueryInHistory(String queryText, String userId) {

    boolean operationStatus = false;
    if (StringUtils.isNotNullNotEmptyNotWhiteSpace(queryText)
        && StringUtils.isNotNullNotEmptyNotWhiteSpace(userId)) {

      // Fetch all queries from query log file
      Properties properties = fetchAllQueriesFromFile();

      // Add query in properties
      properties.setProperty(generateQueryKey(userId), queryText);

      // Store queries/properties in file back
      operationStatus = storeQueriesInFile(properties);

    }

    return operationStatus;
  }

  /**
   * deleteQueryById method deletes query from query history file
   * 
   * @param queryId
   *          Unique Id of Query to be deleted
   * @return boolean
   */
  public boolean deleteQueryById(String queryId) {

    boolean operationStatus = false;

    if (StringUtils.isNotNullNotEmptyNotWhiteSpace(queryId)) {
      // Fetch all queries from query log file
      Properties properties = fetchAllQueriesFromFile();

      // Remove query in properties
      properties.remove(queryId);

      // Store queries in file
      operationStatus = storeQueriesInFile(properties);
    }

    return operationStatus;
  }

  /**
   * getQueryHistoryByUserId method reads and lists out the queries from history
   * file
   * 
   * @param userId
   *          Logged in User's Id
   * @throws JSONException
   */
  public JSONArray getQueryHistoryByUserId(String userId) throws JSONException {

    JSONArray queryList = new JSONArray();

    if (StringUtils.isNotNullNotEmptyNotWhiteSpace(userId)) {

      // Fetch all queries from query log file
      Properties properties = fetchAllQueriesFromFile();

      // Traversing all properties and list out user's queries
      Enumeration<Object> enumerator = properties.keys();
      while (enumerator.hasMoreElements()) {
        String queryId = (String) enumerator.nextElement();
        if (queryId.startsWith(userId)) {
          String strQueryDate = queryId.substring(queryId.indexOf(".") + 1,
              queryId.length());
          Date queryDate = new Date(Long.valueOf(strQueryDate));

          JSONObject queryItem = new JSONObject();
          queryItem.put("queryId", queryId);
          queryItem.put("queryText", properties.getProperty(queryId));
          queryItem.put("queryDateTime", simpleDateFormat.format(queryDate));

          queryList.put(queryItem);
        }
      }
    }

    return queryList;
  }

  /**
   * generateQueryKey method generates unique id based upon user id and current
   * time.
   * 
   * @param userId
   *          Logged in User's Id
   * @return String
   */
  private String generateQueryKey(String userId) {
    return userId + "." + System.currentTimeMillis();
  }

  /**
   * generateQueryKey method fetches queries from query history file
   * 
   * @return Properties A collection queries in form of key and values
   */
  private Properties fetchAllQueriesFromFile() {
    InputStream inputStream = null;
    Properties properties = new Properties();

    try {
      inputStream = new FileInputStream(queryHistoryFile);
      if (inputStream != null) {
        // Load properties from input stream
        properties.load(inputStream);
      }
    } catch (FileNotFoundException e) {
      if (LOGGER.infoEnabled()) {
        LOGGER.info(resourceBundle
            .getString("LOG_MSG_DATA_BROWSER_QUERY_HISTORY_FILE_NOT_FOUND")
            + " : " + e.getMessage());
      }
    } catch (IOException e) {
      if (LOGGER.infoEnabled()) {
        LOGGER.info(e.getMessage());
      }
    } catch (Exception e) {
      if (LOGGER.infoEnabled()) {
        LOGGER.info(e.getMessage());
      }
    } finally {
      // Close input stream
      if (inputStream != null) {
        try {
          inputStream.close();
        } catch (IOException e) {
          if (LOGGER.infoEnabled()) {
            LOGGER.info(e.getMessage());
          }
        }
      }
    }
    return properties;
  }

  /**
   * generateQueryKey method stores queries in query history file.
   * 
   * @return Boolean true is operation is successful, false otherwise
   * @param properties
   *          a collection queries in form of key and values
   */
  private boolean storeQueriesInFile(Properties properties) {
    boolean operationStatus = false;
    FileOutputStream fileOut = null;

    File file = new File(queryHistoryFile);
    try {
      fileOut = new FileOutputStream(file);
      properties.store(fileOut, resourceBundle
          .getString("LOG_MSG_DATA_BROWSER_QUERY_HISTORY_FILE_DESCRIPTION"));
      operationStatus = true;
    } catch (FileNotFoundException e) {

      if (LOGGER.infoEnabled()) {
        LOGGER.info(resourceBundle
            .getString("LOG_MSG_DATA_BROWSER_QUERY_HISTORY_FILE_NOT_FOUND")
            + " : " + e.getMessage());
      }
    } catch (IOException e) {
      if (LOGGER.infoEnabled()) {
        LOGGER.info(e.getMessage());
      }
    } finally {
      if (fileOut != null) {
        try {
          fileOut.close();
        } catch (IOException e) {
          if (LOGGER.infoEnabled()) {
            LOGGER.info(e.getMessage());
          }
        }
      }
    }
    return operationStatus;
  }

}
