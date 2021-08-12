<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center" >购物车（{{cartLength}}）</div>
    </nav-bar>
    <CartList/>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import CartList from "./childComps/CartList.vue";
import { mapGetters } from "vuex";
export default {
    name:"Cart",
    components:{
      NavBar,
      CartList
    },
    computed:{
      ...mapGetters(['cartLength','cartList'])
    }
}
</script>

<style>
.nav-bar{
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 700;
}
</style>