export const nowTime: () => string = () => {
  return new Date().toLocaleTimeString("zh-CN", {
    hour12: false,
  })
}
