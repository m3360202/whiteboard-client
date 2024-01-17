import { api } from './api';

import { orgApi } from './OrgAPISlice';

//**Redux Store */
import {
  handleSetCurrentBoardList,
  handleSetBoardList
} from '../store/boardList';
import {
  handleSetRoomMemberRole,
  handleDelMemberFromList,
  handleSetRoomList,
  handleSetRoomInfo,
  handleSetCurrentRoomName,
  handleSetInRoom
} from '../store/room';
import {
  handleSetTemplateList,
  handleSetSearchTemplateList
} from '../store/resource';
import { handleSetKeyword } from '../store/boardList';
import store from '../store';

//** Service */
import OrgService from '../services/OrgService';
import _ from 'lodash';

export const roomApi = api.injectEndpoints({
  endpoints: builder => ({
    /**
     * Define a mutation to create a private group with provided data.
     * @param {string} name - The name of the private group.
     * @param {array} members - An array of members to include in the group.
     * @param {boolean} readOnly - Flag indicating whether the group is read-only (default is false).
     * @param {boolean} publicRoom - Flag indicating whether the group is public.
     * @param {object} customFields - Custom fields for the group.
     * @param {object} extraData - Extra data for the group.
     * @param {string} orgId - The unique identifier of the organization.
     */
    createPrivateGroup: builder.mutation({
      query: (data) => ({
        serviceName: 'createPrivateGroup',
        args: {
          data
        }
      }),
      transformResponse: (response:any, error) => {
        const group:any = response;

        // Dispatch an action to set room information based on the created group.
        store.dispatch(
          handleSetRoomInfo({
            roomId: group._id,
            name: group.name,
            role: 'owner'
          })
        );

        // Return the room URL and any error that occurred.
        return { roomUrl: `/room/${group._id}`, error };
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Clear board and keyword related data.
        dispatch(handleSetBoardList([]));
        dispatch(handleSetCurrentBoardList([]));
        dispatch(handleSetKeyword(''));
        dispatch(handleSetInRoom(true));

        // Load the room list for the organization.
        OrgService.getInstance().loadRoomListByOrgId(patch.orgId);

        // Invalidate the 'roomList' tag to trigger a refetch of room data.
        dispatch(orgApi.util.invalidateTags(['roomList']));

        try {
          await queryFulfilled;
        } catch {
          // patchResult.undo();
        }
      },
      invalidatesTags: ['roomList']
    }),

    /**
     * Define a mutation to retag a board by its unique identifier with selected categories.
     * @param {string} boardId - The unique identifier of the board to retag.
     * @param {array} selectedCategoryList - An array of selected categories for the board.
     */
    retagBoardById: builder.mutation({
      query: ({ boardId, selectedCategoryList }) => ({
        serviceName: 'retagBoardById',
        args: { boardId, selectedCategoryList }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      invalidatesTags: ['boardList', 'teamsTemplateList'],
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Retrieve the current board list from the store.
        const currentBoardList = store.getState().boardList.currentBoardList;

        // Initialize a new list to store the updated board list.
        let newCurrentBoardList = [];

        // Iterate through the current board list to find the board matching the provided boardId.
        currentBoardList.map(item => {
          if (item._id === patch.boardId) {
            // Update the tags of the matching board with the selectedCategoryList.
            item = { ...item, tags: patch.selectedCategoryList };
          }
          // Add the board to the new list.
          newCurrentBoardList.push(item);
        });

        // Dispatch an action to update the current board list with the changes.
        dispatch(handleSetCurrentBoardList(newCurrentBoardList));

        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Define a mutation to add a room moderator with the provided room ID and user ID.
     * @param {string} roomId - The unique identifier of the room.
     * @param {string} currentUserId - The unique identifier of the current user.
     */
    addRoomModerator: builder.mutation({
      query: ({ roomId, currentUserId }) => ({
        serviceName: 'addRoomModerator',
        args: { roomId, currentUserId }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      invalidatesTags: ['roomInfo'],
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Dispatch an action to set the role of the room member as 'administrator'.
        dispatch(
          handleSetRoomMemberRole({
            userId: patch.currentUserId,
            role: 'administrator'
          })
        );
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Define a mutation to remove a room moderator with the provided room ID and user ID.
     * @param {string} roomId - The unique identifier of the room.
     * @param {string} userId - The unique identifier of the user to remove as a moderator.
     */
    removeRoomModerator: builder.mutation({
      query: ({ roomId, userId }) => ({
        serviceName: 'removeRoomModerator',
        args: { roomId, userId }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Dispatch an action to set the role of the room member as 'member' after removing moderator status.
        dispatch(
          handleSetRoomMemberRole({
            userId: patch.userId,
            role: 'member'
          })
        );

        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['roomInfo']
    }),

    /**
     * Define a mutation to remove a user from a room with the provided room ID and current user information.
     * @param {string} roomId - The unique identifier of the room.
     * @param {string} currentUserName - The username of the current user.
     * @param {object} currentUser - Information about the current user.
     */
    removeUserFromRoom: builder.mutation({
      query: ({ roomId, currentUserName, currentUser }) => ({
        serviceName: 'removeUserFromRoom',
        args: { roomId, currentUserName }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Dispatch an action to remove the user from the member list of the room.
        dispatch(handleDelMemberFromList({ userId: patch.currentUser._id }));

        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['roomInfo']
    }),

    /**
     * Define a mutation to upload a second thumbnail to a board by its unique identifier.
     * @param {string} boardId - The unique identifier of the board.
     * @param {string} thumbnail2URL - The URL of the second thumbnail to upload.
     */
    uploadThumbnail2toBoardById: builder.mutation({
      query: ({ boardId, thumbnail2URL }) => ({
        serviceName: 'uploadThumbnail2toBoardById',
        args: { boardId, thumbnail2URL }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Retrieve the current board list from the store.
        const boardList = store.getState().boardList.currentBoardList;

        // Initialize a new list to store the updated board list.
        let newBoardList = [];

        // Iterate through the current board list to find the board matching the provided boardId.
        boardList.map(item => {
          if (patch.boardId === item._id) {
            // Update the second thumbnail URL of the matching board.
            item = { ...item, thumbnail2: patch.thumbnail2URL };
          }
          newBoardList.push(item);
        });

        // Dispatch actions to update both the current board list and the general board list.
        dispatch(handleSetCurrentBoardList(newBoardList));
        dispatch(handleSetBoardList(newBoardList));

        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['boardList']
    }),

    /**
     * Define a mutation to move a board to a different room by its unique identifier.
     * @param {string} boardId - The unique identifier of the board to be moved.
     * @param {string} roomId - The unique identifier of the destination room.
     */
    moveBoardById: builder.mutation({
      query: ({ boardId, roomId }) => ({
        serviceName: 'moveBoardById',
        args: { boardId, roomId }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Retrieve the current board list from the store.
        let boardList = store.getState().boardList.boardList;

        // Filter out the board to be moved from the board list.
        boardList = boardList.filter(obj => obj._id !== patch.boardId);

        // Dispatch actions to update both the current board list and the general board list.
        dispatch(handleSetCurrentBoardList(boardList));
        dispatch(handleSetBoardList(boardList));

        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['boardList']
    }),

    /**
     * Define a mutation to send an invitation email to a room with the provided room name, current user's username,
     * recipient's username, and invitation link.
     * @param {string} roomName - The name of the room.
     * @param {string} currentUserName - The username of the current user.
     * @param {string} userName - The username of the recipient.
     * @param {string} invitationLink - The invitation link for the room.
     */
    sendInvitationEmailToRoom: builder.mutation({
      query: ({ roomName, currentUserName, userName, invitationLink }) => ({
        serviceName: 'sendInvitationEmailToRoom',
        args: { roomName, currentUserName, userName, invitationLink }
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
     * Define a mutation to rename a room by its unique identifier.
     * @param {string} roomId - The unique identifier of the room to be renamed.
     * @param {string} newRoomName - The new name for the room.
     */
    renameRoom: builder.mutation({
      query: ({ roomId, newRoomName }) => ({
        serviceName: 'renameRoom',
        args: { roomId, newRoomName }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },

      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Create a new list to store the updated room list.
        let newRoomList = [];

        // Get the current room data from the store.
        const roomData = store.getState().room.roomInfo;

        // Get the current room list from the store.
        const roomList = store.getState().room.roomList;

        // Iterate through the room list to update the room name.
        roomList.map(item => {
          if (item.rid === patch.roomId) {
            item = { ...item, name: patch.newRoomName };
          }
          newRoomList.push(item);
        });

        // Dispatch actions to update both the room list and room info.
        dispatch(handleSetRoomList(newRoomList));
        dispatch(handleSetRoomInfo({ ...roomData, name: patch.newRoomName }));

        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['roomInfo', 'roomList']
    }),

    /**
     * Define a mutation to delete a room by its unique identifier.
     * @param {string} roomId - The unique identifier of the room to be deleted.
     */
    deleteRoom: builder.mutation({
      query: ({ roomId }) => ({
        serviceName: 'roomsDelete',
        args: { roomId }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['roomList']
    }),

    /**
     * Define a mutation to toggle the favorite status of a room by its unique identifier.
     * @param {string} roomId - The unique identifier of the room to toggle the favorite status for.
     * @param {boolean} value - The new favorite status value (true or false).
     * @param {string} orgId - The unique identifier of the organization associated with the room.
     */
    toggleRoomFavorite: builder.mutation({
      query: ({ roomId, value, orgId }) => ({
        serviceName: 'toggleFavorite',
        args: { roomId, value }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Dispatch an action to fetch the updated room list by organization ID.
        dispatch(
          orgApi.endpoints.getRoomListByOrgId.initiate(patch.orgId, {
            subscribe: false,
            forceRefetch: false
          })
        );
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['roomList']
    }),

    /**
     * Define a query to load information about a room by its unique identifier.
     * @param {string} roomId - The unique identifier of the room to retrieve information for.
     */
    loadRoomInfo: builder.query({
      query: (data) => {
        return {
          serviceName: 'rooms.info',
          args: { data },
          skip: !data
        };
      },
      transformResponse: (response:any, error) => {
        // Check if the response is empty or has no keys, and return an empty object if so.
        if (!response || _.keys(response).length == 0) return {};

        // Process and transform the response data.
        const result:any = response;
        const room = { ...result, roomId: result._id };
        let memberList = [];

        // Determine if the room is private based on its type ('p' for private).
        room.private = result.t === 'p';

        // Map room members to include their roles.
        memberList = room.members.map(member => ({
          ...member,
          role:
            member.username === room.u.username
              ? 'owner'
              : room.moderators.some(a => a.username === member.username)
              ? 'administrator'
              : 'member'
        }));

        // Map user IDs to 'id' for consistency.
        memberList = memberList.map(user => ({ ...user, id: user.username }));

        // Find the current user's role in the room.
        const member = memberList.find(
          member => member._id === store.getState().user.userInfo.userId
        );
        const role = member ? member.role : 'member';

        // Update room properties and dispatch an action to set room info.
        room.name = room.fname;
        room.role = role;
        store.dispatch(handleSetRoomInfo(room));

        // Return transformed data.
        return { memberList, roomInfo: room };
      },
      providesTags: ['roomInfo', 'roomList', 'roomMemberList']
    }),

    /**
     * Define a query to load recent board lists based on organization, keywords, startIndex, and limit.
     * @param {string} orgId - The organization ID.
     * @param {string} keywords - Keywords for searching boards.
     * @param {number} startIndex - The start index for pagination.
     * @param {number} limit - The maximum number of boards to retrieve.
     */
    getLoadRecentBoardList: builder.query({
      query: ({ orgId, keywords, startIndex, limit,user }) => {
        return {
          serviceName: 'getRecentBoardsByUserId',
          args: { orgId, keywords, startIndex, limit,user },
          skip: !orgId
        };
      },
      transformResponse: (response, error) => {
        // if (!response || _.keys(response).length==0) return [];
        console.log('response-----------------------------', response);
        if (response.action === 'firstLoad') {
          let arr = [];
          if (response.data && response.data.length > 0) {
            response.data.map(t => {
              if (t.boardId) {
                const item = { ...t, _id: t.boardId };
                arr.push(item);
              } else {
                arr.push(t);
              }
            });
          }
          const uniqueList = _.uniqBy(arr, '_id');
          let newCurrentBoardList = [];
          let NoFavoriteBoardList = [];
          uniqueList?.map(board => {
            if (
              !board.deletedInfo &&
              board.favoriteBoard &&
              board.favoriteBoard.favorite
            ) {
              newCurrentBoardList.push(board);
            }
            if (
              (!board.deletedInfo &&
                board.favoriteBoard &&
                !board.favoriteBoard.favorite) ||
              !board.favoriteBoard
            ) {
              NoFavoriteBoardList.push(board);
            }
          });

          newCurrentBoardList.sort((a, b) => {
            if (a.favoriteBoard.favorite > b.favoriteBoard.favorite) return -1;
            if (a.favoriteBoard.favorite < b.favoriteBoard.favorite) return 1;
            return 0;
          });
          NoFavoriteBoardList.sort((a, b) =>
            a.lastUpdateTime > b.lastUpdateTime ? -1 : 1
          );

          const newBoardList = [...newCurrentBoardList, ...NoFavoriteBoardList];
          console.log(
            'newBoardList-----------------------------',
            newBoardList
          );
          return newBoardList;
        }
        if (response.action === 'fetch') {
          const currentList = _.keys(store.getState().splitApi.queries);

          const currentBoardList = currentList.filter(
            item =>
              item.includes('getLoadRecentBoardList') &&
              item.includes(store.getState().org.orgInfo.orgId)
          );
          let combinedList = [];
          currentBoardList.forEach(item => {
            const boardList:any = store.getState().splitApi.queries[item].data;
            if (boardList && boardList.length > 0) {
              combinedList = combinedList.concat(boardList);
            }
          });
          combinedList = combinedList.concat(response.data).map(item => {
            return { ...item, _id: item.boardId };
          });
          let filterCombinedList = combinedList.filter(
            m => m._id !== undefined
          );
          const uniqueList = _.uniqBy(filterCombinedList, 'boardId');
          const sortedList = _.sortBy(uniqueList, 'lastVisitedAt');
          // const boardList = store.getState().boardList.boardList;
          // store.dispatch(handleSetCurrentBoardList([...boardList, ...response]));
          // store.dispatch(handleSetBoardList([...boardList, ...response]));
          return sortedList;
        }
        if (response.action === 'search') {
          const currentList = _.keys(store.getState().splitApi.queries);
          const currentBoardList = currentList.filter(
            item =>
              item.includes('getLoadRecentBoardList') &&
              item.includes(store.getState().org.orgInfo.orgId)
          );
          let combinedList = [];
          currentBoardList.forEach(item => {
            const boardList:any = store.getState().splitApi.queries[item].data;
            if (boardList && boardList.length > 0) {
              if (!boardList[0].boardId) {
                combinedList = combinedList.concat(boardList);
              }
            }
          });
          combinedList = combinedList.concat(response.data).map(item => {
            return { ...item, _id: item._id };
          });
          let filterCombinedList = combinedList.filter(
            m => m._id !== undefined
          );
          const uniqueList = _.uniqBy(filterCombinedList, '_id');
          return uniqueList;
        }
      },
      providesTags: ['recentBoardList']
    }),

    /**
     * Define a mutation to send an invitation notification to a user for a room.
     * @param {string} roomName - The name of the room.
     * @param {string} fromUserName - The username of the sender.
     * @param {string} toUserName - The username of the recipient.
     * @param {string} locationHref - The location href.
     * @param {string} language - The language of the notification.
     */
    InviteUserToRoomNotification: builder.mutation({
      query: ({
        roomName,
        fromUserName,
        toUserName,
        locationHref,
        language
      }) => ({
        serviceName: 'InviteUserToRoomNotification',
        args: { roomName, fromUserName, toUserName, locationHref, language }
      }),
      transformResponse: (response:any, error) => {
        // Return the original response.
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
     * Define a mutation to add users to a room.
     * @param {object} data - The data for adding users to the room.
     * @param {object} inviteData - The data for inviting users to the room.
     * @param {object} invitedUsers - Information about the invited users.
     * @param {object} registeredUsersInfo - Information about registered users.
     */
    addUsersToRoom: builder.mutation({
      query: ({ data, inviteData, invitedUsers, registeredUsersInfo }) => ({
        serviceName: 'addUsersToRoom',
        args: { data, inviteData }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Access the current member list from the store.
        const memberList = store.getState().room.roomMemberList;

        // Set properties for the invited user based on registered user info.
        patch.invitedUsers.name = patch.registeredUsersInfo.name;

        patch.invitedUsers.id = patch.registeredUsersInfo.username;

        patch.invitedUsers._id = patch.registeredUsersInfo._id;

        patch.invitedUsers.role = 'member';
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['roomMemberList', 'roomInfo']
    }),

    /**
     * Define a mutation to retrieve information about a room member.
     * @param {string} roomId - The unique identifier of the room.
     * @param {string} userId - The unique identifier of the user.
     */
    getRoomMember: builder.mutation({
      query: ({ roomId, userId }) => ({
        serviceName: 'getRoomMember',
        args: { roomId, userId }
      }),
      transformResponse: (response:any, error) => {
        // Dispatch an action to handle and set the current room name in the store.
        store.dispatch(handleSetCurrentRoomName(response.fname));

        // Return the original response.
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {},
      invalidatesTags: ['roomMemberList', 'roomInfo']
    }),

    /**
     * Define a query to retrieve a list of boards in a room based on search criteria.
     * @param {number} startIndex - The index from which to start fetching boards.
     * @param {number} limit - The maximum number of boards to retrieve.
     * @param {string} searchKey - The search keyword to filter boards.
     * @param {string} roomId - The unique identifier of the room containing the boards.
     */
    getBoardListInRoomByKey: builder.query({
      query: ({ startIndex, limit, searchKey, roomId }) => ({
        serviceName: 'getBoardListInRoomByKey',
        args: { startIndex, limit, searchKey, roomId },
        skip: !roomId
      }),
      transformResponse: (response:any, error) => {
        // Dispatch an action to handle and set the board list in the store.
        store.dispatch(handleSetTemplateList(response.data));

        // Return the original response.
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      providesTags: ['boardList']
    }),

    /**
     * Define a query to retrieve a list of search templates.
     * @param {number} startIndex - The index from which to start fetching search templates.
     * @param {number} limit - The maximum number of search templates to retrieve.
     * @param {string} searchKey - The search keyword to filter search templates.
     * @param {string} roomId - The unique identifier of the room containing the search templates.
     */
    getSearchTemplateList: builder.query({
      query: ({ startIndex, limit, searchKey, roomId }) => ({
        serviceName: 'getBoardListInRoomByKey',
        args: { startIndex, limit, searchKey, roomId },
        skip: !roomId
      }),
      transformResponse: (response:any, error) => {
        // Dispatch an action to handle and set the search template list in the store.
        store.dispatch(handleSetSearchTemplateList(response.data));

        // Return the original response.
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      providesTags: ['templateList']
    }),

    /**
     * Define a query to retrieve a list of boards in a specific room.
     * @param {number} startIndex - The index from which to start fetching boards.
     * @param {number} limit - The maximum number of boards to retrieve.
     * @param {string} searchKey - The search keyword to filter boards.
     * @param {string} roomId - The unique identifier of the room containing the boards.
     */
    getBoardListInTheRoom: builder.query({
      query: ({ startIndex, limit, searchKey, roomId }) => ({
        serviceName: 'getBoardListInRoomByKey',
        args: { startIndex, limit, searchKey, roomId },
        skip: !roomId
      }),
      transformResponse: (response:any, error) => {
        // Check if the response action is 'fetch'.
        if (response.action === 'fetch') {
          // Get the current room's ID from the store.
          const roomId = store.getState().room.roomId;

          // Filter the response data to only include boards belonging to the current room.
          const boardList = response?.data?.filter(t => t.roomId === roomId);
          let newCurrentBoardList = [];
          let NoFavoriteBoardList = [];

          // Iterate through the filtered board list and categorize them as favorite or not.
          boardList?.map(board => {
            if (
              !board.deletedInfo &&
              board.favoriteBoard &&
              board.favoriteBoard.favorite
            ) {
              newCurrentBoardList.push(board);
            }
            if (
              (!board.deletedInfo &&
                board.favoriteBoard &&
                !board.favoriteBoard.favorite) ||
              !board.favoriteBoard
            ) {
              NoFavoriteBoardList.push(board);
            }
          });

          // Sort the favorite boards by their 'favorite' status and the rest by 'lastUpdateTime'.
          newCurrentBoardList.sort((a, b) => {
            if (a.favoriteBoard.favorite > b.favoriteBoard.favorite) return -1;
            if (a.favoriteBoard.favorite < b.favoriteBoard.favorite) return 1;
            return 0;
          });

          NoFavoriteBoardList = _.sortBy(
            NoFavoriteBoardList,
            'lastUpdateTime'
          ).reverse();

          // Combine the categorized boards into a new board list.
          const newBoardList = [...newCurrentBoardList, ...NoFavoriteBoardList];
          return newBoardList;
        }
        // Check if the response action is 'search' and return the search results.
        if (response.action === 'search') {
          return response.data;
        }
      },
      providesTags: ['boardList']
    })
  })
});

export const {
  useRetagBoardByIdMutation,
  useAddRoomModeratorMutation,
  useRemoveRoomModeratorMutation,
  useRemoveUserFromRoomMutation,
  useUploadThumbnail2toBoardByIdMutation,
  useMoveBoardByIdMutation,
  useSendInvitationEmailToRoomMutation,
  useRenameRoomMutation,
  useDeleteRoomMutation,
  useToggleRoomFavoriteMutation,
  useLoadRoomInfoQuery,
  useGetLoadRecentBoardListQuery,
  useInviteUserToRoomNotificationMutation,
  useAddUsersToRoomMutation,
  useGetRoomMemberMutation,
  useGetBoardListInRoomByKeyQuery,
  useGetSearchTemplateListQuery,
  useGetBoardListInTheRoomQuery,
  useCreatePrivateGroupMutation
} = roomApi;
