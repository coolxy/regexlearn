import { GetStaticProps } from 'next';

import PageHome, { getStaticProps as getLocalizedProps } from './[lang]/index';

export default PageHome;

export const getStaticProps: GetStaticProps = context =>
  getLocalizedProps({ ...context, params: { ...context.params, lang: 'en' } });
