import React, {useState} from 'react';
import {
    Alert,
    Badge,
    Box,
    Button,
    Card,
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    Flex,
    Heading,
    HStack,
    NumberInput,
    Progress,
    SimpleGrid,
    Table,
    TabsContent,
    TabsList,
    TabsRoot,
    TabsTrigger,
    Text,
    VStack,
} from '@chakra-ui/react';
import {FiCheckCircle, FiEdit3, FiFileText, FiRefreshCw,} from 'react-icons/fi';
import {type Column, DataTable} from '../components/common/DataTable';
import type {Product, Stocktaking as StocktakingType, StocktakingItem} from '../types';
import {mockProducts} from '../data/mockData';
import {formatCurrency, formatDate, formatQuantity} from '../utils/formatters';

interface StocktakingItemExtended extends StocktakingItem {
  product?: Product;
}

export const Stocktaking: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [, setCurrentStocktaking] = useState<StocktakingType | null>(null);
  const [stocktakingItems, setStocktakingItems] = useState<StocktakingItemExtended[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
    const [open, setOpen] = useState(false);
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);
  // const toast = useToast(); // TODO: 実装時に使用

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
      theoreticalStock: product.currentStock,
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

    // toast({ title: '棚卸しを開始しました' }); // TODO: 実装時に使用
  };

  const updateActualStock = (productId: string, actualStock: number) => {
    setStocktakingItems(prev => {
      const updated = prev.map(item => {
        if (item.productId === productId) {
          const difference = actualStock - item.theoreticalStock;
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

    // toast({ title: '棚卸しを完了しました' }); // TODO: 実装時に使用
  };

  const cancelStocktaking = () => {
    setIsActive(false);
    setCurrentStocktaking(null);
    setStocktakingItems([]);
    setCompletedCount(0);

    // toast({ title: '棚卸しを中止しました' }); // TODO: 実装時に使用
  };

  const exportReport = () => {
    // toast({ title: 'レポート出力' }); // TODO: 実装時に使用
  };

  const historyColumns: Column<StocktakingType>[] = [
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
        <HStack gap={1}>
          {item.totalDifference !== 0 && (
            <>
                {item.totalDifference > 0 && <Text color="green.500">↑</Text>}
                {item.totalDifference < 0 && <Text color="red.500">↓</Text>}
            </>
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
            colorScheme="primary"
            onClick={startStocktaking}
          >
            <FiEdit3 /> 棚卸し開始
          </Button>
        )}
      </Flex>

      {isActive ? (
        <>
          <Alert.Root status="info" mb={6}>
            <Alert.Indicator />
            <Box>
              <Alert.Title>棚卸し実施中</Alert.Title>
              <Alert.Description>
                各商品の実在庫数を入力してください
              </Alert.Description>
            </Box>
          </Alert.Root>

          <SimpleGrid columns={{ base: 1, md: 4 }} gap={4} mb={6}>
              <Box p={4} bg="white" borderRadius="lg">
                  <Text fontSize="sm" color="gray.500">対象商品数</Text>
                  <Text fontSize="2xl" fontWeight="bold">{mockProducts.length}</Text>
                  <Text fontSize="xs" color="gray.400">全商品</Text>
              </Box>
              <Box p={4} bg="white" borderRadius="lg">
                  <Text fontSize="sm" color="gray.500">確認済み</Text>
                  <Text fontSize="2xl" fontWeight="bold">{completedCount}</Text>
                  <Text fontSize="xs" color="gray.400">{progress.toFixed(0)}%</Text>
              </Box>
              <Box p={4} bg="white" borderRadius="lg">
                  <Text fontSize="sm" color="gray.500">差異金額</Text>
                  <Text fontSize="2xl" fontWeight="bold">
                {formatCurrency(
                  stocktakingItems.reduce((sum, item) => sum + item.differenceAmount, 0)
                )}
                  </Text>
                  <Text fontSize="xs" color="gray.400">現在の差異</Text>
              </Box>
              <Box p={4} bg="white" borderRadius="lg">
                  <Text fontSize="sm" color="gray.500">ステータス</Text>
                  <Text fontSize="2xl" fontWeight="bold">
                <Badge colorScheme="yellow" fontSize="md">進行中</Badge>
                  </Text>
                  <Text fontSize="xs" color="gray.400">{formatDate(new Date())}</Text>
              </Box>
          </SimpleGrid>

          <Progress.Root value={progress} colorPalette="blue" mb={6}>
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>

          <Card.Root mb={6}>
            <Card.Body>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">商品リスト</Heading>
                <HStack>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelStocktaking}
                  >
                    <FiRefreshCw /> 中止
                  </Button>
                  <Button
                    colorScheme="green"
                    size="sm"
                    onClick={onOpen}
                    disabled={completedCount === 0}
                  >
                    <FiCheckCircle /> 棚卸し完了
                  </Button>
                </HStack>
              </Flex>

              <Table.ScrollArea maxH="500px" overflowY="auto">
                  <Table.Root size="sm">
                  <Table.Header position="sticky" top={0} bg="white" zIndex={1}>
                    <Table.Row>
                      <Table.ColumnHeader>商品コード</Table.ColumnHeader>
                      <Table.ColumnHeader>商品名</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="end">システム在庫</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="end">実在庫</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="end">差異</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="end">差異金額</Table.ColumnHeader>
                      <Table.ColumnHeader>状態</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {stocktakingItems.map((item) => (
                      <Table.Row key={item.productId}>
                        <Table.Cell>{item.product?.code}</Table.Cell>
                        <Table.Cell>{item.productName}</Table.Cell>
                        <Table.Cell textAlign="end">
                          {formatQuantity(item.theoreticalStock, item.product?.unit || 'kg')}
                        </Table.Cell>
                        <Table.Cell>
                          <NumberInput.Root
                            value={item.actualStock.toString()}
                            onValueChange={(details) => updateActualStock(item.productId, parseFloat(details.value) || 0)}
                            min={0}
                            step={0.1}
                            size="sm"
                            width="100px"
                          >
                            <NumberInput.Input />
                            <NumberInput.Control>
                              <NumberInput.IncrementTrigger />
                              <NumberInput.DecrementTrigger />
                            </NumberInput.Control>
                          </NumberInput.Root>
                        </Table.Cell>
                        <Table.Cell textAlign="end">
                          {item.difference !== 0 && (
                            <Text color={item.difference > 0 ? 'green.500' : 'red.500'}>
                              {item.difference > 0 ? '+' : ''}{formatQuantity(item.difference, item.product?.unit || 'kg')}
                            </Text>
                          )}
                        </Table.Cell>
                        <Table.Cell textAlign="end">
                          {item.differenceAmount !== 0 && (
                            <Text color={item.differenceAmount > 0 ? 'green.500' : 'red.500'}>
                              {formatCurrency(item.differenceAmount)}
                            </Text>
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          {item.actualStock > 0 ? (
                            <Badge colorScheme="green">確認済</Badge>
                          ) : (
                            <Badge colorScheme="gray">未確認</Badge>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Table.ScrollArea>
            </Card.Body>
          </Card.Root>
        </>
      ) : (
          <TabsRoot defaultValue="overview" colorPalette="blue">
              <TabsList>
                  <TabsTrigger value="overview">概要</TabsTrigger>
                  <TabsTrigger value="history">履歴</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                <Card.Root>
                  <Card.Header>
                    <Heading size="md">前回の棚卸し</Heading>
                  </Card.Header>
                  <Card.Body>
                    <VStack align="stretch" gap={3}>
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
                  </Card.Body>
                </Card.Root>

                <Card.Root>
                  <Card.Header>
                    <Heading size="md">棚卸しサマリー</Heading>
                  </Card.Header>
                  <Card.Body>
                    <VStack align="stretch" gap={3}>
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
                        variant="outline"
                        size="sm"
                        onClick={exportReport}
                      >
                        <FiFileText /> レポート出力
                      </Button>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              </SimpleGrid>
              </TabsContent>

              <TabsContent value="history">
              <Card.Root>
                <Card.Body>
                  <DataTable
                    data={mockStocktakingHistory}
                    columns={historyColumns}
                    sortable
                    paginated
                    pageSize={10}
                  />
                </Card.Body>
              </Card.Root>
              </TabsContent>
          </TabsRoot>
      )}

        <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>棚卸し完了確認</DialogTitle>
                </DialogHeader>
                <DialogBody>
            <VStack align="stretch" gap={4}>
              <Alert.Root status="warning">
                <Alert.Indicator />
                <Box>
                  <Alert.Title>在庫数を調整します</Alert.Title>
                  <Alert.Description>
                    この操作は取り消せません。よろしいですか？
                  </Alert.Description>
                </Box>
              </Alert.Root>
              
              <Box p={4} bg="gray.50" borderRadius="md">
                <VStack align="stretch" gap={2}>
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
                </DialogBody>
                <DialogFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              キャンセル
            </Button>
            <Button colorScheme="primary" onClick={completeStocktaking}>
              確定
            </Button>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    </Box>
  );
};