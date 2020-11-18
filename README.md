<h1> VMware has ended active development of this project, this repository will no longer be updated.</h1><br>## Introduction

GemFire Pulse is a monitoring application that provides a web-based dashboard for monitoring vital, real-time health and performance of GemFire/GemFireXD clusters. The statistics monitored include region puts/gets, memory, CPU, disk space, uptime, connections, critical notifications.

## Building from source

Requirements:

JDK8 installation
Apache Ant >= 1.8. If installing from Linux distribution repositories then install "ant", "ant-optional" and "ant-contrib" packages.

Build pulse product war: ./build.sh build-product

Build everything including pulse war: ./build.sh build-all

Clean: ./build.sh clean

Run just ./build.sh to see all the available targets which should be self-explanatory.
