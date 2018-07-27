FROM node:9-slim

# Add MITRE Soft Certs, comment this out if building outside the mitre network
ADD http://pki.mitre.org/MITRE%20BA%20Root.crt /usr/local/share/ca-certificates/
ADD http://pki.mitre.org/MITRE%20BA%20NPE%20CA-1.crt /usr/local/share/ca-certificates/
ADD http://pki.mitre.org/MITRE%20BA%20NPE%20CA-3.crt /usr/local/share/ca-certificates/
RUN cat /usr/local/share/ca-certificates/MITRE*.crt >> /usr/local/share/ca-certificates/MITRE_Cert_Chain.txt
RUN update-ca-certificates
RUN yarn config set cafile /usr/local/share/ca-certificates/MITRE_Cert_Chain.txt


RUN apt-get update && apt-get install -y git-core

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn install --only=production

# Bundle app source
COPY . .

EXPOSE 8081

CMD [ "yarn", "start" ]