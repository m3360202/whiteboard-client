//**Redux Store */
import { api } from './api';
import store from '../store';
import OrgService from '../services/OrgService';
import {
  handleSetOrgMemberList,
  handleSetOrgInfo,
  handleSetOrgList,
  handleChangeCurrentOrgName,
  handleSetOrgMemberRole
} from '../store/org';

import {
  handleSetBoardList,
  handleSetCurrentBoardList,
  handleSetPendingDeleteBoardList
} from '../store/boardList';

import { handleSetRoomList, handleSetCurrentRoomList } from '../store/room';

export const orgApi = api.injectEndpoints({
  endpoints: builder => ({
    /**
     * Query for retrieving the list of organizations.
     *
     * This query fetches the list of organizations and performs transformations on the response,
     * such as setting the organization list in the state and determining the currently selected
     * organization based on local storage or defaulting to the first organization in the list.
     *
     * @returns {object} The list of organizations and their details.
     */
    getOrgList: builder.query({
      query: () => ({ serviceName: 'getOrgList', args: {} }),
      transformResponse: response => {
        // Store the fetched organization list in the application state.
        const result:any = response.filter(r =>r.name);
        store.dispatch(handleSetOrgList(result));
        // Retrieve the currently selected organization from local storage or use the first organization by default.
        let orgInfo;
        let orgId = localStorage.getItem('orgId');
        if (orgId && orgId !== 'null' && orgId !== 'undefined') {
          const orgFilter = result.filter(r => r.orgId === orgId);
          orgInfo = orgFilter[0];
        } else {
          orgInfo = result[0];
        }
        if(orgInfo===undefined){
          return response;
          }
        // Store the organization details of the currently selected organization in the state.
        store.dispatch(
          handleSetOrgInfo({
            orgId: orgInfo.orgId,
            name: orgInfo.name,
            role: orgInfo.role
          })
        );

        return response;
      },
      providesTags: ['orgList']
    }),
    getRoomListByOrgId: builder.query({
      query: orgId => ({
        serviceName: 'subscriptions.get',
        args: { orgId },
        skip: !orgId
      }),
      transformResponse: response => {
        const result:any = response;
        const roomList = [];
        result.map(r => {
          if (r.t === 'p') {
            if (!r.f) r.f = false;
            r.private = true;
            roomList.push(r);
          }

          if (r.t === 'c') {
            if (!r.f) r.f = false;
            r.private = false;
            roomList.push(r);
          }
        });
        roomList.sort((a, b) => {
          if (!a.fname) {
            a.fname = '';
          }
          if (!b.fname) {
            b.fname = '';
          }

          return a.fname.localeCompare(b.fname);
        });
        roomList.sort((a, b) => {
          if (a.f > b.f) return -1;
          if (a.f < b.f) return 1;
          return 0;
        });
        return roomList;
      },
      providesTags: ['roomList']
    }),

    /**
     * Define a query to get organization's extended settings based on organization ID.
     * @param {string} orgId - The unique identifier of the organization.
     */
    getExtendSettings: builder.query({
      query: orgId => ({
        serviceName: 'getOrgExtendSettings',
        args: orgId,
        skip: !orgId
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      providesTags: ['extendSettings']
    }),

    /**
     * Define a mutation to insert a new organization with provided data.
     * @param {string} orgName - The name of the new organization.
     * @param {string} orgId - The unique identifier of the new organization.
     * @param {string} type - The type of insertion (e.g., 'joinCreateOrg').
     */
    insertNewOrg: builder.mutation({
      query: ({ orgName, orgId, type,user }) => ({
        serviceName: 'insertNewOrg',
        args: { orgName, orgId,user }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        if (patch.type === 'joinCreateOrg') {
          store.dispatch(handleChangeCurrentOrgName(patch.orgName));

          OrgService.getInstance().loadOrganization(patch.orgId);

          localStorage.setItem('dashBoardTeamTutorials', 'true');

          localStorage.setItem('dashBoardRoomTutorials', 'true');
        } else {
          let list = [];

          const orgList = store.getState().org.currentOrgList;

          orgList.map(t => {
            list.push(t);
          });

          list.push({
            orgId: patch.orgId,
            name: patch.orgName,
            role: 'owner',
            orgInfo: [{ _id: patch.orgId, name: patch.orgName }]
          });

          dispatch(handleSetOrgList(list));

          dispatch(
            handleSetOrgInfo({
              orgId: patch.orgId,
              name: patch.orgName,
              role: 'owner'
            })
          );

          localStorage.setItem('orgId', patch.orgId);

          dispatch(handleSetRoomList([]));
          dispatch(handleSetCurrentRoomList([]));
          dispatch(handleSetCurrentBoardList([]));
          dispatch(handleSetPendingDeleteBoardList([]));
          dispatch(handleSetBoardList([]));

          OrgService.getInstance().loadOrganization(patch.orgId);
        }
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['roomList', 'orgList', 'boardList']
    }),

    /**
     * Define a mutation to rename an organization with provided data.
     * @param {string} orgId - The unique identifier of the organization to be renamed.
     * @param {string} newOrgName - The new name for the organization.
     * @param {string} userId - The identifier of the user initiating the rename.
     */
    renameOrganization: builder.mutation({
      query: ({ orgId, newOrgName, userId }) => ({
        serviceName: 'renameOrganization',
        args: { orgId, newOrgName, userId }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const orgList = store.getState().org.orgList;

        let newOrgList = [];

        orgList.map(item => {
          if (item._id === patch.orgId) {
            item = {
              ...item,
              name: patch.newOrgName,
              'orgInfo.name': patch.newOrgName
            };
          }
          newOrgList.push('item----', item);
        });

        dispatch(handleSetOrgList(newOrgList));

        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['orgList']
    }),

    /**
     * Define a mutation to set the ghost status of an organization with provided data.
     * @param {object} data - The data containing information about the organization's ghost status.
     */
    setOrganizationGhost: builder.mutation({
      query: data => ({
        serviceName: 'setOrganizationGhost',
        args: { data }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['extendSettings']
    }),

    /**
     * Define a mutation to set LinkedIn integration settings for an organization with provided data.
     * @param {string} orgId - The unique identifier of the organization.
     * @param {string} linkedinAppKey - The LinkedIn application key.
     * @param {string} linkedinAppSecret - The LinkedIn application secret.
     * @param {string} linkedinCallBack - The LinkedIn callback URL.
     */
    setOrganizationLinkedin: builder.mutation({
      query: ({
        orgId,
        linkedinAppKey,
        linkedinAppSecret,
        linkedinCallBack
      }) => ({
        serviceName: 'setOrganizationLinkedin',
        args: { orgId, linkedinAppKey, linkedinAppSecret, linkedinCallBack }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['orgList']
    }),

    /**
     * Define a mutation to add an organization administrator with provided data.
     * @param {string} orgId - The unique identifier of the organization.
     * @param {string} userId - The unique identifier of the user to be added as an administrator.
     */
    addOrgAdmin: builder.mutation({
      query: ({ orgId, userId }) => ({
        serviceName: 'addOrgAdmin',
        args: { orgId, userId }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        dispatch(
          handleSetOrgMemberRole({
            userId: patch.userId,
            role: 'administrator'
          })
        );

        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['orgList', 'orgMemberList']
    }),

    /**
     * Define a mutation to remove an organization administrator with provided data.
     * @param {string} orgId - The unique identifier of the organization.
     * @param {string} userId - The unique identifier of the user to be removed as an administrator.
     */
    removeOrgAdmin: builder.mutation({
      query: ({ orgId, userId }) => ({
        serviceName: 'removeOrgAdmin',
        args: { orgId, userId }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        dispatch(
          handleSetOrgMemberRole({
            userId: patch.userId,
            role: 'member'
          })
        );

        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['orgMemberList']
    }),

    /**
     * Define a mutation to remove a user from an organization with provided data.
     * @param {string} orgId - The unique identifier of the organization.
     * @param {string} userId - The unique identifier of the user to be removed from the organization.
     */
    removeUserFromOrg: builder.mutation({
      query: ({ orgId, userId }) => ({
        serviceName: 'removeUserFromOrg',
        args: { orgId, userId }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const orgMemberList = store.getState().org.orgMemberList;

        // Filter the orgMemberList to remove the user with the specified userId.
        const newMemberList = orgMemberList.filter(
          obj => obj.userId !== patch.userId
        );

        dispatch(handleSetOrgMemberList(newMemberList));

        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['orgMemberList']
    }),

    /**
     * Define a mutation to add a user to an organization with provided data.
     * @param {string} orgId - The unique identifier of the organization.
     * @param {string} orgName - The name of the organization.
     * @param {object} user - Information about the user to be added.
     * @param {string} link - The link associated with the user.
     * @param {string} language - The language setting for the user.
     * @param {object} orgInfo - Information about the organization.
     */
    addOneUserToOrg: builder.mutation({
      query: ({ orgId, orgName, user, link, language, orgInfo }) => ({
        serviceName: 'addOneUserToOrg',
        args: { orgId, orgName, user, link, language }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const orgMemberList = store.getState().org.orgMemberList;

        let newMember = {...patch.user};

        // Update user properties for the new member.
        newMember.username = patch.user.name;
        newMember.name = patch.orgInfo.name;
        newMember.id = patch.user.username;
        newMember.userId = patch.user._id;
        newMember.role = 'member';

        // Add the new member to the orgMemberList.
        dispatch(handleSetOrgMemberList([...orgMemberList, newMember]));

        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['orgMemberList']
    }),

    /**
     * Define a mutation to send an organization invitation registration email to a non-existing user with provided data.
     * @param {string} orgName - The name of the organization.
     * @param {string} username - The username of the sender.
     * @param {string} inviteUsername - The username of the invited user.
     * @param {string} invitationLink - The link for the invitation.
     * @param {string} language - The language for the email.
     */
    sendOrgInvitationRegisterEmailToNonExistingUser: builder.mutation({
      query: ({
        orgName,
        username,
        inviteUsername,
        invitationLink,
        language
      }) => ({
        serviceName: 'sendOrgInvitationRegisterEmailToNonExistingUser',
        args: { orgName, username, inviteUsername, invitationLink, language }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: []
    }),

    /**
     * Define a query to find or create an invitation with provided user and invite data.
     * @param {string} userId - The unique identifier of the user.
     * @param {object} invite - Invitation data.
     */
    findOrCreateInvite: builder.query({
      query: ({ userId, invite }) => ({
        serviceName: 'findOrCreateInvite',
        args: { userId, invite }
      }),
      transformResponse: (response:any, error) => {
        // Extract the invitation code from the response.
        const invitationCode = response._id;

        // Construct the invitation link using the current host and the invitation code.
        const host = `${window.location.protocol}//${window.location.host}`;
        const invitationLink = `${host}/invite/${invitationCode}`;

        // Return the invitation link and any error that occurred.
        return {
          invitationLink: invitationLink,
          error: error
        };
      }
    }),

    /**
     * Define a query to fetch the list of members for a given organization.
     * @param {string} orgId - The unique identifier of the organization.
     */
    getOrgMemberList: builder.query({
      query: ({ orgId }) => ({
        serviceName: 'getOrgMemberList',
        args: { orgId },
        skip: !orgId
      }),
      transformResponse: (response:any, error) => {
        // Initialize an empty list to store the transformed data.
        let list = [];

        // Map the response data and add an 'id' field for each member.
        response.map(t => {
          t.id = t._id;
          list.push(t);
        });

        // Return the transformed list.
        return list;
      },
      providesTags: ['orgMemberList']
    }),

    /**
     * Define a query to fetch information about a specific member in an organization.
     * @param {string} orgId - The unique identifier of the organization.
     * @param {string} userId - The unique identifier of the user to retrieve information about.
     */
    getOrgMember: builder.query({
      query: ({ orgId, userId }) => ({
        serviceName: 'getOrgMember',
        args: { orgId, userId },
        skip: !orgId
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      providesTags: []
    })
  })
});

export const {
  useGetOrgListQuery,
  useGetRoomListByOrgIdQuery,
  useGetOrgMemberListQuery,
  useInsertNewOrgMutation,
  useRenameOrganizationMutation,
  useSetOrganizationGhostMutation,
  useSetOrganizationLinkedinMutation,
  useAddOrgAdminMutation,
  useRemoveOrgAdminMutation,
  useRemoveUserFromOrgMutation,
  useAddOneUserToOrgMutation,
  useSendOrgInvitationRegisterEmailToNonExistingUserMutation,
  useFindOrCreateInviteQuery,
  useGetOrgMemberQuery,
  useGetExtendSettingsQuery
} = orgApi;
