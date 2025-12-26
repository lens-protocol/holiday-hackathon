const pluralize = require('pluralize');
const slugify = require('slugify');

export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

export function isStringPlural(str: string) {
  return pluralize.isPlural(str);
}

export function makeStringPlural(str: string) {
  return pluralize.plural(str);
}

export function makeStringSingular(str: string) {
  return pluralize.singular(str);
}

export function makeInternalId(str: string) {
  return slugify(str, {
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    lower: true, // convert to lower case, defaults to `false`
    strict: true, // strip special characters except replacement, defaults to `false`
    locale: 'en', // language code of the locale to use
  });
}

export function transformToBoolean(value: string | boolean) {
  const bool =
    typeof value === 'string'
      ? value?.toLowerCase() === 'true'
      : typeof value === 'boolean'
        ? value
        : false;
  return bool;
}
