//**Redux Store */
import store from '../store';


//**Axios */
import axios from 'axios';


//**Services */
import UtilityService from '../services/UtilityService';


//**Aws */
import AWS from 'aws-sdk';


//**Utils */
import imageCompression from 'browser-image-compression';

import server from '../startup/serverConnect';

export default class FileService {

  static service = null;

  private r2;

  private albumBucketName; //aws bucket name

  private uploadSettings = store.getState().system.settings.uploadSettings;

  static getInstance(): FileService {

    if (FileService.service == null) {
      FileService.service = new FileService();
      Boardx.Instance.OrgService = FileService.service;
    }

    return FileService.service;

  }

  constructor() {

    this.r2 = new AWS.S3({
      endpoint: this.uploadSettings.R2EndPoint,
      accessKeyId: this.uploadSettings.R2AccessKeyId,
      secretAccessKey: this.uploadSettings.R2SecretAccessKey,
      signatureVersion: 'v4',
    });

    this.albumBucketName = this.uploadSettings.R2BucketName;

  }

  // upload files to AWS S3
  async uploadFileToR2inBoard(path, file, callback) {

    let uuId = UtilityService.getInstance().generateUUID();

    let photoKey;

    let myFile = file;

    const options = {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 680,
      useWebWorker: false,
    };

    myFile = await imageCompression(file, options);

    const extension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);

    photoKey = path + 'images/' + 'smallPic/' + uuId + '.' + extension;

    let bigphotoKey = path + 'images/' + 'bigPic/' + uuId + '.' + extension;

    await this.uploadFileToR2(bigphotoKey, file);

    let uploadResponse = await this.uploadFileToR2(photoKey, myFile);

    return uploadResponse;

  }

  // upload Json to AWS S3
  async uploadJsonToR2(path, file, callback) {

    let key = path + 'backup/' + store.getState().user.userInfo.userId + '/' + file.name;

    let signature = await this.r2.getSignedUrlPromise('putObject', { Bucket: this.albumBucketName, Key: key, Expires: 3600 });

    return axios.put(signature, file, { headers: { 'Content-Type': file.type } }).then(res => {

      return 'https://files.boardx.us/' + key;

    }).catch(error => {
    })

  }

  // upload Json to AWS S3
  async uploadRecordToR2(path, file) {


    let time = Date.now();

    let extension = '.mp3';

    let key = path + 'record/' + store.getState().user.userInfo.userId + '/' + time + extension;

    let signature = await this.r2.getSignedUrlPromise('putObject', { Bucket: this.albumBucketName, Key: key, Expires: 3600 });

    let contentType = 'audio/mp3';

    await axios.put(signature, file, { headers: { 'Content-Type': contentType } });

    let url = 'https://files.boardx.us/' + key;

    return url;

  }

  // upload AVATAR to AWS S3
  async uploadAvatarToR2(path, file, callback) {

    let photoKey = path + 'avatar/' + file.name;

    let uploadResponse = await this.uploadFileToR2(photoKey, file);

    return uploadResponse;

  }

  async uploadFileToR2(photoKey, file) {

    let signature = await this.r2.getSignedUrlPromise('putObject', { Bucket: this.albumBucketName, Key: photoKey, Expires: 3600 });

     const response = await axios.put(signature, file, { headers: { 'Content-Type': file.type } });

      let result = 'https://files.boardx.us/' + photoKey;

      return result;

   

  }

  async uploadFileToR2Async(path, file, callback) {

    if (file && file.name) {

      const extension = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);

      let photoKey = path + 'files/' + Date.now() + '.' + extension;

      let uploadResponse = await this.uploadFileToR2(photoKey, file);

      return uploadResponse;
    }
  };

  async uploadThumbnailToR2Async(path, file, callback) {

    if (file && file.name) {

      let now = Date.now();

      let photoKey = path + 'thumbnail/' + file.name;

      let uploadResponse = await this.uploadFileToR2(photoKey, file);

      return uploadResponse + '?timestamp=' + now;

    }
  };
  async readContentFromFileAsync(object) {
    server.call('readContentFromFile', { id: object._id, name: object.name, boardId: object.whiteboardId, src: object.src, obj_type: object.obj_type, url: object.url }).then(res => {

    }).catch(err => {
      console.log(err)
    });

  };
}