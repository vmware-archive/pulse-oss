rem Copyright (c) 2010-2015 Pivotal Software, Inc. All rights reserved.

rem Licensed under the Apache License, Version 2.0 (the "License"); you
rem may not use this file except in compliance with the License. You
rem may obtain a copy of the License at

rem http://www.apache.org/licenses/LICENSE-2.0

rem Unless required by applicable law or agreed to in writing, software
rem distributed under the License is distributed on an "AS IS" BASIS,
rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
rem implied. See the License for the specific language governing
rem permissions and limitations under the License. See accompanying
rem LICENSE file.

@echo off
set scriptdir=%~dp0
set BASEDIR=%scriptdir:\buildfiles\=%
if exist "%BASEDIR%\build.xml" @goto baseok
echo Could not determine BASEDIR location
verify other 2>nul
goto done
:baseok

set GEMFIRE=

set PATHOLD=%PATH%
if defined JAVA_HOME (
  set PATH=%JAVA_HOME%\bin;%PATH%
)
if defined ANT_HOME (
  set PATH=%ANT_HOME%\bin;%PATH%
)

echo JAVA_HOME = %JAVA_HOME%
echo ANT_HOME = %ANT_HOME%
echo CLASSPATH = %CLASSPATH%
echo %DATE% %TIME%

echo running %ANT_HOME%\bin\ant.bat
call %ANT_HOME%\bin\ant.bat %*
if not defined ERRORLEVEL set ERRORLEVEL=0

:done
echo %ERRORLEVEL% > .xbuildfailure
set ERRORLEVEL=
if defined PATHOLD set PATH=%PATHOLD%
