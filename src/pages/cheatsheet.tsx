import { GetStaticProps } from 'next';

import PageCheatsheet, { getStaticProps as getLocalizedProps } from './[lang]/cheatsheet';

export default PageCheatsheet;

export const getStaticProps: GetStaticProps = context =>
  getLocalizedProps({ ...context, params: { ...context.params, lang: 'en' } });
