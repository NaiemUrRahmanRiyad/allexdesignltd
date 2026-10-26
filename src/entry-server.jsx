import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { LanguageProvider } from './i18n/Language.jsx';
export function render(language) { return renderToString(<LanguageProvider initialLanguage={language}><App /></LanguageProvider>); }
