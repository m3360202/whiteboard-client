//**Redux Store */
import { api } from './api';
import { handleSetCurrentTemplate } from '../store/resource';
import { handleSetOpenResources } from '../store/sideBar';

export const TemplateApi = api.injectEndpoints({
  endpoints: builder => ({
    /**
     * This is a builder for a mutation in Redux Toolkit Query, named `createTemplate`.
     * It uses a service 'createNewTemplate' to create a new template.
     *
     * @param {Object} args - The argument object.
     * @param {Object} args.data - The data of the new template.
     * @param {string} args.type - The type of the new template.
     *
     * @returns {Object} The response from the service. If an error occurs, it gets caught and handled.
     */
    createTemplate: builder.mutation({
      query: ({ data, type }) => ({
        serviceName: 'createNewTemplate',
        args: { data, type }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['templateList']
    }),

    /**
     * This is a builder for a mutation in Redux Toolkit Query, named `editTemplate`.
     * It uses a service 'editTemplate' to edit a template.
     *
     * @param {Object} args - The argument object.
     * @param {Object} args.data - The data of the edited template.
     *
     * @returns {Object} The response from the service. If an error occurs, it gets caught and handled.
     */
    editTemplate: builder.mutation({
      query: ({ data }) => ({
        serviceName: 'editTemplate',
        args: { data }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        let boardTemplate = patch.currentTemplate;

        boardTemplate.name = patch.templateName;

        boardTemplate.description = patch.description;

        boardTemplate.onlyMe = patch.onlyMe;

        dispatch(handleSetCurrentTemplate(boardTemplate));

        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['templateList']
    }),

    /**
     * This is a builder for a mutation in Redux Toolkit Query, named `delTemplate`.
     * It uses a service 'deleteTemplate' to delete a specific template identified by boardId.
     *
     * @param {Object} args - The argument object.
     * @param {string} args.boardId - The id of the template to delete.
     *
     * @returns {Object} The response from the service. If an error occurs, it gets caught and handled.
     */
    delTemplate: builder.mutation({
      query: ({ boardId }) => ({
        serviceName: 'deleteTemplate',
        args: { boardId }
      }),
      transformResponse: (response:any, error) => {
        return response;
      },
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        dispatch(handleSetOpenResources(false));

        try {
          await queryFulfilled;
        } catch {}
      },
      invalidatesTags: ['templateList']
    })
  })
});

export const {
  useCreateTemplateMutation,
  useEditTemplateMutation,
  useDelTemplateMutation
} = TemplateApi;
