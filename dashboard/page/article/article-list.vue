<template>
    <div class="list-wrapper">
        <h2>文章列表</h2>
        <mu-paper :zDepth="2" class="paper_panel">
            <div class="table_action">
                
            </div>
            <mu-table multiSelectable enableSelectAll ref="table">
                <mu-thead>
                    <mu-tr>
                        <mu-th>标题</mu-th>
                        <mu-th>作者</mu-th>
                        <mu-th class="th_selector" style="width: 150px;">
                            <span ref="categoryToggle" @click="showCategoryPopover = !showCategoryPopover">分类：{{currentCategoryName}}</span>  
                            <mu-popover :open="showCategoryPopover" :trigger="$refs.categoryToggle" @close="showCategoryPopover = false">
                                <mu-menu :value="currentCategoryId" @change="changeCategory">
                                    <mu-menu-item v-for="(item,index) in categoryList" :key="index" :value="item.categoryId" :title="item.categoryName" />
                                </mu-menu>
                            </mu-popover> 
                        </mu-th>
                        <mu-th>评论</mu-th>
                        <mu-th>view</mu-th>
                        <mu-th>日期</mu-th>
                        <mu-th>操作</mu-th>
                    </mu-tr>
                </mu-thead>
                <mu-tbody>
                    <mu-tr v-for="post in currentPostList" :key="post.postId">
                        <mu-td>{{post.title}}</mu-td>
                        <mu-td>{{post.username}}</mu-td>
                        <mu-td>{{categoryObject[post.categoryId]}}</mu-td>
                        <mu-td>{{post.commentCount}}</mu-td>
                        <mu-td>{{post.pageview}}</mu-td>
                        <mu-td>{{post.createTime}}</mu-td>
                        <mu-td class="article_actions">
                            <mu-icon-button @click.stop="gotoModify(post.postId)" class="table_button">
                                <span class="icon-edit"></span>
                            </mu-icon-button>
                            <mu-icon-button @click.stop="deletePost(post.postId, post.title)" class="table_button">
                                <span class="icon-trash-o"></span>
                            </mu-icon-button>
                        </mu-td>
                    </mu-tr>
                </mu-tbody>
            </mu-table>
        </mu-paper>
    </div>
</template>
<script>
    import {
        getCategory
    } from '../../api/category';
    import {
        getPostList,
        deletePost
    } from '../../api/post';

    import muPaper from 'muse-ui/src/paper/index';
    import {
        table as muTable,
        thead as muThead,
        tbody as muTbody,
        tr as muTr,
        th as muTh,
        td as muTd
    } from 'muse-ui/src/table/index.js';
    import muSelectField from 'muse-ui/src/selectField/index';
    import muPopover from 'muse-ui/src/popover/index';
    import muMenu from 'muse-ui/src/menu/menu.vue';
    import muMenuItem from 'muse-ui/src/menu/menuItem.vue';
    import muIconButton from 'muse-ui/src/iconButton/index';
    
    export default {
        data () {
            return {
                showCategoryPopover: false,
                currentCategoryId: '',
                categoryList: [],
                categoryObject: {},
                postList: []
            }
        },
        computed: {
            currentPostList () {
                if (this.currentCategoryId === 0) {
                    return this.postList;
                } else {
                    return this.postList.filter((item) => {
                        return item.categoryId === this.currentCategoryId;
                    })
                }
            },
            currentCategoryName () {
                let result = '';
                this.categoryList.forEach((value) => {
                    if (value.categoryId === this.currentCategoryId) {
                        result = value.categoryName;
                    }
                });
                return result;
            }
        },
        created () {
            getCategory().then(res => {
                if (res.data.code === 200) {
                    this.categoryList = res.data.data;
                    this.categoryList.unshift({
                        categoryId: 0,
                        categoryName: '全部'
                    });
                    this.currentCategoryId = 0;
                    this.categoryList.forEach(value => {
                        this.categoryObject[value.categoryId] = value.categoryName;
                    });
                } else {
                    this.$toast({
                        message: '获取分类列表失败，请重试'
                    })
                }
            })
            getPostList().then(res => {
                if (res.data.code === 200) {
                    this.postList = res.data.data;
                } else {
                    this.$toast({
                        message: '获取文章列表失败，请重试'
                    });
                }
            });
        },
        methods: {
            gotoModify (postId) {
                this.$router.push({
                    name: 'createArticle',
                    query: {
                        postId
                    }
                });
            },
            deletePost (postId, title) {
                this.$confirm({
                    content: '你确定要删除 ' + title + ' 吗',
                    confirm: () => {
                        deletePost(postId).then(res => {
                            if (res.data.code === 200) {
                                this.postList.forEach((post, index) => {
                                    if (post.postId === postId) {
                                        this.postList.splice(index, 1);
                                    }
                                })
                                this.$toast({
                                    message: '删除文章成功'
                                });
                            }
                        })
                    }
               })
            },
            changeCategory (value) {
                this.currentCategoryId = value;
                this.popOverClose();
            },
            popOverClose () {
                this.showCategoryPopover = false;
            }
        },
        components: {
            muPaper,
            muTable,
            muThead,
            muTbody,
            muTr,
            muTh,
            muTd,
            muSelectField,
            muPopover,
            muMenu,
            muMenuItem,
            muIconButton
        }
    }
</script>
<style lang="less">
    .list-wrapper {
        h2 {
            font-size: 24px;
            margin-bottom: 30px;
        }
        .paper_panel {
            padding: 30px;

            .th_selector {
                cursor: pointer;
                color: #ea8783;
            }
            .article_actions {
                font-size: 0;
                .table_button {
                    font-size: 20px;
                    padding: 0px;
                    width: 25px;
                    height: 25px; 
                    margin-right: 5px;

                    .mu-ripple-wrapper {
                        width: 45px;
                        height: 45px;
                        overflow: initial;
                        
                        div {
                            position: absolute;
                            left: -11px;
                            top: -12px;
                        }
                    }
                }
            }
        }
    }
</style>
