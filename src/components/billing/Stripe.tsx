import { PricingService } from '../../services';
import store from '../../store';

export default class Stripe {

  public static switchPrices(
    planTitle: string,
    subCycle: string,
    newQuantity: number,
    accountInfo: any,
    setComfirmInfo: any,
    handleConfirmChangeClickOpen: any
  ) {
    const customerId = accountInfo.customerId;
    const subscriptionId = accountInfo.subscriptionId;
    const currentQuantity = accountInfo.quantity;

    return PricingService.getInstance().retrieveUpcomingInvoice({
      customerId: customerId,
      subscriptionId: subscriptionId,
      planTitle: planTitle,
      subCycle: subCycle,
      quantity: newQuantity
    },
      (error: any, response: any) => {

        const upcomingInvoice = response.invoice;
        const immediateTotal = response.immediate_total;
        const nextInvoiceTotal = response.next_invoice_sum;

        setComfirmInfo({
          currentQuantity: currentQuantity,
          newQuantity: newQuantity,
          planTitle: planTitle,
          immediateTotal: immediateTotal,
          nextInvoiceTotal: nextInvoiceTotal,
          nextPaymentAttempt: upcomingInvoice.next_payment_attempt
        })
        handleConfirmChangeClickOpen();
      }
    )
  }

  public static updateSubscription(
    subscriptionId: string,
    planTitle: string,
    subCycle: string,
    selectMemberIds: string[],
    handleUpgradePlansClose: any,
    handleConfirmChangeClose: any,
    getSubscriptionInformation: any
  ) {

    return PricingService.getInstance().updateSubscription({
      subscriptionId: subscriptionId,
      planTitle: planTitle,
      subCycle: subCycle,
      quantity: selectMemberIds.length,
      selectMemberIds: selectMemberIds
    },
      (error: any, response: any) => {
        handleConfirmChangeClose();
        handleUpgradePlansClose();
        getSubscriptionInformation(subscriptionId);
        const userId = store.getState().user.userInfo.userId;
        PricingService.getInstance().updateSubscriptionMember({
          userId: userId,
          memberIds: selectMemberIds
        })
        return response;

      })
  }

  public static cancelSubscription(data) {

    return PricingService.getInstance().cancelSubscription(
      data,
      (error: any, result: any) => {
        if (error) {
          console.log('error', error)
          return;
        }
        if (result) {
          window.location.href = '/pages/board-list/'
        }
      })
  }

  /* ------ Sample helpers ------- */

  public static getFormattedAmount(amount: any) {
    var amount = amount;
    var numberFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol',
    });
    var parts = numberFormat.formatToParts(amount);
    var zeroDecimalCurrency = true;
    for (var part of parts) {
      if (part.type === 'decimal') {
        zeroDecimalCurrency = false;
      }
    }
    amount = zeroDecimalCurrency ? amount : amount / 100;
    var formattedAmount = numberFormat.format(amount);

    return formattedAmount;
  }

  public static getDateStringFromUnixTimestamp(date: any) {
    let nextPaymentAttemptDate = new Date(date * 1000);
    let day = nextPaymentAttemptDate.getDate();
    let month = nextPaymentAttemptDate.getMonth() + 1;
    let year = nextPaymentAttemptDate.getFullYear();

    return month + '/' + day + '/' + year;
  }
}