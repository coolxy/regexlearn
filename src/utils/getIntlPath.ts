import { ParsedUrlQuery } from 'querystring';
import { defaultLocale } from 'src/localization';

type GetIntlPathArgs = {
  href: string;
  lang?: string | string[];
  query?: ParsedUrlQuery;
};

const getIntlPath = ({ href, lang, query = {} }: GetIntlPathArgs): string => {
  const targetLang = Array.isArray(lang) ? lang[0] : lang || defaultLocale;
  let pathname = href;

  if (pathname.includes('/[lang]')) {
    pathname = pathname.replace(
      '/[lang]',
      targetLang === defaultLocale ? '/' : `/${targetLang}`,
    );
  } else if (targetLang !== defaultLocale) {
    pathname = `/${targetLang}${pathname === '/' ? '' : pathname}`;
  }

  pathname = pathname.replace(/\/\//g, '/');

  Object.keys(query).forEach(key => {
    pathname = pathname.replace(`[${key}]`, `${query[key]}`);
  });

  return pathname;
};

export default getIntlPath;
