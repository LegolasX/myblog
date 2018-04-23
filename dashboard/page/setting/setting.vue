<template>
    <div class="setting_wrapper">
        <mu-appbar title="Setting">
            <mu-icon-button  @click="goBack" slot="left">
                <span class="icon-close2"></span>
            </mu-icon-button>
            <mu-flat-button slot="right" label="SAVE"></mu-flat-button>
            <mu-icon-button slot="right">
                <span class="icon-ellipsis-v"></span>
            </mu-icon-button>
        </mu-appbar>
        <div class="setting_content">
            <mu-paper :zDepth="2" class="profile_setting">
                <div class="profile_content">
                    <div class="profile_preview" :style="{backgroundImage: user.bgUrl ? 'Url(' + user.bgUrl + ')' : ''}">
                        <img class="profile_avatar" :src="user.avatar" alt="头像加载失败">
                        <h3 class="profile_nickname">{{user.nickname}}</h3>
                        <p class="profile_signature">{{user.signature}}</p>
                        <p class="profile_information">{{user.information}}</p>
                        <div class="profile_actions">
                            <mu-raised-button label="修改头像" @click="$refs.avatar.click()" primary>
                                <input ref="avatar" @change="inputChange($event, true)" type="file" name="avatar_file" class="upload_input">
                            </mu-raised-button>
                            
                            <mu-raised-button label="修改背景" @click="$refs.bg.click()" secondary>
                                <input ref="bg" @change="inputChange($event, false)" type="file" name="bg_file" class="upload_input">
                            </mu-raised-button>
                        </div>
                    </div>
                    <div class="profile_info">
                        <div class="profile_title">
                            <h2>ACCOUNT SETTING</h2>
                            <P>Edit your nickname, avatar, signature, etc.</P>
                        </div>
                        <mu-text-field label="username" v-model="user.username" :full-width="true" disabled/>
                        <mu-text-field label="nickname" v-model="user.nickname" :full-width="true" hintText="笔名/昵称/网名" :max-length="20" @textOverflow="textOverflow('nickname')" :errorText="usernameErrorText"/>
                        <mu-text-field label="Signature" v-model="user.signature"  :full-width="true" hintText="个性签名，不超过50个字符" :max-length="50" @textOverflow="textOverflow('signature')" :errorText="signatureErrorText"/>
                        <mu-text-field label="Personal Information" v-model="user.information" :full-width="true" hintText="个人介绍，不超过200个字符"  multiLine :rows="2" :max-length="200" error-text=""/>
                        <mu-text-field label="Background Image Url" v-model="user.bgUrl" :full-width="true" hintText="主页背景图的Url"/>  
                        <mu-raised-button class="button_save" label="保存" @click="updateProfile" primary/>
                    </div>
                </div>
            </mu-paper>
        </div>
    </div>
</template>
<script>
    import {
        getUserProfile,
        updateUserProfile
    } from '../../api/user.js';
    import {uploadFile} from '../../util/qiniu';
    import muAppbar from 'muse-ui/src/appBar/index';
    import muIconButton from 'muse-ui/src/iconButton/index';
    import muFlatButton from 'muse-ui/src/flatButton/index';
    import muPaper from 'muse-ui/src/paper/index';
    import muRaisedButton from 'muse-ui/src/raisedButton/index';
    import muTextField from 'muse-ui/src/textField/textField.vue';

    export default {
        data () {
            return {
                user: {},
                usernameErrorText: '',
                signatureErrorText: ''
            }
        },
        created () {
            getUserProfile().then(res => {
                if (res.data.code === 200) {
                    this.user = res.data.data;
                    this.user.avatar = '//static.sunriseteam.cn/' + this.user.avatar;
                    this.user.bgUrl = '//static.sunriseteam.cn/' + this.user.bgUrl;
                }
            })
        },
        methods: {
            inputChange (event, isAvatar) {
                let file = event.target.files[0];
                if (isAvatar) {
                    this.user.avatar = window.URL.createObjectURL(file);
                } else {
                    this.user.bgUrl = window.URL.createObjectURL(file);
                }
                let extName = file.name.split('.')[1];
                let filename =  `${this.user.username}/profile/${Date.now()}.${extName}`
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
                        if (isAvatar) {
                            this.user.changeAvatar = res.key;
                        } else {
                            this.user.changeBgUrl = res.key;
                        }
                        
                    }
                })
            },
            textOverflow (key) {
                if (key === 'username') {
                    this.usernameErrorText = '超过了20个字符'
                } else if (key === 'signature') {
                    this.signatureErrorText = '超过了50个字符'
                }
            },
            goBack () {
                this.$router.push('dashboard');
            },
            updateProfile () {
                let profile = Object.assign({}, this.user);
                if (profile.changeAvatar) {
                    profile.avatar = profile.changeAvatar
                } else {
                    delete profile.avatar;
                }
                if (profile.changeBgUrl) {
                    profile.bgUrl = profile.changeBgUrl;
                } else {
                    delete profile.bgUrl;
                }
                delete profile.changeBgUrl;
                delete profile.changeAvatar;
                delete profile.userId;
                delete profile.username;

                updateUserProfile(this.user.username, profile).then(res => {
                    if (res.data.code === 200) {
                        this.$toast({
                            message: '资料更新成功'
                        })
                    }
                });
            }
        },
        components: {
            muAppbar,
            muIconButton,
            muFlatButton,
            muRaisedButton,
            muTextField,
            muPaper
        }
    }
