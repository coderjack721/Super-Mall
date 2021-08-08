<template>
  <div id="home">
    <NavBar class="home-nav"><div slot="center">购物街</div></NavBar>
    <Scroll class="content" ref="scroll" 
    :probe-type="3"
     @scroll="contentScroll" 
     :pullUpLoad="true"
     @pullingUp="loadMore">
      <HomeSwiper :banners="banners"/>
        <RecommendView :recommends="recommends"/>
        <FeatureView/>
        <TabControl class="tab_control" :titles="['流行','新款','精选']" @tabClick="tabClick"/>
        <GoodsList :goods="showGoods"/>
    </Scroll>
    <BackTop @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";


import { getHomeMultidata,getHomeGoods } from "network/home";




export default {
    name:"Home",
    components:{
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data(){
      return{
        recommends:[],
        banners:[],
        currentType: 'pop',
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]},
        },
        isShowBackTop: false
      }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    created(){
      //1.请求多个数据
      this.getHomeMultidata()
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    methods:{
      // 事件监听的方法
      tabClick(index){
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break;
          case 1:
            this.currentType = 'new'
            break;
          case 2 :
            this.currentType = 'sell'
            break;
      }
      },
      backClick(){
      // console.log('toptop');
      this.$refs.scroll.scrollTo(0,0)
    },
      contentScroll(position){
        // console.log(position);
        this.isShowBackTop = (-position.y) > 1000
      },
      loadMore(){
        // console.log('上拉加载更多');
        this.getHomeGoods(this.currentType)
      },
      // 网络请求相关
      getHomeMultidata(){
        getHomeMultidata().then(res => {
        // console.log(res);
        this.recommends = res.data.recommend.list;
        this.banners = res.data.banner.list;
      })
      },
      getHomeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res => {
         this.goods[type].list.push(...res.data.list)
         this.goods[type].page += 1

         this.$refs.scroll.finishPullUp()
      })
      },
      
    },
    
}
</script>

<style>
#home{
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}
.home-nav{
  background-color: var(--color-tint);
  color: #fff;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}
.tab-control{
  position: sticky;
  /* top: 44px; */
  z-index:9 ;
}
.content{
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
}
</style>