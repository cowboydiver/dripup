#!/bin/zsh
echo "Key: $OPENCAGE_API_KEY"
curl "https://api.opencagedata.com/geocode/v1/json?q=Copenhagen,%20Denmark&key=$OPENCAGE_API_KEY"
