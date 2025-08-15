#!/bin/bash

# Use the access token from the refresh response
ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODk5MGI1MjJmMTNkOTFjZGJhNmZmMGMiLCJlbWFpbCI6InRlc3QyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzU0ODYyMTg2LCJ0eXBlIjoiYWNjZXNzIn0.e7QVqQVM4CvIo89fVH6LJpn96amrrfTJhW6k93Lf2Qw"

echo "Testing profile endpoint..."
curl -X GET http://localhost:8000/api/v1/users/profile \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
