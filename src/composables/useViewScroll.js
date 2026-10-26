import { nextTick, onActivated, ref } from 'vue'

export function useViewScroll() {
  const viewport = ref(null)
  let scrollTop = 0
  function rememberScroll(event) { scrollTop = event.target.scrollTop }
  // KeepAlive retains component state, but detached DOM scroll must be restored explicitly.
  onActivated(async () => {
    await nextTick()
    if (viewport.value) viewport.value.scrollTop = scrollTop
  })
  return { viewport, rememberScroll }
}
