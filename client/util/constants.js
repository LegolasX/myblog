import config from '../../build/config'

const isProd = process.env.NODE_ENV === 'production';

export const API_BASE_URL = isProd ? config.client.production.apiBaseUrl : config.client.dev.apiBaseUrl;

export const CDN_BASE_URL = '//static.sunriseteam.cn/';

export const IMAGE_PROCESS_AVATAR = '?imageMogr2/thumbnail/!200x200r/gravity/Center/crop/200x/blur/1x0/quality/75|imageslim';

export const IMAGE_PROCESS_BGURL = '?imageMogr2/thumbnail/1200000@/blur/1x0/quality/75|imageslim';

export const IMAGE_PROCESS_POSTCOVER = '?imageMogr2/thumbnail/150000@/|imageslim';