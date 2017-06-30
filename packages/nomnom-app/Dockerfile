FROM alpine:3.5

RUN apk update && apk add libstdc++ libgcc

ADD build/ /

CMD ["/nomnom-app"]
