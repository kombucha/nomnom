FROM alpine:3.5

RUN apk update && apk add libstdc++ libgcc

ADD dist/ /

CMD ["/nomnom-app"]
