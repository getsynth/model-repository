#!/bin/bash

###### Start MongoDB ######

echo "starting mongodb..."
nohup sh -c mongod > out.log 2>&1 &
sleep 5

###### Generate Data to Mongo ######
echo "generating data to mongodb..."

/root/.local/bin/synth init || exit 1;
/root/.local/bin/synth generate shopify --to mongodb://localhost:27017/shopify --size 10 || exit 1

###### Start Web Server ######
npm run serve
