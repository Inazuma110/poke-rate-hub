import Vue from 'vue'
import Router from 'vue-router'
import Graph from '@/components/Graph/Graph'
import Image from '@/components/Image'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Graph',
      component: Graph
    },
    {
      path: '/image/:savedataIdCode',
      name: 'Image',
      component: Image,
    },
  ]
})
