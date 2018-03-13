import config from '../../build/config'

export const API_BASE_URL = PRODUCTION ? config.production.apiBaseUrl : config.dev.apiBaseUrl;