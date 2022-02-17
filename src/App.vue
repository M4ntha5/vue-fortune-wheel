<template>
  <div id="app">
    <fortune-wheel
      ref="wheel"
      :verify="canvasVerify"
      :canvas="canvasOptions"
      :prizes="prizes"
      @rotateEnd="onRotateEnd"
      @buttonClick="btnClicked"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FortuneWheel from '@/components/fortuneWheel/index.vue'

interface PrizeConfig {
  id: number;
  name: string;
  value: any;
  bgColor: string;
  color: string;
  probability: number;
  weight: number;
  imageSrc: string;
  [propName: string]: any;
}

export default Vue.extend({
  name: 'App',
  components: {
    FortuneWheel
  },
  data () {
    return {
      prizeId: 0,
      canvasVerify: false,
      canvasOptions: {
        borderColor: '#000000',
        borderWidth: 6,
        lineHeight: 50,
        textRadius: 220,
        radius: 300,
        btnBgColor: '#178704',
        btnTextColor: '#ffffff',
        btnText: 'GO',
        btnWidth: 80,
        btnFontSize: 32,
        btnBorderColor: '#000000',
        btnImageSrc: ''
      },
      prizes: [
        {
          id: 1,
          name: 'Blue',
          value: 'Blue\'s value',
          bgColor: '#75bcff',
          color: '#ffffff',
          probability: 25,
          weight: 5
        },
        {
          id: 2,
          name: 'Red',
          value: 'Red\'s value',
          bgColor: '#F10025',
          color: '#ffffff',
          probability: 25,
          weight: 5
        },
        {
          id: 3,
          name: 'Green',
          value: 'Green\'s value',
          bgColor: '#4CB300',
          color: '#ffffff',
          probability: 25,
          weight: 5
        },
        {
          id: 4,
          name: 'Yellow',
          value: 'Yellow\'s value',
          bgColor: '#F7F70A',
          color: '#000000',
          probability: 25,
          weight: 5
        }
      ],
    }
  },
  computed: {
    wheel() :any {
      return this.$refs.wheel
    },
    image() :any {
      return this.$refs.image
    }
  },
  methods: {
    spin(){
      this.wheel.spin()
    },
    spinImage(){
      this.image.spin()
    },
    btnClicked(){
      console.log('button clicked')
      //spin canvas
      this.spin()
    },
    onRotateEnd (prize: PrizeConfig) {
      console.log(prize.value)
    },
    DoServiceVerify (verified: boolean, duration: number) {
      // Parameter 1: whether to pass the verification, 2: delay time
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(verified)
        }, duration)
      })
    }
  }
})
</script>

<style lang="scss" scoped>
@import './styles/bootstrap-grid.min.css';
@import './app.scss';
</style>
