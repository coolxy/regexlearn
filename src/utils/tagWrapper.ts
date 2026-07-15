type TagWrapper = { value: string; regex: RegExp; tagName?: string; attributes?: object };

const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    character =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[character]),
  );

const tagWrapper = ({ value, regex, tagName = 'span', attributes = {} }: TagWrapper): string => {
  if (typeof value !== 'string') return value;

  const setAttributes = attrs =>
    Object.entries(attrs)
      .map(([key, val]) => `${key === 'className' ? 'class' : key}="${escapeHtml(String(val))}"`)
      .join(' ');

  return escapeHtml(value).replace(
    regex,
    `<${tagName} ${setAttributes(attributes)}>$1</${tagName}>`,
  );
};

export default tagWrapper;
