// @ts-check
import { test, expect } from './support/test.js';

/**
 * Reproduces the test-history AMBIGUOUS_IDENTITY (409) case: the SAME leaf test
 * title lives in TWO describe blocks in ONE file. Ingestion derives
 * title_path_hash from the full title_path ([suite, ...describes, leaf]), so
 * these become two distinct active identities sharing test_title AND
 * suite_file_path — suite_file_path alone can't disambiguate; only the ancestry
 * (canonical_title_path) / title_path_hash can. Open either case's History to
 * see the candidate picker.
 */

const sharedTitle = 'should validate fields and show proper error messages';

test.describe('Pipeline Validation', { tag: '@chromium' }, () => {
  test(
    sharedTitle,
    {
      annotation: [
        { type: 'testdino:priority', description: 'p1' },
        { type: 'testdino:feature', description: 'Ambiguous History' },
        { type: 'testdino:owner', description: 'qa-team' },
      ],
    },
    async () => {
      expect('validation'.length).toBeGreaterThan(0);
    },
  );
});

test.describe('Pipeline Error Messages', { tag: '@chromium' }, () => {
  test(
    sharedTitle,
    {
      annotation: [
        { type: 'testdino:priority', description: 'p1' },
        { type: 'testdino:feature', description: 'Ambiguous History' },
        { type: 'testdino:owner', description: 'qa-team' },
      ],
    },
    async () => {
      expect('error messages'.length).toBeGreaterThan(0);
    },
  );
});
