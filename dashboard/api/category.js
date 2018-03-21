import http from '../util/http';
import Qs from 'qs';

// 添加文章分类
export const addCategory = (categoryName) => http.post('/category',  Qs.stringify({
    categoryName
}))