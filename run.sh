#!/bin/sh

# Absolute path to this script, e.g. /home/user/bin/foo.sh
SCRIPT=$(readlink -f "$0")
# Absolute path this script is in, thus /home/user/bin
SCRIPTPATH=$(dirname "$SCRIPT")

cd $SCRIPTPATH
if which node >/dev/null; then
   echo exists
else
   echo does not exist
   export PATH="$PATH:/opt/node/bin"
fi

nohup node testserver.js mynodeapp 3>&1 2>&1 1>/dev/null </dev/null &
