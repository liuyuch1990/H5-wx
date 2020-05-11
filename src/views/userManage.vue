<template>
    <van-list
            v-model="loading"
            :finished="finished"
            :offset="20"
            finished-text="没有更多了"
            class="activity"
            @load="onLoad"
    >
        <div v-for="item in list" :key="item.id"
              >
            <van-card
                    num="2"
                    price="2.00"
                    :desc="item.endTime"
                    :title="item.username"
                    :thumb="item.headimgurl"
            >
                <template #footer>
                    <van-button size="mini">按钮</van-button>
                </template>
            </van-card>
        </div>
    </van-list>
</template>

<script>
    export default {
        name: "userManage",
        data() {
            return {
                bar: [],
                show: false,
                loading: false,
                finished: false,
                list: [],
                page: 1,
                size: 5,
                actives: "",
                loading: false,
                finished: false,
                name: "",
                remark: ""
            }
        },
        methods: {
            onLoad() {
                // 异步更新数据
                this.queryAllUser()
            },
            async queryAllUser() {
                let {data: res} = await this.$api.common.queryAllUser()
                this.loading = false;
                this.page++;
                if (res.code === '0000') {
                    if (res.result.user.length == 0) {
                        this.finished = true;
                    } else {
                        this.list = this.list.concat(res.result.user);
                    }
                } else {
                    this.finished = true;
                    this.$notify({type: 'danger', message: res.msg})
                }
            },
        }
    }
</script>

<style scoped>

</style>