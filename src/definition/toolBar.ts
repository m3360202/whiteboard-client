export interface MenuToolBar {
  type: MenuToolBarType
  title: string
  imgSrc?: string
}

export enum MenuToolBarType {
  Pan,
  StickyNotes,
  Text,
  DrawingMode,
  Line,
  Shape,
  Template,
  Upload,
  ScreenShare,
  Timer,
  Slides,
  More
}

export const widgetToolBarData = (t: any): MenuToolBar[] => [
  {
    type: MenuToolBarType.Pan,
    title: t('Pan'),
    imgSrc: 'mouse.png'
  },
  {
    type: MenuToolBarType.StickyNotes,
    title: t('StickyNotes'),
  },
  {
    type: MenuToolBarType.DrawingMode,
    title: t('DrawingMode'),
  },
  {
    type: MenuToolBarType.Text,
    title: t('Text'),
    imgSrc: 'text.png'
  },
  {
    type: MenuToolBarType.Shape,
    title: t('Shape'),
    imgSrc: 'shape.png'
  },
  {
    type: MenuToolBarType.Line,
    title: t('Line'),
    imgSrc: 'path.png'
  },
 
  {
    type: MenuToolBarType.Template,
    title: t('Template'),
    imgSrc: 'template.png'
  },
  {
    type: MenuToolBarType.Upload,
    title: t('Upload'),
    imgSrc: 'upload.png'
  }
]

export const toolBarData = (t: any): MenuToolBar[] => [
    {
      type: MenuToolBarType.ScreenShare,
      title: t('ScreenShare'),
      imgSrc: 'screenshare.png'
    },
    {
      type: MenuToolBarType.Timer,
      title: t('Timer'),
      imgSrc: 'timer.png'
    },
    {
      type: MenuToolBarType.Slides,
      title: t('Slides'),
      imgSrc: 'slides.png'
    },
    {
      type: MenuToolBarType.More,
      title: t('More'),
      imgSrc: 'more.png'
    }
  ]
