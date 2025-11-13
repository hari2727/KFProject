# -----------------------------------------------------------------------------
# Build Arguments
# -----------------------------------------------------------------------------
ARG VERSION=20
ARG BASE_IMAGE=kfydigital.jfrog.io/kf1-docker-dev-local/kf-one/hardened-nginx:1.0.2
ARG ENVIRONMENT=dev

# -----------------------------------------------------------------------------
# Stage 1: Build the frontend application using Node.js
# -----------------------------------------------------------------------------
FROM node:${VERSION} AS build-env

# Set working directory
WORKDIR /app

# Copy source code and Nginx config
COPY frontend/ .
COPY frontend/nginx.conf nginx.conf

# Install dependencies and remove sensitive config
RUN npm install --legacy-peer-deps && rm -f .npmrc

# Additional quality checks
# RUN npm run lint:debug
# RUN npm run lint:fix
# RUN npm run coverage

# Build the tarc app
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Final runtime image with hardened Nginx
# -----------------------------------------------------------------------------
FROM ${BASE_IMAGE} AS runtime-env

ARG ENVIRONMENT=dev

# Copy built frontend files
COPY --from=build-env /app/dist /app/tarc/
COPY --from=build-env /app/dist/kfhub_app/assets /app/assets/
COPY --from=build-env /app/dist/kfhub_app/languages /app/lib/languages

# COPY --from=build-env /app/dist/ /assets

# Copy Nginx config
COPY --from=build-env /app/nginx.conf /nginx.conf