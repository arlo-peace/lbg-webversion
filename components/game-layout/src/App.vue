<template>
  <div class="shadow" v-if="!hidden">
    <div class="circle-btn close" @click="toBack"></div>
    <div class="loading"></div>
  </div>
  <drag @handlepaly="handleaudioplay" :isCanDraggable="!showMore" style="cursor:pointer"></drag>
  <div class="circle-btn" v-if="showMore" @click="toRecharge" style="font-weight: bold;color: #e6dc73;" :style="btnOne">充值</div>
  <div class="circle-btn" v-if="showMore" @click="refreshLoad" :style="btnTwo">刷新</div>
  <div class="circle-btn" v-if="showMore" @click="toBack" :style="btnThree">退出</div>
  <iframe :src="showUrl" id="ifra" style="width:100%;height:100%;" v-if="isLoad" frameborder="0"></iframe>
</template>

<script>
  import drag from './components/drag.vue'
  import paramsToJson from './utils'
  export default {
    name: 'App',
    components: {
      drag
    },
    data(){
      return {
        showMore: false,
        isLoad: false,
        detail: {
          top: 176,
          left: 1360,
          direction: "right" 
        },
        urlMast: null,
        showUrl: null,
        hidden: false
      }
    },
    computed:{
      btnOne(){
        if(this.detail.direction == 'right')
        {

          return {left:this.detail.left - 80 + 'px',top: this.detail.top + 'px'}
        }

        return {left:this.detail.left + 80 + 'px',top: this.detail.top + 'px'}
      },
      btnTwo(){
        if(this.detail.direction == 'right')
        {

          return {left:this.detail.left - 160 + 'px',top: this.detail.top + 'px'}
        }

        return {left:this.detail.left + 160 + 'px',top: this.detail.top + 'px'}
      },
      btnThree(){
        if(this.detail.direction == 'right')
        {

          return {left:this.detail.left - 240 + 'px',top: this.detail.top + 'px'}
        }

        return {left:this.detail.left + 240 + 'px',top: this.detail.top + 'px'}
      }
    }, 
    created(){
      var params = paramsToJson(window.location.href)
      const {Base64} = require('js-base64');
      var ss = Base64.decode(params.data).replace(/\\/g,'')
      ss = ss.substring(1,ss.length - 1)
      this.urlMast = JSON.parse(ss)
      setTimeout(()=>{
        this.initLoad()
      },50)
    },
    methods: {
      listenFrame(){
        var _this = this
        const iframe = document.querySelector('#ifra')
        try{
          iframe.attachEvent('onload', function () {
            setTimeout(()=>{
              _this.hidden = true
            },500)
          })
        }catch(e){
          iframe.onload = function () {
            setTimeout(()=>{
              _this.hidden = true
            },500)
          }
          console.log(e)
        }
      },
      handleaudioplay(e) {
        this.showMore = !this.showMore
        this.detail = e
      },
      refreshLoad(){
        try{
          if(this.urlMast.device == 'h5')
          {
             window.postMessage({
              data:{
                action: 'refresh'
              }
            })
          }else{
            window.uniapp.postMessage({
              data:{
                action: 'refresh'
              }
            })
          }
        }catch(e){
          console.log(e)
          setTimeout(()=>{
            this.refreshLoad()
          },50)
        }
      },
      toRecharge(){
        try{
          if(this.urlMast.device == 'h5')
          {
             window.postMessage({
              data:{
                action: 'recharge'
              }
            })
          }else{
            window.uniapp.postMessage({
              data:{
                action: 'recharge'
              }
            })
          }
        }catch(e){
          console.log(e)
          setTimeout(()=>{
            this.toRecharge()
          },50)
        }
      },
      toBack(){
        try{
          if(this.urlMast.device == 'h5')
          {
             window.postMessage({
              data:{
                action: 'back'
              }
            })
          }else{
            window.uniapp.postMessage({
              data:{
                action: 'back'
              }
            })
          }
        }catch(e){
          console.log(e)
          setTimeout(()=>{
            this.toBack()
          },50)
        }
      },
      initLoad(){
        try{
          if(this.urlMast.width < this.urlMast.height)
          {
          if(this.urlMast.device == 'h5')
          {
             window.postMessage({
              data:{
                action: 'start'
              }
            })
          }else{
            window.uniapp.postMessage({
              data:{
                action: 'start'
              }
            })
          }
          }else{
            this.showUrl = this.urlMast.url + '&game' + this.urlMast.game
            this.isLoad = true
            this.listenFrame()
          }
        }catch(e){
          console.log(e)
          setTimeout(()=>{
            this.initLoad()
          },50)
        }
      }
    }
  }
</script>

<style>
  html,body{width: 100%;height:  100%;padding: 0;margin: 0}
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #000 url(./assets/load.gif) center center no-repeat;
    width: 100%;
    height:  100%;
  }
  .shadow{
    background: url(./assets/bg.jpg) center center no-repeat;
    background-size:  100% 100%;
    width: 100%;
    height:  100%;
    position: absolute;
    left:  0;
    top:  0;
  }
  .circle-btn {
    position: absolute;
    z-index: 10003;
    width: 48px;
    height: 48px;
    background: rgba(50,50,50,1);
    border: rgb(55,55,55,75) 1px solid;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0px 0px 10px 2px  rgba(50,50,50,.75);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    user-select: none;
    color:  #ffffff;
  }
  .close{
    background:  url(./assets/close.png) center center no-repeat;
    background-size: auto 100%;
    box-shadow: none;
    border:  0;
    right:  30px;
    top:  60px;
    width: 30px;
    height: 30px;
  }
  .loading{
    position: absolute;
    bottom:  90px;
    right:  85px;
    width:  62px;
    height:  5px;
    background:  url(./assets/load.gif) center center no-repeat;
    background-size: auto 100%;
  }
</style>
