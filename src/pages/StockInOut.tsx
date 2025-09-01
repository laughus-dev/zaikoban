import React, {useState} from 'react';
import {
    Badge,
    Box,
    Button,
    Card,
    createToaster,
    Field,
    Flex,
    Heading,
    HStack,
    IconButton,
    Input,
    SimpleGrid,
    Table,
    TabsContent,
    TabsList,
    TabsRoot,
    TabsTrigger,
    Text,
    Textarea,
    VStack,
} from '@chakra-ui/react';
import {NativeSelect} from '@chakra-ui/react/native-select';
import {FiMinus, FiPlus, FiRefreshCw, FiTrash2,} from 'react-icons/fi';
import type {Column} from '../components/common/DataTable';
import {DataTable} from '../components/common/DataTable';
import {FormField} from '../components/common/FormField';
import type {StockTransaction} from '../types';
import {mockProducts, mockSuppliers} from '../data/mockData';
import {formatCurrency, formatDate, formatQuantity} from '../utils/formatters';

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
    const toaster = createToaster({
        placement: 'top',
    });

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
        toaster.create({
        title: 'エラー',
        description: '商品と数量を入力してください',
        duration: 3000,
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

      toaster.create({
      title: '追加しました',
      description: `${product.name}を追加しました`,
      duration: 2000,
    });
  };

  const handleRemoveFromBatch = (id: string) => {
    setBatchItems(batchItems.filter(item => item.id !== id));
  };

  const handleSaveBatch = () => {
    if (batchItems.length === 0) {
        toaster.create({
        title: 'エラー',
        description: '商品を追加してください',
        duration: 3000,
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

      toaster.create({
      title: transactionType === 'in' ? '入庫登録完了' : '出庫登録完了',
      description: `${batchItems.length}件の商品を登録しました`,
      duration: 3000,
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


  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>入出庫登録</Heading>

        <TabsRoot
            value={transactionType === 'in' ? 'in' : 'out'}
            onValueChange={(details: { value: string }) => setTransactionType(details.value as 'in' | 'out')}
            colorPalette="primary"
        >
            <TabsList>
                <TabsTrigger value="in">
            <HStack>
              <FiPlus />
              <Text>入庫</Text>
            </HStack>
                </TabsTrigger>
                <TabsTrigger value="out">
            <HStack>
              <FiMinus />
              <Text>出庫</Text>
            </HStack>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="in">
                    <Card.Root mb={6}>
                        <Card.Body>
                            <VStack gap={4} align="stretch">
                                <Field.Root>
                                    <Field.Label>仕入先</Field.Label>
                                    <NativeSelect.Root>
                                        <NativeSelect.Field
                                            placeholder="仕入先を選択"
                                            value={selectedSupplierId}
                                            onChange={(e) => setSelectedSupplierId(e.target.value)}
                                        />
                                        {mockSuppliers.map((supplier) => (
                                            <option key={supplier.id} value={supplier.id}>
                                                {supplier.name}
                                            </option>
                                        ))}
                                    </NativeSelect.Root>
                                </Field.Root>

                                <SimpleGrid columns={{base: 1, md: 2, lg: 4}} gap={4}>
                                    <Field.Root>
                                        <Field.Label>商品 *</Field.Label>
                                        <NativeSelect.Root>
                                            <NativeSelect.Field
                                                placeholder="商品を選択"
                                                value={selectedProductId}
                                                onChange={(e) => setSelectedProductId(e.target.value)}
                                            />
                                            {mockProducts.map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name}
                                                </option>
                                            ))}
                                        </NativeSelect.Root>
                                    </Field.Root>
                                    <Field.Root>
                                        <Field.Label>数量 *</Field.Label>
                                        <Input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            min={0}
                                            step={0.1}
                                        />
                                    </Field.Root>
                                    <Field.Root>
                                        <Field.Label>仕入単価 *</Field.Label>
                                        <Input
                                            type="number"
                                            value={unitPrice}
                                            onChange={(e) => setUnitPrice(Number(e.target.value))}
                                            min={0}
                                        />
                                    </Field.Root>
                                    <Field.Root>
                                        <Field.Label>備考</Field.Label>
                      <Textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="備考を入力"
                        rows={1}
                      />
                                    </Field.Root>
                  </SimpleGrid>

                  <Button
                      colorScheme="blue"
                    onClick={handleAddToBatch}
                    alignSelf="flex-start"
                  >
                      <FiPlus/> リストに追加
                  </Button>
                </VStack>
                        </Card.Body>
                    </Card.Root>
            </TabsContent>

            <TabsContent value="out">
                    <Card.Root mb={6}>
                        <Card.Body>
                            <VStack gap={4} align="stretch">
                                <SimpleGrid columns={{base: 1, md: 2, lg: 3}} gap={4}>
                    <FormField
                      type="select"
                      label="商品"
                      name="productId"
                      value={selectedProductId}
                      onChange={(value) => setSelectedProductId(String(value))}
                      options={productOptions}
                      placeholder="商品を選択"
                      isRequired
                    />
                    <FormField
                      type="number"
                      label="数量"
                      name="quantity"
                      value={quantity}
                      onChange={(value) => setQuantity(Number(value))}
                      min={0}
                      step={0.1}
                      isRequired
                    />
                                    <Field.Root>
                                        <Field.Label>理由</Field.Label>
                                        <NativeSelect.Root>
                                            <NativeSelect.Field
                                                placeholder="理由を選択"
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                            >
                        <option value="料理使用">料理使用</option>
                        <option value="販売">販売</option>
                        <option value="サンプル">サンプル</option>
                        <option value="その他">その他</option>
                            </NativeSelect.Field>
                        </NativeSelect.Root>
                                    </Field.Root>
                  </SimpleGrid>

                  <Button
                      colorScheme="blue"
                    onClick={handleAddToBatch}
                    alignSelf="flex-start"
                  >
                      <FiPlus/> リストに追加
                  </Button>
                </VStack>
                        </Card.Body>
                    </Card.Root>
            </TabsContent>
        </TabsRoot>

      {batchItems.length > 0 && (
          <Card.Root mb={6}>
              <Card.Body>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">登録予定リスト</Heading>
              <HStack>
                <Button
                    variant="outline"
                  size="sm"
                  onClick={() => setBatchItems([])}
                >
                    <FiRefreshCw/> クリア
                </Button>
                <Button
                    colorScheme="primary"
                  size="sm"
                  onClick={handleSaveBatch}
                >
                  一括登録
                </Button>
              </HStack>
            </Flex>

                  <Table.ScrollArea>
                      <Table.Root size="sm">
                          <Table.Header>
                              <Table.Row>
                                  <Table.ColumnHeader>商品名</Table.ColumnHeader>
                                  <Table.ColumnHeader textAlign="end">数量</Table.ColumnHeader>
                                  <Table.ColumnHeader textAlign="end">単価</Table.ColumnHeader>
                                  <Table.ColumnHeader textAlign="end">金額</Table.ColumnHeader>
                                  <Table.ColumnHeader>備考</Table.ColumnHeader>
                                  <Table.ColumnHeader width="50px"></Table.ColumnHeader>
                              </Table.Row>
                          </Table.Header>
                          <Table.Body>
                  {batchItems.map(item => {
                    const product = mockProducts.find(p => p.id === item.productId);
                    return (
                        <Table.Row key={item.id}>
                            <Table.Cell>{product?.name}</Table.Cell>
                            <Table.Cell
                                textAlign="end">{formatQuantity(item.quantity, product?.unit || 'kg')}</Table.Cell>
                            <Table.Cell textAlign="end">{formatCurrency(item.unitPrice)}</Table.Cell>
                            <Table.Cell textAlign="end">{formatCurrency(item.totalAmount)}</Table.Cell>
                            <Table.Cell>{item.note || '-'}</Table.Cell>
                            <Table.Cell>
                          <IconButton
                            aria-label="削除"
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleRemoveFromBatch(item.id)}
                          >
                              <FiTrash2/>
                          </IconButton>
                            </Table.Cell>
                        </Table.Row>
                    );
                  })}
                              <Table.Row fontWeight="bold">
                                  <Table.Cell colSpan={3}>合計</Table.Cell>
                                  <Table.Cell textAlign="end">
                      {formatCurrency(batchItems.reduce((sum, item) => sum + item.totalAmount, 0))}
                                  </Table.Cell>
                                  <Table.Cell colSpan={2}></Table.Cell>
                              </Table.Row>
                          </Table.Body>
                      </Table.Root>
                  </Table.ScrollArea>
              </Card.Body>
          </Card.Root>
      )}

        <Card.Root>
            <Card.Body>
          <Heading size="md" mb={4}>入出庫履歴</Heading>
          <DataTable
            data={transactions}
            columns={transactionColumns}
            searchable
            sortable
            paginated
            pageSize={10}
          />
            </Card.Body>
        </Card.Root>
    </Box>
  );
};