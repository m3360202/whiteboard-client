export class DashboardButtonId {
  static CREATE_ROOM_ID = 'id_createRoom';

  static CREATE_BOARD_ID = 'id_createBoard';

  static ROOM_SETTING_ID = 'id_roomSetting';
}

export const TUTORIAL_STEPS = [
  {
    style: { position: 'fixed', marginLeft: -68, marginTop: 26 },
    paperPos: { marginLeft: 15, marginTop: 16 },
    arrowImg: '/images/roomtutorialarrow_left.png',
    topText: 'Welcome to the BoardX!',
    tutorialImg: '/images/roomtutorial-boardx-illustration-content_1.png',
    tutorialContent: 'You can click the button in the left to create a room.',
    anchorId: DashboardButtonId.CREATE_ROOM_ID,
  },
  {
    style: { position: 'fixed', marginLeft: -68, marginTop: 26 },
    paperPos: { marginLeft: 42, marginTop: 58 },
    arrowImg: '/images/roomtutorialarrow_left.png',
    topText: ' ',
    tutorialImg: '/images/roomtutorial-boardx-illustration-ops_2.png',
    tutorialContent: 'You can create a board here.',
    anchorId: DashboardButtonId.CREATE_BOARD_ID,
  },
  {
    style: { position: 'fixed', marginLeft: 342, marginTop: -80 },
    paperPos: { marginLeft: -8, marginTop: 100 },
    arrowImg: '/images/roomtutorialarrow_up.png',
    topText: ' ',
    tutorialImg: '/images/roomtutorial-boardx-illustration-journey_3.png',
    tutorialContent: 'You can invite friends here.',
    anchorId: DashboardButtonId.ROOM_SETTING_ID,
  },
];
