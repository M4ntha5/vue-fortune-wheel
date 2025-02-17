<template>
  <div class="fw-container">
    <!-- wheel -->
    <div
      class="fw-wheel"
      :style="rotateStyle"
      @transitionend="onRotateEnd"
      @webkitTransitionend="onRotateEnd"
    >
      <canvas
        v-if="type === 'canvas'"
        ref="wheel"
        :width="canvasConfig.radius * 2"
        :height="canvasConfig.radius * 2"
      />
      <slot name="wheel" v-else />
    </div>
    <!-- button -->
    <div class="fw-btn">
      <div
        v-if="type === 'canvas'"
        class="fw-btn__btn"
        :style="{
          width: canvasConfig.btnWidth + 'px',
          height: canvasConfig.btnWidth + 'px',
          background: canvasConfig.btnBgColor,
          color: canvasConfig.btnTextColor,
          'font-size': canvasConfig.btnFontSize + 'px',
          'border-color': canvasConfig.btnBorderColor,
          '--upper-arrow-color': canvasConfig.btnBorderColor,
          '--lower-arrow-color': canvasConfig.btnBgColor,
        }"
        @click="handleClick"
      >
        <template v-if="canvasConfig.btnImageSrc">
          <img :src="canvasConfig.btnImageSrc" alt="Fortune wheel button image"/>
        </template>
        <template v-else>
          {{ canvasConfig.btnText }}
        </template>
      </div>
      <div v-else class="fw-btn__image" @click="handleClick">
        <slot name="button"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable curly,spaced-comment */
import Vue, { PropType } from 'vue'
import sumBy from 'lodash/sumBy'
import random from 'lodash/random'

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

interface CanvasConfig {
  radius: number;
  textRadius: number;
  textLength: number;
  textDirection: string;
  textFontSize: number;
  lineHeight: number;
  borderWidth: number;
  borderColor: string;
  btnText: string;
  btnWidth: number;
  btnBgColor: string;
  btnTextColor: string;
  btnFontSize: number;
  btnBorderColor: string;
  btnImageSrc: string;
  prizeImageWidth: number;
  prizeImageHeight: number;
}

const canvasDefaultConfig = {
  radius: 250, // the radius of the circle
  textRadius: 190, // The distance between the prize position and the center of the circle
  textLength: 20, // Prize text 1 line of several characters, up to 2 lines
  textDirection: 'horizontal', // Prize text direction
  lineHeight: 20, // text line height
  borderWidth: 0, // round outer border
  borderColor: 'transparent', // the color of the outer border
  btnText: 'GO', // start button text
  btnWidth: 140, // button width
  textFontSize: 34, // Prize size
  btnBgColor: '#5d119c', //button background color
  btnTextColor: '#FFFFFF', //button text color
  btnFontSize: 42, //button font size
  btnBorderColor: '#FFFFFF', // button border color
  btnImageSrc: '', // button image src
  prizeImageWidth: 100, // width of prize images
  prizeImageHeight: 100, // height of prize images
}

function getStrArray (str: string, len: number) {
  const arr = []
  while (str !== '') {
    let text = str.substr(0, len)
    if (str.charAt(len) !== '' && str.charAt(len) !== ' ') { // If the next line exists and the first character of the next line is not a space
      const index = text.lastIndexOf(' ')
      if (index !== -1) text = text.substr(0, index)
    }
    str = str.replace(text, '').trim()
    arr.push(text)
  }
  return arr
}

