# Pin to specific node version for building/running
ARG NODE_IMAGE=23.11.1-alpine

###################
# BUILD FOR PRODUCTION
###################

FROM node:${NODE_IMAGE} AS build
WORKDIR /src/app

# Copy package files and .npmrc
# COPY --chown=node:node ./backend/package*.json ./
# RUN ls -l
# COPY --chown=node:node ./.npmrc ./

# Copy source code
COPY --chown=node:node ./backend .
# COPY --chown=node:node ./backend/.npmrc ./
# Set NODE_ENV environment variable
ENV NODE_ENV=production

# Install dependencies and build
RUN npm install --legacy-peer-deps && \ 
    npm install -g typescript && \
    npm run tsc

# COPY --chown=node:node ./backend/env.json ./release/env.json
# COPY --chown=node:node ./backend/variables ./release/variables
# COPY --chown=node:node ./backend/certs ./release/certs
# COPY --chown=node:node ./backend/node_modules ./release/node_modules
COPY --chown=node:node ./backend/environments ./release/environments

###################
# PRODUCTION STAGE
###################

FROM node:${NODE_IMAGE} AS production

WORKDIR /src/app
# Copy only the necessary files from the build stage
COPY --chown=node:node --from=build ./src/app/node_modules ./node_modules
COPY --chown=node:node --from=build ./src/app/release .

USER node
EXPOSE 8081

CMD ["node", "main.js"]
 
