// 缓动函数，使用了标准的缓动公式
function easeInOutQuad(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}

export const animateHeight = (element, targetHeight, duration) => {
  var startHeight = element.clientHeight;
  var startTime = null;

  function step(currentTime) {
    // 如果起始时间为空，设置起始时间为当前时间
    if (!startTime) {
      startTime = currentTime;
    }
    // 计算时间差和当前高度
    var timeElapsed = currentTime - startTime;
    var newHeight = easeInOutQuad(
      timeElapsed,
      startHeight,
      targetHeight - startHeight,
      duration
    );

    // 更新元素高度
    element.style.height = newHeight + 'px';

    // 如果动画未结束，则继续递归调用step函数
    if (timeElapsed < duration) {
      requestAnimationFrame(step);
    }
  }
  // 开始动画
  requestAnimationFrame(step);
};
