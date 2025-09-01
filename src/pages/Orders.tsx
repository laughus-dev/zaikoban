import React, {useState} from 'react';
import {
    Alert,
    Badge,
    Box,
    Button,
    Card,
    Checkbox,
    createToaster,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    Flex,
    Heading,
    HStack,
    SimpleGrid,
    Table,
    TabsContent,
    TabsList,
    TabsRoot,
    TabsTrigger,
    Text,
    VStack
} from '@chakra-ui/react';
import {
    FiAlertCircle,
    FiCheckCircle,
    FiClock,
    FiEdit,
    FiFileText,
    FiPlus,
    FiSend,
    FiShoppingCart,
    FiXCircle,
} from 'react-icons/fi';
import type {Column} from '../components/common/DataTable';
import {DataTable} from '../components/common/DataTable';
import type {Order, OrderItem} from '../types';
import {mockProducts, mockSuppliers} from '../data/mockData';
import {formatCurrency, formatDate, formatQuantity} from '../utils/formatters';

interface OrderDraft {
  supplierId: string;
  items: OrderItem[];
  totalAmount: number;
}

export const Orders: React.FC = () => {
  const [orderDrafts, setOrderDrafts] = useState<OrderDraft[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
    const [isOpen, setIsOpen] = useState(false);
    const toast = createToaster({
        placement: 'top',
    });
    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);

  const lowStockProducts = mockProducts.filter(p => p.currentStock <= p.minStock);
  
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      supplierId: 'supplier1',
      supplierName: '山田青果店',
      items: [
        {
          productId: 'p1',
          productName: 'トマト',
          quantity: 20,
          unitPrice: 200,
          totalPrice: 4000,
        },
      ],
      totalAmount: 4000,
      status: 'received',
      orderDate: new Date('2024-12-01'),
      expectedDate: new Date('2024-12-03'),
      receivedDate: new Date('2024-12-03'),
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      supplierId: 'supplier2',
      supplierName: '田中精肉店',
      items: [
        {
          productId: 'p2',
          productName: '和牛サーロイン',
          quantity: 10,
          unitPrice: 3000,
          totalPrice: 30000,
        },
      ],
      totalAmount: 30000,
      status: 'ordered',
      orderDate: new Date('2024-12-05'),
      expectedDate: new Date('2024-12-07'),
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      supplierId: 'supplier3',
      supplierName: '鈴木水産',
      items: [],
      totalAmount: 15000,
      status: 'draft',
      orderDate: new Date('2024-12-06'),
    },
  ];

  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const handleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === lowStockProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(lowStockProducts.map(p => p.id)));
    }
  };

  const createOrderDraft = () => {
    if (selectedProducts.size === 0) {
        toast.create({
        title: 'エラー',
        description: '商品を選択してください',
        duration: 3000,
      });
      return;
    }

    const productsBySupplier = new Map<string, OrderItem[]>();
    
    selectedProducts.forEach(productId => {
      const product = mockProducts.find(p => p.id === productId);
      if (product && product.supplierId) {
        const items = productsBySupplier.get(product.supplierId) || [];
        items.push({
          productId: product.id,
          productName: product.name,
          quantity: product.maxStock - product.currentStock,
          unitPrice: product.cost,
          totalPrice: (product.maxStock - product.currentStock) * product.cost,
        });
        productsBySupplier.set(product.supplierId, items);
      }
    });

    const drafts: OrderDraft[] = Array.from(productsBySupplier.entries()).map(([supplierId, items]) => ({
      supplierId,
      items,
      totalAmount: items.reduce((sum, item) => sum + item.totalPrice, 0),
    }));

    setOrderDrafts(drafts);
    onOpen();
  };

  const sendOrder = (draft: OrderDraft) => {
    const supplier = mockSuppliers.find(s => s.id === draft.supplierId);
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: `ORD-2024-${String(orders.length + 1).padStart(3, '0')}`,
      supplierId: draft.supplierId,
      supplierName: supplier?.name || '',
      items: draft.items,
      totalAmount: draft.totalAmount,
      status: 'ordered',
      orderDate: new Date(),
      expectedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    };

    setOrders([newOrder, ...orders]);
    setOrderDrafts(orderDrafts.filter(d => d.supplierId !== draft.supplierId));

      toast.create({
      title: '発注完了',
      description: `${supplier?.name}への発注を送信しました`,
      duration: 3000,
    });

    if (orderDrafts.length === 1) {
      onClose();
      setSelectedProducts(new Set());
    }
  };

  const orderColumns: Column<Order>[] = [
    {
      key: 'orderNumber',
      label: '発注番号',
      accessor: (item) => item.orderNumber,
      sortable: true,
    },
    {
      key: 'orderDate',
      label: '発注日',
      accessor: (item) => formatDate(item.orderDate),
      sortable: true,
    },
    {
      key: 'supplierName',
      label: '仕入先',
      accessor: (item) => item.supplierName,
      sortable: true,
    },
    {
      key: 'itemCount',
      label: '品目数',
      accessor: (item) => `${item.items.length}件`,
      align: 'right',
    },
    {
      key: 'totalAmount',
      label: '合計金額',
      accessor: (item) => formatCurrency(item.totalAmount),
      align: 'right',
      sortable: true,
    },
    {
      key: 'expectedDate',
      label: '納品予定日',
      accessor: (item) => item.expectedDate ? formatDate(item.expectedDate) : '-',
    },
    {
      key: 'status',
      label: 'ステータス',
      accessor: (item) => {
        const statusMap = {
          'draft': { label: '下書き', color: 'gray', icon: FiFileText },
          'ordered': { label: '発注済', color: 'blue', icon: FiClock },
          'received': { label: '納品済', color: 'green', icon: FiCheckCircle },
          'cancelled': { label: 'キャンセル', color: 'red', icon: FiXCircle },
        };
        const status = statusMap[item.status];
        const Icon = status.icon;
        return (
          <Badge colorScheme={status.color}>
              <HStack gap={1}>
              <Icon size={12} />
              <Text>{status.label}</Text>
            </HStack>
          </Badge>
        );
      },
    },
  ];

  const orderActions = [
    {
      label: '詳細',
      icon: <FiEdit />,
      onClick: (item: Order) => {
          toast.create({
          title: '発注詳細',
          description: `発注番号: ${item.orderNumber}`,
          duration: 3000,
        });
      },
    },
    {
      label: 'キャンセル',
      icon: <FiXCircle />,
      onClick: (item: Order) => {
          toast.create({
          title: '発注キャンセル',
          description: `${item.orderNumber}をキャンセルしました`,
          duration: 3000,
        });
      },
      color: 'red.500',
      isDisabled: (item: Order) => item.status !== 'ordered',
    },
  ];

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">発注管理</Heading>
        <Button
          colorScheme="primary"
          onClick={createOrderDraft}
          disabled={selectedProducts.size === 0}
        >
            <FiPlus/> 発注書作成 ({selectedProducts.size})
        </Button>
      </Flex>

        <SimpleGrid columns={{base: 1, md: 4}} gap={4} mb={6}>
            <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
                <Text fontSize="sm" color="gray.500">発注必要商品</Text>
                <Text fontSize="2xl" fontWeight="bold" color="red.500">{lowStockProducts.length}</Text>
                <Text fontSize="xs" color="gray.500">在庫不足</Text>
            </Box>
            <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
                <Text fontSize="sm" color="gray.500">進行中の発注</Text>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
            {orders.filter(o => o.status === 'ordered').length}
                </Text>
                <Text fontSize="xs" color="gray.500">納品待ち</Text>
            </Box>
            <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
                <Text fontSize="sm" color="gray.500">今月の発注額</Text>
                <Text fontSize="2xl" fontWeight="bold">{formatCurrency(85000)}</Text>
                <Text fontSize="xs" color="gray.500">12月分</Text>
            </Box>
            <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
                <Text fontSize="sm" color="gray.500">平均リードタイム</Text>
                <Text fontSize="2xl" fontWeight="bold">2.5日</Text>
                <Text fontSize="xs" color="gray.500">発注から納品まで</Text>
            </Box>
      </SimpleGrid>

        <TabsRoot colorScheme="primary">
            <TabsList>
                <TabsTrigger value="required">
            <HStack>
              <FiAlertCircle />
              <Text>発注が必要な商品</Text>
              {lowStockProducts.length > 0 && (
                <Badge colorScheme="red">{lowStockProducts.length}</Badge>
              )}
            </HStack>
                </TabsTrigger>
                <TabsTrigger value="history">
            <HStack>
              <FiShoppingCart />
              <Text>発注履歴</Text>
            </HStack>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="required">
                <Card.Root>
                    <Card.Body>
                {lowStockProducts.length > 0 ? (
                  <>
                    <Flex justify="space-between" align="center" mb={4}>
                      <Text fontSize="sm" color="gray.600">
                        在庫が発注点を下回っている商品
                      </Text>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleSelectAll}
                      >
                        {selectedProducts.size === lowStockProducts.length ? '選択解除' : '全て選択'}
                      </Button>
                    </Flex>
                      <Table.Root size="sm">
                          <Table.Header>
                              <Table.Row>
                                  <Table.ColumnHeader width="40px">
                                      <Checkbox.Root
                                          checked={selectedProducts.size === lowStockProducts.length}
                                          onCheckedChange={handleSelectAll}
                                      >
                                          <Checkbox.Indicator/>
                                      </Checkbox.Root>
                                  </Table.ColumnHeader>
                                  <Table.ColumnHeader>商品名</Table.ColumnHeader>
                                  <Table.ColumnHeader>仕入先</Table.ColumnHeader>
                                  <Table.ColumnHeader textAlign="right">現在庫</Table.ColumnHeader>
                                  <Table.ColumnHeader textAlign="right">発注点</Table.ColumnHeader>
                                  <Table.ColumnHeader textAlign="right">推奨発注量</Table.ColumnHeader>
                                  <Table.ColumnHeader textAlign="right">予想金額</Table.ColumnHeader>
                                  <Table.ColumnHeader>優先度</Table.ColumnHeader>
                              </Table.Row>
                          </Table.Header>
                          <Table.Body>
                          {lowStockProducts.map((product) => {
                            const supplier = mockSuppliers.find(s => s.id === product.supplierId);
                            const orderQuantity = product.maxStock - product.currentStock;
                            const estimatedCost = orderQuantity * product.cost;
                            const priority = product.currentStock === 0 ? 'high' : 
                                           product.currentStock < product.minStock * 0.5 ? 'medium' : 'low';
                            
                            return (
                                <Table.Row key={product.id}>
                                    <Table.Cell>
                                        <Checkbox.Root
                                            checked={selectedProducts.has(product.id)}
                                            onCheckedChange={() => handleSelectProduct(product.id)}
                                        >
                                            <Checkbox.Indicator/>
                                        </Checkbox.Root>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <VStack align="start" gap={0}>
                                    <Text fontWeight="medium">{product.name}</Text>
                                    <Text fontSize="xs" color="gray.500">{product.code}</Text>
                                  </VStack>
                                    </Table.Cell>
                                    <Table.Cell>{supplier?.name || '-'}</Table.Cell>
                                    <Table.Cell textAlign="right">
                                  <Text color={product.currentStock === 0 ? 'red.500' : 'orange.500'}>
                                    {formatQuantity(product.currentStock, product.unit)}
                                  </Text>
                                    </Table.Cell>
                                    <Table.Cell
                                        textAlign="right">{formatQuantity(product.minStock, product.unit)}</Table.Cell>
                                    <Table.Cell textAlign="right" fontWeight="bold">
                                  {formatQuantity(orderQuantity, product.unit)}
                                    </Table.Cell>
                                    <Table.Cell textAlign="right">{formatCurrency(estimatedCost)}</Table.Cell>
                                    <Table.Cell>
                                  <Badge colorScheme={
                                    priority === 'high' ? 'red' : 
                                    priority === 'medium' ? 'orange' : 'yellow'
                                  }>
                                    {priority === 'high' ? '緊急' : 
                                     priority === 'medium' ? '中' : '低'}
                                  </Badge>
                                    </Table.Cell>
                                </Table.Row>
                            );
                          })}
                          </Table.Body>
                      </Table.Root>
                  </>
                ) : (
                    <Alert.Root status="success">
                        <Alert.Indicator/>
                    <Box>
                        <Alert.Title>発注が必要な商品はありません</Alert.Title>
                        <Alert.Description>
                        全ての商品の在庫が適正レベルです
                        </Alert.Description>
                    </Box>
                    </Alert.Root>
                )}
                    </Card.Body>
                </Card.Root>
            </TabsContent>

            <TabsContent value="history">
                <Card.Root>
                    <Card.Body>
                <DataTable
                  data={orders}
                  columns={orderColumns}
                  searchable
                  sortable
                  paginated
                  pageSize={10}
                  actions={orderActions}
                />
                    </Card.Body>
                </Card.Root>
            </TabsContent>
        </TabsRoot>

        <DialogRoot open={isOpen} onOpenChange={(details) => setIsOpen(details.open)} size="xl">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>発注書確認</DialogTitle>
                    <DialogCloseTrigger/>
                </DialogHeader>
                <DialogBody>
                    <VStack align="stretch" gap={4}>
              {orderDrafts.map((draft) => {
                const supplier = mockSuppliers.find(s => s.id === draft.supplierId);
                return (
                    <Card.Root key={draft.supplierId}>
                        <Card.Header>
                      <Flex justify="space-between" align="center">
                        <Heading size="sm">{supplier?.name}</Heading>
                        <Badge colorScheme="blue">
                          {draft.items.length}品目
                        </Badge>
                      </Flex>
                        </Card.Header>
                        <Card.Body>
                            <Box mb={4}>
                                <Table.Root size="sm">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeader>商品名</Table.ColumnHeader>
                                            <Table.ColumnHeader textAlign="right">数量</Table.ColumnHeader>
                                            <Table.ColumnHeader textAlign="right">単価</Table.ColumnHeader>
                                            <Table.ColumnHeader textAlign="right">金額</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                            {draft.items.map((item) => (
                                <Table.Row key={item.productId}>
                                    <Table.Cell>{item.productName}</Table.Cell>
                                    <Table.Cell textAlign="right">{item.quantity}</Table.Cell>
                                    <Table.Cell textAlign="right">{formatCurrency(item.unitPrice)}</Table.Cell>
                                    <Table.Cell textAlign="right">{formatCurrency(item.totalPrice)}</Table.Cell>
                                </Table.Row>
                            ))}
                                        <Table.Row fontWeight="bold">
                                            <Table.Cell colSpan={3}>合計</Table.Cell>
                                            <Table.Cell
                                                textAlign="right">{formatCurrency(draft.totalAmount)}</Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table.Root>
                            </Box>
                      <Button
                        colorScheme="primary"
                        size="sm"
                        width="full"
                        onClick={() => sendOrder(draft)}
                      >
                          <FiSend/> この仕入先に発注
                      </Button>
                        </Card.Body>
                    </Card.Root>
                );
              })}
            </VStack>
                </DialogBody>
                <DialogFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              キャンセル
            </Button>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    </Box>
  );
};