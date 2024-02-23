FROM alpine

RUN apk add nodejs npm ffmpeg git

RUN git clone https://github.com/PerformanC/NodeLink

COPY patches /patches

WORKDIR /NodeLink

RUN git apply /patches/0001-custom-patch.patch

RUN npm i --force

ENTRYPOINT [ "npm", "start" ]
