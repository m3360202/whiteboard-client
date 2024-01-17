//* Store  */
import { api } from './api';
import store from '../store';
import {
  handleSetFavoriteBoardList,
  handleSetPendingDeleteBoardList
} from '../store/boardList';

export const BoardListApi = api.injectEndpoints({
  endpoints: builder => ({
    /**
     * Query for retrieving the list of favorite boards for a team or organization.
     *
     * @param {string} orgId - The organization or team ID for which to fetch favorite boards.
     * @param {object} transformResponse - A function for transforming the response.
     */
    getTeamFavoriteBoard: builder.query({
      query: orgId => ({
        serviceName: 'getTeamFavoriteBoard',
        args: { orgId }
      }),
      transformResponse: response => {
        // Store the response in the state and return it.
        const result = response;
        store.dispatch(handleSetFavoriteBoardList(result));
        return result;
      },
      providesTags: ['favoriteBoardList']
    }),

    /**
     * Query for retrieving the list of pending deleted boards for an organization or team.
     *
     * @param {string} orgId - The organization or team ID for which to fetch pending deleted boards.
     * @param {object} transformResponse - A function for transforming the response.
     */
    getPendingDeletedBoard: builder.query({
      query: ({ orgId }) => ({
        serviceName: 'getPendingDeletedBoard',
        args: { orgId }
      }),
      transformResponse: (response:any) => {
        // Create a new list of pending deleted boards filtered by the current user.
        let newDeleteBoardList = [];
        response.map(board => {
          if (board.deletedInfo.deletedByUserId === store.getState().user.userInfo.userId) {
            newDeleteBoardList.push(board);
          }
        });

        // Store the filtered list in the state and return it.
        store.dispatch(handleSetPendingDeleteBoardList(newDeleteBoardList));
        return newDeleteBoardList;
      },
      providesTags: ['deletedBoardList']
    })
  })
});

export const { useGetTeamFavoriteBoardQuery, useGetPendingDeletedBoardQuery } = BoardListApi;
