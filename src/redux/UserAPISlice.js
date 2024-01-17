import { api } from './api'

//** Redux Store */
import store from '../store'
import { handleSetUserInfo } from '../store/user'

//** Utils */
import RemoteProcedureNames from '../util/RemoteProcedureNames';

export const userApi = api.injectEndpoints({
  endpoints: builder => ({
    /**
     * Define a query to get user information.
     */
    getUserInfo: builder.query({
      query: ({ userId }) => ({ serviceName: 'getUserInfo', args: { userId } }),
      transformResponse: response => {
        // Process the response data and extract user information.
        const result = response;

        let accountType;

        if (result.username.indexOf('vistor_') > -1) {
          accountType = 'anonymous';
        } else {
          accountType = 'normal';
        }
     
        console.log('result', result);
        // Dispatch an action to update user information in the application's state.
        // store.dispatch(
        //   handleSetUserInfo({
        //     userId: result._id,
        //     email: result.emails[0].address,
        //     nickName: result.name,
        //     userName: result.username,
        //     status: result.status,
        //     avatar: result.head_url && result.head_url.indexOf('cn-boardx.oss') > -1 ? '' : result.head_url,
        //     avatarType: result.updateImg ? 'data' : 'nickname',
        //     type: result.type,
        //     credits: result.credits,
        //     emailVerified: result.emails[0].verified,
        //     accountType: accountType,
        //     roles: result.roles,
        //     createdAt: result.createdAt,
        //     referalUsers: result.referalUsers,
        //   })
        // );
        return result;
      },
      providesTags: ['userInfo']
    }),

    /**
     * Define a query to get the user's email from LinkedIn using an access token.
     * @param {string} token - The LinkedIn access token.
     */
    getLinkedinUserEmail: builder.query({
      query: token => ({
        serviceName: 'getLinkedinUserEmail',
        args: { token }
      }),
      transformResponse: response => {
        return response;
      }
    }),

    /**
     * Define a mutation to retrieve user information by email address.
     * @param {string} email - The email address of the user to retrieve.
     */
    getByEmailAddress: builder.mutation({
      query: email => ({
        serviceName: RemoteProcedureNames.GET_BY_EMAIL_ADDRESS,
        args: { email }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['userInfo']
    }),

    /**
     * Define a mutation to update user profile information.
     * @param {object} data - The user profile data to be updated.
     */
    updateUserProfile: builder.mutation({
      query: data => ({
        serviceName: 'updateUserProfileByManage',
        args: { data }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['userInfo']
    }),

    /**
     * Define a mutation to handle user invitation using a token.
     * @param {object} tokenData - Data associated with the invitation token.
     */
    userInviteToken: builder.mutation({
      query: tokenData => ({
        serviceName: 'userInviteToken',
        args: { tokenData }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['inviteToken']
    }),

    /**
     * Define a mutation to validate an invitation token.
     * @param {object} tokenData - Data associated with the invitation token.
     */
    validateInviteToken: builder.mutation({
      query: tokenData => ({
        serviceName: RemoteProcedureNames.VALIDATE_INVITE_TOKEN,
        args: { tokenData }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Define a mutation to register a user.
     * @param {object} data - User registration data.
     */
    registerUser: builder.mutation({
      query: data => ({
        serviceName: 'registerUser',
        args: { data }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['userInfo']
    }),

    /**
     * Define a mutation to exit an online user from a board by user ID, user number, and board ID.
     * @param {object} params - Parameters for exiting the online user.
     * @param {string} params.userId - User ID of the online user to exit.
     * @param {string} params.userNo - User number of the online user to exit.
     * @param {string} params.boardId - ID of the board from which the user should exit.
     */
    exitOnlineUserByBoardId: builder.mutation({
      query: ({ userId, userNo, boardId }) => ({
        serviceName: 'exitOnlineUserByBoardId',
        args: { userId, userNo, boardId }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Define a mutation to update the user's avatar to AWS.
     * @param {object} params - Parameters for updating the user's avatar.
     * @param {File} params.file - The avatar file to be uploaded.
     */
    updateUserAvatarToAws: builder.mutation({
      query: file => ({
        serviceName: 'updateAvatar',
        args: { file }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['userInfo']
    }),

    /**
     * Define a mutation to save the user's profile.
     * @param {object} data - The user profile data to be saved.
     */
    saveUserProfile: builder.mutation({
      query: data => ({
        serviceName: RemoteProcedureNames.SAVE_USER_PROFILE,
        args: { data }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['userInfo']
    }),

    /**
     * Define a mutation to update the user's account.
     * @param {string} userId - The user's ID.
     * @param {object} data - The updated account data.
     */
    updateUserAccount: builder.mutation({
      query: ({ userId, data }) => ({
        serviceName: 'updateUserAccount',
        args: { userId, data }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['userInfo']
    }),

    /**
     * Define a mutation to check if a user with a given email exists.
     * @param {string} email - The email address to check.
     */
    checkIfUserExistsByEmail: builder.mutation({
      query: email => ({
        serviceName: RemoteProcedureNames.CHECK_IF_USER_EXISTS_BY_EMAIL,
        args: { email }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Define a mutation to send a verification email.
     * @param {object} data - Data containing information for sending the verification email.
     */
    sendVerifyMsg: builder.mutation({
      query: data => ({
        serviceName: 'sendVerifyEmail',
        args: { data }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Define a mutation to check the verification status based on a verification token.
     * @param {string} token - The verification token to check.
     */
    checkVerify: builder.mutation({
      query: token => ({
        serviceName: 'checkVerifyEmail',
        args: { token }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Define a mutation to check permissions synchronously for a board based on its ID.
     * @param {string} boardId - The ID of the board to check permissions for.
     */
    checkPermissionSync: builder.mutation({
      query: boardId => ({
        serviceName: RemoteProcedureNames.CHECK_PERMISSION,
        args: { boardId }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Define a query to check if a user is a member of a specific organization.
     * @param {string} orgId - The ID of the organization to check membership in.
     * @param {string} userId - The ID of the user to check membership for.
     */
    checkIfUserInOrg: builder.query({
      query: ({ orgId, userId }) => ({
        serviceName: 'checkIfUserInOrg',
        args: { orgId, userId },
        skip: !orgId
      }),
      transformResponse: (response, error) => {
        return response;
      }
    }),

    /**
     * Define a query to check if a user is a member of a specific room.
     * @param {string} roomId - The ID of the room to check membership in.
     * @param {string} userId - The ID of the user to check membership for.
     */
    checkIfUserInRoom: builder.query({
      query: ({ roomId, userId }) => ({
        serviceName: 'checkIfUserInRoom',
        args: { roomId, userId },
        skip: !roomId
      }),
      transformResponse: (response, error) => {
        return response;
      }
    }),

    /**
     * Define a mutation to retrieve a list of users.
     * @param {object} data - Data containing query parameters.
     */
    getUserList: builder.mutation({
      query: data => ({
        serviceName: 'getUserList',
        args: { data }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Define a query to calculate a user's XP value.
     * @param {object} userId - The user's ID for which XP value needs to be calculated.
     */
    calculationUserXPValue: builder.query({
      query: ({ userId }) => ({
        serviceName: 'calculationUserXPValue',
        args: { userId }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      providesTags: ['userInfo', 'boardList']
    }),

    /**
     * Define a mutation to add tags to a user.
     * @param {object} data - The data containing information about the tags to add to the user.
     */
    addUserTags: builder.mutation({
      query: data => ({
        serviceName: 'addUserTags',
        args: { data }
      }),
      transformResponse: (response, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['userTags']
    }),

    /**
     * Define a query to get user tags.
     */
    getUserTags: builder.query({
      query: () => ({
        serviceName: 'getUserTags',
        args: {}
      }),
      transformResponse: (response, error) => {
        return response;
      },
      providesTags: ['userTags']
    })
  })
});

export const {
  useGetUserInfoQuery,
  useGetByEmailAddressMutation,
  useRegisterUserMutation,
  useExitOnlineUserByBoardIdMutation,
  useUpdateUserAvatarToAwsMutation,
  useSaveUserProfileMutation,
  useUserInviteTokenMutation,
  useValidateInviteTokenMutation,
  useCheckIfUserExistsByEmailMutation,
  useSendVerifyMsgMutation,
  useCheckVerifyMutation,
  useCheckPermissionSyncMutation,
  useCheckIfUserInOrgQuery,
  useCheckIfUserInRoomQuery,
  useGetUserListMutation,
  useUpdateUserProfileMutation,
  useUpdateUserAccountMutation,
  useCalculationUserXPValueQuery,
  useAddUserTagsMutation,
  useGetUserTagsQuery,
  useGetLinkedinUserEmailQuery
} = userApi
