#!/bin/sh
kill -9 `ps aux | grep mynodeapp|grep -v grep|awk '{print $2}'`
