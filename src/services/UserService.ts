//** Import i18n
import i18n from '../i18n';

//** Import Redux
import store from '../store';

//** Import Collections
import { handleSetAccountType, handleSetToken, handleSetUserInfo } from '../store/user'
import { handleAddOnlineUser } from '../store/system';

//** Import Services
import { userApi } from '../redux/UserAPISlice';
import { EventService, BoardService } from './';
import server from '../startup/serverConnect';
import stc from 'string-to-color';
import {handleSetOnlineUsers} from '../store/user/index';
export default class UserService {

  static service = null;
  public userId = '';
  static getInstance(): UserService {
    if (UserService.service == null) {
      UserService.service = new UserService();
      Boardx.Instance.UserService = UserService.service;
    }
    return UserService.service;
  }

  componentDidMount() {
    this.initUser();
  }

  initUser() {
    // const userId = store.getState().user.userInfo.userId ? store.getState().user.userInfo.userId : '';
    // server.subscribe('users.user', userId).ready().then(() => {

    // //   const userCollection = server.collection('users').fetch();

    // //   let user = userCollection[0];

    // //     // 处理collection数据变动
    // //     userCollection.onChange(async (data) => {
    // //       this.saveStore(user);
    // //     })
    // //     setTimeout(async () => {
    // //       await this.saveStore(user);
    // //     }, 200);
    // });

  }



   async addOnlineUserToLocal(user) {

    let profiles = store.getState().user.onlineUsers?.map(r=>r) ||[];
 
    // const user = store.getState().user.userInfo;
   
    const userData = {
      userId: user.userId,
      username: user.userName, 
      avatar: user.avatar, 
      name:user.name,
      t: Date.now(),
      userNo:user.userNo,
      createdAt: new Date(),
      color:"",
      display:"none",
    }

    userData.color = Boardx.Util.getAvatarColor(user.name);
    userData.avatar = user.avatar ? user.avatar : '';
    userData.display = 'none';
    if(!profiles.find(r=>r.userNo == userData.userNo)){
      profiles.push(userData);
    }else{
      return;
    }
      
    

    profiles.sort((a, b) => b.timestamp - a.timestamp);
    store.dispatch(handleSetOnlineUsers(profiles));

   }

   async removeOnlineUserFromLocal(user) {
    let profiles = store.getState().user.onlineUsers?.map(r=>r) ||[];
    profiles = profiles.filter(r=>r.userNo != user.userNo);
    store.dispatch(handleSetOnlineUsers(profiles));
   }

  async pubsub(boardId) {
    console.log('pubsub',store.getState().system.addOnlineUser,boardId,store.getState().user.userInfo.userId)
    if (!store.getState().system.addOnlineUser && boardId && store.getState().user.userInfo.userId) {
      store.dispatch(handleAddOnlineUser(true));
      await EventService.getInstance().addOnlineUserToBoard(boardId);


      await BoardService.getInstance().subscribeAndUpdate(boardId);
    }
  }
 

  async saveStore(result) {
    if (!store.getState().system.settings) return;
    const timestamp = new Date().getTime();
    const userNo = Boardx.Util.getId()
    const user = {
      email: result.emails[0].address,
      nickName: result.name,
      name: result.name,
      userName: result.username,
      status: result.status,
      avatar: result.head_url && result.head_url.indexOf('cn-boardx.oss') > -1 ? '' : result.head_url,
      avatarType: result.updateImg ? 'data' : 'nickname',
      type: 'user',
      userId: result._id,
      credits: result.credits,
      emailVerified: result.emails[0].verified,
      createdAt: result.createdAt,
      roles: result.roles,
      userNo:userNo,
      referalUsers: result.referalUsers,

    };
    await store.dispatch(handleSetUserInfo(user))
    this.addOnlineUserToLocal(user);
    localStorage.setItem('userRoles', JSON.stringify(result.roles));
  }

