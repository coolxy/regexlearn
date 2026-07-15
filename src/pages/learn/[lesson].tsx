import { GetStaticPaths, GetStaticProps } from 'next';

import lessons from 'src/data/lessons/index.json';
import PageLesson, { getStaticProps as getLocalizedProps } from '../[lang]/learn/[lesson]';

export default PageLesson;

export const getStaticProps: GetStaticProps = context =>
  getLocalizedProps({ ...context, params: { ...context.params, lang: 'en' } });

export const getStaticPaths: GetStaticPaths = () => ({
  fallback: false,
  paths: lessons.map(lesson => ({ params: { lesson: lesson.slug } })),
});
