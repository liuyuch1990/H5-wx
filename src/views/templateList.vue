<template>
    <div class="templateList">
        <!-- <van-search placeholder="请输入搜索关键词" v-model="value" /> -->
        <van-tabs v-model="active" sticky @click="change">
            <van-tab v-for="(item, index) in tabList" :title="item" :key="index">
                <div v-for="(item, index) in activityEntityList" :title="item" :key="index">
                    <div class="center link">
                        <div class="icon"><img :src="item.thumbnail"/></div>
                        <div class="cont">
                            <span class="t1"><span style="color: #32b6ea;">[{{item.activityState}}] </span>{{item.activityName}}</span>
                            <span class="t2">最后跟新时间：{{item.updateTime || item.startTime}}</span>
                        </div>
                    </div>
                    <div class="foot">
                        <span @click="link(item)"><van-icon name="points"/>报名表</span>
                        <span @click="commentMgr(item)"><van-icon name="chat"/>留言管理</span>
                        <span @click="edit(item)"><van-icon name="bars"/>编辑</span>
                        <span @click="showMore(item)"><van-icon name="bars"/>更多操作</span>
                    </div>
                </div>
            </van-tab>
        </van-tabs>
        <div class="footer-bar">
            <div class="item">
                <van-icon name="wap-home"  @click="shouye"/>
                <span>商户中心</span>
            </div>
            <div class="item">
                <van-icon name="invition" @click="example"/>
                <span>精选案例</span>
            </div>
            <div class="item" @click="makeActive">
                <van-icon name="add"/>
                <span style=" color: rgb(53, 126, 235);">制作</span>
            </div>
            <div class="item">
                <van-icon name="column"  @click="jiaocheng"/>
                <span>活动教程</span>
            </div>
            <div class="item">
                <van-icon name="question"  @click="wenti"/>
                <span>常见问题</span>
            </div>
        </div>
        <van-popup
                v-model="commentShow"
                position="bottom"
                round
                :style="{ height: '80%' }">
            <div class="commond-wrap">
                <comment v-if='commentShow' :id='id' ishide="1"></comment>
            </div>
        </van-popup>
        <van-action-sheet
                v-model="show"
                @select="select"
                :actions="actions"
                cancel-text="取消"
        />
    </div>
