<template src="./graph.html">
</template>

<script>
const graph = require('./graph').default;
// import axios from 'axios';

const axiosBase = require('axios');
const axios = axiosBase.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  responseType: 'json'
});

export default {
  name: 'Graph',
  data () {
    return {
      battleHistory: null,
      savedataIdCode: '',
      successCreate: null,
      ssPath: '',
    }
  },
  methods:{
    display() {
      const self = this;

      axios.get(`/api/v1/battleHistory?savedataIdCode=${this.savedataIdCode}`)
        .then(function(response) {
          if(response.data['statusCode'] == '4444'){
            self.successCreate = false;
            return;
          }
          self.battleHistory = response.data;
          graph.display(self.battleHistory);
          self.successCreate = true;
        })
        .catch(function(error) {
          console.log('ERROR!! occurred in Backend.')
          console.log(error);
        });
    },
    ss(){
      const self = this;
      axios.get(`/api/v1/ss?savedataIdCode=${this.savedataIdCode}`)
        .then(function(response) {
          self.ssPath = response.data['path'];
          location.href = 'http://twitter.com/share?url=https://github.com/Inazuma110/poke-rate-hub&text=This is my Rating battle result in this 365 days!!&hashtags=PokeRateHub';
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
