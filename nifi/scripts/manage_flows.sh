#!/bin/bash

bucket_id="$1"
flow_name="$2"
nifi_registry_url="${NIFI_REGISTRY_URL}"

# List Flows in Bucket
echo "Fetching flows for bucket ID $bucket_id..."
response=$(curl --silent --insecure --location "$nifi_registry_url/nifi-registry-api/buckets/$bucket_id/flows")
if echo "$response" | jq empty 2>/dev/null; then
  echo "Valid JSON response received"
else
  echo "Invalid JSON response received"
  exit 1
fi
echo "$response" | jq -r '.[] | "\(.name | ascii_downcase):\(.identifier)"' > flows.txt
cat flows.txt

# Check if Flow Exists
flow_name_lower=$(echo "$flow_name" | tr '[:upper:]' '[:lower:]')
flow_id=$(grep "^$flow_name_lower:" flows.txt | cut -d ':' -f 2 | xargs)
if [ -n "$flow_id" ]; then
  echo "Flow $flow_name_lower exists with ID $flow_id"
  echo "flow_id=$flow_id" >> $GITHUB_ENV
else
  echo "Flow $flow_name_lower does not exist"
  echo "flow_id=" >> $GITHUB_ENV
fi

# Create Flow if Not Exists
if [ -z "$flow_id" ]; then
  echo "Creating flow $flow_name_lower..."
  response=$(curl --silent --insecure --location --request POST "$nifi_registry_url/nifi-registry-api/buckets/$bucket_id/flows" --header 'Content-Type: application/json' --data-raw "{\"name\":\"$flow_name_lower\"}")
  echo "Created flow response: $response"
  echo "$response" | jq '.'
  flow_id=$(echo "$response" | jq -r '.identifier')
  echo "flow_id=$flow_id" >> $GITHUB_ENV
fi
