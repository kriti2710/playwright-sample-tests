// @ts-check
import { expect, test } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'https://dummyjson.com';
const USERS_ENDPOINT = '/users';

test.describe('DELETE User API', () => {
  
  test('Remove user 1 ', {
    tag: '@api',
    annotation: [
      { type: 'testdino:priority', description: 'p1' },
      { type: 'testdino:feature', description: 'DELETE User API' },
      { type: 'testdino:link', description: 'https://jira.example.com/API-020' },
      { type: 'testdino:owner', description: 'api-team' },
      { type: 'testdino:notify-slack', description: '#api-alerts' },
      { type: 'testdino:context', description: 'Basic user deletion functionality' }
    ]
  }, async ({ request }) => {
    const userId = 1;
    const startTime = Date.now();
    const response = await request.delete(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`);
    const apiLatency = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id', userId);
    expect(body).toHaveProperty('isDeleted', true);

    test.info().annotations.push(
      {
        type: 'metric',
        description: JSON.stringify({
          name: 'api-latency',
          value: apiLatency,
          threshold: 1000,
          unit: 'ms'
        })
      },
      {
        type: 'metric',
        description: JSON.stringify({
          name: 'delete-success-rate',
          value: 100,
          threshold: 99,
          unit: '%'
        })
      }
    );
  });

  test('Remove user twice ', {
    tag: '@api',
    annotation: [
      { type: 'testdino:priority', description: 'p2' },
      { type: 'testdino:feature', description: 'DELETE User API' },
      { type: 'testdino:link', description: 'https://jira.example.com/API-021' },
      { type: 'testdino:owner', description: 'api-team' },
      { type: 'testdino:notify-slack', description: '#api-alerts' },
      { type: 'testdino:context', description: 'Idempotent delete operation validation' }
    ]
  }, async ({ request }) => {
    const userId = 2;
    const startTime = Date.now();
    
    const response1 = await request.delete(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`);
    expect(response1.status()).toBe(200);
    const body1 = await response1.json();
    expect(body1).toHaveProperty('id', userId);
    
    const response2 = await request.delete(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`);
    expect(response2.status()).toBe(200);
    const body2 = await response2.json();
    expect(body2).toHaveProperty('id', userId);

    const totalTime = Date.now() - startTime;

    test.info().annotations.push(
      {
        type: 'metric',
        description: JSON.stringify({
          name: 'idempotent-operation-time',
          value: totalTime,
          threshold: 2000,
          unit: 'ms'
        })
      },
      {
        type: 'metric',
        description: JSON.stringify({
          name: 'api-calls',
          value: 2,
          threshold: 5,
          unit: 'count'
        })
      }
    );
  });

  test('Validate body is returned ', {
    tag: '@api',
    annotation: [
      { type: 'testdino:priority', description: 'p2' },
      { type: 'testdino:feature', description: 'DELETE User API' },
      { type: 'testdino:link', description: 'https://jira.example.com/API-022' },
      { type: 'testdino:owner', description: 'api-team' },
      { type: 'testdino:notify-slack', description: '#api-alerts' },
      { type: 'testdino:context', description: 'Delete operation response body validation' }
    ]
  }, async ({ request }) => {
    const userId = 3;
    const startTime = Date.now();
    const response = await request.delete(`${API_BASE_URL}${USERS_ENDPOINT}/${userId}`);
    const responseTime = Date.now() - startTime;
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    
    // Validate response body structure
    expect(body).toBeInstanceOf(Object);
    expect(body).toHaveProperty('id');
    expect(typeof body.id).toBe('number');

    test.info().annotations.push({
      type: 'metric',
      description: JSON.stringify({
        name: 'api-latency',
        value: responseTime,
        threshold: 1000,
        unit: 'ms'
      })
    });
  });
});
