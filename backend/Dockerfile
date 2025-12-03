FROM trafex/php-nginx:3.6.0

ARG UID=1000
ARG GID=984

ENV UID $UID
ENV GID $GID

USER root

RUN apk add --no-cache \
    php83-pdo \
    php83-pgsql \
    php83-pdo_pgsql \
    php83-sqlite3 \
    php83-pdo_sqlite

RUN mkdir /.composer && \
    chown $UID:$GID /.composer && \
    chown $UID:$GID /run

COPY docker/composer-install.sh /composer-install.sh

RUN /composer-install.sh

COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY docker/php.ini /etc/php83/conf.d/50-setting.ini

USER $UID
