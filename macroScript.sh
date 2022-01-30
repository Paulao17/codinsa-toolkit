#!/bin/bash
# Should be provided/are needed :
# - The source file
# - The custom lib directory
# - The target directory (create if needed)
# - The archive directory 

# Check if parameters are correct
[ ! $1 ] && echo Missing file argument && exit 1
[ ! -f $1 ] && echo First argument is not a file. && exit 1
[ ! $CODINSA_ROOTDIR ] || [ ! -d $CODINSA_ROOTDIR ] && echo Root directory is not specified in CODINSA_ROOTDIR && exit 1

# Clear target directory
rm $CODINSA_ROOTDIR/target/*

# Create custom lib, target and archive directory if needed
mkdir -p $CODINSA_ROOTDIR/lib
mkdir -p $CODINSA_ROOTDIR/target
mkdir -p $CODINSA_ROOTDIR/archives

# Copy source file and tests
cp $1 $CODINSA_ROOTDIR/target/

# Inject custom libs, fail if can't be found
while read line; do
	if [[ "${line:0:1}" = ">" ]] ;then  # If line starts with injection symbol, then inject.
		[ -f $CODINSA_ROOTDIR/lib/${line:1}.js ] && cat $CODINSA_ROOTDIR/lib/${line:1}.js 
	else
		echo "$line"  # output rest of the file
	fi
done < $1 > $CODINSA_ROOTDIR/target/target.js

# Copy file to archive dir. Date file
cp $CODINSA_ROOTDIR/target/target.js $CODINSA_ROOTDIR/archives/target-`date --iso-8601=seconds`.js || echo archive cp failed

# Plug tests on stdin, compare stdout with expected results
# Tbh this doesn't look very nice
echo Plugged
cat `dirname $1`/input0.txt
echo
echo into $1 and got
cat `dirname $1`/input0.txt | node $CODINSA_ROOTDIR/target/target.js
echo
echo Expected
cat `dirname $1`/input1.txt
echo
echo # separate runs
echo Plugged
cat `dirname $1`/input2.txt
echo
echo into $1 and got
cat `dirname $1`/input2.txt | node $CODINSA_ROOTDIR/target/target.js
echo
echo Expected
cat `dirname $1`/input3.txt
echo

exit 0

