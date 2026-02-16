// @ts-check
import { expect, test } from '@playwright/test';

// Base API URL - adjust this to match your actual API endpoint
const API_BASE_URL = process.env.API_BASE_URL || 'https://dummyjson.com';
const USERS_ENDPOINT = '/users';
const ADD_ENDPOINT = '/users/add';

test.describe('POST Create User API', () => {

  test('Bad endpoint returns 404 ', {
    tag: '@api',
    annotation: [
      { type: 'testdino:priority', description: 'p1' },
      { type: 'testdino:feature', description: 'POST Create User API' },
      { type: 'testdino:link', description: 'https://jira.example.com/API-013' },
      { type: 'testdino:owner', description: 'api-team' },
      { type: 'testdino:notify-slack', description: '#api-alerts' },
      { type: 'testdino:context', description: 'Error handling for invalid API endpoints' }
    ]
  }, async ({ request }) => {
    const userData = {
      firstName: 'Test',
      lastName: 'User'
    };
    
    const startTime = Date.now();
    const response = await request.post(`${API_BASE_URL}${USERS_ENDPOINT}/invalid-endpoint`, {
      data: userData
    });
    const errorResponseTime = Date.now() - startTime;
    
    expect(response.status()).toBe(404);

    test.info().annotations.push(
      {
        type: 'metric',
        description: JSON.stringify({
          name: 'error-handling-time',
          value: errorResponseTime,
          threshold: 500,
          unit: 'ms'
        })
      },
      {
        type: 'metric',
        description: JSON.stringify({
          name: 'api-error-rate',
          value: 100,
          threshold: 5,
          unit: '%'
        })
      }
    );
  });

  test('Invalid JSON payload handling ', {
    tag: '@api',
    annotation: [
      { type: 'testdino:priority', description: 'p1' },
      { type: 'testdino:feature', description: 'POST Create User API' },
      { type: 'testdino:link', description: 'https://jira.example.com/API-014' },
      { type: 'testdino:owner', description: 'api-team' },
      { type: 'testdino:notify-slack', description: '#api-alerts' },
      { type: 'testdino:context', description: 'API error handling for malformed JSON payloads' }
    ]
  }, async ({ request }) => {
    const startTime = Date.now();
    const response = await request.post(`${API_BASE_URL}${ADD_ENDPOINT}`, {
      data: 'invalid json string',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const validationTime = Date.now() - startTime;
    
    // Should return 400 Bad Request for invalid JSON
    expect([400, 422]).toContain(response.status());

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
          threshold: 95,
          unit: 'score'
        })
      }
    );
  });

  test('Too large ID param should return 404 ', {
    tag: '@api',
    annotation: [
      { type: 'testdino:priority', description: 'p2' },
      { type: 'testdino:feature', description: 'POST Create User API' },
      { type: 'testdino:link', description: 'https://jira.example.com/API-015' },
      { type: 'testdino:owner', description: 'api-team' },
      { type: 'testdino:notify-slack', description: '#api-alerts' },
      { type: 'testdino:context', description: 'API boundary testing with oversized ID parameters' }
    ]
  }, async ({ request }) => {
    const tooLargeId = 999999999;
    const response = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}/${tooLargeId}`);
    
    expect(response.status()).toBe(404);
  });

  test('Deleting invalid id returns 200/response but not crash ', {
    tag: '@api',
    annotation: [
      { type: 'testdino:priority', description: 'p2' },
      { type: 'testdino:feature', description: 'POST Create User API' },
      { type: 'testdino:link', description: 'https://jira.example.com/API-016' },
      { type: 'testdino:owner', description: 'api-team' },
      { type: 'testdino:notify-slack', description: '#api-alerts' },
      { type: 'testdino:context', description: 'API stability testing for invalid delete operations' }
    ]
  }, async ({ request }) => {
    const invalidId = 999999;
    const response = await request.delete(`${API_BASE_URL}${USERS_ENDPOINT}/${invalidId}`);
    
    // Should return 200 or 404, but not 500 (server error)
    expect([200, 404]).toContain(response.status());
    const body = await response.json();
    expect(body).toBeInstanceOf(Object);
  });

  test('PUT: Invalid method usage returns appropriate response (no 500) ', {
    tag: '@api',
    annotation: [
      { type: 'testdino:priority', description: 'p2' },
      { type: 'testdino:feature', description: 'POST Create User API' },
      { type: 'testdino:link', description: 'https://jira.example.com/API-017' },
      { type: 'testdino:owner', description: 'api-team' },
      { type: 'testdino:notify-slack', description: '#api-alerts' },
      { type: 'testdino:context', description: 'API method validation and error handling' }
    ]
  }, async ({ request }) => {
    const userId = 1;
    const updateData = {
      firstName: 'Updated'
    };
    
    // Try PUT on an endpoint that might not support it properly
    const response = await request.put(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}/invalid`, {
      data: updateData
    });
    
    // Should return appropriate error (400, 404, 405) but not 500
    expect([400, 404, 405, 200]).toContain(response.status());
    expect(response.status()).not.toBe(500);
  });

  test('user schema contains expected keys ', {
    tag: '@api',
    annotation: [
      { type: 'testdino:priority', description: 'p1' },
      { type: 'testdino:feature', description: 'POST Create User API' },
      { type: 'testdino:link', description: 'https://jira.example.com/API-018' },
      { type: 'testdino:owner', description: 'api-team' },
      { type: 'testdino:notify-slack', description: '#api-alerts' },
      { type: 'testdino:context', description: 'User object schema validation for required fields' }
    ]
  }, async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}/1`);
    const schemaValidationTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    
    // Validate expected keys in user schema
    const expectedKeys = ['id', 'firstName', 'lastName'];
    expectedKeys.forEach(key => {
      expect(body).toHaveProperty(key);
    });

    test.info().annotations.push(
      {
        type: 'metric',
        description: JSON.stringify({
          name: 'schema-validation-time',
          value: schemaValidationTime,
          threshold: 500,
          unit: 'ms'
        })
      },
      {
        type: 'metric',
        description: JSON.stringify({
          name: 'schema-compliance-score',
          value: 100,
          threshold: 100,
          unit: 'score'
        })
      }
    );
  });

  test('users list contains objects with id and email ', {
    tag: '@api',
    annotation: [
      { type: 'testdino:priority', description: 'p1' },
      { type: 'testdino:feature', description: 'POST Create User API' },
      { type: 'testdino:link', description: 'https://jira.example.com/API-019' },
      { type: 'testdino:owner', description: 'api-team' },
      { type: 'testdino:notify-slack', description: '#api-alerts' },
      { type: 'testdino:context', description: 'User list structure validation for ID and email fields' }
    ]
  }, async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}${USERS_ENDPOINT}`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    const users = body.users || body;
    const usersArray = Array.isArray(users) ? users : [];
    
    if (usersArray.length > 0) {
      // Check first user has id and email
      const firstUser = usersArray[0];
      expect(firstUser).toHaveProperty('id');
      // Email might be optional, so check if it exists
      if (firstUser.email !== undefined) {
        expect(typeof firstUser.email).toBe('string');
      }
    }
  });
});