</template>
<script>
    import {mapGetters, mapMutations} from 'vuex';
    import Comment from "../components/comment";
    import {ImagePreview} from "vant"; // 引入Vant图片预览组件
    export default {
        name: "template-list",
        data() {
            return {
                active: 0,
                actions: [
                    {name: '删除活动'},
                    {name: '复制活动'},
                    {name: '导出报名表'},
                    {name: '活动二维码'}
                ],
                tabList: ["全部", "未开始", "进行中", "已结束", "已下架"],
                show: false,
                itemCache: {},
                activityEntityList: [],
                loading: false,
                finished: true,
                commentShow: false,
                id: ''
            };
        },
        computed: {
            ...mapGetters('common', {
                userInfo: 'userInfo'
            })
        },
        mounted() {
            this.queryActivityByUserId('')
        },
        methods: {
            commentMgr(item) {
                this.id = item.id;
                this.commentShow = true;
            },
            showMore(item) {
                this.show = true;
                this.itemCache = item;
            },
            select(item, index) {
                if (index == 1) {
                    this.$api.common.barginCopy({
                        id: this.itemCache.id
                    }).then(({data: res}) => {
                        if (res.code === '0000') {
                            this.queryActivityByUserId(this.active)
                            this.show = false;
                        } else {
                            this.$notify({type: "danger", message: res.msg})
                        }
                        ;
                    });
                } else if (index == 0) {
                    this.$api.common.barginDelete([this.itemCache.id]).then(({data: res}) => {
                        if (res.code === '0000') {
                            this.queryActivityByUserId(this.active)
                            this.show = false;
                        } else {
                            this.$notify({type: "danger", message: res.msg})
                        }
                    });
                } else if (index == 3) {//图片预览
                    ImagePreview({
                        images: this.itemCache.qr.split('&&'), //需要预览的图片 URL 数组
                        showIndex: true, //是否显示页码
                        loop: false, //是否开启循环播放
                        startPosition: 0 //图片预览起始位置索引
                    })
                } else if (index == 2) {
                    this.$api.common.orderExport({
                        activityId: this.itemCache.id,
                        orderType: this.itemCache.activityType
                    }).then(({data: res}) => {
                        if (res.code === '0000') {
                            this.show = false;
                            window.top.location.href = "https://wp.sharkmeida.cn/excel/" + decodeURI(res.result.fileName);
                        } else {
                            this.$notify({type: "danger", message: res.msg})
                        }
                    });
                }
            },
            link(item) {
                this.$router.push({path: "activitySign", query: {id: item.id}})
            },
            edit(item) {
                if (item.activityType == '3') {
                    this.$router.push({path: "bargainDev", query: {id: item.id, isUpdate: true}})
                }
                if (item.activityType == '4') {
                    this.$router.push({path: "pingtuanDev", query: {id: item.id, isUpdate: true}})
                }
                if (item.activityType == '2') {
                    this.$router.push({path: "jizanDev", query: {id: item.id, isUpdate: true}})
                }
            },
            makeActive() {
                this.$router.push({path: 'activityList'})
            },
            shouye() {
                this.$router.push({path: 'peopleHome'})
            },
            example() {
                window.location.href = 'https://mp.weixin.qq.com/s/wYbgjxQt43iAB40J9rgOaA'
            },
            kefu() {
                window.location.href = 'https://mp.weixin.qq.com/s/wYbgjxQt43iAB40J9rgOaA'
            },
            jiaocheng() {
                window.location.href = 'https://mp.weixin.qq.com/s/wYbgjxQt43iAB40J9rgOaA'
            },
            wenti() {
                window.location.href = 'https://mp.weixin.qq.com/s/wYbgjxQt43iAB40J9rgOaA'
            },
            change(name) {
                this.active = name;
                this.queryActivityByUserId(!!name ? name.toString() : '')
            },
            async queryActivityByUserId(activityState) {
                let {data: res} = await this.$api.common.queryActivityByUserId({
                    "createUser": this.userInfo.userId,
                    "activityState": activityState
                });
                if (res.code === "0000") {
                    this.activityEntityList = res.result.activityEntityList;
                } else {
                    this.$notify({type: "danger", message: res.msg})
                }

            }
        },
        computed: {
            ...mapGetters('common', {
                userInfo: 'userInfo'
            })
        },
        components: {
            Comment
        }
    };
</script>
<style lang="scss" scoped>
    .footer-bar {
        position: fixed;
        bottom: 0;
        height: 60px;
        width: 100%;
        border-top: 1px solid #ccc;
        background: #fffffff0;
        z-index: 200;
        display: flex;
        justify-content: space-around;

        .item {
            width: 60px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            font-size: 14px;
            font-weight: bold;
            color: #a2a2a2;

            i {
                font-size: 38px;
            }

            .van-icon-add {
                position: relative;
                top: -15px;
                color: rgb(53, 126, 235);
            }
        }
    }

    /deep/ .van-tabs__line {
        background: rgb(53, 126, 235);
    }

    .center {
        height: 60px;
        background: #fff;
        border-bottom: 1px solid rgb(231, 231, 231);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .t1 {
            font-size: 20px;
            color: rgb(136, 136, 136);
        }

        .t2 {
            font-size: 12px;
            color: rgb(212, 211, 211);
        }
    }

    .center.link {
        height: 90px;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;

        .icon {
            width: 70px;
            height: 70px;
            font-size: 24px;
            background: rgb(97, 132, 247);
            line-height: 35px;
            text-align: center;
            color: #fff;
            font-weight: bold;
            border-radius: 5px;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .cont {
            display: flex;
            flex-direction: column;
            width: 270px;
            justify-content: center;

            .t1 {
                font-size: 20px;
                color: rgb(22, 22, 22);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .t2 {
                margin-top: 5px;
                font-size: 16px;
                color: #cacaca;
            }
        }
    }

    .foot {
        height: 30px;
        border-bottom: 1px solid #e7e7e7;
        margin: 0 0 10px 0;
        font-size: 14px;
        color: #2b568e;
        display: flex;
        align-items: center;
        justify-content: space-around;

        > span {
            display: flex;
            align-items: center;
        }
    }

    .commond-wrap {
        height: 100%;
    }
</style>

