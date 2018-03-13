import config from '../../build/config'

export const API_BASE_URL = PRODUCTION ? config.client.production.apiBaseUrl : config.client.dev.apiBaseUrl;