  async saveStoreForAnonymous(result) {

    const timestamp = new Date().getTime();
    await store.dispatch(handleSetUserInfo({
      email: result.emails[0].address,
      name: result.name,
      nickName: result.name,
      userName: result.username,
      status: result.status,
      avatar: result.head_url && result.head_url.indexOf('cn-boardx.oss') > -1 ? '' : result.head_url,
      avatarType: result.updateImg ? 'data' : 'nickname',
      type: 'anonymous',
      userId: result._id,
      credits: result.credits,
      emailVerified: result.emails[0].verified,
      createdAt: result.createdAt,
      roles: result.roles,
    }))

  
  }

  logout() {

    Boardx.Util.Msg.info("logging out...");

    //exitonlineusers
    const userId = store.getState().user.userInfo.userId;
    const token = localStorage.getItem('token');
    const boardId = store.getState().board.board._id;
    EventService.getInstance().exitOnlineUsers(userId, boardId, token);

    localStorage.removeItem('jitsiMeetId');
    localStorage.removeItem('currentOrgList');
    localStorage.removeItem('roomId');
    localStorage.removeItem('orgId');
    localStorage.removeItem('loginToken');
    localStorage.removeItem('loginTokenExpires');
    localStorage.removeItem('currentOrgId');
    localStorage.removeItem('viewportTransformation');
    localStorage.removeItem('pageFrom');
    localStorage.removeItem('firstUsedUser');
    localStorage.removeItem('latestCommands');
    localStorage.removeItem('AiCreateImgSize');
    localStorage.removeItem('AiCreateImgNum');
    localStorage.removeItem('token');
    localStorage.removeItem('ChatSessionStorage');
    const userInfo = {
      userId: '',
      email: [],
      nickName: '',
      userName: '',
      status: '',
      avatar: '',
      avatarType: '',
      type: '',
      credits: 0,
      roles: [],
      emailVerified: false,
      accountType: '',
      createdAt: '',
      lastSessionId: ''
    }

    store.dispatch(handleSetUserInfo(userInfo));
    store.dispatch(handleSetToken(null));
    store.dispatch(handleAddOnlineUser(false));
  }

  stringAvatar(name) {
    return {
      sx: {
        bgcolor: this.getAvatarColor(name || ''),
      },
    };
  };

  getAvatarColor = (name) => stc(name);

  getNickName() {
    let name = [
      'Abby',
      'Angel',
      'Annie',
      'Baby',
      'Bailey',
      'Bandit',
      'Bear',
      'Bella',
      'Bob',
      'Boo',
      'Boots',
      'Bubba',
      'Buddy',
      'Buster',
      'Cali',
      'Callie',
      'Casper',
      'Charlie',
      'Chester',
      'Chloe',
      'Cleo',
      'Coco',
      'Cookie',
      'Cuddles',
      'Daisy',
      'Dusty',
      'Felix',
      'Fluffy',
      'Garfield',
      'George',
      'Ginger',
      'Gizmo',
      'Gracie',
      'Harley',
      'Jack',
      'Jasmine',
      'Jasper',
      'Kiki',
      'Kitty',
      'Leo',
      'Lilly',
      'Lily',
      'Loki',
      'Lola',
      'Lucky',
      'Lucy',
      'Luna',
      'Maggie',
      'Max',
      'Mia',
      'Midnight',
      'Milo',
      'Mimi',
      'Miss kitty',
      'Missy',
      'Misty',
      'Mittens',
      'Molly',
      'Muffin',
      'Nala',
      'Oliver',
      'Oreo',
      'Oscar',
      'Patches',
      'Peanut',
      'Pepper',
      'Precious',
      'Princess',
      'Pumpkin',
      'Rascal',
      'Rocky',
      'Sadie',
      'Salem',
      'Sam',
      'Samantha',
      'Sammy',
      'Sasha',
      'Sassy',
      'Scooter',
      'Shadow',
      'Sheba',
      'Simba',
      'Simon',
      'Smokey',
      'Snickers',
      'Snowball',
      'Snuggles',
      'Socks',
      'Sophie',
      'Spooky',
      'Sugar',
      'Tiger',
      'Tigger',
      'Tinkerbell',
      'Toby',
      'Trouble',
      'Whiskers',
      'Willow',
      'Zoe',
      'Zoey',
    ];
    return name[Math.floor(Math.random() * name.length)] + '_vistor';
  }
}
