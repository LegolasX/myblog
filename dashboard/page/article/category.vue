<template>
    <div class="category_wrapper">
        <h2>分类管理</h2>
        <mu-paper :zDepth="2" class="paper_panel">
            <mu-raised-button label="添加分类" @click="categoryAction(0)" labelPosition="after">
                <span class="icon-plus-circle icon_raised_button"></span>
            </mu-raised-button>
            <mu-table multiSelectable enableSelectAll ref="table">
                <mu-thead>
                    <mu-tr>
                        <mu-th>ID</mu-th>
                        <mu-th>分类名称</mu-th>
                        <mu-th>操作</mu-th>
                    </mu-tr>
                </mu-thead>
                <mu-tbody>
                    <mu-tr v-for="item in categoryList" :key="item.id">
                        <mu-td>{{item.categoryId}}</mu-td>
                        <mu-td>{{item.categoryName}}</mu-td>
                        <mu-td class="categoty_actions">
                            <mu-icon-button @click.stop="categoryAction(1, item.categoryId, item.categoryName)" class="table_button">
                                <span class="icon-edit"></span>
                            </mu-icon-button>
                            <mu-icon-button @click.stop="deleteCategory(item.categoryId, item.categoryName)" class="table_button">
                                <span class="icon-trash-o"></span>
                            </mu-icon-button>
                        </mu-td>
                    </mu-tr>
                </mu-tbody>
            </mu-table>
        </mu-paper>
        <mu-dialog :open="dialog.show" :title="dialog.title">
            <div class="dialog_content">
                <mu-text-field label="分类名称" v-model="dialog.categoryName" :label-float="true" :full-width="true" :max-length="15"  hintText="不超过10个字符" error-text=""/>
            </div>
            <mu-flat-button slot="actions" @click="dialog.show = false" primary label="取消"/>
            <mu-flat-button slot="actions" @click="dialogConfirm" primary label="确定"/>
        </mu-dialog>
    </div>
</template>
<script>
    import {
        getCategory,
        addCategory,
        modifyCategory,
        deleteCategory
    } from '../../api/category.js';
    import {
        table as muTable,
        thead as muThead,
        tbody as muTbody,
        tr as muTr,
        th as muTh,
        td as muTd
    } from 'muse-ui/src/table/index.js';
    import muRaisedButton from 'muse-ui/src/raisedButton/index';
    import muIconButton from 'muse-ui/src/iconButton/index';
    import muFlatButton from 'muse-ui/src/flatButton/index';
    import muPaper from 'muse-ui/src/paper/index';
    import muCheckbox from 'muse-ui/src/checkbox/index';
    import muDialog from 'muse-ui/src/dialog/index';
    import muTextField from 'muse-ui/src/textField/textField.vue';

    export default {
        data() {
            return {
                dialog: {
                    // 0: 新增  1. 修改, 2. 删除
                    type: 0,
                    show: false,
                    title: '添加文章分类',
                    categoryName: '',
                    categoryId: ''
                },
                categoryList: []
            }
        },
        created() {
            getCategory().then(res => {
                if (res.data.code === 200) {
                    this.categoryList = res.data.data;
                } else {
                    this.$toast({
                        message: '获取分类列表失败，请重试'
                    })
                }
            })
        },
        methods: {
            dialogConfirm () {
                if (this.dialog.type === 0) {
                    addCategory(this.dialog.categoryName).then(res => {
                        if (res.data.code === 200) {
                            this.categoryList.push({
                                categoryId: res.data.data.categoryId,
                                categoryName: this.dialog.categoryName
                            })
                            this.dialog.categoryName = '';
                        }
                    })
                } else if (this.dialog.type === 1) {
                    modifyCategory(this.dialog.categoryId, this.dialog.categoryName).then(res => {
                        if (res.data.code === 200) {
                            for (let item of this.categoryList) {
                                if (item.categoryId === this.dialog.categoryId) {
                                    item.categoryName = this.dialog.categoryName;
                                    break;
                                }
                            }
                            this.$toast({
                                message: '修改成功'
                            })
                            this.dialog.categoryName = '';
                        }
                    })
                }
                this.dialog.show = false;
            },
            deleteCategory (categoryId, categoryName) {
                this.$confirm({
                    content: '你确定要删除 ' + categoryName + ' 分类吗',
                    confirm: () => {
                        deleteCategory(categoryId).then(res => {
                            if (res.data.code === 200) {
                                this.categoryList.forEach((item, index) => {
                                    if (item.categoryId === categoryId) {
                                        this.categoryList.splice(index, 1);
                                    }
                                })
                                this.$toast({
                                    message: '删除分类成功'
                                });
                            } else if (res.data.code === 205) {
                                this.$toast({
                                    message: '当前分类下还有' + res.data.data + '篇文章，不允许直接删除分类'
                                })
                            }
                        })
                    }
               })
            },
            categoryAction (type, categoryId, categoryName) {
                this.dialog.categoryId = categoryId || '';
                this.dialog.categoryName = categoryName || '';
                this.dialog.show = true;
                switch(type) {
                    case 0: 
                        this.dialog.title = '添加文章分类';
                        this.dialog.type = 0;
                        break;
                    case 1:
                        this.dialog.title = '修改分类名称';
                        this.dialog.type = 1;
                        break;
                }
            }
        },
        components: {
            muTable,
            muThead,
            muTbody,
            muTr,
            muTh,
            muTd,
            muCheckbox,
            muPaper,
            muFlatButton,
            muRaisedButton,
            muIconButton,
            muDialog,
            muTextField
        }
    }
</script>
<style lang="less" scoped>
    .category_wrapper {
        h2 {
            font-size: 24px;
            margin-bottom: 30px;
        }
        .paper_panel {
            padding: 30px;
            .categoty_actions {
                font-size: 0;
                .table_button {
                    font-size: 20px;
                }
            }
        }
    }
</style>
