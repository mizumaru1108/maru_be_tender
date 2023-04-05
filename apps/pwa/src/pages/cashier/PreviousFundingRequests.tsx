import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CardTableBE from 'components/card-table/CardTableBE';
import { gettingPreviousRequests } from 'queries/project-supervisor/gettingPreviousRequests';
import { getProposals } from 'queries/commons/getProposal';
import useLocales from '../../hooks/useLocales';
import useAuth from 'hooks/useAuth';
import { useSelector } from 'redux/store';
import { useEffect, useState } from 'react';

function PreviousFundingRequests() {
  const { user } = useAuth();
  const { translate } = useLocales();

  const { proposal } = useSelector((state) => state.proposal);

  const [paymentFilter, setPayementFilter] = useState<any>([]);

  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  useEffect(() => {
    const acc_payments = proposal.number_of_payments_by_supervisor;
    const payment_actual_done = proposal.payments.filter(
      (el: { status: string }) => el.status === 'done'
    ).length;

    if (payment_actual_done === acc_payments && proposal.inner_status !== 'DONE_BY_CASHIER') {
      setPayementFilter(['accepted_by_finance', 'done']);
    } else {
      setPayementFilter(['accepted_by_finance']);
    }
  }, [proposal]);

  return (
    // <Page title="طلبات الدعم سابقة">
    <Page title={translate('pages.common.previous_funding_requests')}>
      <Container>
        <ContentStyle>
          <CardTableBE
            resource={gettingPreviousRequests}
            title="طلبات الدعم سابقة"
            cardFooterButtonAction="show-project"
            dateFilter={true}
            filters={[
              {
                name: 'entity',
                title: 'اسم الجهة المشرفة',
                // The options will be fitcehed before passing them
                options: [
                  { label: 'اسم المستخدم الأول', value: 'Essam Kayal' },
                  { label: 'اسم المستخدم الثاني', value: 'hisham' },
                  { label: 'اسم المستخدم الثالت', value: 'danang' },
                  { label: 'اسم المستخدم الرابع', value: 'yamen' },
                  { label: 'اسم المستخدم الخامس', value: 'hamdi' },
                ],
                generate_filter: (value: string) => ({
                  user: { client_data: { entity: { _eq: value } } },
                }),
              },
              {
                name: 'status',
                title: 'الرجاء اختيار حالة المشروع',
                // The options will be fitcehed before passing them
                options: [
                  { label: 'معلقة', value: 'PENDING' },
                  { label: 'مكتملة', value: 'COMPLETED' },
                  { label: 'ملغاة', value: 'CANCELED' },
                ],
                generate_filter: (value: string) => ({
                  outter_status: { _eq: value },
                }),
              },
            ]}
            destination={'previous-funding-requests'}
            // baseFilters={{
            //   inner_status: {
            //     inner_status: {
            //       _in: ['DONE_BY_CASHIER', 'PROJECT_COMPLETED', 'REQUESTING_CLOSING_FORM'],
            //     },
            //   },
            //   _and: {
            //     _not: {
            //       payments: { payments: { status: { _in: ['accepted_by_finance'] } } },
            //     },
            //   },
            //   outter_status: { outter_status: { _in: ['COMPLETED', 'ONGOING'] } },
            // }}
            baseFilters={{
              filter1: {
                cashier_id: { _eq: user?.id },
                _or: [
                  {
                    inner_status: {
                      _in: ['ACCEPTED_AND_SETUP_PAYMENT_BY_SUPERVISOR'],
                    },
                    _not: {
                      payments: { status: { _in: paymentFilter } },
                    },
                  },
                  {
                    inner_status: {
                      _in: ['DONE_BY_CASHIER', 'PROJECT_COMPLETED', 'REQUESTING_CLOSING_FORM'],
                    },
                    payments: { status: { _in: ['done'] } },
                  },
                ],
              },
            }}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PreviousFundingRequests;
