#!/bin/bash

flow_id="$1"
bucket_id="$2"
file_pattern="$3"
nifi_registry_url="${NIFI_REGISTRY_URL}"

# Define the NiFi Registry URL for uploading the flow
nifi_flow_url="$nifi_registry_url/nifi-registry-api/buckets/$bucket_id/flows/$flow_id/versions/import"

# Loop through all files matching the file pattern
for file in nifi/$file_pattern; do
  # Check if the file exists
  if [ ! -f "$file" ]; then
    echo "Warning: File $file not found."
    continue
  fi

  # Print file content for debugging
  echo "Uploading file: $file"
  echo "File content:"
  cat "$file"

  # Use `PUT` method for updating the flow (change to `POST` if required by the API)
  response=$(curl --silent --insecure --location --request POST "$nifi_flow_url" \
    --header 'Content-Type: application/json' \
    --data-binary @"$file")

  if [ $? -eq 0 ]; then
    echo "Successfully uploaded $file"
    echo "Response: $response"
  else
    echo "Failed to upload $file"
    exit 1
  fi
done
