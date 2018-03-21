<template>
    <div class="create_article">
        <h2>Articles</h2>
        <mu-paper :zDepth="2" class="paper_panel">
            <mu-text-field label="文章标题" :label-float="true" :full-width="true" :max-length="20"  hintText="不超过20个字符" error-text=""/>
            <div class="panel_cell">
                <mu-select-field v-model="game1" class="cell_inline" label="选择文章分类">
                    <mu-menu-item v-for="(text,index) in list" :key="index" :value="index" :title="text" />
                </mu-select-field>
                <mu-date-picker v-model="article.createDate" :auto-ok="true" class="cell_inline" hintText="选择日期" mode="portrait" label="发表日期"/>
                <mu-time-picker v-model="article.createTime" :auto-ok="true" class="cell_inline" label="发表时间" hintText="选择时间" mode="landscape" format="24hr"/>
            </div>
            <div class="panel_cell">
                <mu-text-field  label="文章描述" hintText="请输入文章的简要描述，不超过200个字符" multiLine :rows="3" :max-length="200" :label-float="true" :full-width="true"/>
            </div>
            <mu-switch label="公开发表" v-model="isPublic" labelLeft class="switch" />
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
    import muSwitch from 'muse-ui/src/switch/index';
    import muTimePicker from 'muse-ui/src/timePicker/index';
    import editor from '../../components/editor/editor.vue';

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
        return result;
    }
    let dateObject = getDate();

    export default {
        data() {
            return {
                article: {
                    createDate: dateObject.date,
                    createTime: dateObject.time
                },
                isPublic: true,
                game1: 0,
                list: ['Web前端', 'Node.js', 'Webpack'],
                msgShow: '我要显示的内容',
                msg: {
                    mdValue: ''
                }
            }
        },
        created() {

        },
        mounted() {

        },
        methods: {
            childEventHandler: function (res) {
                // res会传回一个data,包含属性mdValue和htmlValue，具体含义请自行翻译
                this.msg = res;
            }
        },
        components: {
            muPaper,
            muTextField,
            muSelectField,
            muMenuItem,
            muDatePicker,
            muTimePicker,
            muSwitch,
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
                display: flex;
                justify-content: space-between;
                .cell_inline {
                    width: 33%;
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
        }
        .editorContainer {
            width: 100%;
            margin-top: 40px;
            margin-bottom: 40px;
            height: 700px;
        }
    }
</style>
