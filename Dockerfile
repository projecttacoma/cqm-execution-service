FROM node:22-slim

RUN apt-get update && apt-get install -y ca-certificates curl
# Create the folder where you will store the MITRE SSL certificates
RUN mkdir -p /usr/local/share/ca-certificates
# Download the SSL certificates
RUN curl -L -o /usr/local/share/ca-certificates/MITRE-BA-NPE-CA-3-1.crt "http://pki.mitre.org/MITRE%20BA%20NPE%20CA-3(1).crt"
RUN curl -L -o /usr/local/share/ca-certificates/MITRE-BA-ROOT.crt "http://pki.mitre.org/MITRE%20BA%20ROOT.crt"
RUN curl -L -o /usr/local/share/ca-certificates/MITRE-NPE-CA1.crt "http://pki.mitre.org/MITRE-NPE-CA1.crt"
RUN curl -L -o /usr/local/share/ca-certificates/ZScaler_Root.crt "http://pki.mitre.org/ZScaler_Root.crt"
# Rebuild the system-wide SSL certificates bundle
RUN /usr/sbin/update-ca-certificates

ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

# Install app dependencies, including ssl_setup if it exists
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json docker_ssl_setup.sh* ./

# Run a custom ssl_setup script if available
RUN ./docker_ssl_setup.sh; exit 0

RUN apt-get update && apt-get install -y git-core

# Bundle app source
COPY . /usr/src/app

RUN useradd -m app
RUN chown -R app:app /usr/src/app
USER app

WORKDIR /usr/src/app

RUN yarn install --only=production

# clean up mitre certs from image
USER root
RUN rm -rf /usr/local/share/ca-certificates && /usr/sbin/update-ca-certificates

USER app

EXPOSE 8081

CMD [ "yarn", "start" ]
