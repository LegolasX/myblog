<template>
    <div class="create_article">
        <h2>Articles</h2>
        <mu-paper :zDepth="2" class="paper_panel">
            <mu-text-field label="文章标题" :label-float="true" :full-width="true" :max-length="20" error-text=""/>
            <div class="panel_cell">
                <mu-select-field v-model="game1" class="cell_inline" label="选择文章分类">
                    <mu-menu-item v-for="(text,index) in list" :key="index" :value="index" :title="text" />
                </mu-select-field>
                <mu-date-picker class="cell_inline" hintText="选择日期" mode="portrait" label="发表日期"/>
            </div>
        </mu-paper>
        <div class="editorContainer">
            <editor 
                :mdValuesP="msg.mdValue"  
                :fullPageStatusP="false" 
                :editStatusP="true" 
                :previewStatusP="true" 
                :navStatusP="true"
                @childevent="childEventHandler" />
        </div>

    </div>
</template>
<script>
    import muDatePicker from 'muse-ui/src/datePicker/index';
    import muTextField from 'muse-ui/src/textField/textField.vue';
    import muPaper from 'muse-ui/src/paper/index';
    import muSelectField from 'muse-ui/src/selectField/index';
    import muMenuItem from 'muse-ui/src/menu/menuItem.vue';
    import editor from '../../components/editor/editor.vue';

    export default {
        data() {
            return {
                game1: 0,
                list: ['Web前端', 'Node.js', 'Webpack'],
                msgShow:'我要显示的内容',
                msg: {
                    mdValue:'## Vue-markdownEditor'
                }
            }
        },
        mounted () {

        },
        methods: {
            childEventHandler:function(res){
            // res会传回一个data,包含属性mdValue和htmlValue，具体含义请自行翻译
                this.msg=res;
            }
        },
        components: {
            muPaper,
            muTextField,
            muSelectField,
            muMenuItem,
            muDatePicker,
            editor
        }
    }
</script>
<style lang="less" scoped>
    .create_article {
        h2 {
            font-size: 24px;
        }
        .paper_panel {
            margin-top: 30px;
            padding: 30px;
            .panel_cell {
                .cell_inline {
                    vertical-align: top;
                    margin-right: 30px;
                }
                font-size: 0;
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
