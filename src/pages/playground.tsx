import { GetStaticProps } from 'next';

import PagePlayground, { getStaticProps as getLocalizedProps } from './[lang]/playground';

export default PagePlayground;

export const getStaticProps: GetStaticProps = context =>
  getLocalizedProps({ ...context, params: { ...context.params, lang: 'en' } });
