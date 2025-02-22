import prettierConfig from '@kiwikilian/prettier-config' with { type: 'json' };

export default {
  ...prettierConfig,
  overrides: [
    {
      files: ['slides.md', 'sections/*.md'],
      options: {
        parser: 'slidev',
        plugins: ['prettier-plugin-slidev'],
      },
    },
  ],
};
