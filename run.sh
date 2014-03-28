#!/bin/sh
nohup node testserver.js mynodeapp 3>&1 2>&1 1>/dev/null </dev/null &