export default Vue.extend({
  name: 'FortuneWheel',
  props: {
    type: {
      type: String,
      default: 'canvas' // canvas || image
    },
    useWeight: {
      type: Boolean,
      default: false // Probability by weight
    },
    disabled: {
      type: Boolean,
      default: false // Whether to disable
    },
    verify: {
      type: Boolean,
      default: false // Whether to enable verification
    },
    canvas: {
      type: Object as PropType<CanvasConfig>,
      default: () => canvasDefaultConfig
    },
    duration: {
      type: Number,
      default: 6000 // Time of one rotation (milliseconds)
    },
    timingFun: {
      type: String,
      default: 'cubic-bezier(0.36,.99999,0.64,.99999)'//'cubic-bezier(0.36, 0.95, 0.64, 1)'
      // The transition time function of the rotation of the turntable
    },
    angleBase: {
      type: Number,
      default: 4 // The base of the rotation angle, the number of rotations 360 * 10
    },
    prizeId: {
      type: Number,
      default: 0
      // When it is 0, it is not used. For other values, the result of the rotation is the prize of this Id,
      // which can be changed during rotation
    },
    prizes: {
      type: Array as PropType<PrizeConfig[]>,
      required: true,
      default: () => [] // List of prizes
    }
  },
  data () {
    return {
      isRotating: false,
      rotateEndDeg: 0,
      prizeRes: {}
    }
  },
  computed: {
    // canvas
    canvasConfig (): CanvasConfig {
      return Object.assign(canvasDefaultConfig, this.canvas)
    },
    // The probabilities of all prizes and
    probabilityTotal (): number {
      if (this.useWeight) return 100
      return sumBy(this.prizes, (row: PrizeConfig) => row.probability || 0)
    },
    // Array of prize ids generated for probability
    prizesIdArr (): Array<number> {
      const idArr: number[] = []
      this.prizes.forEach((row) => {
        const count: number = this.useWeight
          ? (row.weight || 0)
          : ((row.probability || 0) * this.decimalSpaces)

        const arr = (new Array(count)).fill(row.id)
        idArr.push(...arr)
      })
      return idArr
    },
    // The probability of the prize keeps several decimal places,
    // up to 4 digits => (0: 1, 1: 10, 2: 100, 3: 1000, 4: 10000)
    decimalSpaces (): number {
      if (this.useWeight) return 0
      const sortArr = [...this.prizes].sort((a, b) => {
        const aRes = String(a.probability).split('.')[1]
        const bRes = String(b.probability).split('.')[1]
        const aLen = aRes ? aRes.length : 0
        const bLen = bRes ? bRes.length : 0
        return bLen - aLen
      })
      const maxRes = String(sortArr[0].probability).split('.')[1]
      const idx = maxRes ? maxRes.length : 0
      return [1, 10, 100, 1000, 10000][idx > 4 ? 4 : idx]
    },
    rotateStyle (): object {
      return {
        '-webkit-transform': `rotateZ(${this.rotateEndDeg}deg)`,
        transform: `rotateZ(${this.rotateEndDeg}deg)`,
        '-webkit-transition-duration': `${this.rotateDuration}s`,
        'transition-duration': `${this.rotateDuration}s`,
        '-webkit-transition-timing-function:': this.timingFun,
        'transition-timing-function': this.timingFun
      }
    },
    // Time to spin once
    rotateDuration (): number {
      return this.isRotating ? this.duration / 1000 : 0
    },
    rotateBase (): number {
      let angle = this.angleBase * 360
      if (this.angleBase < 0)
        angle -= 360
      return angle
    },
    canRotate (): boolean {
      return !this.disabled && !this.isRotating && this.probabilityTotal === 100
    }
  },
  watch: {
    prizeId (newVal): void {
      if (!this.isRotating)
        return

      let newAngle = this.getTargetDeg(newVal)
      if (this.angleBase < 0)
        newAngle -= 360

      const prevEndDeg = this.rotateEndDeg
      let nowEndDeg = this.angleBase * 360 + newAngle
      const angle = 360 * (Math.floor((nowEndDeg - prevEndDeg) / 360))

      if (this.angleBase >= 0)
        nowEndDeg += Math.abs(angle)
      else
        nowEndDeg += -360 - angle

      this.rotateEndDeg = nowEndDeg
    }
  },
  created (): void {
    this.checkProbability()
  },
  mounted (): void {
    if (this.type === 'canvas')
      this.drawCanvas()
  },
  methods: {
    // Check whether the total probability is 100
    checkProbability () {
      if (this.probabilityTotal !== 100)
        throw new Error('Prizes Is Error: Sum of probabilities is not 100!')

      return true
    },
    // Draw canvas
    drawCanvas (): void {
      const canvasEl = this.$refs.wheel as HTMLCanvasElement
      if (canvasEl.getContext) {
        const { radius, textRadius, borderWidth, borderColor, textFontSize } = this.canvasConfig
        // Calculate the circumference angle based on the number of prizes
        const arc = Math.PI / (this.prizes.length / 2)
        const ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D
        // Empty a rectangle within the given rectangle
        ctx.clearRect(0, 0, radius * 2, radius * 2)
        // strokeStyle Property sets or returns the color, gradient, or pattern used for the stroke
        ctx.strokeStyle = borderColor
        ctx.lineWidth = borderWidth * 2
        // font Property sets or returns the current font property of the text content on the canvas
        ctx.font = `${textFontSize}px Arial`

        this.prizes.forEach((row, i) => {
          const angle = i * arc - Math.PI / 2
          ctx.fillStyle = row.bgColor
          ctx.beginPath()
          // arc(x, y, r, Start Angle, End Angle, Draw Direction) method to create arcs/curves (for creating circles or partial circles)
          ctx.arc(radius, radius, radius - borderWidth, angle, angle + arc, false)
          ctx.stroke()
          ctx.arc(radius, radius, 0, angle + arc, angle, true)
          ctx.fill()
          // Lock the canvas (in order to save the previous canvas state)
          ctx.save()
          // ----draw prizes start----
          ctx.fillStyle = row.color
          //draw separator lines
          if(this.prizes.length > 1){
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          //if image src exists add image as a prize
          //else add text as a prize
          if(row.imageSrc && row.imageSrc.length > 0)
            this.loadAndDrawImages(row.imageSrc, ctx, angle, arc)
            //this.drawPrizeImage(ctx, angle, arc, row.imageSrc)
          else {
            // translate method to remap the (0, 0) position on the canvas
            ctx.translate(radius + Math.cos(angle + arc / 2) * textRadius, radius + Math.sin(angle + arc / 2) * textRadius)
            this.drawPrizeText(ctx, angle, arc, row.name)
          }
          // Returns (adjusts) the current canvas to the previous save() state
          ctx.restore()
          // ----draw prizes over----
        })
      }
    },
    loadAndDrawImages(src: string, ctx: CanvasRenderingContext2D, angle: number, arc: number) {
      return new Promise((resolve) => {
        const { radius, textRadius, textDirection, prizeImageWidth, prizeImageHeight } = this.canvasConfig
        const image = document.createElement('img');
        //image.crossOrigin = 'Anonymous'; // To avoid tainted canvas
        image.src = src;
        image.width = prizeImageWidth
        image.height = prizeImageHeight
        image.hidden = true
        image.onload = () => resolve(image);
        //todo check if better like this

        let x = (radius + Math.cos(angle + arc / 2) * textRadius)
        let y = (radius + Math.sin(angle + arc / 2) * textRadius)

        ctx.translate(x, y)
        textDirection === 'vertical'
          ? ctx.rotate(angle + arc / 2 + Math.PI)
          : ctx.rotate(angle + arc / 2 + Math.PI / 2)
        ctx.translate(-x, -y)

        let xAfterScaling = x - prizeImageWidth / 2
        let yAfterScaling = y - prizeImageHeight / 2

        ctx.drawImage(image, xAfterScaling, yAfterScaling, prizeImageWidth, prizeImageHeight)
        document.body.appendChild(image);
      });
    },
    // Adds image as a prize
    /*async drawPrizeImage(ctx: CanvasRenderingContext2D, angle: number, arc: number, src: string){
      const { radius, textRadius, textDirection, prizeImageWidth, prizeImageHeight } = this.canvasConfig
      let image = new Image()
      image.src = src

      let x = (radius + Math.cos(angle + arc / 2) * textRadius)
      let y = (radius + Math.sin(angle + arc / 2) * textRadius)

      ctx.translate(x, y)
      textDirection === 'vertical'
        ? ctx.rotate(angle + arc / 2 + Math.PI)
        : ctx.rotate(angle + arc / 2 + Math.PI / 2)
      ctx.translate(-x, -y)

      let xAfterScaling = x - prizeImageWidth / 2
      let yAfterScaling = y - prizeImageHeight / 2

      ctx.drawImage(image, xAfterScaling, yAfterScaling, prizeImageWidth, prizeImageHeight)
    },*/

    // Draw prize text
    drawPrizeText (ctx: CanvasRenderingContext2D, angle: number, arc: number, name: string) {
      const { lineHeight, textLength, textDirection } = this.canvasConfig
      // The following code renders different effects, such as fonts, colors, and picture effects,
      // according to the type of prize and the length of the prize name.
      // (The specific changes according to the actual situation)
      const content = getStrArray(name, textLength)
      if (content.length === 0)
        return
      textDirection === 'vertical'
        ? ctx.rotate(angle + arc / 2 + Math.PI)
        : ctx.rotate(angle + arc / 2 + Math.PI / 2)
      content.forEach((text, idx) => {
        let textX = -ctx.measureText(text).width / 2
        let textY = (idx + 1) * lineHeight
        if (textDirection === 'vertical') {
          textX = 0
          textY = (idx + 1) * lineHeight - content.length * lineHeight / 2
        }
        ctx.fillText(text, textX, textY)
      })
    },
    handleClick (): void {
      this.$emit('buttonClick')
    },
    spin(){
      if (!this.canRotate) return
      if (this.verify) {
        this.$emit('rotateStart', this.onRotateStart)
        return
      }
      this.$emit('rotateStart')
      this.onRotateStart()
    },
    spinImage(){
      if (!this.canRotate) return
      this.$emit('rotateStart')
      this.onRotateStart()
    },
    // Start spinning
    onRotateStart (): void {
      this.rotateEndDeg = 0
      this.isRotating = true
      const prizeId = this.prizeId || this.getRandomPrize()
      this.rotateEndDeg = this.rotateBase + this.getTargetDeg(prizeId)
    },
    // End rotation
    onRotateEnd (): void {
      this.isRotating = false
      this.rotateEndDeg %= 360
      this.$emit('rotateEnd', this.prizeRes)
    },
    // Get random prize id
    getRandomPrize (): number {
      const len = this.prizesIdArr.length
      return this.prizesIdArr[random(0, len - 1)]
    },
    // Get the angle of the prize
    getTargetDeg (prizeId: number): number {
      const angle = 360 / this.prizes.length

      const num = this.prizes.findIndex(row => row.id === prizeId)
      this.prizeRes = this.prizes[num]

      const startAngle = 10 + angle * num
      const endAngle = startAngle + angle - 20
      const randomAngle = this.getRandomNumber(startAngle, endAngle)

      return 360 - randomAngle
    },
    getRandomNumber (min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
  }
})
</script>

<style scoped lang="scss">
@import 'index.scss';
</style>
