import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));

export const author = pkg.publisher;

export default {
  id: 'oxocarbon-grey-theme',
  name: pkg.displayName,
  version: '0.1.0',
  schema_version: 1,
  authors: [author],
  description: 'A dark cool-grey take on Oxocarbon, with flat graphene surfaces and richer syntax colours.',
  repository: pkg.repository.url,
};
