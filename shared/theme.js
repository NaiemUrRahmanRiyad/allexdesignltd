export function resolveTheme(preference, systemDark) { return preference === 'light' || preference === 'dark' ? preference : systemDark ? 'dark' : 'light'; }
