#!/usr/bin/env node

// Test script to simulate frontend registration request
const fetch = require('node-fetch');

async function testRegistration() {
    const userData = {
        email: "frontend-test@example.com",
        password: "testpass123",
        full_name: "Frontend Test User",
        phone: "1234567890"
    };

    console.log('Sending registration request with data:', userData);

    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers));

        const data = await response.text();
        console.log('Response body:', data);

        if (!response.ok) {
            console.error('Request failed');
        } else {
            console.log('Request succeeded');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testRegistration();
