//** Import i18n
import { useTranslation } from 'react-i18next';

export const creationMock = () => {
  const { t } = useTranslation();
  
  return [
    {
      id: 'createShapes',
      key: '0',
      title: t('components.boardTutorial.supportResources.contentCreation.createShapes'),
      contents: t('components.boardTutorial.supportResources.contentCreation.createShapesContents'),
      img: '/images/tutorial/createShapes.png'
    },
    {
      id: 'multiSelections_Group',
      key: '1',
      title: t('components.boardTutorial.supportResources.contentCreation.multiSelections') + ' & ' + t('components.boardTutorial.supportResources.contentCreation.group'),
      contents: t('components.boardTutorial.supportResources.contentCreation.multiSelectionsContents'),
      img: '/images/tutorial/multiSelections_Group.png'
    },
    {
      id: 'connectObjects',
      key: '2',
      title: t('components.boardTutorial.supportResources.contentCreation.connectObjects'),
      contents: t('components.boardTutorial.supportResources.contentCreation.connectObjectsContents'),
      img: '/images/tutorial/connectObjects.png'
    },
    {
      id: 'changeTextWidth',
      key: '3',
      title: t('components.boardTutorial.supportResources.contentCreation.changeTextWidth'),
      contents: t('components.boardTutorial.supportResources.contentCreation.changeTextWidthContents'),
      img: '/images/tutorial/changeTextWidth.png'
    },
    {
      id: 'textShape',
      key: '4',
      title: t('components.boardTutorial.supportResources.contentCreation.textInAShape'),
      contents: t('components.boardTutorial.supportResources.contentCreation.textInAShapeContent'),
      img: '/images/tutorial/textShape.png'
    }
  ];
};

export const collaborationMock = () =>{
  const { t } = useTranslation();
  
  return [
  {
    id: 'bringEveryoneToMe',
    key: '0',
    title: t(
      'components.boardTutorial.supportResources.collaboration.bringEveryoneTome'
    ),
    contents: t(
      'components.boardTutorial.supportResources.collaboration.bringEveryoneTomeContents'
    ),
    img: '/images/tutorial/bringEveryoneToMe.png'
  },
  {
    id: 'copyLinksToUploadFiles',
    key: '1',
    title: t(
      'components.boardTutorial.supportResources.collaboration.copyLinkstoUploadFiles'
    ),
    contents: t(
      'components.boardTutorial.supportResources.collaboration.copyLinkstoUploadFilesContents'
    ),
    img: '/images/tutorial/copyLinksToUploadFiles.png'
  }
]} 
