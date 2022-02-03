#!/bin/bash
# Needed :
# - PHP session ID : $CODINSA_PHPSESS
# - submission token (can be found in submission page form) : $CODINSA_SUBTOKEN
# - project root directory : CODINSA_ROOTDIR

FOLDER=`dirname $1`

curl -v -X POST -H "Cookie: PHPSESSID=$CODINSA_PHPSESS" \
  --data-urlencode "form%5Blanguage%5D=14" \
  --data-urlencode "form%5B_token%5D=$CODINSA_SUBTOKEN" \
  --data-urlencode "form%5Bcode%5D@$CODINSA_ROOTDIR/target/target.js" \
  https://codinsa.org/qualifications/code/`cat $FOLDER/id.txt`

