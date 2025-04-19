#!/bin/sh

# Recreate config file at runtime
cat > /usr/share/nginx/html/config.js <<EOF
window.APP_CONFIG = {
    API_URL: "${API_URL}",
    NODE_ENV: "${NODE_ENV}"
};
EOF
