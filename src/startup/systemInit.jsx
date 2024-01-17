//** Import React
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

//** Import Redux
import { useSelector } from 'react-redux';
import store from '../store';
import Box from '@mui/material/Box';

//** Import Collections
import { handleSetInitDone, handleSetSettings } from '../store/system';
import { UserService, OrgService } from '../services';
import server from './serverConnect';
import { useTranslation } from 'react-i18next';

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

import AIService from '../services/AIService';
import ClipboardService from '../services/ClipboardService';
import { orgApi } from 'redux/OrgAPISlice';
 
window.MemoryVectorStore = MemoryVectorStore;
window.OpenAIEmbeddings = OpenAIEmbeddings;


import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

window.RecursiveCharacterTextSplitter = RecursiveCharacterTextSplitter

import * as htmlToImage from 'html-to-image';
window.htmlToImage = htmlToImage;

export default function SystemInit({ children }) {
    const history = useHistory();
    const user = useSelector(state => state.user.userInfo);
    const storageToken = localStorage.getItem('token');
    const settings = useSelector(state => state.system.settings);
 
    const { t } = useTranslation();
    Boardx.Util.t = t;
    AIService.getInstance();
    ClipboardService.getInstance();
 
    const isLoginOrJoin = window.location.pathname.indexOf('/signin') > -1
        || window.location.pathname.indexOf('/join') > -1;

    if ((storageToken == undefined || storageToken == null)
        && window.location.pathname.indexOf('/signin') === -1
        && window.location.pathname.indexOf('/join') === -1
        &&window.location.pathname.slice(1) !== '') {
        history.push('/signin?callback=' + window.location.pathname.slice(1));
    }

    const listenLoginOut = event => {
        if (event.key === 'loginStatue') {
            const loginStatue = localStorage.getItem('loginStatue');
            if (loginStatue === 'logout') {
                UserService.getInstance().logout();
                localStorage.removeItem('loginStatue');
                if (window.location.pathname.indexOf('/board/') > -1) {
                    history.push('/signin?callback=' + window.location.pathname.slice(1));
                } else {
                    history.push('/signin');

                }
            }
        }
    };
    useEffect(() => {
        if (
            !store.getState().system.settings ||
            (store.getState().system.setting &&
                store.getState().system.settings.length === 0)
        ) {
            server
                .call('getSettings', 'all')
                .then(res => {
                    store.dispatch(handleSetSettings(res));
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, []);

    useEffect(() => {
        let url = '';
        if (settings) {
            if (!store.getState().system.initDone) {
                store.dispatch(handleSetInitDone(true));
                if (storageToken && !store.getState().user.userId) {

                    loadUser();

                    async function loadUser() {
                        try {
                            let user = await server.login({ resume: storageToken });
                            console.log('user', user)
                            if (user && user.id) {

                                store.dispatch(handleSetInitDone(true));
                                let user = await server.call('getUserInfo');
                                console.log('user----', user)
                                const userId = user._id;
                                const token = storageToken;
                                await server.call('saveLoginToken', userId, token);
                                UserService.getInstance().saveStore(user);
                                if (location.pathname.indexOf('/board/') === -1) {
                                    if (store.getState().user.userInfo.userName.indexOf('vistor_') > -1) {
                                        UserService.getInstance().logout();
                                        history.push('/signin');
                                    }
                                }
                            }
                        } catch (err) {
                            console.log('err---------', err)
                            if (location.pathname.indexOf('/signin') === -1) {
                                store.dispatch(handleSetInitDone(true));
                                history.push('/signin');
                            }
                        }




                    }

                    // server.call('loginWithToken', storageToken).then(res => {
                    //     if (res && res.status) {
                    //         store.dispatch(handleSetInitDone(true));
                    //         UserService.getInstance().saveStore(res.user);
                    //         if (location.pathname.indexOf('/board/') === -1) {
                    //             if (store.getState().user.userInfo.userName.indexOf('vistor_') > -1) {
                    //                 UserService.getInstance().logout();
                    //                 history.push('/signin');
                    //             }


                    //         }
                    //     } else {
                    //         if (location.pathname.indexOf('/signin') === -1) {
                    //             store.dispatch(handleSetInitDone(true));
                    //             history.push('/signin');
                    //         }
                    //     }
                    // });
                } else {
                    if (location.pathname.indexOf('/signin') === -1
                        && location.pathname.indexOf('callback') === -1
                        && location.pathname.indexOf('/board') === -1
                        && location.pathname.indexOf('/join') === -1
                        && location.pathname.indexOf('/singinWithLinkedin') === -1
                        && location.pathname.indexOf('/invite') === -1
                        && location.pathname.indexOf('/reset-password') === -1
                    ) {
                        store.dispatch(handleSetInitDone(true));
                        url = '/signin';
                        location.href = url;
                    }
                    if (location.pathname.indexOf('callback') === -1
                        && location.pathname.indexOf('/board') > -1
                    ) {
                        store.dispatch(handleSetInitDone(true));

                    }

                }

            }
        }
    }, [settings]);

    useEffect(() => {
        console.log('#user', user)
        if (!user.userId) return;

        (async () => {
            const {data: orgList} = await store.dispatch(orgApi.endpoints.getOrgList.initiate({ userId: user.userId }));
            let orgId = localStorage.getItem('orgId');
            if (!orgId) orgId = orgList[0]?.orgId;
            if (orgList && orgList.length > 0 && user.userId && orgId) {
                console.log('orglist', orgList);
                OrgService.getInstance().loadOrganization(orgId);
            }
        })();






        window.addEventListener('storage', listenLoginOut, true);

        return () => {
            window.removeEventListener('storage', listenLoginOut, true);
        };
    }, [user]);
    return (isLoginOrJoin || user.userId !== "") && <Box>{children}</Box>;
}
