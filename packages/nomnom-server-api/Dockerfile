FROM alpine:3.5

RUN apk update && apk add libstdc++ libgcc

RUN mkdir /images
ADD build/nomnom-api /

# Env stuff
ADD .env /
ENV IMAGES_PATH /images

CMD ["/nomnom-api"]
