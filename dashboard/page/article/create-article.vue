<template>
    <div class="create_article">
        <h2>发表文章</h2>
        <mu-paper :zDepth="2" class="paper_panel">
            <mu-text-field v-model="article.title" label="文章标题" :label-float="true" :full-width="true" :max-length="20"  hintText="不超过20个字符" error-text=""/>
            <div class="panel_cell">
                <mu-select-field v-model="article.categoryId" class="cell_inline" label="选择文章分类">
                    <mu-menu-item v-for="(item,index) in categoryList" :key="index" :value="item.categoryId" :title="item.categoryName" />
                </mu-select-field>
                <mu-date-picker v-model="article.date" :auto-ok="true" class="cell_inline" hintText="选择日期" mode="portrait" label="发表日期"/>
                <mu-time-picker v-model="article.time" :auto-ok="true" class="cell_inline" label="发表时间" hintText="选择时间" mode="landscape" format="24hr"/>
            </div>
            <div class="panel_cell">
                <mu-text-field v-model="article.description"  label="文章描述" hintText="请输入文章的简要描述，不超过200个字符" multiLine :rows="3" :max-length="200" :full-width="true"/>
            </div>
            <div style="position: relative;">
                <span>封面图片</span>
                <span class="icon-plus-circle upload_rect" @click="$refs.coverPic.click()" v-if="!tempCoverUrl">
                    <input type="file" ref="coverPic" name="coverFile" style="display:none" @change="uploadCoverPic">
                </span>
                <span class="cover_preview" v-else>
                    <img :src="tempCoverUrl">
                </span>
                <mu-raised-button class="submit_button" :label="$route.query.postId ? '更新文章' : '发表文章'" @click="submitPost">
                </mu-raised-button>
            </div>
            
        </mu-paper>
        <div class="editorContainer">
            <editor 
                :mdValuesP="editorContent.mdValue"  
                :fullPageStatusP="false" 
                :editStatusP="true" 
                :previewStatusP="true" 
                :navStatusP="true"
                @childevent="childEventHandler" />
        </div>
    </div>
