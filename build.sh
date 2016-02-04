#!/bin/bash

# Copyright (c) 2010-2015 Pivotal Software, Inc. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you
# may not use this file except in compliance with the License. You
# may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
# implied. See the License for the specific language governing
# permissions and limitations under the License. See accompanying
# LICENSE file.

# Set BASEDIR to be the toplevel checkout directory.
# We do this so that BASEDIR can be used elsewhere if needed
#set -xv
exec 0<&-
BASEDIR=`/usr/bin/dirname $0`
OLDPWD=$PWD
cd $BASEDIR
export BASEDIR=`/usr/bin/dirname $PWD`
cd $OLDPWD

unset CLASSPATH
export CLASSPATH

unset GEMFIRE
export GEMFIRE

if [ `uname` = "SunOS" ]; then
  # for JVM debugging
  # export JAVA_HOME=/export/avocet2/users/otisa/j2se142debug
  logfile=buildSol.log
elif [ `uname` = "Darwin" ]; then
  logfile=buildMac.log
elif [ `uname` = "Linux" ]; then
  logfile=buildLinux.log
elif [ `uname` = "AIX" ]; then
  logfile=buildAIX.log
  NO_BUILD_LOG=1
else
  echo "Defaulting to Windows build"
  # unset TERMCAP since it causes issues when used
  # with windows environment variables
  unset TERMCAP
  # suppress DOS path warnings
  if [ -z "${CYGWIN}" ]; then
    export CYGWIN="nodosfilewarning"
  else
    export CYGWIN="${CYGWIN} nodosfilewarning"
  fi

  rm -f .xbuildfailure
  cmd.exe /c .\\build.bat "$@"
  if [ -r .xbuildfailure ]; then
    read stat <.xbuildfailure
    rm -f .xbuildfailure
    exit $stat
  fi
fi

if [ -n "${JAVA_HOME}" ]; then
  export PATH="${JAVA_HOME}/bin:${PATH}"
fi
if [ -n "${ANT_HOME}" ]; then
  export PATH="${ANT_HOME}/bin:${PATH}"
fi

function logant {
#  if [[ `uname` == "SunOS" || `uname` == "Linux" || `uname` == "AIX" ]]; then
    rm -f .xbuildfailure
    (ant --noconfig "$@" || echo "$?" > .xbuildfailure ) 2>&1 | tee $logfile
    if [ -r .xbuildfailure ]; then
      read stat <.xbuildfailure
      rm -f .xbuildfailure
      exit $stat
    fi
#  else
    # cygwin tee causes hang on windows
#    $ANT_HOME/bin/ant --noconfig -DuseSSH=false "$@"
#  fi
}

echo "JAVA_HOME = $JAVA_HOME"
echo "ANT_HOME = $ANT_HOME"
echo "CLASSPATH = $CLASSPATH"
date

# ant likes to be in the directory that build.xml is in
if [[ "x$NO_BUILD_LOG" = "x" ]]; then
  logant "$@"
else
  echo "running $ANT_HOME/bin/ant "
  $ANT_HOME/bin/ant --noconfig "$@"
fi
