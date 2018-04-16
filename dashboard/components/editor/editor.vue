<template>
    <div class="mdContainer" :class="{ fullPage: fullPageStatus }">
        <div class="navContainer" v-if="navStatus">
            <div class="markContainer">
                <ul class="markListGroup">
                    <li class="markListItem" @click="addStrong" title="strong">
                        <mu-icon-button tooltip="文字加粗" tooltipPosition="top-right">
                            <span class="icon-bold icon-text"></span>
                        </mu-icon-button>
                    </li>
                    <li class="markListItem" @click="addItalic" title="italic">
                        <mu-icon-button tooltip="文字斜体" tooltipPosition="top-right">
                            <span class="icon-italic icon-text"></span>
                        </mu-icon-button>
                    </li>
                    <li class="markListItem" @click="addStrikethrough" title="strikethrough">
                        <mu-icon-button tooltip="strikethrough" tooltipPosition="top-right">
                            <span class="icon-strikethrough icon-text"></span>
                        </mu-icon-button>
                    </li>
                    <li class="markListItem" @click="addHTitle(2)" title="H2-title">
                        <mu-icon-button tooltip="二级标题" tooltipPosition="top-right">
                            <span class="icon-text">H2</span>
                        </mu-icon-button>
                    </li>
                    <li class="markListItem" @click="addHTitle(3)" title="H3-title">
                        <mu-icon-button tooltip="三级标题" tooltipPosition="top-right">
                            <span class="icon-text">H3</span>
                        </mu-icon-button>
                    </li>
                    <li class="markListItem" @click="addHTitle(4)" title="H4-title">
                        <mu-icon-button tooltip="四级标题" tooltipPosition="top-right">
                            <span class="icon-text">H4</span>
                        </mu-icon-button>
                    </li>
                    <li class="markListItem" @click="addHTitle(5)" title="H5-title">
                        <mu-icon-button tooltip="五级标题" tooltipPosition="top-right">
                            <span class="icon-text">H5</span>
                        </mu-icon-button>
                    </li>
                    <li class="markListItem" @click="addHTitle(6)" title="H6-title">
                        <mu-icon-button tooltip="六级标题" tooltipPosition="top-right">
                            <span class="icon-text">H6</span>
                        </mu-icon-button>
                    </li>
                    <li class="markListItem" @click="addLine" title="line">
                        <mu-icon-button tooltip="分割线" tooltipPosition="top-right">
                            <span class="icon-minus icon-text"></span>
                        </mu-icon-button>
                    </li>
                    <li class="markListItem" @click="addQuote" title="quote">
                        <mu-icon-button tooltip="引用" tooltipPosition="top-right">
                            <span class="icon-quote-left icon-text"></span>
                        </mu-icon-button>
                    </li>
                    <li class="markListItem" @click="addCode">
                        <mu-icon-button tooltip="代码段" tooltipPosition="top-right">
                            <span class="icon-code icon-text"></span>
                        </mu-icon-button>
                    </li>
                    <li class="markListItem" @click="addLink">
                        <mu-icon-button tooltip="链接" tooltipPosition="top-right">
                            <span class="icon-chain icon-text"></span>
                        </mu-icon-button>
                    </li>
                    <li class="markListItem" @click="addImage">
                        <mu-icon-button tooltip="在线图片" tooltipPosition="top-right">
                            <span class="icon-image icon-text"></span>
                        </mu-icon-button>
                    </li>
                    <li class="markListItem" @click="addTable" title="table">
                        <mu-icon-button tooltip="表格" tooltipPosition="top-right">
                            <span class="icon-th icon-text"></span>
                        </mu-icon-button>
                    </li>
                    <li class="markListItem" @click="addUl" title="ul-list">
                        <mu-icon-button tooltip="无序列表" tooltipPosition="top-right">
                            <span class="icon-list-ul icon-text"></span>
                        </mu-icon-button>
                    </li>
                    <li class="markListItem" @click="addOl" title="ol-list">
                        <mu-icon-button tooltip="有序列表" tooltipPosition="top-right">
                            <span class="icon-list-ol icon-text"></span>
                        </mu-icon-button>
                    </li>
                    <li class="markListItem" @click="fullPageFn" title="fullpage">
                        <mu-icon-button tooltip="全屏" tooltipPosition="top-right">
                            <span class="icon-arrows-alt icon-text"></span>
                        </mu-icon-button>
                    </li>
                    <li class="markListItem" @click="previewFn" title="preview">
                        <mu-icon-button tooltip="写作模式" tooltipPosition="top-right">
                            <span class="icon-eye-slash icon-text"></span>
                        </mu-icon-button>
                        
                    </li>
                    <li class="markListItem" @click="previewAllFn" title="previewAll">
                        <mu-icon-button tooltip="预览模式" tooltipPosition="top-right">
                            <span class="icon-eye icon-text"></span>
                        </mu-icon-button>
                    </li>
                </ul>
            </div>
        </div>
        <div class="mdBodyContainer" :class="{ noMenu: !navStatus }">
            <div class="editContainer" v-if="editStatus">
                <textarea name="" class="mdEditor" @keydown.9="tabFn" v-scroll="editScroll" v-model="input"></textarea>
            </div>
            <div class="previewContainer markdown-body" v-scroll="previewScroll" v-html="compiledMarkdown" v-if="previewStatus">
            </div>
        </div>
    </div>
