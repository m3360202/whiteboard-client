import { createApi } from '@reduxjs/toolkit/query/react'
import server from '../startup/serverConnect';

const dataBaseQuery = () =>
  async ({ serviceName, args, skip = false }) => {

    // if (skip || server.userId === null      ) {
    //   return new Promise((resolve, reject) => {
    //     reject({ data: [] })
    //   })
    // };
    return new Promise((resolve, reject) => {
      server.call(serviceName, ...Object.values(args)).then(result => {
        resolve({ data: result });
       }).catch(error => {
        reject({ error: { status: 500, data: error } })
      });

    })

  }

/**
 * Create a base API to inject endpoints into elsewhere.
 * Components using this API should import from the injected site,
 * in order to get the appropriate types,
 * and to ensure that the file injecting the endpoints is loaded 
 */
export const api = createApi({
  /**
   * `reducerPath` is optional and will not be required by most users.
   * This is useful if you have multiple API definitions,
   * e.g. where each has a different domain, with no interaction between endpoints.
   * Otherwise, a single API definition should be used in order to support tag invalidation,
   * among other features
   */
  reducerPath: 'splitApi',
  /**
   * A bare bones base query would just be `baseQuery: fetchBaseQuery({ baseUrl: '/' })`
   */
  baseQuery: dataBaseQuery(),
  /**
   * Tag types must be defined in the original API definition
   * for any tags that would be provided by injected endpoints
   */
  tagTypes: [
    'userList',
    'orgList',
    'roomList',
    'roomInfo',
    'roomMemberList',
    'widgets',
    'boardList',
    'recentBoardList',
    'deletedBoardList',
    'board',
    'orgMemberList',
    'aiCommandList',
    'teamsAiCommandList',
    'aiModelList',
    'aiModelTrainedList',
    'aiCustomStyleCommand',
    'BoardBackupList',
    'templateList',
    'teamsTemplateList',
    'invoiceList',
    'subscriptionPlan',
    'favoriteBoardList',
    'IconList',
    'ImageList',
    'settings',
    'userInfo',
    'inviteToken',
    'boardArticle',
    'userTags',
    'extendSettings',
    'ghostSettings',
    'aiChatSessionList',
    'userCustomizeImgCommandList',
    'boardTimer',
    'boardTimer',
    'aiChatContext',
    'aiAgentList',
    'myAgentList'
  ],
  /**
   * This api has endpoints injected in adjacent files,
   * which is why no endpoints are shown below.
   * If you want all endpoints defined in the same file, they could be included here instead
   */
  endpoints: () => ({})
});

export const enhancedApi = api.enhanceEndpoints({
  endpoints: () => ({
    getPost: () => 'test',
  }),
})
