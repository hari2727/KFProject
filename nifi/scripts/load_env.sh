#!/bin/bash

# Print a message indicating the environment
echo "Loading environment variables for environment: $1"

# Define the path to the environment file
env_file="nifi/variables/$1.env"

# Check if the environment file exists
if [ -f "$env_file" ]; then
  echo "Found environment file: $env_file"
  
  # Export environment variables from the file
  set -a
  source "$env_file"
  set +a

  # Ensure necessary variables are loaded
  if [ -z "$NIFI_URL" ]; then
    echo "Error: NIFI_URL is missing from $env_file."
    exit 1
  fi

  if [ -z "$NIFI_REGISTRY_URL" ]; then
    echo "Error: NIFI_REGISTRY_URL is missing from $env_file."
    exit 1
  fi

  if [ -z "$NIFI_REGISTRY_ID" ]; then
    echo "Error: NIFI_REGISTRY_ID is missing from $env_file."
    exit 1
  fi

  # Export these variables to GitHub Actions environment
  echo "NIFI_URL=$NIFI_URL" >> $GITHUB_ENV
  echo "NIFI_REGISTRY_URL=$NIFI_REGISTRY_URL" >> $GITHUB_ENV
  echo "NIFI_REGISTRY_ID=$NIFI_REGISTRY_ID" >> $GITHUB_ENV

else
  echo "Error: Environment file $env_file not found."
  exit 1
fi
