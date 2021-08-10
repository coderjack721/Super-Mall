<template>
  <div id="detail">
    <DetailNavBar class="detail-nav"/>
    <Scroll class="content" ref="scroll">
        <DetailSwiper :topImages="topImages"/>
        <DetailBaseInfo :goods="goods"/>
        <DetailShopInfo :shop="shop"/>
        <!-- <DetailGoodsInfo :detailInfo="detailInfo"/> -->
        <DetailParamInfo :paramInfo="paramInfo"/>       
        <DetailCommentInfo :commentInfo="commentInfo"/>
        <GoodsList :goods="recommends"/>
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
        }
    },

    created(){
        //1.保存传入的iid
        this.iid = this.$route.params.iid
        //2.根据iid请求详情数据
        getDetail(this.iid).then(res => {
            //1.获取顶部的图片轮播数据
            console.log(res);
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
        })

        // 3.请求推荐数据
            getRecommend().then(res => {
                console.log(res);
                this.recommends = res.data.list
        })
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