//**Redux Store */
import { api } from './api';
import store from '../store';
import { handleSetCurrentBoardFilesContent } from '../store/AIAssist';

export const LangchainLLMApiSlice = api.injectEndpoints({
  endpoints: builder => ({
    /**
     * A GraphQL query to fetch the current board's file content.
     * @param {string} boardId - The ID of the current board.
     */
    getCurrentBoardFileContent: builder.query({
      query: boardId => ({
        serviceName: 'getBoardFileManagement',
        args: { boardId }
      }),
      transformResponse: (response:any, error) => {
        // Check if there was an error in the response.
        if (error) {
          console.log(error);
          return;
        }

        // Dispatch an action to set the current board's file content in the store.
        store.dispatch(handleSetCurrentBoardFilesContent(response));

        // Return the response.
        return response;
      }
    })
  })
});

export const { useGetCurrentBoardFileContentQuery } = LangchainLLMApiSlice;
