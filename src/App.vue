<template>
  <div id="app">
    <fortune-wheel
      :key="componentKey"
      ref="wheel"
      :verify="canvasVerify"
      :use-weight="true"
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
      componentKey: 5,
      prizeId: 0,
      canvasVerify: false,
      canvasOptions: {
        borderColor: '#000000',
        borderWidth: 6,
        lineHeight: 0,
        textRadius: 200,
        radius: 300,
        btnBgColor: '#ffffff',
        btnTextColor: '#ffffff',
        btnText: 'GO',
        btnWidth: 80,
        btnFontSize: 32,
        btnBorderColor: '#000000',
        btnImageSrc: 'https://www.kika.lt/images/galleries/projects/1646122976_kika-logotipas-ukraine.png'
      },
      prizes: [
        {
          id: 1,
          name: 'Blue',
          value: 'Blue\'s value',
          bgColor: '#75bcff',
          color: '#ffffff',
          probability: 25,
          weight: 5,
          imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Windows_live_square.JPG'
        },
        {
          id: 2,
          name: 'Red',
          value: 'Red\'s value',
          bgColor: '#cbd014',
          color: '#ffffff',
          probability: 25,
          weight: 5,
          imageSrc: 'https://media.istockphoto.com/photos/picturesque-morning-in-plitvice-national-park-colorful-spring-scene-picture-id1093110112?k=20&m=1093110112&s=612x612&w=0&h=3OhKOpvzOSJgwThQmGhshfOnZTvMExZX2R91jNNStBY='
        },
        {
          id: 3,
          name: 'Green',
          value: 'Green\'s value',
          bgColor: '#cbd014',
          color: '#ffffff',
          probability: 25,
          weight: 5,
          imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Windows_live_square.JPG'
        },
        {
          id: 4,
          name: 'Yellow',
          value: 'Yellow\'s value',
          bgColor: '#F7F70A',
          color: '#000000',
          probability: 25,
          weight: 5,
          imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Windows_live_square.JPG'
        },
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
      //this.$refs.wheel?.spin()
    },
    onRotateEnd (prize: PrizeConfig) {
      console.log(prize.value)

      const ind = this.prizes.indexOf(prize)
      this.prizes.splice(ind, 1)

      //reloads component
      this.componentKey = this.getNewRandomKey()
    },
    getNewRandomKey(){
      //to force update wheel component
      let newVal = this.componentKey
      let oldVal = this.componentKey
      while(oldVal === newVal)
        newVal = Math.floor(Math.random() * 100)
      return newVal
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
