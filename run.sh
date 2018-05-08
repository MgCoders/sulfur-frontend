#!/bin/sh

/bin/sed -i "s|http://localhost:8080|${BASE_URL}|" /usr/share/nginx/html/api.config.chunk.js
find . -type f -name '*.js' -exec sed -i "s|backend-endpoint|${BACKEND_URL}|" {} +

nginx -g 'daemon off;'
