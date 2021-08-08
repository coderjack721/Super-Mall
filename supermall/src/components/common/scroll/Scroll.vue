<template>
  <div ref="wrapper">
      <div>
          <slot>

          </slot>
      </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
    name:"Scroll",
    data(){
        return {
            scroll:null,
        }
    },
    props:{
        probeType:{
            Type:Number,
            default:0
        },
        pullUpLoad:{
            Type:Boolean,
            default:false
        }
    },
    mounted(){
        //1.创建BScroll对象
        this.scroll = new BScroll(this.$refs.wrapper,{
            probeType: this.probeType,
            pullUpLoad: this.pullUpLoad,
            click: true,
            // pullUpLoad: this.pullUpLoad
        })
        //2.监听滚动事件
        this.scroll.on('scroll',(position) => {
            // console.log(position);
            this.$emit('scroll',position)
        })
        //3.监听上拉事件
        this.scroll.on('pullingUp', () => {
            // console.log('上拉加载更多');
            this.$emit('pullingUp')
        })
    },
    methods:{
        scrollTo(x,y,time=500){
            this.scroll.scrollTo(x,y,time)           
        },
        finishPullUp(){
            this.scroll.finishPullUp()
        }
    }
}
</script>

<style>

</style>