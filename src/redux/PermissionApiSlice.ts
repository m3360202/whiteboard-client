//**Redux Store */
import { api } from './api';

export const permissionApi = api.injectEndpoints({
  endpoints: builder => ({
    /**
     * Define a mutation for checking action permission.
     */
    checkActionPermission: builder.mutation({
      query: data => ({
        serviceName: 'checkActionPermission',
        args: { data }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Define a mutation for checking action permission of a room.
     */
    checkActionPermissionOfRoom: builder.mutation({
      query: data => ({
        serviceName: 'checkActionPermissionOfRoom',
        args: { data }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    }),

    /**
     * Define a mutation for checking action permission of a team.
     */
    checkActionPermissionOfTeam: builder.mutation({
      query: data => ({
        serviceName: 'checkActionPermissionOfTeam',
        args: { data }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      }
    })
  })
});

export const {
  useCheckActionPermissionMutation,
  useCheckActionPermissionOfRoomMutation,
  useCheckActionPermissionOfTeamMutation
} = permissionApi;
