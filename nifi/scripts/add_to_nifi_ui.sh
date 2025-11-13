#!/bin/bash

set -e

# Check arguments
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <flow_id> <bucket_id>"
    exit 1
fi

FLOW_ID=$1
BUCKET_ID=$2
NIFI_URL="${NIFI_URL}"
NIFI_REGISTRY_URL="${NIFI_REGISTRY_URL}"
REGISTRY_ID="${NIFI_REGISTRY_ID}"

# Step 1: Get token
echo "Authenticating..."
TOKEN=$(curl -s -X POST \
  "${NIFI_URL}/nifi-api/access/token" \
  -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
  --data "username=${NIFI_USERNAME}&password=${NIFI_PASSWORD}" \
  --compressed --insecure)

if [ -z "$TOKEN" ]; then
  echo "Failed to authenticate"
  exit 1
fi

echo "Token acquired."

# Step 2: Get latest version of the flow
echo "Fetching latest version..."
LATEST_VERSION=$(curl -s --insecure -H "Authorization: Bearer $TOKEN" \
  "${NIFI_REGISTRY_URL}/nifi-registry-api/buckets/${BUCKET_ID}/flows/${FLOW_ID}/versions" \
  -H 'Content-Type: application/json' | jq -r '.[0].version')

if [ -z "$LATEST_VERSION" ]; then
    echo "Failed to fetch latest version."
    exit 1
fi

echo "Latest version is $LATEST_VERSION"

# Step 3: Get root process group ID
ROOT_PG_ID=$(curl -s --insecure -H "Authorization: Bearer $TOKEN" \
  "${NIFI_URL}/nifi-api/flow/process-groups/root" \
  -H 'Content-Type: application/json' | jq -r '.processGroupFlow.id')

echo "Root process group ID: $ROOT_PG_ID"

# Step 4: Check if the flow already exists on canvas
echo "Checking if versioned flow is already on canvas..."
EXISTING_PG_ID=$(curl -s --insecure -H "Authorization: Bearer $TOKEN" \
  "${NIFI_URL}/nifi-api/flow/process-groups/${ROOT_PG_ID}" \
  -H 'Content-Type: application/json' | jq -r \
  --arg FLOW_ID "$FLOW_ID" '.processGroupFlow.flow.processGroups[] | select(.component.versionControlInformation.flowId == $FLOW_ID) | .component.id')

if [ -n "$EXISTING_PG_ID" ]; then
    echo "Flow already exists on canvas (Process Group ID: $EXISTING_PG_ID)"
    
    # Step 5: Upgrade the flow
    echo "Upgrading existing flow to version $LATEST_VERSION..."
    curl -s --insecure -X PUT "${NIFI_URL}/nifi-api/versions/process-groups/${EXISTING_PG_ID}" \
      -H "Authorization: Bearer $TOKEN" \
      -H 'Content-Type: application/json' \
      -d "{
        \"versionControlInformation\": {
            \"registryId\": \"$REGISTRY_ID\",
            \"bucketId\": \"$BUCKET_ID\",
            \"flowId\": \"$FLOW_ID\",
            \"version\": $LATEST_VERSION
        }
    }"

    echo "Flow upgraded successfully."
else
    echo "Flow not found on canvas. Importing..."

    # Step 6: Import the flow for the first time
    curl -s --insecure -X POST "${NIFI_URL}/nifi-api/process-groups/${ROOT_PG_ID}/template-instance" \
      -H "Authorization: Bearer $TOKEN" \
      -H 'Content-Type: application/json' \
      -d "{
        \"originX\": 0.0,
        \"originY\": 0.0,
        \"versionedFlow\": {
            \"registryId\": \"$REGISTRY_ID\",
            \"bucketId\": \"$BUCKET_ID\",
            \"flowId\": \"$FLOW_ID\",
            \"version\": $LATEST_VERSION
        }
    }"

    echo "Flow imported to canvas successfully."
fi
