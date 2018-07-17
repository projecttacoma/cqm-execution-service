FROM node:9-slim

RUN apt-get update && apt-get install -y git-core

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# TODO: This is needed behind corporate proxies, investigate alternatives.
RUN yarn config set "strict-ssl" false

RUN yarn install --only=production

# Bundle app source
COPY . .

EXPOSE 8081

CMD [ "yarn", "start" ]