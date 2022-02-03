<template>
  <div id="app" class="container">
    <div class="row">
      <h2> Canvas </h2>
      <fortune-wheel
        :verify="canvasVerify"
        :canvas="canvasOptions"
        :prizes="prizesCanvas"
        @rotateStart="onCanvasRotateStart"
        @rotateEnd="onRotateEnd"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import FortuneWheel from '@/components/fortuneWheel/index.vue'

interface PrizeConfig {
  /* eslint-disable */
  id: number;
  name: string;
  value: any;
  bgColor: string;
  color: string;
  probability: number;
  weight: number;
  [propName: string]: any;
  /* eslint-enable */
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
        btnWidth: 140,
        borderColor: '#fffff',
        borderWidth: 6,
        lineHeight: 50,
        textRadius: 200,
        radius: 350
      },
      prizesCanvas: [
        {
          id: 1,
          name: 'Miegot',
          value: 'Blue\'s value1',
          bgColor: '#75bcff',
          color: '#ffffff',
          probability: 25
        },
        {
          id: 2,
          name: 'Deliot delione',
          value: 'Red\'s value1',
          bgColor: '#1adb54',
          color: '#ffffff',
          probability: 25
        },
        {
          id: 3,
          name: 'Ziuret filma/seriala',
          value: 'Red\'s value1',
          bgColor: '#75bcff',
          color: '#ffffff',
          probability: 25
        },
        {
          id: 4,
          name: 'Chillint ant sofkes',
          value: 'Red\'s value1',
          bgColor: '#1adb54',
          color: '#ffffff',
          probability: 25
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
    }
  },
  methods: {
    onCanvasRotateStart (rotate: Function) {
      if (this.canvasVerify) {
        const verified = true // true: test passed validation, false: test failed validation
        this.DoServiceVerify(verified, 2000).then((verifiedRes) => {
          if (verifiedRes) {
            console.log('Verification passed, start spinning')
            rotate() // Call the callback, start spinning
            this.canvasVerify = false // Turn off verification mode
          } else {
            alert('Failed to verify')
          }
        })
        return
      }
      console.log('onCanvasRotateStart')
    },
    onImageRotateStart () {
      console.log('onImageRotateStart')
    },
    onRotateEnd (prize: PrizeConfig) {
      // alert(prize.value)
      console.log(prize.value)
    },
    onChangePrize (id: number) {
      this.prizeId = id
    },
    DoServiceVerify (verified: boolean, duration: number) { // Parameter 1: whether to pass the verification, 2: delay time
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
