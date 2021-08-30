#!/bin/bash

DB_PORT=27017
DB_NAME=shopify
CONTAINER_NAME=mongo-api-mock-backend
CONTAINER_ID=0

######### Checks #########
# Check deps
which synth > /dev/null || { echo "Error: synth not installed." ; exit 1 ; }
which docker > /dev/null || { echo "Error: docker not installed." ; exit 1 ; }

######### Initialization #########

function cleanup()
{
    docker rm -f "${CONTAINER_ID}"
}

trap cleanup EXIT

cd "$( dirname "${BASH_SOURCE[0]}" )" || exit

# 1. Init DB service
CONTAINER_ID=$(docker run -d --name $CONTAINER_NAME -p $DB_PORT:$DB_PORT mongo)

# 2. Generate Data
synth generate shopify --to mongodb://localhost:$DB_PORT/$DB_NAME --size 1000

# 3. Run API Mock server
npm install && npm run serve