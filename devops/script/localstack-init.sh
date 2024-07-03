#!/bin/bash

set -ex
echo "Initializing localstack"

awslocal s3 mb s3://incircl
awslocal sqs create-queue --queue-name my-app-queue
awslocal ses verify-email-identity --email-address app@demo.com

awslocal dynamodb create-table \
    --table-name printers \
    --key-schema AttributeName=id,KeyType=HASH \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --billing-mode PAY_PER_REQUEST \
    --region eu-central-1 

echo "coucou" 

echo "Initializing localstack end"