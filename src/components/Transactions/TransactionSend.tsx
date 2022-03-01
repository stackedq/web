import { Flex } from '@chakra-ui/react'
import { Asset } from '@shapeshiftoss/types'
import { useState } from 'react'
import { TxDetails } from 'hooks/useTxDetails/useTxDetails'
import { fromBaseUnit } from 'lib/math'
import { selectMarketDataById } from 'state/slices/selectors'
import { useAppSelector } from 'state/store'

import { TransactionDetails } from './TransactionDetails'
import { TransactionGenericRow } from './TransactionGenericRow'

export const TransactionSend = ({
  txDetails,
  showDateAndGuide
}: {
  txDetails: TxDetails
  activeAsset?: Asset
  showDateAndGuide?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)
  const marketData = useAppSelector(state =>
    selectMarketDataById(state, txDetails.tx.transfers[0].caip19)
  )
  const feeAssetMarketData = useAppSelector(state =>
    selectMarketDataById(state, txDetails.feeAsset.caip19)
  )
  return (
    <>
      <Flex alignItems='center' flex={1} as='button' w='full' py={4} onClick={toggleOpen}>
        <TransactionGenericRow
          type={txDetails.type}
          blockTime={txDetails.tx.blockTime}
          symbol={txDetails.symbol}
          assets={[
            {
              symbol: txDetails.symbol,
              amount: txDetails.value,
              precision: txDetails.precision,
              currentPrice: marketData.price
            }
          ]}
          fee={{
            symbol: txDetails.feeAsset?.symbol ?? '',
            amount:
              txDetails.tx.fee && txDetails.feeAsset
                ? fromBaseUnit(txDetails.tx.fee.value, txDetails.feeAsset.precision)
                : '0',
            precision: txDetails.feeAsset.precision,
            currentPrice: feeAssetMarketData.price
          }}
          explorerTxLink={txDetails.explorerTxLink}
          txid={txDetails.tx.txid}
          showDateAndGuide={showDateAndGuide}
        />
      </Flex>
      <TransactionDetails isOpen={isOpen} txDetails={txDetails} />
    </>
  )
}
