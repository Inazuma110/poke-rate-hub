<template>
  <div class="ss-image">
    {{ getImage() }}
    <img :src="ssSrc" id="graph-ss">
  </div>
</template>

<script>
export default {
  data(){
    return {
      savedataIdCode: this.$route.params.savedataIdCode,
      ssSrc: null,
    }
  },
  methods:{
    getImage(){
      this.ssSrc = require(`../api/ss/${this.savedataIdCode}.png`);
    }
  }
}
</script>

<style scoped>

</style>