</template>
<script>
    import {
        http
    } from '../../util/http';
    import {uploadFile} from '../../util/qiniu';
    import {getUploadToken} from '../../api/photo';
    import muDatePicker from 'muse-ui/src/datePicker/index';
    import muTextField from 'muse-ui/src/textField/textField.vue';
    import muPaper from 'muse-ui/src/paper/index';
    import muSelectField from 'muse-ui/src/selectField/index';
    import muMenuItem from 'muse-ui/src/menu/menuItem.vue';
    import muRaisedButton from 'muse-ui/src/raisedButton/index';
    import muTimePicker from 'muse-ui/src/timePicker/index';
    import editor from '../../components/editor/editor.vue';
    import {
        getCategory
    } from '../../api/category';
    import {
        createPost,
        getPostById,
        updatePost
    } from '../../api/post';
    import {
        formatDate
    } from '../../util/util.js'
    import {
        CDN_BASE_URL
    } from '../../util/constants'

    function getDate() {
        let now = new Date();
        let result = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
            hour: now.getHours(),
            minute: now.getMinutes()
        }
        for (var key in result) {
            if (result.hasOwnProperty(key) && result[key] < 10) {
                result[key] = '0' + result[key].toString();
            }
        }
        result.date = result.year + '-' + result.month + '-' + result.day;
        result.time = result.hour + ':' + result.minute;
        result.value = now.valueOf();
        return result;
    }
    let dateObject = getDate();

    export default {
        data() {
            return {
                article: {
                    date: dateObject.date,
                    time: dateObject.time,
                    createTime: dateObject.value,
                    description: '',
                    categoryId: '',
                    markdown: '',
                    title: '',
                    coverUrl: ''
                },
                tempCoverUrl: '',
                username: '',
                isPublic: true,
                categoryList: [],
                // 编辑器内容
                editorContent: {
                    mdValue: '',
                    htmlValue: ''
                }
            }
        },
        created() {
            getCategory().then(res => {
                if (res.data.code === 200) {
                    this.categoryList = res.data.data;
                    this.article.categoryId = this.categoryList[0].categoryId;
                    this.username = this.categoryList[0].username;
                } else {
                    this.$toast({
                        message: '获取分类列表失败，请重试'
                    })
                }
            });
            if (this.$route.query.postId) {
                getPostById(this.$route.query.postId).then(res => {
                    let post = res.data.data.post;
                    this.article.createTime = post.createTime;
                    let date = formatDate(post.createTime);
                    this.article.date = date.date;
                    this.article.time = date.time;
                    this.article.title = post.title;
                    this.article.description = post.description;
                    this.article.categoryId = post.categoryId;
                    this.article.coverUrl = post.coverUrl;
                    this.tempCoverUrl = post.coverUrl ? CDN_BASE_URL + post.coverUrl : '';
                    this.editorContent.mdValue = post.markdown;
                    this.editorContent.htmlValue = post.content;
                });
            }
        },
        methods: {
            uploadCoverPic (event) {
                let file = event.target.files[0];
                this.tempCoverUrl = window.URL.createObjectURL(file);
                let extName = file.name.split('.')[1];
                let filename =  `${this.username}/profile/${Date.now()}.${extName}`;
                uploadFile(file, filename, {
                    error: (res) => {
                        console.log(res);
                        this.$toast({
                            message: '图片上传出错'
                        });
                    },
                    complete: (res) => {
                        this.$toast({
                            message: '图片上传成功'
                        });
                        this.article.coverUrl = res.key;
                    }
                })
            },
            submitPost () {
                let postParams = Object.assign({}, this.article);
                let dateArray = postParams.date.split('-');
                // 月份从0开始，减1
                dateArray[1] = (parseInt(dateArray[1]) - 1).toString();
                postParams.createTime = new Date(...dateArray, ...postParams.time.split(':')).valueOf();
                delete postParams.date;
                delete postParams.time;
                postParams.markdown = this.editorContent.mdValue;
                if (!postParams.title || !postParams.markdown || !postParams.categoryId || !postParams.coverUrl) {
                    this.$toast({
                        message: '标题，内容, 封面图以及分类不能为空'
                    });
                    return void 666;
                }
                if (this.$route.query.postId) {
                    updatePost(this.$route.query.postId, postParams).then(res => {
                        if (res.data.code === 200) {
                            this.$toast({
                                message: '更新成功'
                            });
                        }
                    })
                } else {
                    createPost(postParams).then(res => {
                        if (res.data.code === 200) {
                            this.$toast({
                                message: '发表成功'
                            });
                        }
                    });
                }
            },
            childEventHandler: function (res) {
                // res会传回一个data,包含属性mdValue和htmlValue，具体含义请自行翻译
                this.editorContent = res;
            }
        },
        components: {
            muPaper,
            muTextField,
            muSelectField,
            muMenuItem,
            muDatePicker,
            muTimePicker,
            muRaisedButton,
            editor
        }
    }
</script>
<style lang="less" scope>
    .upload_rect {
        display: inline-block;
        border-radius: 6px;
        border: 1px dashed #cacaca;
        width: 230px;
        height: 160px;
        font-size: 22px;
        text-align: center;
        line-height: 160px;
        margin-left: 20px;
        cursor: pointer;

        &:hover {
            border: 1px dashed #2196f3;
        }
    }
    .create_article {
        h2 {
            font-size: 24px;
        }
        .paper_panel {
            margin-top: 30px;
            padding: 30px;
            .panel_cell {
                display: flex;
                justify-content: space-between;
                .cell_inline {
                    vertical-align: top;
                }
                font-size: 0;
                .switch {
                    position: relative;
                    top: 20px;
                    left: 20px;
                    font-size: 14px;
                }
            }
            
            .cover_preview {
                img {
                    width: 230px;
                    height: 160px;
                }
            }
            .submit_button {
                position: absolute;
                right: 0;
                bottom: 0;
            }
        }
        .editorContainer {
            width: 100%;
            margin-top: 40px;
            margin-bottom: 40px;
            height: 700px;
        }
    }
</style>
