#!/bin/bash

workspace=$(dirname $(pwd))
log_path= ${workspace}/logs/;

echo ${workspace}

echo ${log_path}

echo 'start kurento for 8443'

pm2 start ${workspace}/server.js -n mykurento --merge-logs -l ${log_path}pm2.log -o ${log_path}out.log -e ${log_path}err.log