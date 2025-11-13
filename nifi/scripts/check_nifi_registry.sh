#!/bin/bash

nifi_registry_url="${NIFI_REGISTRY_URL}"

echo "Checking NiFi Registry availability..."
curl -k -I "$nifi_registry_url/nifi-registry/" || { echo 'NiFi Registry is not reachable'; exit 1; }
echo 'NiFi Registry is reachable'
