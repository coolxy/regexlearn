const fs = require('fs');
const path = require('path');

const BASE_PATH = path.resolve('out');
const LOCALIZATION_PATH = path.resolve('src/localization');
const locales = new Set(
  fs
    .readdirSync(LOCALIZATION_PATH, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name),
);

function replaceLangTag(path, locale) {
  const content = fs.readFileSync(path, { encoding: 'utf-8' });
  fs.writeFileSync(path, content.replace(/(<html lang=")en(" class="dark">)/, `$1${locale}$2`));
}

function htmlLangFixer(directory) {
  const list = fs.readdirSync(directory);

  list.forEach(el => {
    const currentPath = path.join(directory, el);
    const stats = fs.lstatSync(currentPath);

    if (stats.isFile() && el.endsWith('.html')) {
      const relativeParts = path.relative(BASE_PATH, currentPath).split(path.sep);
      const locale =
        relativeParts.length === 1 ? path.parse(relativeParts[0]).name : relativeParts[0];

      if (locales.has(locale)) {
        replaceLangTag(currentPath, locale);
      }
    } else if (stats.isDirectory()) {
      htmlLangFixer(currentPath);
    }
  });
}

htmlLangFixer(BASE_PATH);
