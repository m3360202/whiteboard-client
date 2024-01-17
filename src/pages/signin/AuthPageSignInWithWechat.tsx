//** Import react
import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

//** Import i18n


//** Import Redux kit
import { handleSetUserInfo } from '../../store/user';
import { useSelector, useDispatch } from 'react-redux';

//**Import others
import __ from 'underscore';
import uuid from 'uuid';

const wechatLogin = () => {
  const dispatch = useDispatch();
  const query = useQuery();
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  var path = location.pathname + location.search;
  if (path.indexOf('?code') > -1 && path.indexOf('&state') > -1) {
    const history = useHistory();
    //login with wechat
    const appid = 'wx7b9c396cfe495af5';
    const appsecret = '665c55bc433b6d32d6e768f038d27f41';
    const wechatcode = query.get('code');
    const getAccessUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appid + '&secret=' + appsecret + '&code=' + wechatcode + '&grant_type=authorization_code'
    const jumpUrl = async (result) => {
      await dispatch(
        handleSetUserInfo({
          email: 'none',
          nickName: result.name,
          userName: result.username,
          status: 'offline',
          avatar: result.head_url,
          avatarType: 'data',
          type: 'wechatUser',
          unionId: result.unionId,
          userId: result._id,
          credits: result.credits,
          emailVerified: result.emails[0].verified,
          roles: result.roles
        })
      );

      history.replace('/recent');
    }

  }
  return (<div></div>);
};
export default wechatLogin;

