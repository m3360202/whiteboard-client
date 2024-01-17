import RemoteProcedureNames from '../util/RemoteProcedureNames';
import server from '../startup/serverConnect';
import store from '../store';

export default class PricingService {
  static service = null;

  static getInstance(): PricingService {
    if (PricingService.service == null) {
      PricingService.service = new PricingService();
    }
    return PricingService.service;
  }

  constructor() { }

  /**
   * Checks a card token using a remote procedure call.
   * @param {object} data - The data containing the card token to check.
   * @param {function} resultHandler - A callback function to handle the result of the card token check.
   */
  checkCardToken(data, resultHandler) {
    // Call the remote procedure to check the card token and invoke the result handler.

    server.call(RemoteProcedureNames.CHECK_CARD_TOKEN, data).then(res => {

    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Creates a subscription using a remote procedure call.
   * @param {object} data - The data containing information for creating the subscription.
   * @param {function} resultHandler - A callback function to handle the result of the subscription creation.
   */
  createSubscription(data, resultHandler) {
    // Call the remote procedure to create the subscription and invoke the result handler.
    server.call(RemoteProcedureNames.CREATE_SUBSCRIPTION, data).then(res => {

    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Adds a pricing plan using a remote procedure call.
   * @param {object} data - The data containing information for the pricing plan to add.
   */
  addPricingPlan(data) {
    // Call the remote procedure to add the pricing plan.
    server.call(RemoteProcedureNames.ADD_PRICING_PLAN, data).then(res => {

    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Finds a subscription by user ID using a remote procedure call.
   * @param {string} userId - The ID of the user for whom to find the subscription.
   * @param {function} resultHandler - A callback function to handle the result of the subscription search.
   */
  findSubscriptionByuserId(userId, resultHandler) {
    // Call the remote procedure to find the subscription by user ID and invoke the result handler.
    server.call(RemoteProcedureNames.FIND_SUBSCRIPTION_BY_USERID, userId).then(res => {

    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Retrieves subscription information using a remote procedure call.
   * @param {object} data - The data containing information for retrieving subscription details.
   * @param {function} resultHandler - A callback function to handle the result of the subscription information retrieval.
   */
  retrieveSubscriptionInformation(data, resultHandler) {
    // Call the remote procedure to retrieve subscription information and invoke the result handler.
    server.call(RemoteProcedureNames.RETRIEVE_SUBSCRIPTION_INFORMATION,
      data).then(res => {

      }).catch(err => {
        console.log(err)
      });
  }

  /**
   * Retrieves information about an upcoming invoice using a remote procedure call.
   * @param {object} data - The data containing information for retrieving the upcoming invoice.
   * @param {function} resultHandler - A callback function to handle the result of the upcoming invoice retrieval.
   */
  retrieveUpcomingInvoice(data, resultHandler) {
    // Call the remote procedure to retrieve information about an upcoming invoice and invoke the result handler.
    server.call(RemoteProcedureNames.RETRIEVE_UPCOMINGINVOICE,
      data).then(res => {

      }).catch(err => {
        console.log(err)
      });
  }

  /**
   * Updates a subscription using a remote procedure call.
   * @param {object} data - The data containing information for updating the subscription.
   * @param {function} resultHandler - A callback function to handle the result of the subscription update.
   */
  updateSubscription(data, resultHandler) {
    server.call(RemoteProcedureNames.UPDATE_SUBSCRIPTION, data).then(res => {

    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Updates a subscription member using a remote procedure call.
   * @param {object} data - The data containing information for updating the subscription member.
   */
  updateSubscriptionMember(data) {
    server.call(RemoteProcedureNames.UPDATE_SUBSCRIPTION_MEMBER, data).then(res => {

    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Cancels a subscription using a remote procedure call.
   * @param {object} data - The data containing information for canceling the subscription.
   * @param {function} resultHandler - A callback function to handle the result of the subscription cancellation.
   */
  cancelSubscription(data, resultHandler) {
    server.call(RemoteProcedureNames.CANCEL_SUBSCRIPTION, data).then(res => {

    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Updates customer information using a remote procedure call.
   * @param {object} data - The data containing information for updating customer details.
   * @param {function} resultHandler - A callback function to handle the result of the customer information update.
   */
  updateCustomer(data, resultHandler) {

    server.call(RemoteProcedureNames.UPDATE_CUSTOMER, data).then(res => {

    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Updates a payment method using a remote procedure call.
   * @param {object} data - The data containing information for updating the payment method.
   * @param {function} resultHandler - A callback function to handle the result of the payment method update.
   */
  updatePaymentMethod(data, resultHandler) {
    server.call(RemoteProcedureNames.UPDATE_PAYMENT_METHOD,
      data).then(res => {
        
    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Changes the subscription plan for an organization using a remote procedure call.
   * @param {string} orgId - The ID of the organization.
   * @param {object} item - The item containing information about the new subscription plan.
   * @param {function} resultHandler - A callback function to handle the result of the plan change.
   */
  changeSubscriptionPlanMethod(orgId, item, resultHandler) {
    server.call('changeSubscriptionPlan', orgId, item).then(res => {
        
    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Unsubscribes a subscription record using a remote procedure call.
   * @param {string} orgId - The ID of the organization.
   * @param {boolean} isTest - Indicates whether it's a test scenario.
   * @param {function} resultHandler - A callback function to handle the result of the unsubscription.
   */
  unSubscriptionRecordMethod(orgId, isTest, resultHandler) {
    server.call('unSubscriptionRecord', orgId, isTest).then(res => {
        
    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Gets subscription records for an organization using a remote procedure call.
   * @param {string} orgId - The ID of the organization.
   * @param {function} resultHandler - A callback function to handle the result of the record retrieval.
   */
  getSubscriptionRecordByOrgIdMethod(orgId) {
    let user = store.getState().user.userInfo;
    server.call('getSubscriptionRecordByOrgId', orgId,user).then(res => {
        return res;
    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Gets subscription records for a user using a remote procedure call.
   * @param {string} orgId - The ID of the organization.
   * @param {function} resultHandler - A callback function to handle the result of the record retrieval.
   */
  getSubscriptionRecordByUserIdMethod(orgId) {
    let user = store.getState().user.userInfo;
    server.call('getSubscriptionRecordByUserId', orgId,user).then(res => {
        return res;
    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Upgrades a subscription record using a remote procedure call.
   * @param {string} id - The ID of the subscription record to upgrade.
   * @param {function} resultHandler - A callback function to handle the result of the record upgrade.
   */
  upgradeSubscriptionRecordMethod(id,plan) {
    let user = store.getState().user.userInfo;
    server.call('upgradeSubscriptionRecord', id,plan,user).then(res => {
          return res;
    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Checks if a subscription record has expired using a remote procedure call.
   * @param {string} orgId - The ID of the organization.
   * @param {function} resultHandler - A callback function to handle the result of the expiration check.
   */
  checkIfSubscriptionRecordExpiredMethod(orgId) {
    let user = store.getState().user.userInfo;
    server.call('checkIfSubscriptionRecordExpired', orgId,user).then(res => {
        return res;
    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Gets subscription credits using a remote procedure call.
   * @param {string} id - The ID of the subscription record to get credits for.
   * @param {function} resultHandler - A callback function to handle the result of the credit retrieval.
   */
  getSubscriptionCreditsMethod(id, resultHandler) {
    server.call('getSubscriptionCredits', id).then(res => {
        
    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Gets subscription record invoice history using a remote procedure call.
   * @param {string} id - The ID of the subscription record to get invoice history for.
   * @param {function} resultHandler - A callback function to handle the result of the invoice history retrieval.
   */
  getSubscriptionRecordInvoiceHistoryMethod(id, resultHandler) {
    server.call('getSubscriptionRecordInvoiceHistory', id).then(res => {
        
    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Gets subscription record credits consumption history using a remote procedure call.
   * @param {string} id - The ID of the subscription record to get credits consumption history for.
   * @param {function} resultHandler - A callback function to handle the result of the consumption history retrieval.
   */
  getSubscriptionRecordCreditsConsumeHistoryMethod(id, resultHandler) {
    server.call('getSubscriptionRecordCreditsConsumeHistory', id).then(res => {
        
    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Consumes credits for an organization using a remote procedure call.
   * @param {string} orgId - The ID of the organization.
   * @param {number} credits - The number of credits to consume.
   * @param {function} resultHandler - A callback function to handle the result of the credits consumption.
   */
  creditsConsumeMethod(orgId, credits, resultHandler) {
    server.call('creditsConsume', orgId, credits).then(res => {
        
    }).catch(err => {
      console.log(err)
    });
  }

  /**
   * Updates a subscription plan using a remote procedure call.
   * @param {string} id - The ID of the subscription record to update.
   * @param {object} plan - The updated subscription plan.
   * @param {function} resultHandler - A callback function to handle the result of the plan update.
   */
  updatePlanMethod(id, plan) {
    let user = store.getState().user.userInfo;
    server.call('updatePlan', {id, plan,user}).then(res => {
        return res;
    }).catch(err => {
      console.log(err)
    });
  }
}
