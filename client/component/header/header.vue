<template>
    <header class="blog_header">
        <div class="overlay"></div>
        <section class="header_intro">
            <img class="header_avatar" src="../../assets/images/avatar.jpg" alt="">
            <h1>ECIZEP</h1>
            <p>you will lose everything at any moment</p>
            <ul class="header_menu">
                <li>
                    <span class="icon-home"></span>
                </li>
                <li @click="gotoBBS">
                    <span class="icon-comments"></span>
                </li>
                <li @click="fullScreenSwitch">
                    <span :class="[isFull ? 'icon-compress' : 'icon-expand']"></span>
                </li>
            </ul>
            <p class="header_words">我是一个 21 岁的 homeschooler，爱好旅行以及一切富有创造性的事物，尤其是摄影、设计和编程。这个世界就是我的学校。学自己之所想所爱。自由的身心定能使我成为一个一直朝前行走的行者。</p>
            <button type="button" class="button button_tobbs">留言</button>
        </section>
        <section class="header_top">

        </section>
        <section class="header_bottom">

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
        methods: {
            gotoBBS () {
                this.$router.push({
                    name: 'bbs',
                    params: {
                        username: this.$route.params.username || 'ecizep'
                    }
                });
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
            display: none;
        }
        width: 33.3%;
        position: fixed;
        height: 100%;
        background: url('../../assets/images/05.jpg') center center no-repeat;
        background-size: cover;
        box-shadow: 5px 0px 10px 8px rgba(0,
        0,
        0,
        .05);
        /* .header_top {
            height: 60%;
            width: 100%;
            background: url('../../assets/images/two.jpg') center center no-repeat;
            background-size: cover;
            
        }
        .header_bottom {
            height: 40%;
            width: 100%;
            background-color: white;
        } */
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
            h1 {
                padding-top: 25px;
                font-size: 26px;
                font-weight: 200;
                letter-spacing: 2px;
            }
            p {
                font-weight: 200;
                font-size: 20px;
                margin-top: 10px;
            }
            .header_menu {
                margin: 20px 0;
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
        }
    }
</style>
