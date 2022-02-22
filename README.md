
# Improved-Vue-Fortune-Wheel

Component name: Wheel of Fortune, Wheel of Fortune, Wheel of Fortune

Application scenario: lottery

## Install
```
yarn add improved-vue-fortune-wheel
```
or
```
npm install improved-vue-fortune-wheel
```
## Language

[English](./README.md)

## Demo

### online
https://xiaolin1995.github.io/vue-fortune-wheel/demo/

## Usage

```html
<template>
  <div>
    <!-- type: image -->
    <fortune-wheel
      style="width: 500px"
      type="image"
      :useWeight="true"
      :prizes="prizes"
      :angleBase="-10"
      @rotateStart="onImageRotateStart"
      @rotateEnd="onRotateEnd"
    >
      <img slot="wheel" src="@/assets/wheel.png" alt=""/>
      <img slot="button" src="@/assets/button.png" alt=""/>
    </fortune-wheel>

    <!-- type: canvas -->
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
```

```js
import FortuneWheel from 'vue-fortune-wheel'
import 'vue-fortune-wheel/lib/vue-fortune-wheel.css'

export default {
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
  }
};
```

## FortuneWheel Functions

You can access the functions inside the component by referencing the component.

| Function name | Description |
| ------ | ------ | 
| spin | This function will start spinning canvas wheel | 
| spinImage | This function will start spinning then image wheel |

## FortuneWheel Events
| Event name | Description | Callback parameters |
| ------ | ------ | ------ |
| buttonClick | Triggered when the dial button is clicked | / |
| rotateEnd | Triggered at the end of the turntable animation | The entire prize Object |

## FortuneWheel Attributes
| Parameters | Description | Type | Default Value |
| ------ | ------ | ------ | ----- |
| type | Type of turntable (canvas, image) | String | canvas |
| useWeight | Whether to calculate probability by weight | Boolean | false |
| disabled | Whether to disable (after disabled, click the button will not rotate) | Boolean | false |
| verify | Whether to enable verification mode | Boolean | false |
| canvas.radius | Radius of circle (type: canvas) | Number | 250 |
| canvas.textRadius | The distance of the text from the center of the circle (type: canvas) | Number | 190 |
| canvas.textLength | A few characters in one line of the prize, beyond the line break (maximum two lines) | Number | 6 |
| canvas.textDirection | Prize text direction (horizontal, vertical) | String | horizontal |
| canvas.textFontSize | Prize text font size (px) | Number | 34 |
| canvas.lineHeight | Text line height (type: canvas) | Number | 20 |
| canvas.borderWidth | Round outer border (type: canvas) | Number | 0 |
| canvas.borderColor | Color value of the outer border (type: canvas) | String | transparent |
| canvas.btnText | Button text (type: canvas) | String | GO |
| canvas.btnWidth | Button width (px) | Number | 140 |
| canvas.btnBgColor | Button background color | String | #5d119c |
| canvas.btnTextColor | Button text color | String | #FFFFFF |
| canvas.btnFontSize | Button text font size | Number | 42 |
| canvas.btnBorderColor | Button border color | String | #FFFFFF |
| canvas.btnImageSrc | Image src to show in a button | String | '' |
| canvas.prizeImageHeight | Height of prize images | Number | 100 |
| canvas.prizeImageWidth | Width of prize images | Number | 100 |
| duration | Time to complete one rotation (unit: ms) | Number | 6000 |
| timingFun | Css time function of rotation transition | String | cubic-bezier(0.36, 0.95, 0.64, 1) |
| angleBase | Number of rotations (angleBase * 360 is the total angle of one rotation, it can be reversed when it is a negative number) | Number | 10 |
| prizeId | Specify the id, it will spin to the prize of this id every time (when it is 0, the value can be changed during the rotation according to the probability of each prize itself to complete various show operations) | Number | 0 |
| prizes | Prize list (structure reference Usage) | Array | / |

