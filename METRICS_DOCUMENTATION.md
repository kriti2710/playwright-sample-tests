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

### cart_checkout.spec.js
- cart-operation-time (5000ms)
- registration-time (3000ms)
- checkout-time (5000ms)
- order-cancellation-rate (20%)
- end-to-end-flow-time (15000ms)
- profile-update-time (4000ms)

### login.spec.js
- login-time (3000ms)
- authentication-success-rate (95%)

### navigation.spec.js
- page-load-time (2000ms)
- navigation-count (10)
- form-submission-time (4000ms)
- form-success-rate (98%)

### orders.spec.js
- address-add-time (3000ms)
- address-edit-time (2500ms)
- address-delete-time (1500ms)
- crud-operation-time (10000ms)
- order-placement-time (8000ms)
- order-quantity (10)
- conversion-rate (85%)

### product.spec.js
- review-submission-time (5000ms)
- user-engagement-rate (75%)
- filter-operation-time (3000ms)
- wishlist-operation-time (4000ms)
- user-onboarding-time (12000ms)
- new-user-conversion-rate (70%)

### visual.spec.js
- page-load-time (5000ms)
- visual-regression-time (3000ms)
- screenshot-count (10)

## Supported Units
ms, s, mb, gb, %, count, score
