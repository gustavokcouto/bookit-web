#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

DOCKERNAME=bookit_functional_tests

cleanup () {
  docker-compose -p $DOCKERNAME kill > /dev/null 2>&1
  docker-compose -p $DOCKERNAME rm -f > /dev/null 2>&1
}

awsparam () {
  echo `aws ssm get-parameters --names $1 --with-decryption --output text | cut -f 4`
}

trap 'cleanup ; printf "${RED}Tests Failed For Unexpected Reasons${NC}\n"' HUP INT QUIT PIPE TERM

export BOOKITUSER=$(awsparam BUILDIT_REGULAR_USER_NAME)
export BOOKITPASSWD=$(awsparam BUILDIT_REGULAR_USER_PASSWORD)
export CLOUD_CONFIG=$(awsparam CLOUD_CONFIG)
export BUILDIT_SECRET=$(awsparam BUILDIT_SECRET)

cd $(dirname "$(cd -P -- "$(dirname -- "$0")" && pwd -P)")

docker-compose -f docker-compose.testcafe.yml -p $DOCKERNAME up -d > /dev/null 2>&1

TEST_EXIT_CODE=`docker wait bookit_testcafe`
docker logs bookit_testcafe

cleanup

cd - > /dev/null 2>&1

exit $TEST_EXIT_CODE