//**Redux Store */
import { api } from './api';

export const pricingApi = api.injectEndpoints({
  endpoints: builder => ({
    /**
     * Define a mutation for getting the subscription plan for an organization.
     * @param {string} orgId - The unique identifier of the organization.
     */
    getSubscriptionPlan: builder.mutation({
      query: data => ({
        serviceName: 'getSubscriptionRecordByOrgId',
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
     * Define a mutation for getting an invoice based on provided data.
     * @param {object} data - The data used as arguments for the query.
     */
    getInvoice: builder.mutation({
      query: data => ({ serviceName: 'getInvoice', args: { data } }),
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
     * Define a mutation for consuming credits based on provided data.
     * @param {object} data - The data used as arguments for the query.
     */
    consumeCredits: builder.mutation({
      query: data => ({
        serviceName: 'creditsConsume',
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
     * This is a builder for a mutation in Redux Toolkit Query named `checkCreditsIsEnough`.
     * It uses a service 'checkIfCreditsIsEnough' to check if the credits in a specific organisation are enough.
     *
     * @param {string} orgId - The Id of the organisation.
     *
     * @returns {Object} The response from the service.
     *
     */
    checkCreditsIsEnough: builder.mutation({
      query: data => ({
        serviceName: 'checkIfCreditsIsEnough',
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
    getPurchaseInvoiceListByUserId: builder.query({
      query: ({ userId }) => ({
        serviceName: 'getPurchaseInvoiceListByUserId',
        args: { userId }
      }),
      transformResponse: (response:any, error) => {
        return response;
      }
    })
  })
});

export const {
  useGetSubscriptionPlanMutation,
  useGetInvoiceMutation,
  useConsumeCreditsMutation,
  useCheckCreditsIsEnoughMutation,
  useGetPurchaseInvoiceListByUserIdQuery
} = pricingApi;