</script>
<style lang="less">
    .upload_input {
        display: none;
    }
    .setting_wrapper {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #f5f5f7;
        z-index: 3;
        overflow: scroll;

        .mu-icon-button .mu-ripple-wrapper {
            &:hover {
                background-color: rgba(0,0,0,0.1);
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
        .setting_content {
            padding: 40px 20px;
            .profile_setting {
                position: relative;
                width: 100%;
                max-width: 1100px;
                margin: 0 auto;

                .profile_content {
                    height: 650px;
                    
                    .profile_preview {
                        position: relative;
                        width: 400px;
                        height: 100%;
                        float: left;
                        padding: 30px 40px;
                        text-align: center;
                        background-position: center center;
                        background-repeat: no-repeat;
                        background-size: cover;
                        color: white;

                        &:before {
                            content: "";
                            position: absolute;
                            bottom: 0;
                            right: 0;
                            left: 0;
                            top: 0;
                            background-color: rgba(0, 0, 0, 0.3);
                            opacity: 1;
                            overflow-y: hidden;
                            transition: opacity 1s;
                        }

                        > * {
                            position: relative;
                            z-index: 1;
                        }
                        .profile_bg {
                            position: absolute;
                            bottom: 0;
                            right: 0;
                            left: 0;
                            top: 0;
                        }
                        .profile_nickname {
                            font-size: 22px;
                            font-weight: 200;
                            letter-spacing: 2px;
                        }
                        .profile_signature {
                            font-size: 16px;
                            margin-top: 10px;
                            margin-bottom: 30px;
                        }
                        .profile_information {
                            text-align: left;
                            font-size: 14px;
                            margin-bottom: 50px;
                        }

                        .profile_actions {
                            position: absolute;
                            left: 50%;
                            transform: translate(-50%, 0);
                            text-align: center;
                            bottom: 60px;
                        }

                        .profile_avatar {
                            width: 170px;
                            height: 170px;
                            border-radius: 50%;
                            margin-top: 30px;
                            margin-bottom: 30px;
                            box-shadow: 0 0 0 2px rgba(255, 255, 255, .7), 0px 2px 20px 3px rgba(0, 0, 0, .25);
                        }
                    }

                    .profile_info {
                        overflow: hidden;
                        padding: 40px;

                        .profile_title {
                            margin-bottom: 30px;
                            h2 {
                                font-weight: 400;
                                letter-spacing: 2px;
                                position: relative;
                                z-index: 1;
                            }

                            p {
                                font-weight: 400;
                                letter-spacing: 1px;
                                color: #777777;
                                margin-top:15px;
                                position: relative;
                                z-index: 1;
                            }
                        }
                        .button_save {
                            margin-top: 20px;
                            float:right;
                        }
                    }
                }
                
            }
        }
        
        .toolbar {
            height: 64px;

        }
    }
</style>
