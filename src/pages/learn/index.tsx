import { GetStaticProps } from 'next';

import PageLearn, { getStaticProps as getLocalizedProps } from '../[lang]/learn/index';

export default PageLearn;

export const getStaticProps: GetStaticProps = context =>
  getLocalizedProps({ ...context, params: { ...context.params, lang: 'en' } });
