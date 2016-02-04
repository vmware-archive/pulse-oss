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
package com.pivotal.gemfire.tools.pulse.testbed;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class TestBed {
  
  private String fileName=null;
  PropFileHelper propertiesFile =null;
  GemFireDistributedSystem ds = null;
  
  public TestBed(String fileName) throws FileNotFoundException, IOException{
    this.fileName = fileName;
    propertiesFile = new PropFileHelper(fileName);
    ds = new GemFireDistributedSystem("t1", propertiesFile.getProperties());
  }
  
  
  public TestBed(String fileName,boolean flag) throws FileNotFoundException, IOException{    
    ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
    InputStream inputStream = classLoader.getResourceAsStream("testbed.properties");
    System.out.println("Inputstream : " + inputStream);
    Properties properties = new Properties();
    try {
      properties.load(inputStream);
    } catch (IOException e) {
      e.printStackTrace();
      throw new RuntimeException(e);
    }    
    this.fileName = fileName;
    propertiesFile = new PropFileHelper(properties);
    ds = new GemFireDistributedSystem("t1", propertiesFile.getProperties());
  }
  
  
  public String getBrowserForDriver(){
    return propertiesFile.readKey("browser");
  }
  
  public String getBrowserVersionForDriver(String browser){
    return propertiesFile.readKey("browserVersion");
  }
  
  public GemFireDistributedSystem getRootDs(){
    return ds;
  }  

}
