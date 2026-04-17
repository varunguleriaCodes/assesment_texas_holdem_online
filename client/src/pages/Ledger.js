import React, { useEffect } from 'react';
import styled from 'styled-components';
import Container from '../components/layout/Container';
import RelativeWrapper from '../components/layout/RelativeWrapper';
import Spacer from '../components/layout/Spacer';
import Heading from '../components/typography/Heading';
import Text from '../components/typography/Text';
import Button from '../components/buttons/Button';
import { useLedger } from '../hooks/useLedger';
import useScrollToTopOnPageLoad from '../hooks/useScrollToTopOnPageLoad';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.6rem 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.primaryCta};
  font-weight: 600;
`;

const Td = styled.td`
  padding: 0.6rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightBg};
`;

const Amount = styled.span`
  font-weight: 600;
  color: ${({ positive, theme }) =>
    positive ? 'hsl(140, 55%, 35%)' : theme.colors.dangerColor};
`;

const PAGE_SIZE = 5;

const fmt = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

const Ledger = () => {
  const { transactions, pagination, loading, error, fetchLedger } = useLedger();
  useScrollToTopOnPageLoad();
  useEffect(() => {
    fetchLedger({ limit: PAGE_SIZE, offset: 0 });
  }, [fetchLedger]);

  const goToPrev = () =>
    fetchLedger({ limit: PAGE_SIZE, offset: Math.max(pagination.offset - PAGE_SIZE, 0) });

  const goToNext = () =>
    fetchLedger({ limit: PAGE_SIZE, offset: pagination.offset + PAGE_SIZE });

  const currentPage = Math.floor(pagination.offset / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(pagination.total / PAGE_SIZE) || 1;

  return (
    <RelativeWrapper>
      <Container
        fullHeight
        flexDirection="column"
        alignItems="center"
        padding="5rem 2rem 2rem"
      >
        <Heading headingClass="h2" style={{ marginBottom: '0.5rem' }}>
          Transactions
        </Heading>

        {error && <Text style={{ color: 'red' }}>{error}</Text>}

        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Type</Th>
                <Th>Description</Th>
                <Th>Amount</Th>
                <Th>Balance</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <Td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                    No transactions yet.
                  </Td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <Td style={{ textTransform: 'capitalize' }}>{tx.type.replace('_', ' ')}</Td>
                    <Td>{tx.description}</Td>
                    <Td>
                      <Amount positive={tx.amount > 0}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                      </Amount>
                    </Td>
                    <Td>{tx.balance.toLocaleString()}</Td>
                    <Td>{fmt(tx.createdAt)}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
        <Spacer style={{ marginTop: '1.25rem' }}>
          <Button onClick={goToPrev} disabled={pagination.offset === 0}>← Prev</Button>
          <Text style={{ margin: 0 }}>{currentPage} / {totalPages}</Text>
          <Button onClick={goToNext} disabled={!pagination.hasMore}>Next →</Button>
        </Spacer>
      </Container>
    </RelativeWrapper>
  );
};

export default Ledger;