import React, { useState } from 'react';
import {
  Box,
  Heading,
  HStack,
  Button,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Text,
  VStack,
  useToast,
  Badge,
  Divider,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiSave,
  FiRefreshCw,
  FiEdit3,
  FiFileText,
  FiDownload,
} from 'react-icons/fi';
import { DataTable, Column } from '../components/common/DataTable';
import { Product, Stocktaking as StocktakingType, StocktakingItem } from '../types';
import { mockProducts } from '../data/mockData';
import { formatCurrency, formatQuantity, formatDate } from '../utils/formatters';

interface StocktakingItemExtended extends StocktakingItem {
  product?: Product;
}

export const Stocktaking: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStocktaking, setCurrentStocktaking] = useState<StocktakingType | null>(null);
  const [stocktakingItems, setStocktakingItems] = useState<StocktakingItemExtended[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const mockStocktakingHistory: StocktakingType[] = [
    {
      id: '1',
      date: new Date('2024-11-01'),
      items: [],
      totalDifference: -15000,
      status: 'completed',
      userId: 'user1',
      userName: '田中太郎',
    },
    {
      id: '2',
      date: new Date('2024-10-01'),
      items: [],
      totalDifference: 8000,
      status: 'completed',
      userId: 'user2',
      userName: '佐藤花子',
    },
  ];

  const startStocktaking = () => {
    const items: StocktakingItemExtended[] = mockProducts.map(product => ({
      productId: product.id,
      productName: product.name,
      systemStock: product.currentStock,
      actualStock: 0,
      difference: 0,
      differenceAmount: 0,
      product: product,
    }));

    setStocktakingItems(items);
    setCurrentStocktaking({
      id: `st-${Date.now()}`,
      date: new Date(),
      items: [],
      totalDifference: 0,
      status: 'in_progress',
      userId: 'user1',
      userName: '現在のユーザー',
    });
    setIsActive(true);
    setCompletedCount(0);

    toast({
      title: '棚卸しを開始しました',
      description: `${mockProducts.length}件の商品を確認してください`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const updateActualStock = (productId: string, actualStock: number) => {
    setStocktakingItems(prev => {
      const updated = prev.map(item => {
        if (item.productId === productId) {
          const difference = actualStock - item.systemStock;
          const differenceAmount = difference * (item.product?.cost || 0);
          return {
            ...item,
            actualStock,
            difference,
            differenceAmount,
          };
        }
        return item;
      });

      const completed = updated.filter(item => item.actualStock > 0).length;
      setCompletedCount(completed);

      return updated;
    });
  };

  const completeStocktaking = () => {
    const totalDifference = stocktakingItems.reduce(
      (sum, item) => sum + item.differenceAmount,
      0
    );

    setCurrentStocktaking(prev => 
      prev ? {
        ...prev,
        items: stocktakingItems,
        totalDifference,
        status: 'completed',
      } : null
    );

    setIsActive(false);
    onClose();

    toast({
      title: '棚卸しを完了しました',
      description: '在庫数を調整しました',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const cancelStocktaking = () => {
    setIsActive(false);
    setCurrentStocktaking(null);
    setStocktakingItems([]);
    setCompletedCount(0);

    toast({
      title: '棚卸しを中止しました',
      status: 'warning',
      duration: 3000,
      isClosable: true,
    });
  };

  const exportReport = () => {
    toast({
      title: 'レポート出力',
      description: 'PDFファイルをダウンロードしました',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const historyColumns: Column<Stocktaking>[] = [
    {
      key: 'date',
      label: '実施日',
      accessor: (item) => formatDate(item.date),
      sortable: true,
    },
    {
      key: 'userName',
      label: '実施者',
      accessor: (item) => item.userName,
    },
    {
      key: 'itemCount',
      label: '対象商品数',
      accessor: (item) => `${item.items.length}件`,
      align: 'right',
    },
    {
      key: 'totalDifference',
      label: '差異金額',
      accessor: (item) => (
        <HStack spacing={1}>
          {item.totalDifference !== 0 && (
            <StatArrow type={item.totalDifference > 0 ? 'increase' : 'decrease'} />
          )}
          <Text color={item.totalDifference > 0 ? 'green.500' : item.totalDifference < 0 ? 'red.500' : 'gray.500'}>
            {formatCurrency(Math.abs(item.totalDifference))}
          </Text>
        </HStack>
      ),
      align: 'right',
    },
    {
      key: 'status',
      label: 'ステータス',
      accessor: (item) => (
        <Badge colorScheme={item.status === 'completed' ? 'green' : 'yellow'}>
          {item.status === 'completed' ? '完了' : '進行中'}
        </Badge>
      ),
    },
  ];

  const progress = (completedCount / mockProducts.length) * 100;

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">棚卸し</Heading>
        {!isActive && (
          <Button
            leftIcon={<FiEdit3 />}
            colorScheme="primary"
            onClick={startStocktaking}
          >
            棚卸し開始
          </Button>
        )}
      </Flex>

      {isActive ? (
        <>
          <Alert status="info" mb={6}>
            <AlertIcon />
            <Box>
              <AlertTitle>棚卸し実施中</AlertTitle>
              <AlertDescription>
                各商品の実在庫数を入力してください
              </AlertDescription>
            </Box>
          </Alert>

          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={6}>
            <Stat>
              <StatLabel>対象商品数</StatLabel>
              <StatNumber>{mockProducts.length}</StatNumber>
              <StatHelpText>全商品</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>確認済み</StatLabel>
              <StatNumber>{completedCount}</StatNumber>
              <StatHelpText>{progress.toFixed(0)}%</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>差異金額</StatLabel>
              <StatNumber>
                {formatCurrency(
                  stocktakingItems.reduce((sum, item) => sum + item.differenceAmount, 0)
                )}
              </StatNumber>
              <StatHelpText>現在の差異</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>ステータス</StatLabel>
              <StatNumber>
                <Badge colorScheme="yellow" fontSize="md">進行中</Badge>
              </StatNumber>
              <StatHelpText>{formatDate(new Date())}</StatHelpText>
            </Stat>
          </SimpleGrid>

          <Progress value={progress} colorScheme="primary" mb={6} />

          <Card mb={6}>
            <CardBody>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">商品リスト</Heading>
                <HStack>
                  <Button
                    leftIcon={<FiRefreshCw />}
                    variant="outline"
                    size="sm"
                    onClick={cancelStocktaking}
                  >
                    中止
                  </Button>
                  <Button
                    leftIcon={<FiCheckCircle />}
                    colorScheme="green"
                    size="sm"
                    onClick={onOpen}
                    isDisabled={completedCount === 0}
                  >
                    棚卸し完了
                  </Button>
                </HStack>
              </Flex>

              <TableContainer maxH="500px" overflowY="auto">
                <Table size="sm" variant="simple">
                  <Thead position="sticky" top={0} bg="white" zIndex={1}>
                    <Tr>
                      <Th>商品コード</Th>
                      <Th>商品名</Th>
                      <Th isNumeric>システム在庫</Th>
                      <Th isNumeric>実在庫</Th>
                      <Th isNumeric>差異</Th>
                      <Th isNumeric>差異金額</Th>
                      <Th>状態</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {stocktakingItems.map((item) => (
                      <Tr key={item.productId}>
                        <Td>{item.product?.code}</Td>
                        <Td>{item.productName}</Td>
                        <Td isNumeric>
                          {formatQuantity(item.systemStock, item.product?.unit || 'kg')}
                        </Td>
                        <Td>
                          <NumberInput
                            value={item.actualStock}
                            onChange={(_, value) => updateActualStock(item.productId, value)}
                            min={0}
                            step={0.1}
                            size="sm"
                            width="100px"
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Td>
                        <Td isNumeric>
                          {item.difference !== 0 && (
                            <Text color={item.difference > 0 ? 'green.500' : 'red.500'}>
                              {item.difference > 0 ? '+' : ''}{formatQuantity(item.difference, item.product?.unit || 'kg')}
                            </Text>
                          )}
                        </Td>
                        <Td isNumeric>
                          {item.differenceAmount !== 0 && (
                            <Text color={item.differenceAmount > 0 ? 'green.500' : 'red.500'}>
                              {formatCurrency(item.differenceAmount)}
                            </Text>
                          )}
                        </Td>
                        <Td>
                          {item.actualStock > 0 ? (
                            <Badge colorScheme="green">確認済</Badge>
                          ) : (
                            <Badge colorScheme="gray">未確認</Badge>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        </>
      ) : (
        <Tabs colorScheme="primary">
          <TabList>
            <Tab>概要</Tab>
            <Tab>履歴</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Card>
                  <CardHeader>
                    <Heading size="md">前回の棚卸し</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <HStack justify="space-between">
                        <Text>実施日:</Text>
                        <Text fontWeight="bold">{formatDate(new Date('2024-11-01'))}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>実施者:</Text>
                        <Text fontWeight="bold">田中太郎</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>対象商品数:</Text>
                        <Text fontWeight="bold">45件</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>差異金額:</Text>
                        <Text fontWeight="bold" color="red.500">
                          {formatCurrency(-15000)}
                        </Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader>
                    <Heading size="md">棚卸しサマリー</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <HStack justify="space-between">
                        <Text>今月実施回数:</Text>
                        <Text fontWeight="bold">1回</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>平均差異率:</Text>
                        <Text fontWeight="bold">2.5%</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>累計調整額:</Text>
                        <Text fontWeight="bold" color="red.500">
                          {formatCurrency(-45000)}
                        </Text>
                      </HStack>
                      <Button
                        leftIcon={<FiFileText />}
                        variant="outline"
                        size="sm"
                        onClick={exportReport}
                      >
                        レポート出力
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              <Card>
                <CardBody>
                  <DataTable
                    data={mockStocktakingHistory}
                    columns={historyColumns}
                    sortable
                    paginated
                    pageSize={10}
                  />
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>棚卸し完了確認</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <Alert status="warning">
                <AlertIcon />
                <Box>
                  <AlertTitle>在庫数を調整します</AlertTitle>
                  <AlertDescription>
                    この操作は取り消せません。よろしいですか？
                  </AlertDescription>
                </Box>
              </Alert>
              
              <Box p={4} bg="gray.50" borderRadius="md">
                <VStack align="stretch" spacing={2}>
                  <HStack justify="space-between">
                    <Text>確認済み商品:</Text>
                    <Text fontWeight="bold">{completedCount}件</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>差異金額合計:</Text>
                    <Text fontWeight="bold" color={
                      stocktakingItems.reduce((sum, item) => sum + item.differenceAmount, 0) > 0
                        ? 'green.500'
                        : 'red.500'
                    }>
                      {formatCurrency(
                        stocktakingItems.reduce((sum, item) => sum + item.differenceAmount, 0)
                      )}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              キャンセル
            </Button>
            <Button colorScheme="primary" onClick={completeStocktaking}>
              確定
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};