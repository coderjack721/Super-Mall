<template>
  <div id="detail">
    <DetailNavBar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <Scroll class="content" ref="scroll" 
            :probeType="3" @scroll="contentScroll">
        <DetailSwiper :topImages="topImages"></DetailSwiper>
        <DetailBaseInfo :goods="goods"></DetailBaseInfo>
        <DetailShopInfo :shop="shop"></DetailShopInfo>
        <!-- <DetailGoodsInfo :detailInfo="detailInfo" @imageLoad="imageLoad"></DetailGoodsInfo> -->
        <DetailParamInfo :paramInfo="paramInfo" ref="params"></DetailParamInfo>       
        <DetailCommentInfo :commentInfo="commentInfo" ref="comment"></DetailCommentInfo>
        <GoodsList :goods="recommends" ref="recommend"></GoodsList>
    </Scroll>
  </div>

</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/detail";
import { debounce } from "common/utils";

import {itemListenerMixin} from "common/mixin";

export default {
    name:"Detail",
    components:{
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        Scroll,
        GoodsList
    },
    mixins:[itemListenerMixin],
    data(){
        return{
            iid: null,
            data: [],
            topImages: [],
            goods: {},
            shop:{},
            detailInfo: {},
            paramInfo: {},
            commentInfo: {},
            recommends: [],
            themeTopYs:[],
            currentIndex:0
            // getThemeTopY:null
        }
    },

    created(){
        //1.保存传入的iid
        this.iid = this.$route.params.iid
        //2.根据iid请求详情数据
        getDetail(this.iid).then(res => {
            //1.获取顶部的图片轮播数据
            // console.log(res);
            const data = res.result
            //2.取出轮播图数据
            this.topImages = res.result.itemInfo.topImages

            //3.获取商品信息
            this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

            //4.创建店铺信息
            this.shop = new Shop(data.shopInfo)

            //5.保存商品的详情数据
            this.detailInfo = data.detailInfo;

            //6.获取参数信息
            this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

            //7.取出评论信息
            if(data.rate.cRate != 0){
                this.commentInfo = data.rate.list[0]
            }
            this.$nextTick(() => {
              //值不对，图片没有计算在内
              //根据最新的数据，对应的DOM已经被渲染出来
              //但是图片依然是没有加载完（目前获取到的offsettop不包含其中的图片）
              //offsetTop值不对的时候，都是因为图片的问题
              this.themeTopYs = []

              this.themeTopYs.push(0);
              this.themeTopYs.push(this.$refs.params.$el.offsetTop)
              this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
              this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
              console.log(this.themeTopYs);
            })
        })

        // 3.请求推荐数据
            getRecommend().then(res => {
                console.log(res);
                this.recommends = res.data.list
        })
        //4.给getThemeTopY赋值
            // this.getThemeTopY = debounce(() => {              
                
            // })
    },
    
    destroyed(){
        this.$bus.$off('itemImgLoad',this.itemImgListener)
    },
    methods:{
      imageLoad(){
        this.newRefresh()
        this.getThemeTopY()
      },
      titleClick(index){
        // console.log(index);
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
      },
      contentScroll(position){
        // console.log(position);
        //1.获取y值
        const positionY = -position.y
        //2.positionY和主题中值进行对比
        let length = this.themeTopYs.length
        for(let i = 0; i < length; i++){
          if(this.currentIndex !== i && ((i < length-1 && positionY > this.themeTopYs[i] && positionY < 
          this.themeTopYs[i+1]) || (i === length - 1 && positionY > this.themeTopYs[i]))){
            this.currentIndex = i;
            // console.log(this.currentIndex);
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
      }
    }
    
    
}
</script>

<style scoped>
  #detail {
    height: 100vh;
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 60px;
  }
  .detail-nav{
    position: relative;
    z-index: 9;
    background: #fff;
  }

  .back-top {
    position: fixed;
    right: 10px;
    bottom: 65px;
  }
</style>