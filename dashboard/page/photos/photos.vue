<template>
    <div class="photos_wrapper">
        <h2>图片管理</h2>
        <input type="file" name="photo" @change="fileUpload">
        <mu-raised-button label="添加分类" @click="posttest" labelPosition="after">
            <span class="icon-plus-circle icon_raised_button"></span>
        </mu-raised-button>
    </div>
</template>
<script>
    import muRaisedButton from 'muse-ui/src/raisedButton/index';

    export default {
        data() {
            return {
                currentPic: null,
            }
        },
        methods: {
            posttest() {
                let formData = new FormData();
                formData.append('cover', this.currentPic);
                http.post('/upload', formData).then(res => {
                    console.log(res);
                })
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
