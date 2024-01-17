//** Import react
import React from 'react';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useGetPurchaseInvoiceListByUserIdQuery } from '../../../redux/PricingApiSlice';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import DownloadIcon from '@mui/icons-material/Download';

function UserBilling() {

  const { t } = useTranslation();
  const [showAllBillings, setShowAllBillings] = useState(false);

  const { data: purchaseInvoiceList = [] } =
    useGetPurchaseInvoiceListByUserIdQuery({
      userId: store.getState().user.userInfo.userId
    });

  const InvoiceDownloadDOM = params => {
    let invoicePdf = params.row.invoicePdf;
    return (
      <a
        href={invoicePdf}
        style={{ cursor: 'pointer', color: 'rgba(58, 53, 65, 0.68)' }}
      >
        <DownloadIcon />
      </a>
    );
  };

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp * 1000);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month.toString().padStart(2, '0')}/${day
      .toString()
      .padStart(2, '0')}/${year}`;
  };

  const columns = [
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 180,
      renderCell: params => formatTimestamp(params.row.createdAt)
    },
    { field: 'type', headerName: 'Payment Method', width: 180, renderCell: params => 'Stripe'},
    { field: '', headerName: 'Purchased Item', width: 180 },
    {
      field: 'amount',
      headerName: 'Invoice total',
      width: 180,
      renderCell: params => `$${(params.row.amount / 100).toFixed(2)}`
    },
    {
      field: 'invoicePdf',
      headerName: 'Download',
      renderCell: params => InvoiceDownloadDOM(params)
    }
  ];

  return (
    <Box sx={{ maxWidth: '918px', m: '0px auto', height: '100%',
    '.dataGridHeader': {  display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'}}}>
      {!showAllBillings ? (
        <Box className={'dataGridHeader'}>
          <Typography sx={{ fontWeight: 600,
    fontSize: '16px',
    lineHeight: '150%',
    fontFamily: 'Roboto',
    letterSpacing: '0.15px',
    color: 'rgba(58, 53, 65, 0.87)'}}>
            {t('components.userProfileAndSettingsPage.billingHistory')}
          </Typography>
          <Button
            onClick={() => setShowAllBillings(!showAllBillings)}
            variant="text"
            sx={{ fontWeight: 500,
              fontSize: '14px',
              lineHeight: '24px',
              letterSpacing: '0.4px',
              color: '#F21D6B',
              textTransform: 'uppercase'}}
          >
            {t('components.userProfileAndSettingsPage.seeAllBillings')}
          </Button>
        </Box>
      ) : (
        <Box className={'dataGridHeader'}>
          <Button
            onClick={() => setShowAllBillings(!showAllBillings)}
            variant="text"
            sx={{  padding: 0,
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '24px',
              color: 'rgba(58, 53, 65, 0.87)'}}
          >
            <NavigateBeforeIcon />
            {t('components.userProfileAndSettingsPage.billingHistory')}
          </Button>
        </Box>
      )}

      <Box sx={{ height: 'calc(100% - 60px)', '.dataGridCell': {fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.15px',
    color: 'rgba(58, 53, 65, 0.68)'},
    '.dataGridColumnSeparator':    { display: 'none !important'} }}>
        <DataGrid
          classes={{
            cell: 'dataGridCell',
            columnSeparator: 'dataGridColumnSeparator'
          }}
          rows={
            showAllBillings
              ? purchaseInvoiceList
              : purchaseInvoiceList.slice(0, 3)
          }
          columns={columns}
          pageSize={30}
          headerHeight={40}
          disableColumnMenu
          getRowId={row => row._id}
        />
      </Box>
    </Box>
  );
}

export default UserBilling;
