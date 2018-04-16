import {
    http
} from '../util/http';
import {
    serializeParams
} from '../util/util.js'

// 添加文章分类
export const addCategory = (categoryName) => http.post('/category',  serializeParams({
    categoryName
}));

// 获取文章分类
export const getCategory = () => http.get('/category');

// 修改分类名称
export const modifyCategory = (categoryId, categoryName) => http.put(`/category/${categoryId}`, serializeParams({
    categoryName
}))

// 删除分类
export const deleteCategory = (categoryId) => http.delete(`/category/${categoryId}`)