<template>
    <div class="photos_wrapper">
        <h2>图片管理</h2>
        <input type="file" name="photo" @change="fileUpload">
        <mu-raised-button label="添加分类" @click="posttest" labelPosition="after">
            <span class="icon-plus-circle icon_raised_button mu-icon"></span>
        </mu-raised-button>
    </div>
</template>
<script>
    import * as qiniu from 'qiniu-js';
    import {
        getUploadToken
    } from '../../api/photo';
    import muRaisedButton from 'muse-ui/src/raisedButton/index';

    export default {
        data() {
            return {
                currentPic: null,
                uploadToken: null
            }
        },
        created () {
            getUploadToken().then(res => {
                if (res.data.code === 200) {
                    this.uploadToken = res.data.data;
                }
            })
        },
        methods: {
            posttest() {
                let observable = qiniu.upload(this.currentPic, this.currentPic.name, this.uploadToken, {
                    fname: this.currentPic.name,
                    mineType: ["image/png", "image/jpeg", "image/jpg"]
                }, {
                    region: qiniu.region.z0
                });
                let subscription = observable.subscribe({
                    next (res) {
                        console.log('loaded:' + res.total.loaded + ' ' + res.total.percent);
                    },
                    error (res) {
                        console.log(res);
                    },
                    complete (res) {
                        console.log('complete');
                        console.log(res);
                    }
                })
                /* let formData = new FormData();
                formData.append('cover', this.currentPic);
                http.post('/upload', formData).then(res => {
                    console.log(res);
                }) */
            },
            fileUpload (event) {
                this.currentPic = event.target.files[0];
                console.log(this.currentPic);
            }
        },
        components: {
            muRaisedButton
        }
    }
</script>
<style lang="less" scoped>
    .photos_wrapper {
        h2 {
            font-size: 24px;
            margin-bottom: 30px;
        }
    }
</style>
