#!/bin/bash
# Should be provided/are needed :
# - The source file
# - The custom lib directory
# - The target directory (create if needed)
# - The archive directory 

# Check if parameters are correct
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
		[ -f $CODINSA_ROOTDIR/lib/${line:1}.js ] && cat $CODINSA_ROOTDIR/lib/${line:1}.js || echo unknown lib ${line:1} && exit 1
	else
		echo $line  # output rest of the file
	fi
done < $1 > $CODINSA_ROOTDIR/target/target.js

# Copy file to archive dir. Date file


# Copy file to "latest" directory (for easy access)


# Plug tests on stdin, compare stdout with expected results

exit 0

