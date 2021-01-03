<template>
    <div>
        <van-list
                v-model="loading"
                :finished="finished"
                :offset="20"
                finished-text="没有更多了"
                class="activity"
                @load="onLoad"
        >
            <div v-for="(item,index) in list" :key="index">
                <van-card
                        :price="item.money"
                        currency="￥"
                        :desc="item.desc"
                        :title="item.username"
                        :thumb="item.headimgurl"
                >
                    <template #tags>
                        {{item.company}}
                        <van-tag>{{item.contact}}</van-tag>
                    </template>
                    <template #footer>
                        申请时间：{{item.createTime}}
                        <van-button size="mini" round   :text="item.button" type="danger" v-show="item.show"></van-button>
                        <van-button size="mini" round   :text="item.button" type="info" v-show="!item.show"></van-button>
                    </template>
                </van-card>
            </div>
        </van-list>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "payList",
        data() {
            return {
                index:'',
                show: false,
                loading: false,
                endTime: "",
                finished: false,
                list: [],
                page: 1,
                size: 5,
                actives: "",
                finished: false,
                name: "",
                remark: ""
            }
        },
        computed: {
            ...mapGetters('common', {
                userInfo: 'userInfo',
                code: 'code'
            })
        },
        methods: {
            onLoad() {
                // 异步更新数据
                this.queryAllApproval()
            },
            async queryAllApproval() {
                let {data: res} = await this.$api.common.queryAllApproval({
                    userId: this.userInfo.userId,
                    pageSize: this.size,
                    pageNum: (this.page - 1) * 5
                })
                this.loading = false;
                this.page++;
                if (res.code === '0000') {
                    if (res.result.approval.length == 0) {
                        this.finished = true;
                    } else {
                        this.list = this.list.concat(res.result.approval);
                        this.list.filter(e => {
                            e.desc = "公司名:" + e.companyName
                            e.company = "地址："+e.companyProvince+ e.companyCity;
                            e.contact = "联系方式：" + e.mobile
                            if(e.status==='1'){
                                e.button = "待审批";
                                e.show = true;
                            }else{
                                e.button = "通过";
                                e.show = false;
                            }

                        })
                    }
                } else {
                    this.finished = true;
                    this.$notify({type: 'danger', message: res.msg})
                }
            }
        }
    }
</script>

<style scoped>

</style>