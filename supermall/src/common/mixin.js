import {debounce} from "common/utils";
import BackTop from "components/content/backTop/BackTop";

export const itemListenerMixin = {
    data(){
        return {
            itemImgListener:null,
            newRefresh:null
        }
    },
    mounted(){
        this.newRefresh = debounce(this.$refs.scroll.refresh,100)
        this.itemImgListener = () => {
            this.newRefresh()
        }
        this.$bus.$on('itemImgLoad',this.itemImgListener)
        // console.log('我是混入的内容');
        
    }
}
export const backTopMixin = {
    components:{
        BackTop
    },
    data(){
        return {
            isShowBackTop: false
        }
    },
    methods:{
        backClick(){
            // console.log('toptop');
            this.$refs.scroll.scrollTo(0,0)
            }
    }
}