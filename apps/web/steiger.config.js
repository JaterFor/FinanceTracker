import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

export default defineConfig([
  ...fsd.configs.recommended,
  // Skeleton phase: slices are deliberately split for future growth even with one consumer today.
  { rules: { 'fsd/insignificant-slice': 'off' } },
]);
