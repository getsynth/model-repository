#!/bin/bash

DB_PORT=27017
DB_NAME=shopify
CONTAINER_NAME=mongo-api-mock-backend

######### Checks #########
# Check deps
which synth > /dev/null || { echo "Error: synth not installed." ; exit 1 ; }
which docker > /dev/null || { echo "Error: docker not installed." ; exit 1 ; }

######### Initialization #########

cd "$( dirname "${BASH_SOURCE[0]}" )"

# 1. Init DB service
container_id=$(docker run -d --name $CONTAINER_NAME -p $DB_PORT:$DB_PORT mongo)

# 2. Generate Data
synth generate shopify --to mongodb://localhost:$DB_PORT/$DB_NAME --size 1000

# 3. Run API Mock server
npm install && npm run serve

echo "Server running! Press any key to continue..."
read

######### Cleanup #########

docker rm -f "${container_id}"