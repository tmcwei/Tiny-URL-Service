FROM node:6.3.1

RUN mkdir -p /tiny

WORKDIR /tiny

ADD . /tiny  
# put all file in .(current dir(app)) to docker container /tiny dir

RUN cd /tiny && npm install

EXPOSE 3000

CMD ["node", "/tiny/server.js"]


