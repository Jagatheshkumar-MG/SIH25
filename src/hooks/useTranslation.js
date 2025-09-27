import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations';

export function useTranslation() {
  const { language } = useLanguage();

  // Translation function that uses current language
  const translate = (key, params = {}) => {
    return t(key, language, params);
  };

  return { t: translate, language };
}