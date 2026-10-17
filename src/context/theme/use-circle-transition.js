import { flushSync } from 'react-dom'
import { toMilliseconds } from '@/utils'
import {
  CIRCLE_PSEUDO_ELEMENT,
  REDUCED_MOTION_QUERY,
  TRANSITION_DURATION_VARIABLE,
  TRANSITION_EASING_VARIABLE,
} from '@/constants'

export function useCircleTransition() {
  const buildCircleKeyframes = (origin) => {
    const { left, top, width, height } = origin.getBoundingClientRect()

    const centerX = left + width / 2
    const centerY = top + height / 2

    const reachX = Math.max(centerX, window.innerWidth - centerX)
    const reachY = Math.max(centerY, window.innerHeight - centerY)
    const radius = Math.hypot(reachX, reachY)

    const startCircle = `circle(0 at ${centerX}px ${centerY}px)`
    const endCircle = `circle(${radius}px at ${centerX}px ${centerY}px)`

    return { clipPath: [startCircle, endCircle] }
  }

  const readTokenTiming = () => {
    const rootStyle = getComputedStyle(document.documentElement)
    const time = rootStyle.getPropertyValue(TRANSITION_DURATION_VARIABLE)
    const duration = toMilliseconds(time)
    const easing = rootStyle.getPropertyValue(TRANSITION_EASING_VARIABLE).trim()

    return { duration, easing, pseudoElement: CIRCLE_PSEUDO_ELEMENT }
  }

  const runCircleTransition = (update, origin) => {
    const isSupported = Boolean(document.startViewTransition)
    const isMotionReduced = window.matchMedia(REDUCED_MOTION_QUERY).matches

    const canAnimate = isSupported && !isMotionReduced
    if (!canAnimate) {
      update()
      return
    }

    const keyframes = buildCircleKeyframes(origin)
    const timing = readTokenTiming()

    const transition = document.startViewTransition(() => flushSync(update))
    const growCircle = () => document.documentElement.animate(keyframes, timing)

    transition.ready.then(growCircle).catch(() => {})
  }

  return runCircleTransition
}
