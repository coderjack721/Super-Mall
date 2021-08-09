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
        //2.监听滚动的位置
        if(this.probeType===2||this.probeType===3){
            this.scroll.on('scroll',(position) => {
            // console.log(position);
            this.$emit('scroll',position)
        })
        }
        //3.监听scroll滚动到底部
         if(this.pullUpLoad){
            this.scroll.on('pullingUp', ()=>{
            this.$emit('pullingUp');
            })
            }
    },
    methods:{
        scrollTo(x,y,time=300){
            this.scroll && this.scroll.scrollTo(x,y,time)           
        },
        refresh(){
            this.scroll && this.scroll.refresh()
        },
        finishPullUp(){
            this.scroll && this.scroll.finishPullUp()
        },
        getScrollY(){
            return this.scroll ? scroll.y : 0
        }
    }
}
</script>

<style>

</style>