#!/bin/sh

find . -type f -name '*.js' -exec sed -i "s|backend-endpoint|${BACKEND_URL}|" {} +

nginx -g 'daemon off;'