</template>

<style lang="less">
    
    /*引入github的markdown样式文件*/
    
    @import "./style/github.markdown.css";
    
    /*引入atom的代码高亮样式文件*/
    
    @import "./style/atom-one-dark.min.css";
    .mdContainer {
        width: 100%;
        height: 100%;
        background: lightblue;
        &.fullPage {
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
        }
        .navContainer {
            width: 100%;
            height: 45px;
            background: #fff;
            box-sizing: border-box;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 0 10px;
            .markContainer {
                width: auto;
                height: 100%;
                margin-left: 0px;
                ul.markListGroup {
                    height: 100%;
                    width: auto;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    li.markListItem {
                        list-style: none;
                        width: 35px;
                        height: 35px;
                        margin: 0 2px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                        font-size: 12px;
                        color: #333;
                        .icon-text {
                            font-size: 16px;
                        }
                    }
                }
            }
        }
        .mdBodyContainer {
            width: 100%;
            min-height: 500px;
            height: 100%;
            background: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            margin-bottom: 50px;
            &.noMenu{
                height: 100%;
            }
        }
    }
    
    // 编辑区域
    .editContainer {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        border-right: 1px solid #ddd;
        background: white;

        padding: 10px;
        padding-bottom: 55px;
        .mdEditor {
            height: 100%;
            width: 100%;
            background: transparent;
            outline: none;
            resize: none;
            border: 0;
        }
    }
    
    // 预览区
    .previewContainer {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        background: #fdf9f1;
        overflow: auto;
        padding: 10px;

        ul {
            list-style-type: disc; 
        }
        em {
            font-style: italic;
        }
    }
</style>

