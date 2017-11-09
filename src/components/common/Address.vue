<template>
  <div class="address-template" v-bind:class="{ 'label-setting' : isResetStyle }">
    <group>
      <x-address title="城市"  @on-hide="getaddress(form.address)" value-text-align="left" v-model="form.address" raw-value :list="addressData" hide-district :placeholder="defalutAdrress"></x-address>
    </group>
  </div>
</template>

<script>
import { Group, XAddress, ChinaAddressV3Data, Cell, Value2nameFilter as value2name } from 'vux'
import api from '@/service/index'
export default {
  components: {
    Group,
    XAddress,
    Cell
  },
  props: ['defaultValue', 'isResetStyle'],
  data() {
    return {
      addressData: ChinaAddressV3Data,
      form: {
        address: []
      },
      addressInfo: '',
      defalutAdrress: '广东省 广州市'
    }
  },
  created() {
    if (!this.defaultValue) {
      api.getCurrentCity().then(result => {
        // console.log(`current address : ${result.data.data}`)
        if (result.data.code === 0) {
          const getAddress = result.data.data.replace('_', ' ')
          const splitAddress = result.data.data.split('_')
          this.defalutAdrress = getAddress
          this.form.address = [splitAddress[0], splitAddress[1]]
          this.$emit('getaddress', this.defalutAdrress)
        }
      });
    } else {
      const getAddress = this.defaultValue.replace('_', ' ')
      const splitAddress = this.defaultValue.split('_')
      this.defalutAdrress = getAddress
      this.form.address = [splitAddress[0], splitAddress[1]]
      this.$emit('getaddress', this.defalutAdrress)
    }
  },
  methods: {
    getaddress(value) {
      this.addressInfo = value2name(value, ChinaAddressV3Data)
      // console.log(this.addressInfo)
      this.$emit('getaddress', this.addressInfo)
    }
  }
}
</script>
<style lang="less">
.address-template {
  .weui-cells {
    margin-top: 0;
  }
  .weui-label {
    width: 3em;
  }
  .vux-popup-picker-select {
    color: #999;
  }
}
.label-setting {
  .weui-label {
    width: 6em;
  }  
}
</style>
