export default class BoardListType {
  public static RECENT = 'recent'
  public static ROOM = 'room'
}

export enum MoreHandleType {
  Rename,
  Duplicate,
  UploadThumbnail,
  SetCategory,
  AddDescription,
  OpenInNewTab,
  Move,
  Delete
}
