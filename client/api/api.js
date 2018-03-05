import http from '../util/http';
import Qs from 'qs';

// 请求博客文章列表
export const getPostList = (username) => {
    return http.get(`/postList/${username}`);
};

// 根据postId请求文章
export const getPostById = postId => http.get(`/post/${postId}`);

// 根据IP获取地址
export const getPosition = () => http.get('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json');

// 添加新评论
export const addComment = (comment) => {
    return http.post('/comment', Qs.stringify(comment));
}

// 获取评论
export const getCommentList = (postId) => {
    return http.get('/comment', {
        params: {
            postId
        }
    })
}

// 评论vote or dislike
export const voteOrDislikeComment = (commentId, vote) => {
    vote = vote ? 'vote' : 'dislike';
    return http.get(`/comment/${commentId}/${vote}`);
}

// cancel vote or cancel dislike
export const cancelVoteOrDislike = (commentId, vote) => {
    vote = vote ? 'cancelVote' : 'cancelDislike';
    return http.get(`/comment/${commentId}/${vote}`);
}

// 回复评论
export const replyComment = (comment) => {
    return http.post('/comment/reply', Qs.stringify(comment));
}