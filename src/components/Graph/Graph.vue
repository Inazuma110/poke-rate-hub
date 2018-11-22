<template src="./graph.html">
</template>

<script>
const graph = require('./graph').default;

export default {
  name: 'Graph',
  data () {
    return {
      msg: 'Welcome to pokemon',
    }
  },
  methods:{
    display(){ graph.display() },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./graph.css">
</style>
