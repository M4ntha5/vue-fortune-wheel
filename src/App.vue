<!--suppress ES6ShorthandObjectProperty -->
<template>
  <div id="app">
    <fortune-wheel
      ref="wheel"
      :verify="canvasVerify"
      :canvas="canvasOptions"
      :prizes="prizesCanvas"
      @rotateEnd="onRotateEnd"
      @buttonClick="btnClicked"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
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
        textRadius: 300,
        radius: 300,
        btnBgColor: '#1F870E',
        btnTextColor: '#ffffff',
        btnText: 'KIKA',
        btnWidth: 80,
        btnFontSize: 24,
        btnBorderColor: '#000000'
      },
      prizesCanvas: [
        {
          id: 1,
          name: 'Blue',
          value: 'Blue\'s value',
          bgColor: '#75bcff',
          color: '#ffffff',
          probability: 12.5
        },
        {
          id: 2,
          name: 'Red',
          value: 'Red\'s value',
          bgColor: '#F10025',
          color: '#ffffff',
          probability: 12.5
        },
        {
          id: 3,
          name: 'Green',
          value: 'Green\'s value',
          bgColor: '#4CB300',
          color: '#ffffff',
          probability: 12.5
        },
        {
          id: 4,
          name: 'Yellow',
          value: 'Yellow\'s value',
          bgColor: '#F7F70A',
          color: '#ffffff',
          probability: 12.5
        },
        {
          id: 5,
          name: 'Blue',
          value: 'Blue\'s value',
          bgColor: '#75bcff',
          color: '#ffffff',
          probability: 12.5
        },
        {
          id: 6,
          name: 'Red',
          value: 'Red\'s value',
          bgColor: '#F10025',
          color: '#ffffff',
          probability: 12.5
        },
        {
          id: 7,
          name: 'Green',
          value: 'Green\'s value',
          bgColor: '#4CB300',
          color: '#ffffff',
          probability: 12
        },
        {
          id: 8,
          name: 'Yellow',
          value: 'Yellow\'s value',
          bgColor: '#F7F70A',
          color: '#ffffff',
          probability: 13
        }
      ],
      prizesImage: [
        {
          id: 1,
          value: 'Blue\'s value', // Prize value
          weight: 1 // Weights
        },
        {
          id: 2,
          value: 'Red\'s value',
          weight: 0
        },
        {
          id: 3,
          value: 'Yellow\'s value',
          weight: 0
        }
      ]
    }
  },
  computed: {
    prizeRes (): object {
      return this.prizesImage.filter(item => item.id === this.prizeId)[0] || {}
    },
    wheel() :any{
      return this.$refs.wheel
    }
  },
  methods: {
    onRotateStart () {
      console.log('verify', this.canvasVerify)
      this.verify()
    },
    verify(){
      if (!this.canvasVerify)
        this.spin()
      else {
        const verified = true // true: test passed validation, false: test failed validation
        this.DoServiceVerify(verified, 2000).then((verifiedRes) => {
          if (verifiedRes) {
            console.log('Verification passed, start spinning')
            this.spin() //  start spinning
            this.canvasVerify = false // Turn off verification mode
          }
          else
            return false
        })
      }
    },
    spin(){
      this.wheel.spin()
    },
    btnClicked(){
      console.log('btn click')
      //spin
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