<script>
    import Vue from 'vue';
    import marked from 'marked';
    import scroll from 'vue-scroll';
    import hljs from '../../util/highlight.min.js';
    import range from './script/rangeFn.js';
    import muIconButton from 'muse-ui/src/iconButton/index';

    Vue.use(scroll)
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false,
        highlight: function(code) {
            return hljs.highlightAuto(code).value
        }
    });
    
    function insertContent(val, that) {
        let textareaDom = document.querySelector('.mdEditor');
        let value = textareaDom.value;
        let point = range.getCursortPosition(textareaDom);
        let lastChart = value.substring(point - 1, point);
        let lastFourCharts = value.substring(point - 4, point);
        if (lastChart != '\n' && value != '' && lastFourCharts != '    ') {
            val = '\n' + val;
            range.insertAfterText(textareaDom, val);
        } else {
            range.insertAfterText(textareaDom, val);
        }
        that.input = document.querySelector('.mdEditor').value;
    }
    export default {
        name: 'markdown',
        props: ['mdValuesP', 'fullPageStatusP', 'editStatusP', 'previewStatusP', 'navStatusP'],
        data() {
            return {
                input: this.mdValuesP || '',
                editStatus: Boolean(this.editStatusP),
                previewStatus: Boolean(this.previewStatusP),
                fullPageStatus: Boolean(this.fullPageStatusP),
                navStatus: Boolean(this.navStatusP),
                maxEditScrollHeight:0,
                maxPreviewScrollHeight:0
            }
        },
        created: function() {
            if (!this.editStatus && !this.previewStatus) {
                this.editStatus = true;
                this.previewStatus = true;
            }
        },
        components: {
            muIconButton
        },
        methods: {
            tabFn: function(evt) {
                insertContent("    ", this);
                // 屏蔽屌tab切换事件
                if (evt.preventDefault) {
                    evt.preventDefault();
                } else {
                    evt.returnValue = false;
                }
            },
            addImage: function(evt) {
                insertContent("![Vue](https://cn.vuejs.org/images/logo.png)", this);
            },
            addHTitle: function(index) {
                let tmp = '';
                switch (index) {
                    case 1:
                        tmp = '# ';
                        break;
                    case 2:
                        tmp = '## ';
                        break;
                    case 3:
                        tmp = '### ';
                        break;
                    case 4:
                        tmp = '#### ';
                        break;
                    case 5:
                        tmp = '##### ';
                        break;
                    case 6:
                        tmp = '###### ';
                        break;
                    default:
                        break;
                }
                insertContent(tmp, this);
            },
            addCode: function() {
                let textareaDom = document.querySelector('.mdEditor');
                let value = textareaDom.value;
                let point = range.getCursortPosition(textareaDom);
                let lastChart = value.substring(point - 1, point);
                insertContent('```\n\n```', this);
                if (lastChart != '\n' && value != '') {
                    range.setCaretPosition(textareaDom, point + 5);
                } else {
                    range.setCaretPosition(textareaDom, point + 4);
                }
            },
            addStrikethrough: function() {
                let textareaDom = document.querySelector('.mdEditor');
                let value = textareaDom.value;
                let point = range.getCursortPosition(textareaDom);
                let lastChart = value.substring(point - 1, point);
                insertContent('~~~~', this);
                if (lastChart != '\n' && value != '') {
                    range.setCaretPosition(textareaDom, point + 3);
                } else {
                    range.setCaretPosition(textareaDom, point + 2);
                }
            },
            addStrong: function() {
                let textareaDom = document.querySelector('.mdEditor');
                let value = textareaDom.value;
                let point = range.getCursortPosition(textareaDom);
                let lastChart = value.substring(point - 1, point);
                insertContent('****', this);
                if (lastChart != '\n' && value != '') {
                    range.setCaretPosition(textareaDom, point + 3);
                } else {
                    range.setCaretPosition(textareaDom, point + 2);
                }
            },
            addItalic: function() {
                let textareaDom = document.querySelector('.mdEditor');
                let value = textareaDom.value;
                let point = range.getCursortPosition(textareaDom);
                let lastChart = value.substring(point - 1, point);
                insertContent('**', this);
                if (lastChart != '\n' && value != '') {
                    range.setCaretPosition(textareaDom, point + 2);
                } else {
                    range.setCaretPosition(textareaDom, point + 1);
                }
            },
            setStrong: function() {
                let textareaDom = document.querySelector('.mdEditor');
                let point = range.getCursortPosition(textareaDom);
            },
            addLine: function() {
                insertContent('\n----\n', this);
            },
            addLink: function() {
                insertContent("[Vue](https://cn.vuejs.org/images/logo.png)", this);
            },
            addQuote: function() {
                let textareaDom = document.querySelector('.mdEditor');
                let value = textareaDom.value;
                let point = range.getCursortPosition(textareaDom);
                let lastChart = value.substring(point - 1, point);
                insertContent('> ', this);
                if (lastChart != '\n' && value != '') {
                    range.setCaretPosition(textareaDom, point + 3);
                } else {
                    range.setCaretPosition(textareaDom, point + 2);
                }
            },
            addTable: function() {
                insertContent('\nheader 1 | header 2\n', this);
                insertContent('---|---\n', this);
                insertContent('row 1 col 1 | row 1 col 2\n', this);
                insertContent('row 2 col 1 | row 2 col 2\n\n', this);
            },
            addUl: function() {
                insertContent('* ', this);
            },
            addOl: function() {
                insertContent('1. ', this);
            },
            previewFn: function() {
                if (!this.editStatus) {
                    this.editStatus = true;
                    this.previewStatus = !this.previewStatus;
                } else {
                    this.previewStatus = !this.previewStatus;
                }
            },
            previewAllFn: function() {
                if (!this.editStatus && this.previewStatus) {
                    this.editStatus = true;
                    this.previewStatus = true;
                } else {
                    this.editStatus = false;
                    this.previewStatus = true;
                }
            },
            fullPageFn: function() {
                this.fullPageStatus = !this.fullPageStatus;
                let maxEditScrollHeight=document.querySelector('.mdEditor').scrollHeight-document.querySelector('.mdEditor').clientHeight;
                let maxPreviewScrollHeight=document.querySelector('.previewContainer').scrollHeight-document.querySelector('.previewContainer').clientHeight;
                this.maxEditScrollHeight = maxEditScrollHeight
                this.maxPreviewScrollHeight = maxPreviewScrollHeight
            },
            previewScroll: function(e, position) {
                if(this.maxEditScrollHeight!==0){
                    let topPercent=position.scrollTop/this.maxPreviewScrollHeight;
                    document.querySelector('.mdEditor').scrollTop = this.maxEditScrollHeight*topPercent;
                }
            },
            editScroll:function(e, position){
                if(this.maxPreviewScrollHeight!==0){
                    let topPercent=position.scrollTop/this.maxEditScrollHeight;
                    document.querySelector('.previewContainer').scrollTop = this.maxPreviewScrollHeight*topPercent;
                }
            }
        },
        computed: {
            compiledMarkdown: function() {
                return marked(this.input, {
                    sanitize: true
                })
            }
        },
        watch: {
            input: function() {
                let data = {};
                data.mdValue = this.input;
                data.htmlValue = marked(this.input, {
                    sanitize: true
                });
                this.$emit('childevent', data);
                let maxEditScrollHeight=document.querySelector('.mdEditor').scrollHeight-document.querySelector('.mdEditor').clientHeight;
                let maxPreviewScrollHeight=document.querySelector('.previewContainer').scrollHeight-document.querySelector('.previewContainer').clientHeight;
                this.maxEditScrollHeight = maxEditScrollHeight
                this.maxPreviewScrollHeight = maxPreviewScrollHeight
            },
            mdValuesP: function (value) {
                this.input = value;
            }
        }
    }
</script>