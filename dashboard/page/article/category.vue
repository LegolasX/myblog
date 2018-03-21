<template>
    <div class="category_wrapper">
        <h2>分类管理</h2>

        <mu-paper :zDepth="2" class="paper_panel">
            <mu-raised-button label="删除多个">
                <span class="icon-trash-o icon_raised_button"></span>
            </mu-raised-button>
            <mu-raised-button label="添加分类" @click="dialog.show = true" labelPosition="after">
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
                    <mu-tr>
                        <mu-td>1</mu-td>
                        <mu-td>John Smith</mu-td>
                        <mu-td>
                            <mu-icon-button @click.stop class="table_button">
                                <span class="icon-trash-o"></span>
                            </mu-icon-button>
                        </mu-td>
                    </mu-tr>
                    <mu-tr>
                        <mu-td>2</mu-td>
                        <mu-td>Randal White</mu-td>
                        <mu-td>Unemployed</mu-td>
                    </mu-tr>
                    <mu-tr>
                        <mu-td>3</mu-td>
                        <mu-td>Stephanie Sanders</mu-td>
                        <mu-td>Employed</mu-td>
                    </mu-tr>
                    <mu-tr>
                        <mu-td>4</mu-td>
                        <mu-td>Steve Brown</mu-td>
                        <mu-td>Employed</mu-td>
                    </mu-tr>
                </mu-tbody>
            </mu-table>
        </mu-paper>
        <mu-dialog :open="dialog.show" title="添加文章分类">
            <div class="dialog_content">
                <mu-text-field label="分类名称" v-model="dialog.categoryName" :label-float="true" :full-width="true" :max-length="10"  hintText="不超过10个字符" error-text=""/>
            </div>
            <mu-flat-button slot="actions" @click="dialog.show = false" primary label="取消"/>
            <mu-flat-button slot="actions" @click="addCategory" primary label="确定"/>
        </mu-dialog>
    </div>
</template>
<script>
    import {
        addCategory
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
                    show: false,
                    categoryName: ''
                }
            }
        },
        created() {

        },
        methods: {
            addCategory () {
                addCategory(this.dialog.categoryName).then(res => {

                })
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
        }

        .table_button {
            font-size: 20px;
        }
    }
</style>
