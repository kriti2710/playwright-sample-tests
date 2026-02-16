# Metric Annotation Implementation Guide

## Overview
Custom metric annotations have been added to all test files to track performance, business, and quality metrics across test runs.

## Annotation Format

```javascript
test.info().annotations.push({
  type: 'metric',
  description: JSON.stringify({
    name: 'metric-name',
    value: 1250,
    threshold: 2000,
    unit: 'ms'
  })
});
```

## Implemented Metrics

### UI/E2E Tests

#### cart_checkout.spec.js
- cart-operation-time (5000ms)
- registration-time (3000ms)
- checkout-time (5000ms)
- order-cancellation-rate (20%)
- end-to-end-flow-time (15000ms)
- profile-update-time (4000ms)

#### login.spec.js
- login-time (3000ms)
- authentication-success-rate (95%)

#### navigation.spec.js
- page-load-time (2000ms)
- navigation-count (10)
- form-submission-time (4000ms)
- form-success-rate (98%)

#### orders.spec.js
- address-add-time (3000ms)
- address-edit-time (2500ms)
- address-delete-time (1500ms)
- crud-operation-time (10000ms)
- order-placement-time (8000ms)
- order-quantity (10)
- conversion-rate (85%)

#### product.spec.js
- review-submission-time (5000ms)
- user-engagement-rate (75%)
- filter-operation-time (3000ms)
- wishlist-operation-time (4000ms)
- user-onboarding-time (12000ms)
- new-user-conversion-rate (70%)

#### visual.spec.js
- page-load-time (5000ms)
- visual-regression-time (3000ms)
- screenshot-count (10)

### API Tests

#### delete-api.spec.js
- api-latency (1000ms)
- delete-success-rate (99%)
- idempotent-operation-time (2000ms)
- api-calls (5 count)

#### get-users.spec.js
- api-latency (800-1500ms)
- response-size (1000 count)
- pagination-accuracy (100%)
- error-handling-time (500ms)
- error-count (10 count)
- timeout-handling-score (95 score)

#### post-api.spec.js
- error-handling-time (500ms)
- api-error-rate (5%)
- validation-time (300ms)
- input-validation-score (95 score)
- schema-validation-time (500ms)
- schema-compliance-score (100 score)

#### updateUser.spec.js
- api-latency (1000ms)
- update-success-rate (98%)
- partial-update-time (800ms)
- patch-efficiency-score (90 score)
- auth-failure-time (500ms)
- security-score (95 score)
- validation-time (300ms)
- input-validation-score (98 score)

## Metric Categories

### Performance Metrics
- API latency measurements (ms)
- Operation durations (ms)
- Response times (ms)

### Business Metrics
- Success rates (%)
- Conversion rates (%)
- Error rates (%)

### Quality Metrics
- Validation scores (score)
- Compliance scores (score)
- Accuracy percentages (%)

### Resource Metrics
- API call counts (count)
- Response sizes (count)
- Operation counts (count)

## Supported Units
ms, s, mb, gb, %, count, score

## Usage Example

```javascript
test('API test', async ({ request }) => {
  const startTime = Date.now();
  const response = await request.get('/api/users');
  const apiLatency = Date.now() - startTime;
  
  expect(response.status()).toBe(200);
  
  test.info().annotations.push({
    type: 'metric',
    description: JSON.stringify({
      name: 'api-latency',
      value: apiLatency,
      threshold: 1000,
      unit: 'ms'
    })
  });
});
```

## Next Steps
1. Parse metric annotations from test results
2. Store in database with test run associations
3. Create visualization dashboard
4. Implement alerting for threshold violations
5. Add aggregation queries for analytics
