import { api } from './api';

export const UtilityAPI = api.injectEndpoints({
  endpoints: builder => ({
    /**
     * This is a mutation function for uploading a website using the `builder` tool.
     * The function receives the `options` for uploading as a parameter.
     * It calls the `uploadWebsite` service with the provided options.
     *
     * If the query is successful, it will return the response from the server.
     * If an error occurs during the query, it will be handled by the catch block within `onQueryStarted`.
     *
     * Note: Currently, this function does not invalidate any entity tags after uploading the website.
     */
    uploadWebsite: builder.mutation({
      query: ({ options }) => ({
        serviceName: 'uploadWebsite',
        args: { options }
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
    })
  })
});

export const { useUploadWebsiteMutation } = UtilityAPI;
