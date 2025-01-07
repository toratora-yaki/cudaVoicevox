FROM node:21

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    gcc \
    libtool \
    autoconf \
    automake \
    libopus-dev \
    && ln -sf python3 /usr/bin/python

WORKDIR /usr/app
COPY ./ /usr/app

# 依存関係のインストール
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    npm install

CMD [ "npm","start" ]

EXPOSE 50021
EXPOSE 80