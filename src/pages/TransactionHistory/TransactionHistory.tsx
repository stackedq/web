import { Flex, Heading, useColorModeValue } from '@chakra-ui/react'
import { useMemo } from 'react'
import { Card } from 'components/Card/Card'
import { Page } from 'components/Layout/Page'
import { Text } from 'components/Text'
import { TransactionHistoryList } from 'components/TransactionHistory/TransactionHistoryList'
import { selectTxIdsBasedOnSearchTermAndFilters } from 'state/slices/selectors'
import { useAppSelector } from 'state/store'

import { DownloadButton } from './DownloadButton'
import { useFilters } from './hooks/useFilters'
import { useSearch } from './hooks/useSearch'
import { TransactionHistoryFilter } from './TransactionHistoryFilter'
import { TransactionHistorySearch } from './TransactionHistorySearch'

export const TransactionHistory = () => {
  const { searchTerm, matchingAssets, handleInputChange } = useSearch()
  const filters = useFilters()
  console.info(matchingAssets)
  const selectorFilters = useMemo(
    () => ({
      matchingAssets: matchingAssets.map(asset => asset.caip19),
      ...filters
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchTerm]
  )
  const txIds = useAppSelector(state =>
    selectTxIdsBasedOnSearchTermAndFilters(state, selectorFilters)
  )
  console.info(txIds)
  return (
    <Page style={{ flex: 1 }}>
      <Flex role='main' flex={1} flexDir='column' maxWidth='6xl' mx='auto' px={4}>
        <Heading mb={4} ml={4}>
          <Text translation='transactionHistory.transactionHistory' />
        </Heading>
        <Card>
          <Card.Heading
            p={6}
            borderBottomWidth='1px'
            borderColor={useColorModeValue('gray.100', 'gray.750')}
          >
            <Flex justifyContent='space-between'>
              <Flex>
                <TransactionHistorySearch handleInputChange={handleInputChange} />
                <TransactionHistoryFilter />
              </Flex>
              <DownloadButton />
            </Flex>
          </Card.Heading>
          <TransactionHistoryList txIds={txIds} />
        </Card>
      </Flex>
    </Page>
  )
}
