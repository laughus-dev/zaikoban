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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Checkbox,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
} from '@chakra-ui/react';
import {
  FiShoppingCart,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiPlus,
  FiSend,
  FiFileText,
  FiTrash2,
  FiEdit,
} from 'react-icons/fi';
import { DataTable, Column } from '../components/common/DataTable';
import { FormField } from '../components/common/FormField';
import { Product, Order, OrderItem, Supplier } from '../types';
import { mockProducts, mockSuppliers } from '../data/mockData';
import { formatCurrency, formatQuantity, formatDate } from '../utils/formatters';
import { calculateReorderPoint } from '../utils/calculations';

interface OrderDraft {
  supplierId: string;
  items: OrderItem[];
  totalAmount: number;
}

export const Orders: React.FC = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [orderDrafts, setOrderDrafts] = useState<OrderDraft[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

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
      toast({
        title: 'エラー',
        description: '商品を選択してください',
        status: 'error',
        duration: 3000,
        isClosable: true,
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
    
    toast({
      title: '発注完了',
      description: `${supplier?.name}への発注を送信しました`,
      status: 'success',
      duration: 3000,
      isClosable: true,
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
            <HStack spacing={1}>
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
        toast({
          title: '発注詳細',
          description: `発注番号: ${item.orderNumber}`,
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      },
    },
    {
      label: 'キャンセル',
      icon: <FiXCircle />,
      onClick: (item: Order) => {
        toast({
          title: '発注キャンセル',
          description: `${item.orderNumber}をキャンセルしました`,
          status: 'warning',
          duration: 3000,
          isClosable: true,
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
          leftIcon={<FiPlus />}
          colorScheme="primary"
          onClick={createOrderDraft}
          isDisabled={selectedProducts.size === 0}
        >
          発注書作成 ({selectedProducts.size})
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={6}>
        <Stat>
          <StatLabel>発注必要商品</StatLabel>
          <StatNumber color="red.500">{lowStockProducts.length}</StatNumber>
          <StatHelpText>在庫不足</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>進行中の発注</StatLabel>
          <StatNumber color="blue.500">
            {orders.filter(o => o.status === 'ordered').length}
          </StatNumber>
          <StatHelpText>納品待ち</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>今月の発注額</StatLabel>
          <StatNumber>{formatCurrency(85000)}</StatNumber>
          <StatHelpText>12月分</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>平均リードタイム</StatLabel>
          <StatNumber>2.5日</StatNumber>
          <StatHelpText>発注から納品まで</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Tabs colorScheme="primary">
        <TabList>
          <Tab>
            <HStack>
              <FiAlertCircle />
              <Text>発注が必要な商品</Text>
              {lowStockProducts.length > 0 && (
                <Badge colorScheme="red">{lowStockProducts.length}</Badge>
              )}
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <FiShoppingCart />
              <Text>発注履歴</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Card>
              <CardBody>
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
                    <TableContainer>
                      <Table size="sm">
                        <Thead>
                          <Tr>
                            <Th width="40px">
                              <Checkbox
                                isChecked={selectedProducts.size === lowStockProducts.length}
                                isIndeterminate={selectedProducts.size > 0 && selectedProducts.size < lowStockProducts.length}
                                onChange={handleSelectAll}
                              />
                            </Th>
                            <Th>商品名</Th>
                            <Th>仕入先</Th>
                            <Th isNumeric>現在庫</Th>
                            <Th isNumeric>発注点</Th>
                            <Th isNumeric>推奨発注量</Th>
                            <Th isNumeric>予想金額</Th>
                            <Th>優先度</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {lowStockProducts.map((product) => {
                            const supplier = mockSuppliers.find(s => s.id === product.supplierId);
                            const orderQuantity = product.maxStock - product.currentStock;
                            const estimatedCost = orderQuantity * product.cost;
                            const priority = product.currentStock === 0 ? 'high' : 
                                           product.currentStock < product.minStock * 0.5 ? 'medium' : 'low';
                            
                            return (
                              <Tr key={product.id}>
                                <Td>
                                  <Checkbox
                                    isChecked={selectedProducts.has(product.id)}
                                    onChange={() => handleSelectProduct(product.id)}
                                  />
                                </Td>
                                <Td>
                                  <VStack align="start" spacing={0}>
                                    <Text fontWeight="medium">{product.name}</Text>
                                    <Text fontSize="xs" color="gray.500">{product.code}</Text>
                                  </VStack>
                                </Td>
                                <Td>{supplier?.name || '-'}</Td>
                                <Td isNumeric>
                                  <Text color={product.currentStock === 0 ? 'red.500' : 'orange.500'}>
                                    {formatQuantity(product.currentStock, product.unit)}
                                  </Text>
                                </Td>
                                <Td isNumeric>{formatQuantity(product.minStock, product.unit)}</Td>
                                <Td isNumeric fontWeight="bold">
                                  {formatQuantity(orderQuantity, product.unit)}
                                </Td>
                                <Td isNumeric>{formatCurrency(estimatedCost)}</Td>
                                <Td>
                                  <Badge colorScheme={
                                    priority === 'high' ? 'red' : 
                                    priority === 'medium' ? 'orange' : 'yellow'
                                  }>
                                    {priority === 'high' ? '緊急' : 
                                     priority === 'medium' ? '中' : '低'}
                                  </Badge>
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </>
                ) : (
                  <Alert status="success">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>発注が必要な商品はありません</AlertTitle>
                      <AlertDescription>
                        全ての商品の在庫が適正レベルです
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Card>
              <CardBody>
                <DataTable
                  data={orders}
                  columns={orderColumns}
                  searchable
                  sortable
                  paginated
                  pageSize={10}
                  actions={orderActions}
                />
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>発注書確認</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              {orderDrafts.map((draft) => {
                const supplier = mockSuppliers.find(s => s.id === draft.supplierId);
                return (
                  <Card key={draft.supplierId}>
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Heading size="sm">{supplier?.name}</Heading>
                        <Badge colorScheme="blue">
                          {draft.items.length}品目
                        </Badge>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <TableContainer mb={4}>
                        <Table size="sm">
                          <Thead>
                            <Tr>
                              <Th>商品名</Th>
                              <Th isNumeric>数量</Th>
                              <Th isNumeric>単価</Th>
                              <Th isNumeric>金額</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {draft.items.map((item) => (
                              <Tr key={item.productId}>
                                <Td>{item.productName}</Td>
                                <Td isNumeric>{item.quantity}</Td>
                                <Td isNumeric>{formatCurrency(item.unitPrice)}</Td>
                                <Td isNumeric>{formatCurrency(item.totalPrice)}</Td>
                              </Tr>
                            ))}
                            <Tr fontWeight="bold">
                              <Td colSpan={3}>合計</Td>
                              <Td isNumeric>{formatCurrency(draft.totalAmount)}</Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TableContainer>
                      <Button
                        leftIcon={<FiSend />}
                        colorScheme="primary"
                        size="sm"
                        width="full"
                        onClick={() => sendOrder(draft)}
                      >
                        この仕入先に発注
                      </Button>
                    </CardBody>
                  </Card>
                );
              })}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              キャンセル
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};