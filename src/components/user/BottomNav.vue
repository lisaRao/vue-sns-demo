<template>
  <div class="bottom-nav-box">
      <group>
        <cell :title="title1" :link="{path:'/todayluck'}" ></cell>
        <cell :title="title2" :link="{path:'/weather'}" ></cell>
      </group>
  </div>
</template>

<<script>
import { Group,  Cell } from 'vux'
export default {
  components: {
      Group,
      Cell
  },
  data() {
    return {
        title1: '星座运程',
        title2: '天气'
    }
  }
}
</script>
<style lang="less" scoped>

</style>
