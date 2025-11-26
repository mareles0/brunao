export const PARKING_CONSTANTS = {
  TOTAL_SPACES: 300,
  SPACES_PER_SECTION: 20,
  FIRST_SECTION_CHAR_CODE: 65, // 'A'
  REFRESH_INTERVAL_MS: 10000,
  DEFAULT_RECENT_ENTRIES_LIMIT: 5,
} as const;

export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  TIMEOUT_MS: 5000,
} as const;

export const PLATE_CONFIG = {
  MAX_LENGTH: 7,
  MERCOSUR_FORMAT: /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/,
  LEGACY_FORMAT: /^[A-Z]{3}[0-9]{4}$/,
} as const;
