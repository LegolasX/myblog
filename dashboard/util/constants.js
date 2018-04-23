import config from '../../build/config'

const isProd = process.env.NODE_ENV === 'production';

export const API_BASE_URL = isProd ? config.dashboard.production.apiBaseUrl : config.dashboard.dev.apiBaseUrl;

export const CDN_BASE_URL = '//static.sunriseteam.cn/'