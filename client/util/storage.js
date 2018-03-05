const storageManager = {
    _voteCommentIdList: [],
    _dislikeCommentIdList: [],
    _userInfo: {},
    init () {
        try {
            this._voteCommentIdList = JSON.parse(localStorage.getItem('voteCommentIdList')) || [];
            this._dislikeCommentIdList = JSON.parse(localStorage.getItem('dislikeCommentIdList')) || [];
            this._userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
            this._isSupport = true;
        } catch (e) {
            console.log('not support localstorage');
            this._isSupport = false
        }
    },
    _updateCommentIdList () {
        if (!this._isSupport) return void 666;
        localStorage.setItem('voteCommentIdList', JSON.stringify(this._voteCommentIdList));
        localStorage.setItem('dislikeCommentIdList', JSON.stringify(this._dislikeCommentIdList));
    },
    _updateUserInfo () {
        if (!this._isSupport) return void 666;
        localStorage.setItem('userInfo', JSON.stringify(this._userInfo));
    },
    getUserInfo () {
        return this._userInfo;
    },
    setUserInfo (userInfo) {
        this._userInfo = userInfo;
        this._updateUserInfo();
    },
    addVoteCommentId (commentId) {
        if (this._voteCommentIdList.some(value => value === commentId)) {
            return false;
        } else {
            this._voteCommentIdList.push(commentId);
            this._updateCommentIdList();
            return true;
        }
    },
    removeVoteCommentId (commentId) {
        this._voteCommentIdList.forEach((value, index, array) => {
            if (value === commentId) {
                array.splice(index, 1);
                this._updateCommentIdList();
                return true;
            }
        })
        return false;
    },
    addDislikeCommentId (commentId) {
        if (this._dislikeCommentIdList.some(value => value === commentId)) {
            return false;
        } else {
            this._dislikeCommentIdList.push(commentId);
            this._updateCommentIdList();
            return true;
        }
    },
    removeDislikeCommentId (commentId) {
        this._dislikeCommentIdList.forEach((value, index, array) => {
            if (value === commentId) {
                array.splice(index, 1);
                this._updateCommentIdList();
                return true;
            }
        })
        return false;
    },
    // 00 01 10 11  四种状态 高位表示是否赞成，低位表示是否反对
    getCommentState (commentId) {
        let flag = 0;
        if (this._dislikeCommentIdList.some(value => value === commentId)) {
            flag |= 1;
        }
        if (this._voteCommentIdList.some(value => value === commentId)) {
            flag |= (1 << 1);
        }
        return flag;
    }

}

export default storageManager;