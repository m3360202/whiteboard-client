export default class ProcedureNames {
  // Widget
  static GET_WIDGET_BY_BOARD_ID = 'getWidgetsByBoardId';

  static PUBLISH_WHITEBOARD_ACTIVITY = 'publishWhiteboardActivity';

  static UPDATE_WIDGET = 'updateWidget';

  static UPDATE_WIDGET_ARR = 'updateWidgetArr';

  static INSERT_WIDGET = 'insertWidget';

  static INSERT_WIDGET_ARR = 'insertWidgetArr';

  static REMOVE_WIDGET = 'removeWidget';

  static REMOVE_WIDGET_ARR = 'removeWidgetArr';

  // User
  static USERS_Login = 'userLogin';
  static USERS_INFO = 'usersInfo';
  static FORGOTPASSWORD='userForgotPassword';

  static CHECK_IF_SUPPORT_ANONYMOUS_VISITOR = 'checkIfSupportAnonymousVisitor';

  static USERS_USER = 'users.user';

  static GET_ACCESS_TOKEN = 'getWechatAccessToken';

  static GET_USER_INFO = 'getUserInfo';

  static GET_WECHAT_USER = 'getWechatUserInfo';

  static GET_ANONYMOUSE_USER_ACCOUNT = 'getAnonymousUserAccount';

  static CHECK_PERMISSION = 'checkPermission';

  static SAVE_USER_PROFILE = 'saveUserProfile';

  static UPDATE_USER_AVATAR = 'updateUserAvatar';

  static REGISTER_USER = 'registerUser';

  static VALIDATE_INVITE_TOKEN = 'validateInviteToken';

  static USE_INVITE_TOKEN = 'useInviteToken';

  static IS_ANONYMOUS_USER = 'isAnonymousUser';

  static GET_USER_UNIONID = 'getUserInviteUnionId';

  static GET_USER_NAME = 'getUserName';

  static GET_NAME = 'getName';

  static GET_USER_INVITEID_ID = 'getUserInviteId';

  static GET_USER_BY_UNION_ID = 'getUserByUnionId';

  static CHECK_IF_USER_EXISTS_BY_USER_NAME = 'checkIfUserExistsByUserName';

  // Room & Board
  static GET_ROOM_MEMBER = 'getRoomMember';

  static GET_RECENT_BOARD_LIST_BY_KEY = 'getRecentBoardListByKey';

  static GET_RECENT_BOARD_LIST_BY_USERID = 'getRecentBoardsByUserId';

  static GET_BOARD_LIST_IN_ROOM_BY_KEY = 'getBoardListInRoomByKey';

  static UPLOAD_DESCRIPTION_TO_BOARD_BY_ID = 'uploadDescriptiontoBoardById';

  static UPDATE_BOARD_BY_ID = 'updateBoardById';

  static GET_WHITEBOARD_BY_ID = 'getBoardById';

  static ADD_WHITE_BOARD = 'addWhiteboard';

  static CREATE_PRIVATE_GROUP = 'createPrivateGroup';

  static DELETE_BOARD_BY_ID = 'deleteBoardById';

  static MOVE_BOARD_BY_ID = 'moveBoardById';

  static RENAME_BOARD_BY_ID = 'renameBoardById';

  static RETAG_BOARD_BY_ID = 'retagBoardById';

  static UPLOAD_THUMBNAIL2_TO_BOARD_BY_ID = 'uploadThumbnail2toBoardById';

  static REMOVE_USER_FROM_ROOM = 'removeUserFromRoom';

  static REMOVE_ROOM_MODERATOR = 'removeRoomModerator';

  static ADD_ROOM_MODERATOR = 'addRoomModerator';

  static USERS_AUTOCOMPLETE = 'usersAutocomplete';

  static INVITE_USER_TO_ROOM_NOTIFICATION = 'InviteUserToRoomNotification';

  static ADD_USERS_TO_ROOM = 'addUsersToRoom';

  static SEND_INVITATION_EMAIL_TO_ROOM = 'sendInvitationEmailToRoom';

  static FIND_OR_CREATE_INVITE = 'findOrCreateInvite';

  static ROOMS_DELETE = 'roomsDelete';

  static RENAME_ROOM = 'renameRoom';

  static TOGGLE_FAVORITE = 'toggleFavorite';

  static DUPLICATE_BOARD = 'duplicateBoard';

  static GET_IMAGE_LIST_BY_KEY = 'getImageListByKey';

  static UPLOAD_IMAGE_BY_URL = 'uploadImageByUrl';

  static GET_WHITEBOARD_BY_ROOM_ID = 'getWhiteboardByRoomId';

  static GET_BOARD_BACK_UP = 'getBoardBackup';

  static RESTORE_BACK_UP = 'restoreBackup';

  static GET_ICON_LIST_BY_KEY = 'getIconListByKey';

  static GET_ROOMS='subscriptions.get';

  // Org
  static GET_ORG_LIST='getOrgList';

  static INSERT_NEW_ORG = 'insertNewOrg';

  static GET_ORG_MEMBER = 'getOrgMember';

  static GET_ORG_MEMBER_LIST = 'getOrgMemberList';

  static RENAME_ORGANIZATION = 'renameOrganization';

  static ADD_ONE_USER_TO_ORG = 'addOneUserToOrg';

  static CHECK_IF_USER_EXISTS_BY_EMAIL = 'checkIfUserExistsByEmail';

  static SEND_ORG_INVITATION_REGISTER_EMAIL_TO_NON_EXISTING_USER =
    'sendOrgInvitationRegisterEmailToNonExistingUser';

  static ADD_ORG_ADMIN = 'addOrgAdmin';

  static REMOVE_ORG_ADMIN = 'removeOrgAdmin';

  static REMOVE_USER_FROM_ORG = 'removeUserFromOrg';

  // Utility
  static UPLOAD_WEBSITE = 'uploadWebsite';

  static GET_ALL_BOARDS='getAllBoards'
}
