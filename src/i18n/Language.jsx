import { createContext, useContext, useEffect } from 'react';
const identity = text => text;
const EnglishContext = createContext({language:'en',t:identity});
export function LanguageProvider({children}) {
 useEffect(()=>{document.documentElement.lang='en';try{localStorage.removeItem('allex-language');}catch{}},[]);
 return <EnglishContext.Provider value={{language:'en',t:identity}}>{children}</EnglishContext.Provider>;
}
export const useLanguage=()=>useContext(EnglishContext);
export const translate=identity;
export function Localize({children}){return children;}
