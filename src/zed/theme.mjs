import { colors, status, players, accents } from './ui.mjs';
import syntax from './syntax.mjs';
import manifest, { author } from './manifest.mjs';

export default {
  $schema: 'https://zed.dev/schema/themes/v0.2.0.json',
  name: manifest.name,
  author,
  themes: [
    {
      name: manifest.name,
      appearance: 'dark',
      style: {
        'background.appearance': 'opaque',
        accents,
        ...colors,
        ...status,
        players,
        syntax,
      },
    },
  ],
};
