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

import java.util.logging.Level;

/**
 * Class PulseConfig
 * 
 * PulseConfig is used for configuring Pulse application.
 * 
 * @since 7.0.1
 */
public class PulseConfig {

  // Log file name
  private String LogFileName;

  // Log file location
  private String LogFileLocation;

  // Log file size in MBs
  private int logFileSize;

  // Number of cyclic log files
  private int logFileCount;

  // Log messages date pattern
  private String logDatePattern;

  // Log level
  private Level logLevel;

  // Flag for appending log messages
  private Boolean logAppend;

  public PulseConfig() {
    this.LogFileName = PulseConstants.PULSE_LOG_FILE_NAME;
    this.LogFileLocation = PulseConstants.PULSE_LOG_FILE_LOCATION;
    this.logFileSize = PulseConstants.PULSE_LOG_FILE_SIZE;
    this.logFileCount = PulseConstants.PULSE_LOG_FILE_COUNT;
    this.logDatePattern = PulseConstants.PULSE_LOG_MESSAGE_DATE_PATTERN;
    this.logLevel = PulseConstants.PULSE_LOG_LEVEL;
    this.logAppend = PulseConstants.PULSE_LOG_APPEND;
  }

  public String getLogFileName() {
    return LogFileName;
  }

  public void setLogFileName(String logFileName) {
    this.LogFileName = logFileName;
  }

  public String getLogFileLocation() {
    return LogFileLocation;
  }

  public void setLogFileLocation(String logFileLocation) {
    this.LogFileLocation = logFileLocation;
  }

  public String getLogFileFullName() {
    return this.LogFileLocation + "/" + this.LogFileName;
  }

  public int getLogFileSize() {
    return logFileSize;
  }

  public void setLogFileSize(int logFileSize) {
    this.logFileSize = logFileSize;
  }

  public int getLogFileCount() {
    return logFileCount;
  }

  public void setLogFileCount(int logFileCount) {
    this.logFileCount = logFileCount;
  }

  public String getLogDatePattern() {
    return logDatePattern;
  }

  public void setLogDatePattern(String logDatePattern) {
    this.logDatePattern = logDatePattern;
  }

  public Level getLogLevel() {
    return logLevel;
  }

  public void setLogLevel(Level logLevel) {
    this.logLevel = logLevel;
  }

  public Boolean getLogAppend() {
    return logAppend;
  }

  public void setLogAppend(Boolean logAppend) {
    this.logAppend = logAppend;
  }

}
