//time:更新时间
//content:更新内容，其中'<br/>'代表换行
const data = [
  {
    time: '2022-06-09',
    content:
      '1、优化：选择多个便笺/文本框时，菜单中现在提供了“调整字体大小”选项。<br/>2、优化了中国版本的“模板”部分菜单名称没有彻底翻译的体验。<br/>3、优化了箭头吸附效果的体验，修复了箭头末端坐标不正确的bug。<br/>4、优化了在Windows系统上使用鼠标滚轮缩放时的体验。<br/>5、当用户使用鼠标右键移动白板时，如果鼠标移动范围超出了浏览器页面，再切换回白板时，鼠标将不再会和白板粘连。<br/>6、计时器的UI现在可以正确显示了。<br/>7、修复了使用橡皮擦时会出现框选效果的bug。<br/>'
  },
  {
    time: 'June 9, 2022',
    content:
      '1. Optimization: When selecting multiple sticky notes/text boxes, the "Resize Font" option is now available in the widget menu.<br/>2. Optimized the experience that the menu name of the "Template" part of the Chinese version is not completely translated.<br/>3. Optimized the experience of the arrow adsorption effect, and fixed the bug that the coordinates at the end of the arrow were incorrect.<br/>4. Optimized the experience when using the mouse wheel zoom on Windows system.<br/>5. When the user uses the right mouse button to move the whiteboard, if the mouse moves beyond the browser page, and then switches back to the whiteboard, the mouse will no longer stick to the whiteboard.<br/>6. The UI of the timer can now be displayed correctly.<br/>7. Fixed the bug that the box selection effect would appear when using the eraser.<br/>'
  }
];

export default data;

export const versionNo = '0.3.2';
