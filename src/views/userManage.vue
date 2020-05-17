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
        <div v-for="(item,index) in list" :key="index"
              >
            <van-card
                    :price="item.endTime"
                    currency="截至时间"
                    @desc="onDesc"
                    :title="item.username"
                    :thumb="item.headimgurl"
            >
                <template #footer>
                    <van-button size="mini" round @click="selectStart(index)">更新</van-button>
                </template>
            </van-card>
        </div>
    </van-list>
    <van-popup v-model="show" position="bottom">
        <van-datetime-picker
                type="datetime"
                :formatter="formatter"
                :min-date="new Date()"
                @cancel="cancel"
                @confirm="sconfirm"
        />
    </van-popup>
    </div>
</template>

<script>
    export default {
        name: "userManage",
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
        methods: {
            onLoad() {
                // 异步更新数据
                this.queryAllUser()
            },
            onDesc(item) {
                // 异步更新数据
                let value = "公司：";
                return value;
            },
            selectStart(e){
                this.index = e ;
                this.show = true;
            },
            cancel(){
                this.show = false
            },
            formatter(type, value){
                if (type === 'year') {
                    return `${value}年`;
                } else if (type === 'month') {
                    return `${value}月`
                } else if (type === 'day' ) {
                    return `${value}日`
                } else if (type === 'hour' ) {
                    return `${value}小时`
                } else {
                    return `${value}分`
                }
                return value;
            },
            async sconfirm(value){
                this.show = false;
                let index = this.index;
                let startTime = this.dateFtt("yyyy-MM-dd hh:mm:ss", new Date(value));
                this.list[index].endTime =  startTime ;
                let {data: res} = await this.$api.common.updateUser({
                    "userId": this.list[index].userId,
                    "endTime": startTime
                })
                if (res.code === '0000') {
                    this.$notify({type: 'success', message: "更新成功"})
                } else {
                    this.$notify({type: 'danger', message: res.msg})
                }
            },
            async queryAllUser() {
                let {data: res} = await this.$api.common.queryAllUser({
                    pageSize: this.size,
                    pageNum: (this.page - 1) * 5 + 1
                })
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
            dateFtt(fmt,date) { //author: meizz
                var o = {
                    "M+" : date.getMonth()+1,                 //月份
                    "d+" : date.getDate(),                    //日
                    "h+" : date.getHours(),                   //小时
                    "m+" : date.getMinutes(),                 //分
                    "s+" : date.getSeconds(),                 //秒
                    "q+" : Math.floor((date.getMonth()+3)/3), //季度
                    "S"  : date.getMilliseconds()             //毫秒
                };
                if(/(y+)/.test(fmt))
                    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
                for(var k in o)
                    if(new RegExp("("+ k +")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                return fmt;
            }
        }
    }
</script>

<style scoped>

</style>