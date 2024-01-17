//**Redux Store */
import { api } from './api';

export const resourceApi = api.injectEndpoints({
  endpoints: builder => ({
    /**
     * This is a builder for a query in Redux Toolkit Query named `getMyTemplates`.
     * It uses a service 'getMyTemplates' to fetch templates for a specific organisation.
     *
     * @param {string} orgId - The Id of the organisation.
     *
     * @returns {Object} The response from the service which is the list of templates.
     */
    getMyTemplates: builder.query({
      query: orgId => ({ serviceName: 'getMyTemplates', args: { orgId } }),
      transformResponse: response => {
        return response;
      },
      providesTags: ['templateList']
    }),

    /**
     * This is a builder for a query in Redux Toolkit Query named `getOrgTemplates`.
     * It uses the service 'getOrgTemplates' to fetch templates for a specific organisation.
     *
     * @param {string} orgId - The ID of the organisation.
     *
     * @returns {Object} The response from the service, which is the list of templates.
     */
    getOrgTemplates: builder.query({
      query: orgId => ({ serviceName: 'getOrgTemplates', args: { orgId } }),
      transformResponse: response => {
        return response;
      },
      providesTags: ['templateList']
    }),

    /**
     * This is a builder for a query in Redux Toolkit Query named `getOfficialTemplates`.
     * It uses the service 'getOfficialTemplates' to fetch official templates for a specific organisation.
     *
     * @param {string} orgId - The ID of the organisation.
     *
     * @returns {Object} The response from the service, which is the list of official templates.
     */
    getOfficialTemplates: builder.query({
      query: orgId => ({
        serviceName: 'getOfficialTemplates',
        args: { orgId }
      }),
      transformResponse: response => {
        return response;
      },
      providesTags: ['templateList']
    })
  })
});

export const {
  useGetMyTemplatesQuery,
  useGetOrgTemplatesQuery,
  useGetOfficialTemplatesQuery
} = resourceApi;
