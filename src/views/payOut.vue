<template>
    <div>
        <van-cell is-link @touchstart.native.stop="keyboard = 'multiExtraKey'">
            提现页
        </van-cell>
        <van-field
                readonly
                clickable
                :value="account"
                label="您的余额￥"
                @touchstart.native.stop="show = true"
        />
        <van-field
                readonly
                clickable
                :value="value"
                label="提现金额￥"
                placeholder="请输入金额"
                @touchstart.native.stop="show = true"
        />
        <van-field
                readonly
                clickable
                :value="value2"
                label="到账金额￥"
                placeholder="请输入金额"
                @touchstart.native.stop="show = true"
        />
        <van-number-keyboard
                v-model="value"
                :show="show"
                theme="custom"
                extra-key="."
                close-button-text="Close"
                @blur="show = false"
                @input="onInput"
                @delete="onDelete"
        />
        <van-button round type="danger" @click="submitApproval()" style="">确定提现</van-button>
        <van-divider>温馨提示提现过程中会收取1%的手续费</van-divider>
        <van-field
                readonly
                rows="2"
                autosize
                label="注:"
                type="textarea"
                value="1、实际到账金额为输入提现金额的99%；
2、申请成功后，费用会在两个工作日内到达提现账户；
3、请仔细核对填写的提现账号，确认正确后再点击提交，如因输入错误账号造成的损失，由个人承担全部责任，平台概不负责。"
                maxlength="50"
                placeholder="请输入留言"
                show-word-limit
        />
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "payOut",
        data() {
            return {
                value: "",
                value2: "",
                account:"",
                show: false,
                keyboard: 'default',
            };
        },
        computed: {
            ...mapGetters('common', {
                userInfo: 'userInfo',
                code: 'code'
            })
        },
        mounted() {
            if (this.userInfo.userId) {
                this.syncUserInfo(this.userInfo.userId)
            }
        },
        methods: {
            onInput(value) {
                this.value2 = ((this.value * 10 + value) * (0.99)).toFixed(2)
            },
            syncUserInfo(value) {
                this.$api.common.syncUserInfo(
                    value
                ).then(({data:res})=>{
                    if (res.code === '0000') {
                        this.account = res.result.user.account
                    } else {
                        this.account = this.userInfo.account
                    }
                })
            },
            submitApproval() {
                if (parseFloat(this.account) > parseFloat(this.value)) {
                    this.$api.common.saveApproval({
                        "userId": this.userInfo.userId,
                        "originalMoney": this.value,
                        "money": this.value2,
                        "status": "1"
                    }).then(({data: res}) => {
                        if (res.code === '0000') {
                            this.$notify({type: 'success', message: "提现成功"})
                            this.account = this.account - this.value;
                        } else {
                            this.$notify({type: 'danger', message: res.msg})
                        }
                    })
                } else {
                    this.$notify({type: 'danger', message: "余额不足"})
                }
            },
            onDelete(value) {
                this.value2 =parseInt(this.value/10) ==0?0.00: ((this.value / 10) * (0.99)).toFixed(2)
            },
        },
    }
</script>

<style scoped>

</style>