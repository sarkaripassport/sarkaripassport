export const BASE_URL = 'https://govjobwala.com';

export function getSeoAlternates(lang: string, path: string) {
  // Normalize path (ensure it starts with / and handle root case)
  const cleanPath = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  
  return {
    canonical: `${BASE_URL}/${lang}${cleanPath}`,
    languages: {
      'en': `${BASE_URL}/en${cleanPath}`,
      'hi': `${BASE_URL}/hi${cleanPath}`,
      'mr': `${BASE_URL}/mr${cleanPath}`,
    }
  };
}
