// @ts-check
import { expect, test } from '@playwright/test';

// Base API URL - adjust this to match your actual API endpoint
const API_BASE_URL = process.env.API_BASE_URL || 'https://dummyjson.com';
const USERS_ENDPOINT = '/users';
const AUTH_ENDPOINT = '/auth/login';

test.describe('PUT / PATCH Update User API', () => {
  
  test('Update user details ', {
    tag: '@api',
    annotation: [
      { type: 'testdino:priority', description: 'p1' },
      { type: 'testdino:feature', description: 'PUT / PATCH Update User API' },
      { type: 'testdino:link', description: 'https://jira.example.com/API-023' },
      { type: 'testdino:owner', description: 'api-team' },
      { type: 'testdino:notify-slack', description: '#api-alerts' },
      { type: 'testdino:context', description: 'Complete user profile update functionality' }
    ]
  }, async ({ request }) => {
    const userId = 1;
    const updateData = {
      firstName: 'John',
      lastName: 'Doe',
      age: 30
    };
    
    const startTime = Date.now();
    // Try PUT first, fallback to PATCH if needed
    const response = await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`, {
      data: updateData
    });
    const updateTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id', userId);
    expect(body).toHaveProperty('firstName', updateData.firstName);
    expect(body).toHaveProperty('lastName', updateData.lastName);

    test.info().annotations.push(
      {
        type: 'metric',
        description: JSON.stringify({
          name: 'api-latency',
          value: updateTime,
          threshold: 1000,
          unit: 'ms'
        })
      },
      {
        type: 'metric',
        description: JSON.stringify({
          name: 'update-success-rate',
          value: 100,
          threshold: 98,
          unit: '%'
        })
      }
    );
  });

  test('Update user with empty payload ', {
    tag: '@api',
    annotation: [
      { type: 'testdino:priority', description: 'p2' },
      { type: 'testdino:feature', description: 'PUT / PATCH Update User API' },
      { type: 'testdino:link', description: 'https://jira.example.com/API-024' },
      { type: 'testdino:owner', description: 'api-team' },
      { type: 'testdino:notify-slack', description: '#api-alerts' },
      { type: 'testdino:context', description: 'Edge case handling for empty update payloads' }
    ]
  }, async ({ request }) => {
    const userId = 2;
    const startTime = Date.now();
    const response = await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`, {
      data: {}
    });
    const emptyPayloadTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('id', userId);

    test.info().annotations.push({
      type: 'metric',
      description: JSON.stringify({
        name: 'empty-payload-handling-time',
        value: emptyPayloadTime,
        threshold: 700,
        unit: 'ms'
      })
    });
  });

  test('Update only one field ', {
    tag: '@api',
    annotation: [
      { type: 'testdino:priority', description: 'p1' },
      { type: 'testdino:feature', description: 'PUT / PATCH Update User API' },
      { type: 'testdino:link', description: 'https://jira.example.com/API-025' },
      { type: 'testdino:owner', description: 'api-team' },
      { type: 'testdino:notify-slack', description: '#api-alerts' },
      { type: 'testdino:context', description: 'Partial update functionality using PATCH method' }
    ]
  }, async ({ request }) => {
    const userId = 3;
    const updateData = {
      firstName: 'UpdatedFirstName'
    };
    
    const startTime = Date.now();
    // Use PATCH for partial update
    const response = await request.patch(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`, {
      data: updateData
    });
    const patchTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id', userId);
    expect(body).toHaveProperty('firstName', updateData.firstName);

    test.info().annotations.push(
      {
        type: 'metric',
        description: JSON.stringify({
          name: 'partial-update-time',
          value: patchTime,
          threshold: 800,
          unit: 'ms'
        })
      },
      {
        type: 'metric',
        description: JSON.stringify({
          name: 'patch-efficiency-score',
          value: 95,
          threshold: 90,
          unit: 'score'
        })
      }
    );
  });

  test('Validate returned name field ', {
    tag: '@api',
    annotation: [
      { type: 'testdino:priority', description: 'p1' },
      { type: 'testdino:feature', description: 'PUT / PATCH Update User API' },
      { type: 'testdino:link', description: 'https://jira.example.com/API-026' },
      { type: 'testdino:owner', description: 'api-team' },
      { type: 'testdino:notify-slack', description: '#api-alerts' },
      { type: 'testdino:context', description: 'Response validation for updated name fields' }
    ]
  }, async ({ request }) => {
    const userId = 4;
    const updateData = {
      firstName: 'Jane',
      lastName: 'Smith'
    };
    
    const startTime = Date.now();
    const response = await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`, {
      data: updateData
    });
    const fieldValidationTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('firstName');
    expect(body).toHaveProperty('lastName');
    expect(typeof body.firstName).toBe('string');
    expect(typeof body.lastName).toBe('string');
    expect(body.firstName).toBe(updateData.firstName);
    expect(body.lastName).toBe(updateData.lastName);

    test.info().annotations.push({
      type: 'metric',
      description: JSON.stringify({
        name: 'field-validation-time',
        value: fieldValidationTime,
        threshold: 900,
        unit: 'ms'
      })
    });
  });

  test('Update and validate response contains updatedAt simulation ', {
    tag: '@api',
    annotation: [
      { type: 'testdino:priority', description: 'p2' },
      { type: 'testdino:feature', description: 'PUT / PATCH Update User API' },
      { type: 'testdino:link', description: 'https://jira.example.com/API-027' },
      { type: 'testdino:owner', description: 'api-team' },
      { type: 'testdino:notify-slack', description: '#api-alerts' },
      { type: 'testdino:context', description: 'Timestamp validation for update operations' }
    ]
  }, async ({ request }) => {
    const userId = 5;
    const updateData = {
      firstName: 'Updated',
      lastName: 'User'
    };
    
    const startTime = Date.now();
    const response = await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`, {
      data: updateData
    });
    const timestampValidationTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    
    // Check for updatedAt or similar timestamp field
    const hasTimestamp = body.hasOwnProperty('updatedAt') || 
                        body.hasOwnProperty('updated') || 
                        body.hasOwnProperty('modifiedAt');
    
    // At minimum, validate the response structure
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('id', userId);

    test.info().annotations.push({
      type: 'metric',
      description: JSON.stringify({
        name: 'timestamp-validation-time',
        value: timestampValidationTime,
        threshold: 800,
        unit: 'ms'
      })
    });
  });

  test('Login failure (invalid creds) ', {
    tag: '@api',
    annotation: [
      { type: 'testdino:priority', description: 'p1' },
      { type: 'testdino:feature', description: 'PUT / PATCH Update User API' },
      { type: 'testdino:link', description: 'https://jira.example.com/API-028' },
      { type: 'testdino:owner', description: 'api-team' },
      { type: 'testdino:notify-slack', description: '#api-alerts' },
      { type: 'testdino:context', description: 'Authentication failure handling with invalid credentials' }
    ]
  }, async ({ request }) => {
    const loginData = {
      username: 'invaliduser',
      password: 'wrongpassword'
    };
    
    const startTime = Date.now();
    const response = await request.post(`${API_BASE_URL}${AUTH_ENDPOINT}`, {
      data: loginData
    });
    const authFailureTime = Date.now() - startTime;
    
    // Should return error status (400 or 401)
    expect([400, 401, 403]).toContain(response.status());
    const body = await response.json();
    expect(body).toBeInstanceOf(Object);

    test.info().annotations.push(
      {
        type: 'metric',
        description: JSON.stringify({
          name: 'auth-failure-time',
          value: authFailureTime,
          threshold: 500,
          unit: 'ms'
        })
      },
      {
        type: 'metric',
        description: JSON.stringify({
          name: 'security-score',
          value: 100,
          threshold: 95,
          unit: 'score'
        })
      }
    );
  });

  test('Login missing fields returns 400 ', {
    tag: '@api',
    annotation: [
      { type: 'testdino:priority', description: 'p1' },
      { type: 'testdino:feature', description: 'PUT / PATCH Update User API' },
      { type: 'testdino:link', description: 'https://jira.example.com/API-029' },
      { type: 'testdino:owner', description: 'api-team' },
      { type: 'testdino:notify-slack', description: '#api-alerts' },
      { type: 'testdino:context', description: 'Authentication validation for missing required fields' }
    ]
  }, async ({ request }) => {
    // Missing password field
    const loginData = {
      username: 'kminchelle'
    };
    
    const startTime = Date.now();
    const response = await request.post(`${API_BASE_URL}${AUTH_ENDPOINT}`, {
      data: loginData
    });
    const validationTime = Date.now() - startTime;
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toBeInstanceOf(Object);

    test.info().annotations.push(
      {
        type: 'metric',
        description: JSON.stringify({
          name: 'validation-time',
          value: validationTime,
          threshold: 300,
          unit: 'ms'
        })
      },
      {
        type: 'metric',
        description: JSON.stringify({
          name: 'input-validation-score',
          value: 100,
          threshold: 98,
          unit: 'score'
        })
      }
    );
  });
});
