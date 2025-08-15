#!/bin/bash

echo "Testing registration..."
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "password": "testpassword123",
    "full_name": "Test User 2",
    "phone": "1234567890"
  }' | jq .
