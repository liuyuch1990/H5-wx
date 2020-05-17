<template>
    <div>
    <van-cell is-link @touchstart.native.stop="keyboard = 'multiExtraKey'">
        提现页
    </van-cell>
    <van-field
            readonly
            clickable
            :value="value"
            label="金额￥"
            placeholder="请输入金额"
            @touchstart.native.stop="keyboard = 'bindValue'"
    />
    <van-number-keyboard
            :show="keyboard === 'multiExtraKey'"
            close-button-text="Close"
            theme="custom"
            :extra-key="['00', '.']"
            @blur="keyboard = ''"
            @input="onInput"
            @delete="onDelete"
    />
    </div>
</template>

<script>
    export default {
        name: "payOut",
        data() {
            return {
                value: '',
                keyboard: 'default',
            };
        },
        methods: {
            onInput(value) {
                this.$toast(`${this.t('input')}: ${value}`);
            },
            onDelete() {
                this.$toast(this.t('delete'));
            },
        },
    }
</script>

<style scoped>

</style>