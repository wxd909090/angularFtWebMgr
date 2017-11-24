#!/bin/bash
if [ $# -gt 0 ]
then
	prjName="$1"
else
	prjName="FtWebMgr"
fi

now=$(date +"%Y-%m-%d-%H-%S")
prjDir=/data/www/$prjName
if [ ! -d $prjDir ];then
    mkdir -p $prjDir
fi
cd $prjDir
tar zcvf /data/backup/${prjName}.${now}.tar.gz .
rm -rf  $prjDir/*
tar xvf /data/release/${prjName}.tar.gz -C /data/www/${prjName}

cp $prjDir/env.js.release $prjDir/env.js
