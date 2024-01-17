//** Redux Store */
import store from '../store';
import { api } from './api';
import BoardService from '../services/BoardService';

export const WidgetAPI = api.injectEndpoints({
  endpoints: builder => ({
    /**
     * Define a query to get widgets by board ID.
     * @param {string} boardId - The unique identifier of the board.
     */
    getWidgetsByBoardId: builder.query({
      query: boardId => ({
        serviceName: 'getWidgetsByBoardId',
        args: { boardId },
        skip: !boardId || boardId !== store.getState().board.boardId
      }),
      transformResponse: (response:any, error) => {
        if (
          response &&
          response.length > 0 &&
          response[0].whiteboardId === store.getState().board.boardId
        ) {
          BoardService.getInstance().loadWidgetByBoardId(response);
        }

        return response;
      },
      providesTags: ['widgets']
    }),

    /**
     * Define a query to get widgets by template ID.
     * @param {string} boardId - The unique identifier of the board.
     */
    getWidgetsByTemplateId: builder.query({
      query: boardId => ({
        serviceName: 'getWidgetsByBoardId',
        args: { boardId },
        skip: !boardId
      }),
      transformResponse: (response:any, error) => {
        if (
          response &&
          response.length > 0 &&
          response[0].whiteboardId === store.getState().board.boardId
        ) {
          // Load widgets by board ID using a service instance.
          BoardService.getInstance().loadWidgetByBoardId(response);
        }

        return response;
      },
      // Define tags for caching and invalidation.
      providesTags: (result, error, arg) =>
        result // successful query
          ? [
              ...result.map(
                ({ whiteboardId }) =>
                  ({ type: 'widgets', whiteboardId } as const)
              ),
              { type: 'widgets', id: 'LIST' }
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: 'widgets', id: 'LIST' }]
    }),

    /**
     * Define a mutation to remove a widget by its ID.
     * @param {string} id - The unique identifier of the widget to be removed.
     */
    removeWidget: builder.mutation({
      query: ({ id }) => ({
        serviceName: 'removeWidget',
        args: { id }
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
     * Define a mutation to remove an array of widgets.
     * @param {array} widgetArr - An array of widget identifiers to be removed.
     */
    removeWidgetArr: builder.mutation({
      query: ({ widgetArr }) => ({
        serviceName: 'removeWidgetArr',
        args: { widgetArr }
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
     * Define a mutation to update a widget by its ID with new data.
     * @param {string} id - The unique identifier of the widget to be updated.
     * @param {object} data - The new data to update the widget with.
     */
    updateWidget: builder.mutation({
      query: ({ id, data }) => ({
        serviceName: 'updateWidget',
        args: { id, data }
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
     * Define a mutation to update an array of widgets with new data.
     * @param {array} dataArr - An array of objects containing updated data for widgets.
     */
    updateWidgetArr: builder.mutation({
      query: ({ dataArr }) => ({
        serviceName: 'updateWidgetArr',
        args: { dataArr }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      invalidatesTags: []
    }),

    /**
     * Define a mutation to insert a new widget with provided data.
     * @param {object} data - The data for the new widget to be inserted.
     */
    insertWidget: builder.mutation({
      query: ({ data }) => ({
        serviceName: 'insertWidget',
        args: { data }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      invalidatesTags: []
    }),

    /**
     * Define a mutation to insert an array of new widgets with provided data.
     * @param {array} data - An array of objects containing data for the new widgets to be inserted.
     */
    insertWidgetArr: builder.mutation({
      query: ({ data }) => ({
        serviceName: 'insertWidgetArr',
        args: { data }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      invalidatesTags: []
    })
  })
});

export const {
  useRemoveWidgetMutation,
  useRemoveWidgetArrMutation,
  useUpdateWidgetMutation,
  useUpdateWidgetArrMutation,
  useInsertWidgetMutation,
  useInsertWidgetArrMutation,
  useGetWidgetsByBoardIdQuery
} = WidgetAPI;
