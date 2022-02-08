/* eslint-disable */
import FortuneWheel from './index'

// Add an install method to components for importing on demand
FortuneWheel.install = function (Vue) {
  Vue.component(FortuneWheel.name, FortuneWheel)
}

export default FortuneWheel
