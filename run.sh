#!/bin/sh
if which node >/dev/null; then
   echo exists
else
   echo does not exist
   export PATH="$PATH:/opt/node/bin"
fi

nohup node testserver.js mynodeapp 3>&1 2>&1 1>/dev/null </dev/null &


