<template>
    <div class="app">
        <section class="half_top">
            <h1>Teresa</h1>
            <p>One Account, All Of Your Note</p>
        </section>
        <section class="float_card login_card">
            <div class="three_one"></div>
            <div class="login_avatar"></div>
            <p class="login_text">{{username ? username.toUpperCase() : 'Hey'}}, Welcome To Login</p>
            <mu-text-field label="账号" v-model="username" type="text" :label-float="true"></mu-text-field>
            <mu-text-field label="密码" v-model="password" type="password" :label-float="true"></mu-text-field> 
            <div class="login_button">
                <mu-raised-button label="注册" class="demo-raised-button"/>
                <mu-raised-button label="登录" class="demo-raised-button" primary @click="login"/>
            </div>
        </section>
        <section class="half_bottom">
            <p>We’re Tiny along with Designer News, Crew, MetaLab, Flow, Pixel Union, We Work Remotely and more. © 2018 Dribbble. All rights reserved.</p>
        </section>
    </div>
</template>

<script>
    import muTextField from 'muse-ui/src/textField/textField.vue';
    import muRaisedButton from 'muse-ui/src/raisedButton/index';
    import {
        login
    } from '../../api/login'

    export default {
        data() {
            return {
                username: '',
                password: ''
            }
        },
        created() {
        },
        methods: {
            login() {
                login(this.username, this.password).then((res) => {
                    
                    if (res.data.code === 200) {
                        if (this.$route.query.returnUrl) {
                            location.href = this.$route.query.returnUrl;
                        } else {
                            this.$router.push({
                                name: 'dashboard'
                            });
                        }
                    } else {
                        this.$toast({
                            message: '登录失败'
                        });
                    }
                })
            }
        },
        components: {
            muTextField,
            muRaisedButton
        }
    }
</script>·

<style lang="less" scoped>
    .half_top {
        height: 50%;
        background: url('../../assets/images/1.jpeg') left top no-repeat;
        background-size: cover;
        color: white;
        text-align: center;
        h1 {
            font-size: 40px;
            padding: 30px 0;
        }
        p {
            font-size: 20px;
        }
    }

    .float_card {
        margin: 0 auto;
        border-radius: 10px;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.05), 0 15px 100px 0 rgba(0, 0, 75, 0.125);
        transition: box-shadow ease-out .5s, opacity linear .3s;
        transition-delay: .2s;
        &:hover {
            box-shadow: 0 5px 12px rgba(0, 0, 0, 0.05), 0 15px 180px 0 rgba(0, 0, 50, 0.25);
            opacity: 1;
        }
    }

    .login_card {
        position: absolute;
        z-index: 2;
        top: 200px;
        left: 50%;
        transform: translate(-50%, 0);
        width: 350px;
        height: 480px;
        background-color: white;
        text-align: center;
        .three_one {
            height: 125px;
            border-radius: 10px 10px 0 0;
            background: linear-gradient(135deg, #dfa36e 0%, #ea8783 50%, #db8869 55%, #da817c 100%);
            margin-bottom: 70px;
        }
        .login_avatar {
            position: absolute;
            top: 70px;
            left: 50%;
            margin-left: -50px;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-image: linear-gradient(60deg, #abecd6 0%, #fbed96 100%);
        }
        .login_text {
            margin-bottom: 20px;
        }
        .login_button {
            margin-top: 20px;
            display: flex;
            justify-content: space-around;
        }
    }

    .half_bottom {
        position: relative;
        height: 50%;
        p {
            position: absolute;
            bottom: 20px;
            width: 100%;
            text-align: center;
        }
    }
</style>
