#!/bin/bash

bucket_name="$1"
nifi_registry_url="${NIFI_REGISTRY_URL}"

# Fetch NiFi Registry Buckets
echo "Fetching NiFi Registry Buckets..."
response=$(curl --silent --insecure --location "$nifi_registry_url/nifi-registry-api/buckets")
echo "$response" | jq -r '.[] | "\(.name | ascii_downcase):\(.identifier)"' > buckets.txt
cat buckets.txt

# Check if Bucket Exists
bucket_name_lower=$(echo "$bucket_name" | tr '[:upper:]' '[:lower:]')
bucket_id=$(grep "^$bucket_name_lower:" buckets.txt | cut -d ':' -f 2 | xargs)
if [ -n "$bucket_id" ]; then
  echo "Bucket $bucket_name_lower exists with ID $bucket_id"
  echo "bucket_id=$bucket_id" >> $GITHUB_ENV
else
  echo "Bucket $bucket_name_lower does not exist"
  echo "bucket_id=" >> $GITHUB_ENV
fi

# Create Bucket if Not Exists
if [ -z "$bucket_id" ]; then
  echo "Creating bucket $bucket_name_lower..."
  response=$(curl --silent --insecure --location --request POST "$nifi_registry_url/nifi-registry-api/buckets" \
    --header 'Content-Type: application/json' \
    --data-raw "{\"name\":\"$bucket_name_lower\"}")
  echo "Created bucket response: $response"
  echo "$response" | jq '.'
  bucket_id=$(echo "$response" | jq -r '.identifier')
  echo "bucket_id=$bucket_id" >> $GITHUB_ENV
fi
