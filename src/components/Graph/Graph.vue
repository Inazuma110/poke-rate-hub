<template>
  <div class="graph">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
const test = require('./test').default;
test.test();

export default {
  name: 'Graph',
  data () {
    return {
      msg: 'Welcome to pokemon'
    }
  },
  methods:{
    // test: test
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped src="./graph.css">
</style>
