<template>
    <header class="blog_header">
        <div class="overlay"></div>
        <section class="header_intro">
            <img class="header_avatar" src="../../assets/images/avatar.jpg" alt="">
            <h1>ECIZEP</h1>
            <p>you will lose everything at any moment</p>
            <ul class="header_menu">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <p class="header_words">我是一个 21 岁的 homeschooler，爱好旅行以及一切富有创造性的事物，尤其是摄影、设计和编程。这个世界就是我的学校。学自己之所想所爱。自由的身心定能使我成为一个一直朝前行走的行者。</p>
        </section>
    </header>
</template>
<script>
    export default {
        data() {
            return {

            }
        }
    }
</script>
<style lang="less" scoped>
    .blog_header {
        width: 33.3%;
        position: fixed;
        height: 100%;
        background: url('../../assets/images/05.jpg') center center no-repeat;
        background-size: cover;
        .overlay {
            position: absolute;
            bottom: 0;
            right: 0;
            left: 0;
            top: 0;
            background-color: rgba(0, 0, 0, 0.5);
            opacity: 1;
            overflow-y: hidden;
            transition: opacity 1s;
        }

        .header_intro {
            position: relative;
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
                    width: 25px;
                    height: 25px;
                    box-sizing: border-box;
                    border: 1px solid white;
                    border-radius: 50%;
                    margin-left: 10px;
                }
            }
            .header_words {
                font-size: 14px;
                text-align: left;
                line-height: 1.5em;
            }
        }
    }
</style>
