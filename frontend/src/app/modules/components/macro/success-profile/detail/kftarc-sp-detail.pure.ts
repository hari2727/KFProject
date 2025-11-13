import { KfILang } from '@kf-products-core/kfhub_lib';

export function findSelectedLocale(locale: string, languages: KfILang[]): KfILang {
    return languages.find((language) => language.id === locale);
}
