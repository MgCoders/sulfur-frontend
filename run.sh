#!/bin/sh

find . -type f -name '*.js' -exec sed -i "s|backend-endpoint|${BACKEND_URL}|" {} +

find . -type f -name '*.html' -exec sed -i "s|ico-url-show|${ICO_URL}|" {} +

nginx -g 'daemon off;'
