<template src="./index.html">
</template>

<script>
const graph = require('./graph').default;
const test = require('./test').default;


export default {
  name: 'Graph',
  data () {
    return {
      msg: 'Welcome to pokemon',
    }
  },
  methods:{
    writeCal(){ graph.write() },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./graph.css">
</style>
