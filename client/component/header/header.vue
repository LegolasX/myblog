<template>
    <header class="blog_header" :style="user.bgUrl | bgStyleSlim">
        <div class="overlay"></div>
        <section class="header_intro">
            <div class="header_info">
                <img class="header_avatar" :src="user.avatar | avatarUrl" alt="">
                <div>
                    <h1>{{user.nickname || '未设置'}}</h1>
                    <p>{{user.signature || '这个人很懒，还没有个性签名'}}</p>
                </div>
            </div>
            <ul class="header_menu">
                <li @click="gotoBlog">
                    <span class="icon-home"></span>
                </li>
                <li @click="gotoBBS">
                    <span class="icon-comments"></span>
                </li>
                <li @click="fullScreenSwitch">
                    <span :class="[isFull ? 'icon-compress' : 'icon-expand']"></span>
                </li>
            </ul>
            <p class="header_words">{{user.information || '这个人很懒，还没有个人介绍'}}</p>
            <button type="button" class="button button_tobbs" @click="gotoBBS">留言</button>
        </section>
    </header>
</template>
<script>
    export default {
        data() {
            return {
                isFull: false
            }
        },
        computed: {
            user: {
                get () {
                    return this.$store.state.user;
                }
            }
        },
        methods: {
            gotoBlog () {
                if (this.user && this.user.username) {
                    this.$router.push({
                        name: 'blog',
                        params: {
                            username: this.user.username
                        }
                    });
                } else {
                    this.$toast({
                        message: '缺少参数'
                    });
                }   
            },
            gotoBBS () {
                if (this.user && this.user.username) {
                    this.$router.push({
                        name: 'bbs',
                        params: {
                            username: this.user.username
                        }
                    });
                } else {
                    this.$toast({
                        message: '缺少参数'
                    });
                }   
            },
            fullScreenSwitch() {
                this.isFull = !this.isFull;
                if (!document.fullscreenElement && // alternative standard method
                    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) { // current working methods
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                    } else if (document.documentElement.msRequestFullscreen) {
                        document.documentElement.msRequestFullscreen();
                    } else if (document.documentElement.mozRequestFullScreen) {
                        document.documentElement.mozRequestFullScreen();
                    } else if (document.documentElement.webkitRequestFullscreen) {
                        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    .button {
        width: 100px;
        margin-top: 15px;
        padding: 5px 10px;
        color: white;
        border: 1px solid #eee;
        border-radius: 6px;
        font-size: 16px;
        line-height: 30px;
        cursor: pointer;

        &:hover {
            background-color: rgba(255, 255, 255, 0.15);
        }
    }

    .blog_header {
        @media screen and (max-width: 960px) {
            width: 100%;
            position: relative;
            height: initial;
        }
        width: 33.3%;
        position: fixed;
        height: 100%;
        background-color: #cacaca;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        box-shadow: 5px 0px 10px 8px rgba(0, 0, 0, .05);
        
        .overlay {
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
        .header_intro {
            position: relative;
            margin-top: 120px;
            padding: 50px 8%;
            z-index: 2;
            text-align: center;
            color: #e4e4e4;
            .header_avatar {
                border-radius: 50%;
                width: 120px;
                height: 120px;
                box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.7), 0px 2px 20px 3px rgba(0, 0, 0, 0.25);
            }
            .header_info {
                h1 {
                    padding-top: 25px;
                    font-size: 26px;
                    font-weight: 200;
                    letter-spacing: 2px;
                }
                p {
                    font-weight: 200;
                    font-size: 20px;
                    margin-top: 20px;
                }
            }
            
            .header_menu {
                margin-top: 20px;
                text-align: center;
                font-size: 0;
                li {
                    display: inline-block;
                    width: 28px;
                    height: 28px;
                    box-sizing: border-box;
                    cursor: pointer;
                    border: 1px solid white;
                    border-radius: 50%;
                    margin-left: 10px;
                    font-size: 16px;
                    line-height: 28px;
                    vertical-align: top;
                    &:hover {
                        background-color: rgba(255, 255, 255, 0.15);
                    }
                }
            }
            .header_words {
                font-size: 14px;
                text-align: left;
                line-height: 1.5em;
                margin-top: 50px;
            }
            .button_tobbs {
                margin-top: 50px;
            }

            @media screen and (max-width: 960px) {
                margin-top: 0;
                .header_words {
                    display: none;
                }
                .button_tobbs {
                    display: none;
                }
                .header_avatar {
                    width: 100px;
                    height: 100px;
                    vertical-align: top;
                    margin-right: 15px;
                }
                .header_info {
                    > div {
                        display: inline-block;
                        text-align: left;
                        vertical-align: top;

                        h1 {
                            padding-top: 15px;
                        }

                        p {
                            font-size: 16px;
                        }
                    }
                }
                
            }

            @media screen and (max-width: 480px) {
                padding: 20px 10px;
                .header_avatar {
                    width: 70px;
                    height: 70px;
                }

                .header_info {
                    > div {
                        h1 {
                            font-size: 18px;
                            padding-top: 10px;
                        }
                        p {
                            font-size: 12px;
                            margin-top: 5px;
                        }
                    }
                }
            }
        }
    }
</style>
