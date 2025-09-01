import React, { useState } from 'react';
import {
  Box,
  Heading,
  HStack,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Text,
  VStack,
  useToast,
  Card,
  CardBody,
  Badge,
  Divider,
  IconButton,
  Flex,
  Select,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import {
  FiPlus,
  FiMinus,
  FiPackage,
  FiTruck,
  FiTrash2,
  FiSave,
  FiRefreshCw,
} from 'react-icons/fi';
import { DataTable, Column } from '../components/common/DataTable';
import { FormField } from '../components/common/FormField';
import { Product, StockTransaction, Supplier } from '../types';
import { mockProducts, mockSuppliers } from '../data/mockData';
import { formatCurrency, formatQuantity, formatDate } from '../utils/formatters';

interface BatchItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  note?: string;
}

export const StockInOut: React.FC = () => {
  const [transactionType, setTransactionType] = useState<'in' | 'out'>('in');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const toast = useToast();

  const mockTransactions: StockTransaction[] = [
    {
      id: '1',
      productId: 'p1',
      productName: '和牛サーロイン',
      type: 'in',
      quantity: 10,
      unitPrice: 3000,
      totalAmount: 30000,
      date: new Date('2024-12-01'),
      userId: 'user1',
      userName: '田中太郎',
      reason: '定期入荷',
    },
    {
      id: '2',
      productId: 'p2',
      productName: 'トマト',
      type: 'out',
      quantity: 5,
      unitPrice: 200,
      totalAmount: 1000,
      date: new Date('2024-12-02'),
      userId: 'user1',
      userName: '田中太郎',
      reason: '料理使用',
    },
    {
      id: '3',
      productId: 'p3',
      productName: 'キャベツ',
      type: 'disposal',
      quantity: 2,
      unitPrice: 150,
      totalAmount: 300,
      date: new Date('2024-12-03'),
      userId: 'user2',
      userName: '佐藤花子',
      reason: '賞味期限切れ',
    },
  ];

  const [transactions, setTransactions] = useState<StockTransaction[]>(mockTransactions);

  const handleAddToBatch = () => {
    if (!selectedProductId || quantity <= 0) {
      toast({
        title: 'エラー',
        description: '商品と数量を入力してください',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const product = mockProducts.find(p => p.id === selectedProductId);
    if (!product) return;

    const newItem: BatchItem = {
      id: `batch-${Date.now()}`,
      productId: selectedProductId,
      quantity,
      unitPrice: transactionType === 'in' ? unitPrice : product.price,
      totalAmount: quantity * (transactionType === 'in' ? unitPrice : product.price),
      note,
    };

    setBatchItems([...batchItems, newItem]);
    setSelectedProductId('');
    setQuantity(0);
    setUnitPrice(0);
    setNote('');

    toast({
      title: '追加しました',
      description: `${product.name}を追加しました`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleRemoveFromBatch = (id: string) => {
    setBatchItems(batchItems.filter(item => item.id !== id));
  };

  const handleSaveBatch = () => {
    if (batchItems.length === 0) {
      toast({
        title: 'エラー',
        description: '商品を追加してください',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newTransactions: StockTransaction[] = batchItems.map(item => {
      const product = mockProducts.find(p => p.id === item.productId);
      return {
        id: `trans-${Date.now()}-${Math.random()}`,
        productId: item.productId,
        productName: product?.name || '',
        type: transactionType,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalAmount: item.totalAmount,
        reason: item.note,
        date: new Date(),
        userId: 'user1',
        userName: '現在のユーザー',
      };
    });

    setTransactions([...newTransactions, ...transactions]);
    setBatchItems([]);
    
    toast({
      title: transactionType === 'in' ? '入庫登録完了' : '出庫登録完了',
      description: `${batchItems.length}件の商品を登録しました`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const transactionColumns: Column<StockTransaction>[] = [
    {
      key: 'date',
      label: '日時',
      accessor: (item) => formatDate(item.date),
      sortable: true,
    },
    {
      key: 'type',
      label: '種別',
      accessor: (item) => {
        const typeMap = {
          'in': { label: '入庫', color: 'green' },
          'out': { label: '出庫', color: 'red' },
          'disposal': { label: '廃棄', color: 'orange' },
          'adjustment': { label: '調整', color: 'blue' },
        };
        const type = typeMap[item.type];
        return <Badge colorScheme={type.color}>{type.label}</Badge>;
      },
    },
    {
      key: 'productName',
      label: '商品名',
      accessor: (item) => item.productName,
      sortable: true,
    },
    {
      key: 'quantity',
      label: '数量',
      accessor: (item) => formatQuantity(item.quantity, 'kg'),
      align: 'right',
    },
    {
      key: 'unitPrice',
      label: '単価',
      accessor: (item) => formatCurrency(item.unitPrice),
      align: 'right',
    },
    {
      key: 'totalAmount',
      label: '金額',
      accessor: (item) => formatCurrency(item.totalAmount),
      align: 'right',
    },
    {
      key: 'reason',
      label: '備考',
      accessor: (item) => item.reason || '-',
    },
    {
      key: 'userName',
      label: '登録者',
      accessor: (item) => item.userName,
    },
  ];

  const productOptions = mockProducts.map(p => ({
    value: p.id,
    label: `${p.code} - ${p.name}`,
  }));

  const supplierOptions = mockSuppliers.map(s => ({
    value: s.id,
    label: s.name,
  }));

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>入出庫登録</Heading>

      <Tabs
        index={transactionType === 'in' ? 0 : 1}
        onChange={(index) => setTransactionType(index === 0 ? 'in' : 'out')}
        colorScheme="primary"
      >
        <TabList>
          <Tab>
            <HStack>
              <FiPlus />
              <Text>入庫</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack>
              <FiMinus />
              <Text>出庫</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Card mb={6}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <FormField
                    type="select"
                    label="仕入先"
                    name="supplierId"
                    value={selectedSupplierId}
                    onChange={setSelectedSupplierId}
                    options={supplierOptions}
                    placeholder="仕入先を選択"
                  />

                  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                    <FormField
                      type="select"
                      label="商品"
                      name="productId"
                      value={selectedProductId}
                      onChange={setSelectedProductId}
                      options={productOptions}
                      placeholder="商品を選択"
                      isRequired
                    />
                    <FormField
                      type="number"
                      label="数量"
                      name="quantity"
                      value={quantity}
                      onChange={setQuantity}
                      min={0}
                      step={0.1}
                      isRequired
                    />
                    <FormField
                      type="number"
                      label="仕入単価"
                      name="unitPrice"
                      value={unitPrice}
                      onChange={setUnitPrice}
                      min={0}
                      isRequired
                    />
                    <FormControl>
                      <FormLabel>備考</FormLabel>
                      <Textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="備考を入力"
                        rows={1}
                      />
                    </FormControl>
                  </SimpleGrid>

                  <Button
                    leftIcon={<FiPlus />}
                    colorScheme="blue"
                    onClick={handleAddToBatch}
                    alignSelf="flex-start"
                  >
                    リストに追加
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Card mb={6}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    <FormField
                      type="select"
                      label="商品"
                      name="productId"
                      value={selectedProductId}
                      onChange={setSelectedProductId}
                      options={productOptions}
                      placeholder="商品を選択"
                      isRequired
                    />
                    <FormField
                      type="number"
                      label="数量"
                      name="quantity"
                      value={quantity}
                      onChange={setQuantity}
                      min={0}
                      step={0.1}
                      isRequired
                    />
                    <FormControl>
                      <FormLabel>理由</FormLabel>
                      <Select
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="理由を選択"
                      >
                        <option value="料理使用">料理使用</option>
                        <option value="販売">販売</option>
                        <option value="サンプル">サンプル</option>
                        <option value="その他">その他</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>

                  <Button
                    leftIcon={<FiPlus />}
                    colorScheme="blue"
                    onClick={handleAddToBatch}
                    alignSelf="flex-start"
                  >
                    リストに追加
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {batchItems.length > 0 && (
        <Card mb={6}>
          <CardBody>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">登録予定リスト</Heading>
              <HStack>
                <Button
                  leftIcon={<FiRefreshCw />}
                  variant="outline"
                  size="sm"
                  onClick={() => setBatchItems([])}
                >
                  クリア
                </Button>
                <Button
                  leftIcon={<FiSave />}
                  colorScheme="primary"
                  size="sm"
                  onClick={handleSaveBatch}
                >
                  一括登録
                </Button>
              </HStack>
            </Flex>

            <TableContainer>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>商品名</Th>
                    <Th isNumeric>数量</Th>
                    <Th isNumeric>単価</Th>
                    <Th isNumeric>金額</Th>
                    <Th>備考</Th>
                    <Th width="50px"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {batchItems.map(item => {
                    const product = mockProducts.find(p => p.id === item.productId);
                    return (
                      <Tr key={item.id}>
                        <Td>{product?.name}</Td>
                        <Td isNumeric>{formatQuantity(item.quantity, product?.unit || 'kg')}</Td>
                        <Td isNumeric>{formatCurrency(item.unitPrice)}</Td>
                        <Td isNumeric>{formatCurrency(item.totalAmount)}</Td>
                        <Td>{item.note || '-'}</Td>
                        <Td>
                          <IconButton
                            aria-label="削除"
                            icon={<FiTrash2 />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleRemoveFromBatch(item.id)}
                          />
                        </Td>
                      </Tr>
                    );
                  })}
                  <Tr fontWeight="bold">
                    <Td colSpan={3}>合計</Td>
                    <Td isNumeric>
                      {formatCurrency(batchItems.reduce((sum, item) => sum + item.totalAmount, 0))}
                    </Td>
                    <Td colSpan={2}></Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          <Heading size="md" mb={4}>入出庫履歴</Heading>
          <DataTable
            data={transactions}
            columns={transactionColumns}
            searchable
            sortable
            paginated
            pageSize={10}
          />
        </CardBody>
      </Card>
    </Box>
  );
};