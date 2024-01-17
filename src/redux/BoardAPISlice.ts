//** Redux Store */
import { api } from './api';
import store from '../store';
import RemoteProcedureNames from '../util/RemoteProcedureNames';
import {
  handleSetCurrentBoardList,
  handleSetBoardList,
  handleSetPendingDeleteBoardList,
  handleSetFavoriteBoardList
} from '../store/boardList';
import {
  handleSetRescourePageImageList,
  handleSetRescourePageIconList,
  handleSetOrgTemplateList,
  handleSetOffcialTemplateList
} from '../store/resource';

export const BoardApi = api.injectEndpoints({
  endpoints: builder => ({
    /**
     * Query for retrieving organization administrators based on the organization ID.
     *
     * @param {object} query - The GraphQL query object with the 'orgId' argument.
     * @param {object} transformResponse - A function for transforming the response.
     */
    getOrgAdmin: builder.query({
      query: orgId => ({ serviceName: 'getOrgAdminUser', args: { orgId } }),
      transformResponse: response => {
        return response;
      }
    }),

    /**
     * Mutation for sending feedback messages to GitHub.
     *
     * @param {object} query - The GraphQL query object with the 'msg' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     */
    handleSendFeedbackMsgToGitHub: builder.mutation({
      query: msg => ({
        serviceName: 'handleSendFeedbackMsgToGitHub',
        args: { msg }
      }),
      transformResponse: (response: any, error) => {
        return response;
      }
    }),

    /**
     * Mutation for closing a board.
     *
     * @param {object} query - The GraphQL query object with the 'boardId' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     */
    closeBoard: builder.mutation({
      query: ({ boardId }) => ({
        serviceName: 'exitBoard',
        args: { boardId }
      }),
      transformResponse: (response: any, error) => {
        return [];
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Mutation for uploading a description to a board by its ID.
     *
     * @param {object} query - The GraphQL query object with the 'boardId' and 'updatedDescription' arguments.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     */
    uploadDescriptiontoBoardById: builder.mutation({
      query: ({ boardId, updatedDescription }) => ({
        serviceName: RemoteProcedureNames.UPLOAD_DESCRIPTION_TO_BOARD_BY_ID,
        args: { boardId, updatedDescription }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Mutation for renaming a board by its ID.
     *
     * @param {object} query - The GraphQL query object with the 'boardId' and 'newName' arguments.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    renameBoardById: builder.mutation({
      query: ({ boardId, newName }) => ({
        serviceName: RemoteProcedureNames.RENAME_BOARD_BY_ID,
        args: { boardId, newName }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['boardList', 'teamsTemplateList']
    }),

    /**
     * Mutation for uploading an image by its URL.
     *
     * @param {object} query - The GraphQL query object with the 'options' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     */
    uploadImageByUrl: builder.mutation({
      query: ({ options }) => ({
        serviceName: RemoteProcedureNames.UPLOAD_IMAGE_BY_URL,
        args: {
          options
        }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['board']
    }),

    /**
     * Mutation for inserting a board backup.
     *
     * @param {object} query - The GraphQL query object with the 'data' argument.
     * @param {array} invalidatesTags - An array of tags to invalidate when the mutation is executed.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     */
    insertBoardBackup: builder.mutation({
      query: data => ({
        serviceName: 'insertBackupBoard',
        args: { data }
      }),
      invalidatesTags: ['BoardBackupList'],
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Query for retrieving board backups by board ID.
     *
     * @param {object} query - The GraphQL query object with the 'boardId' argument.
     * @param {array} providesTags - An array of tags to provide when the query is executed.
     * @param {object} transformResponse - A function for transforming the response or error.
     */
    getBoardBackup: builder.query({
      query: boardId => ({
        serviceName: RemoteProcedureNames.GET_BOARD_BACK_UP,
        args: { boardId },
        skip: !boardId
      }),
      providesTags: ['BoardBackupList'],
      transformResponse: response => {
        return response;
      }
    }),

    /**
     * Mutation for restoring a board from a backup.
     *
     * @param {object} query - The GraphQL query object with the 'whiteboardId' and 'backupData' arguments.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     */
    restoreBackup: builder.mutation({
      query: ({ whiteboardId, backupData }) => ({
        serviceName: RemoteProcedureNames.RESTORE_BACK_UP,
        args: { whiteboardId, backupData }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Query for retrieving a whiteboard by its ID.
     *
     * @param {object} query - The GraphQL query object with the 'boardId' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     */
    getWhiteboardById: builder.query({
      query: boardId => ({
        serviceName: RemoteProcedureNames.GET_WHITEBOARD_BY_ID,
        args: { boardId }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Query for retrieving a whiteboard by its room ID.
     *
     * @param {object} query - The GraphQL query object with the 'roomId' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     */
    getWhiteboardByRoomId: builder.query({
      query: roomId => ({
        serviceName: RemoteProcedureNames.GET_WHITEBOARD_BY_ROOM_ID,
        args: { roomId }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Query for retrieving the timer information for a whiteboard by its board ID.
     *
     * @param {object} query - The GraphQL query object with the 'boardId' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the query is started.
     */
    getWhiteboardTimer: builder.query({
      query: boardId => ({
        serviceName: 'getWhiteboardTimer',
        args: { boardId }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Mutation for updating a board by its ID.
     *
     * @param {object} query - The GraphQL query object with the 'id' and 'data' arguments.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {object} invalidatesTags - An array of tags that should be invalidated after the mutation.
     * @param {function} onQueryStarted - An asynchronous function executed when the mutation is started.
     */
    updateBoardById: builder.mutation({
      query: ({ id, data }) => ({
        serviceName: RemoteProcedureNames.UPDATE_BOARD_BY_ID,
        args: { id, data }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      invalidatesTags: ['boardList'],
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Mutation for updating the timer information for a board.
     *
     * @param {object} query - The GraphQL query object with the 'data' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {function} onQueryStarted - An asynchronous function executed when the mutation is started.
     */
    updateBoardTimer: builder.mutation({
      query: data => ({
        serviceName: 'updateBoardTimer',
        args: { data }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Query for retrieving a list of images by a search key and current page.
     *
     * @param {object} query - The GraphQL query object with the 'search' and 'currentPage' arguments.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {object} providesTags - An array of tags that provide caching information.
     */
    getImageListByKey: builder.query({
      query: ({ search, currentPage }) => ({
        serviceName: RemoteProcedureNames.GET_IMAGE_LIST_BY_KEY,
        args: { search, currentPage },
        skip: !search
      }),
      transformResponse: (response: any, error) => {
        // Get the current list of images from the store.
        const imagesList = store.getState().resource.rescourePageImageList;

        // Combine the current list with the newly retrieved images.
        const result = imagesList.concat(JSON.parse(response).hits);

        // Dispatch an action to update the resource page image list in the store.
        store.dispatch(handleSetRescourePageImageList(result));

        // Return the combined result.
        return result;
      },
      providesTags: ['ImageList']
    }),

    /**
     * Query for retrieving a list of icons by a search key and offset.
     *
     * @param {object} query - The GraphQL query object with the 'search' and 'offset' arguments.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {object} providesTags - An array of tags that provide caching information.
     */
    getIconListByKey: builder.query({
      query: ({ search, offset }) => ({
        serviceName: RemoteProcedureNames.GET_ICON_LIST_BY_KEY,
        args: { search, offset },
        skip: !search
      }),
      transformResponse: (response: any, error) => {
        // Get the current list of icons from the store.
        const IconsList = store.getState().resource.rescourePageIconList;

        // Dispatch an action to update the resource page icon list in the store.
        store.dispatch(
          handleSetRescourePageIconList(IconsList.concat(response))
        );

        // Return the combined result of the current list and the retrieved icons.
        return IconsList.concat(response);
      },
      providesTags: ['IconList']
    }),

    /**
     * Query for retrieving user's own templates by organization ID.
     *
     * @param {object} query - The GraphQL query object with the 'orgId' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {object} providesTags - An array of tags that provide caching information.
     */
    getOwnTemplatesByType: builder.query({
      query: ({ orgId }) => ({
        serviceName: 'getMyTemplates',
        args: { orgId },
        skip: !orgId
      }),
      providesTags: ['templateList'],
      transformResponse: (response: any, error) => {
        return response;
      }
    }),

    /**
     * Query for retrieving organization's templates by organization ID.
     *
     * @param {object} query - The GraphQL query object with the 'orgId' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {object} providesTags - An array of tags that provide caching information.
     */
    getOrgTemplatesByType: builder.query({
      query: ({ orgId }) => ({
        serviceName: 'getMyTemplates',
        args: { orgId }
      }),
      providesTags: ['templateList'],
      transformResponse: (response: any, error) => {
        store.dispatch(handleSetOrgTemplateList(response));
        return response;
      }
    }),

    /**
     * Query for retrieving official templates by organization ID.
     *
     * @param {object} query - The GraphQL query object with the 'orgId' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {object} providesTags - An array of tags that provide caching information.
     */
    getOfficialTemplatesByType: builder.query({
      query: ({ orgId }) => ({
        serviceName: 'getOfficialTemplates',
        args: { orgId }
      }),
      transformResponse: (response: any, error) => {
        // Initialize arrays to separate favorite and non-favorite templates.
        let favoriteTemplates = [];
        let NoFavoriteTemplates = [];

        // Iterate through the response to categorize templates.
        response.map(board => {
          if (board.favoriteBoard && board.favoriteBoard.favorite) {
            favoriteTemplates.push(board);
          }
          if (!board.favoriteBoard || !board.favoriteBoard.favorite) {
            NoFavoriteTemplates.push(board);
          }
        });

        // Sort favorite templates by addTime in descending order.
        favoriteTemplates.sort((a, b) => {
          if (
            a.favoriteBoard.addTime.getTime() >
            b.favoriteBoard.addTime.getTime()
          )
            return -1;
          if (
            a.favoriteBoard.addTime.getTime() <
            b.favoriteBoard.addTime.getTime()
          )
            return 1;
          return 0;
        });

        // Dispatch an action to update the official template list in the store.
        store.dispatch(
          handleSetOffcialTemplateList(
            [...favoriteTemplates, ...NoFavoriteTemplates].slice(0, 10)
          )
        );
        return response;
      },
      providesTags: ['templateList']
    }),

    /**
     * Query for retrieving team management templates by organization ID.
     *
     * @param {object} query - The GraphQL query object with the 'orgId' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {object} providesTags - An array of tags that provide caching information.
     */
    getTeamsManagementTemplates: builder.query({
      query: ({ orgId }) => ({
        serviceName: 'getTeamsManagementTemplates',
        args: { orgId }
      }),
      transformResponse: (response: any, error) => {
        // Initialize arrays to separate templates into favorite and non-favorite categories.
        let newCurrentBoardList = [];
        let NoFavoriteBoardList = [];

        // Iterate through the response to categorize templates.
        response?.map(board => {
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

        // Sort the 'newCurrentBoardList' by favorite status in descending order.
        newCurrentBoardList.sort((a, b) => {
          if (a.favoriteBoard.favorite > b.favoriteBoard.favorite) return -1;
          if (a.favoriteBoard.favorite < b.favoriteBoard.favorite) return 1;
          return 0;
        });

        // Sort the 'NoFavoriteBoardList' by 'lastUpdateTime' in descending order.
        NoFavoriteBoardList.sort((a, b) =>
          a.lastUpdateTime > b.lastUpdateTime ? -1 : 1
        );

        // Combine the sorted lists to create a new board list.
        const newBoardList = [...newCurrentBoardList, ...NoFavoriteBoardList];

        // Return the transformed board list as the response.
        return newBoardList;
      },
      providesTags: ['templateList', 'teamsTemplateList']
    }),

    /**
     * Mutation for batch importing official templates.
     *
     * @param {object} mutation - The GraphQL mutation object with the 'templatesData' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {object} onQueryStarted - Callback function triggered when the query starts.
     * @param {object} invalidatesTags - An array of tags that should be invalidated in the cache.
     */
    batchImportOfficialTemplates: builder.mutation({
      query: ({ templatesData }) => ({
        serviceName: 'batchImportOfficialTemplates',
        args: { templatesData }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['templateList', 'teamsTemplateList']
    }),

    /**
     * Mutation for deleting a board by its ID.
     *
     * @param {object} mutation - The GraphQL mutation object with the 'boardId' and 'deletedInfo' arguments.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {object} onQueryStarted - Callback function triggered when the query starts.
     * @param {object} invalidatesTags - An array of tags that should be invalidated in the cache.
     */
    deleteBoardById: builder.mutation({
      query: ({ boardId, deletedInfo }) => ({
        serviceName: RemoteProcedureNames.DELETE_BOARD_BY_ID,
        args: { boardId, deletedInfo }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const boardList = store.getState().boardList.boardList;

        const deletedBoardList =
          store.getState().boardList.pendingDeleteBoardList;

        const favoriteBoardList = store.getState().boardList.favoriteBoardList;

        let newBoardList = [];

        // Remove the deleted board from the current board list.
        boardList.forEach(obj => {
          if (obj._id !== patch.boardId) {
            newBoardList.push(obj);
          }
        });

        // Update the current board list in the store.
        dispatch(handleSetCurrentBoardList(newBoardList));

        dispatch(handleSetBoardList(newBoardList));

        let newDeletedBoardList = [];
        boardList.map(b => {
          if (patch.boardId === b._id) {
            newDeletedBoardList.push(b);
          }
        });

        // Add the deleted board to the pending delete board list.
        dispatch(
          handleSetPendingDeleteBoardList([
            ...deletedBoardList,
            ...newDeletedBoardList
          ])
        );

        // Remove the deleted board from the favorite board list.
        let newFavoriteBoardList = favoriteBoardList.filter(
          item => item._id !== patch.boardId
        );

        // Update the favorite board list in the store.
        dispatch(handleSetFavoriteBoardList(newFavoriteBoardList));

        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['boardList', 'teamsTemplateList', 'deletedBoardList']
    }),

    /**
     * Mutation for restoring a deleted board by its ID.
     *
     * @param {object} mutation - The GraphQL mutation object with the 'boardId' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {object} invalidatesTags - An array of tags that should be invalidated in the cache.
     * @param {object} onQueryStarted - Callback function triggered when the query starts.
     */
    restoreDeletedBoard: builder.mutation({
      query: ({ boardId }) => ({
        serviceName: 'restoreDeletedBoard',
        args: { boardId }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const deletedBoardList =
          store.getState().boardList.pendingDeleteBoardList;

        let newDeletedBoardList = [];

        // Remove the restored board from the pending delete board list.
        deletedBoardList.forEach(board => {
          if (board._id !== patch.boardId) {
            newDeletedBoardList.push(board);
          }
        });

        // Update the pending delete board list in the store.
        dispatch(handleSetPendingDeleteBoardList(newDeletedBoardList));

        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['boardList', 'teamsTemplateList']
    }),

    /**
     * Mutation for duplicating a board by its ID.
     *
     * @param {object} mutation - The GraphQL mutation object with the 'boardId' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {object} invalidatesTags - An array of tags that should be invalidated in the cache.
     * @param {object} onQueryStarted - Callback function triggered when the query starts.
     */
    duplicateBoard: builder.mutation({
      query: ({ boardId }) => ({
        serviceName: RemoteProcedureNames.DUPLICATE_BOARD,
        args: { boardId }
      }),
      transformResponse: (response: any, error) => {
        const boardList = store.getState().boardList.currentBoardList;

        // Update the current board list and board list in the store.
        store.dispatch(handleSetCurrentBoardList([response, ...boardList]));
        store.dispatch(handleSetBoardList([response, ...boardList]));

        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['boardList', 'teamsTemplateList']
    }),

    /**
     * Mutation for adding a new whiteboard with the provided board data.
     *
     * @param {object} mutation - The GraphQL mutation object with the 'boardData' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {object} invalidatesTags - An array of tags that should be invalidated in the cache.
     * @param {object} onQueryStarted - Callback function triggered when the query starts.
     */
    addWhiteboard: builder.mutation({
      query: ({ boardData }) => ({
        serviceName: RemoteProcedureNames.ADD_WHITE_BOARD,
        args: { boardData }
      }),
      invalidatesTags: ['boardList', 'teamsTemplateList'],
      transformResponse: (response: any, error) => {
        const boardList = store.getState().boardList.boardList;
        let list = [...boardList, response];

        // Sort the board list by lastUpdateTime in descending order.
        list.sort((a, b) => b.lastUpdateTime - a.lastUpdateTime);

        // Update the board list and current board list in the store.
        store.dispatch(handleSetBoardList(list));
        store.dispatch(handleSetCurrentBoardList(list));

        // Return the response as is.
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Mutation for saving a board article with the provided data.
     *
     * @param {object} mutation - The GraphQL mutation object with the 'data' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {object} invalidatesTags - An array of tags that should be invalidated in the cache.
     * @param {object} onQueryStarted - Callback function triggered when the query starts.
     */
    saveBoardArticle: builder.mutation({
      query: data => ({
        serviceName: 'saveArticle',
        args: { data }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['boardArticle']
    }),

    /**
     * Query for retrieving a board article with the provided data.
     *
     * @param {object} query - The GraphQL query object with the 'data' argument.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {object} providesTags - An array of tags that provides data for caching.
     */
    getBoardArticle: builder.query({
      query: data => ({
        serviceName: 'getArticle',
        args: { data }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      providesTags: ['boardArticle']
    }),

    /**
     * Mutation for marking a board as a favorite or unfavorite.
     *
     * @param {object} query - The GraphQL query object with 'boardId', 'favorite', and 'boardList' arguments.
     * @param {object} transformResponse - A function for transforming the response or error.
     * @param {object} onQueryStarted - An async function executed when the query is started.
     * @param {object} invalidatesTags - An array of tags that get invalidated after the mutation.
     */
    favoriteBoard: builder.mutation({
      query: ({ boardId, favorite, boardList }) => ({
        serviceName: RemoteProcedureNames.FAVORITE_BOARD,
        args: { boardId }
      }),
      transformResponse: (response: any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Initialize a new board list and favorite board.
        let newBoardList = [];
        let favoriteBoard = null;

        // Get the current favorite board list from the store.
        const favoriteBoardList = store.getState().boardList.favoriteBoardList;

        // Loop through the provided board list.
        patch.boardList.map(board => {
          // Check if the board ID matches the one being favorited/unfavorited.
          if (board._id === patch.boardId) {
            // Update the favorite status of the board.
            favoriteBoard = board.favoriteBoard;
            board = {
              ...board,
              favoriteBoard: { ...favoriteBoard, favorite: patch.favorite }
            };
          }

          // Add the board to the new board list.
          newBoardList.push(board);
        });

        // Sort the board list based on lastUpdateTime if unfavoriting.
        if (!patch.favorite) {
          newBoardList.sort((a, b) => b.lastUpdateTime - a.lastUpdateTime);
        }

        // Update the current board list in the store.
        dispatch(handleSetCurrentBoardList(newBoardList));
        dispatch(handleSetBoardList(newBoardList));

        // Remove the board from the favorite board list if unfavorited.
        if (!patch.favorite) {
          let newFavoriteBoardList = favoriteBoardList.filter(
            item => item._id !== patch.boardId
          );
          dispatch(handleSetFavoriteBoardList(newFavoriteBoardList));
        }

        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['favoriteBoardList', 'boardList', 'teamsTemplateList', 'recentBoardList']
    })
  })
});

export const {
  useGetOrgAdminQuery,
  useHandleSendFeedbackMsgToGitHubMutation,
  useCloseBoardMutation,
  useUploadDescriptiontoBoardByIdMutation,
  useInsertBoardBackupMutation,
  useRenameBoardByIdMutation,
  useUploadImageByUrlMutation,
  useGetBoardBackupQuery,
  useRestoreBackupMutation,
  useGetWhiteboardByIdQuery,
  useGetWhiteboardByRoomIdQuery,
  useUpdateBoardByIdMutation,
  useGetImageListByKeyQuery,
  useGetIconListByKeyQuery,
  useGetOwnTemplatesByTypeQuery,
  useGetOrgTemplatesByTypeQuery,
  useGetOfficialTemplatesByTypeQuery,
  useDeleteBoardByIdMutation,
  useRestoreDeletedBoardMutation,
  useDuplicateBoardMutation,
  useAddWhiteboardMutation,
  useFavoriteBoardMutation,
  useSaveBoardArticleMutation,
  useGetBoardArticleQuery,
  useGetTeamsManagementTemplatesQuery,
  useBatchImportOfficialTemplatesMutation,
  useUpdateBoardTimerMutation,
  useGetWhiteboardTimerQuery
} = BoardApi;
