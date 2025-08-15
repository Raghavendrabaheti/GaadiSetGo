#!/bin/bash

# Extract the refresh token from the previous registration
REFRESH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODk5MGI1MjJmMTNkOTFjZGJhNmZmMGMiLCJlbWFpbCI6InRlc3QyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzU1NDY1MTcwLCJ0eXBlIjoicmVmcmVzaCJ9.K3zx4cHaFyBsB-27BPjBDTMDNaLshGtyYO_WF0PY6P4"

echo "Testing refresh token..."
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $REFRESH_TOKEN" | jq .
