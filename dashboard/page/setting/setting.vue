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
                    <div class="profile_avatar">
                        <img src="../../assets/images/avatar.jpg" alt="">
                        <h3 class="profile_nickname">ECIZEP</h3>
                        <p class="profile_signature">you will lose everything at any moment</p>
                        <p class="profile_information">
                            我是一个 21 岁的 homeschooler，爱好旅行以及一切富有创造性的事物，尤其是摄影、设计和编程。这个世界就是我的学校。学自己之所想所爱。自由的身心定能使我成为一个一直朝前行走的行者。
                        </p>
                        <div class="profile_actions">
                            <mu-raised-button label="修改头像" @click=";" primary>
                            </mu-raised-button>
                            <mu-raised-button label="修改密码" @click=";" secondary>
                            </mu-raised-button>
                        </div>
                        
                    </div>
                    <div class="profile_info">
                        <div class="profile_title">
                            <h2>ACCOUNT SETTING</h2>
                            <P>Edit your nickname, avatar, signature, etc.</P>
                        </div>
                        <mu-text-field label="username" v-model="user.username" :full-width="true" disabled/>
                        <mu-text-field label="nickname" :full-width="true" hintText="笔名/昵称/网名" :max-length="20" @textOverflow="textOverflow('nickname')" :errorText="usernameErrorText"/>
                        <mu-text-field label="Signature" :full-width="true" hintText="个性签名，不超过50个字符" :max-length="50" @textOverflow="textOverflow('signature')" :errorText="signatureErrorText"/>
                        <mu-text-field label="Personal Information" :full-width="true" hintText="个人介绍，不超过200个字符"  multiLine :rows="2" :max-length="200" error-text=""/>
                        <mu-text-field label="Background Image Url" :full-width="true" hintText="主页背景图的Url"/>  
                        <mu-raised-button class="button_save" label="保存" primary/>
                    </div>
                </div>
            </mu-paper>
        </div>
    </div>
</template>
<script>
    import muAppbar from 'muse-ui/src/appBar/index';
    import muIconButton from 'muse-ui/src/iconButton/index';
    import muFlatButton from 'muse-ui/src/flatButton/index';
    import muPaper from 'muse-ui/src/paper/index';
    import muRaisedButton from 'muse-ui/src/raisedButton/index';
    import muTextField from 'muse-ui/src/textField/textField.vue';

    export default {
        data () {
            return {
                user: {
                    username: 'ecizep'
                },
                usernameErrorText: '',
                signatureErrorText: '',
            }
        },
        methods: {
            textOverflow (key) {
                if (key === 'username') {
                    this.usernameErrorText = '超过了20个字符'
                } else if (key === 'signature') {
                    this.signatureErrorText = '超过了50个字符'
                }
            },
            goBack () {
                this.$router.go(-1);
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
                    
                    .profile_avatar {
                        position: relative;
                        width: 400px;
                        height: 100%;
                        float: left;
                        padding: 30px 40px;
                        text-align: center;
                        background: url('../../assets/images/05.jpg') center center no-repeat;
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

                        img {
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
