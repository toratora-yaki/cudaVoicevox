FROM node:alpine

# 必要なビルドツールとPythonをインストール
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    gcc \
    libtool \
    autoconf \
    automake \
    opus \
    opus-dev \
    && ln -sf python3 /usr/bin/python

WORKDIR /usr/app
COPY ./ /usr/app

# 依存関係のインストール
RUN apk update && \
    apk add --no-cache ffmpeg && \
    npm install

CMD [ "npm","start" ]

EXPOSE 50021
EXPOSE 80