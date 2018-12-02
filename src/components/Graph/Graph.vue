<template src="./graph.html">
</template>

<script>
const graph = require('./graph').default;
import axios from 'axios';

export default {
  name: 'Graph',
  data () {
    return {
      battleHistory: null,
    }
  },
  methods:{
    display() {
      const self = this;
      const axiosBase = require('axios');
      const axios = axiosBase.create({
      baseURL: 'http://localhost:3000',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        responseType: 'json'
      });

      axios.get('/api/v1/battleHistory')
        .then(function(response) {
          self.battleHistory = response.data;
          graph.display(self.battleHistory);
        })
        .catch(function(error) {
          console.log('ERROR!! occurred in Backend.')
          console.log(error);
        });
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./graph.css">
</style>
