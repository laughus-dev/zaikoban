import React, {useState} from 'react';
import {
    Badge,
    Box,
    Button,
    createToaster,
    DialogBackdrop,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogPositioner,
    DialogRoot,
    DialogTitle,
    Heading,
    HStack,
    Image,
    Input,
    SimpleGrid,
    TabsContent,
    TabsList,
    TabsRoot,
    TabsTrigger,
    Text,
    VStack,
} from '@chakra-ui/react';
import {FiDownload, FiEdit, FiEye, FiPlus, FiShoppingCart, FiTrash2, FiUpload,} from 'react-icons/fi';
import {type Column, DataTable} from '../components/common/DataTable';
import {FormField} from '../components/common/FormField';
import {mockCategories, mockProducts, mockSuppliers} from '../data/mockData';
import type {Product} from '../types';
import {formatCurrency, formatDate, formatQuantity, isExpiringSoon} from '../utils/formatters';
import {calculateStockLevel} from '../utils/calculations';
import {STOCK_STATUS} from '../config/constants';

export const InventoryList: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [open, setOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Product>>({});
    const [products, setProducts] = useState<Product[]>(mockProducts);
  const toaster = createToaster({
    placement: 'top',
  });

  const columns: Column<Product>[] = [
    {
      key: 'name',
      label: '商品名',
      accessor: (item) => (
        <VStack align="start" gap={0}>
          <Text fontWeight="medium">{item.name}</Text>
          <Text fontSize="xs" color="gray.500">
            {item.code}
          </Text>
        </VStack>
      ),
      sortable: true,
    },
    {
      key: 'category',
      label: 'カテゴリ',
      accessor: (item) => (
        <Badge colorScheme="gray">{item.categoryName}</Badge>
      ),
      sortable: true,
    },
    {
      key: 'currentStock',
      label: '在庫数',
      accessor: (item) => (
        <VStack align="end" gap={0}>
          <Text fontWeight="medium">
            {formatQuantity(item.currentStock, item.unit)}
          </Text>
          <Text fontSize="xs" color="gray.500">
            発注点: {item.minStock} {item.unit}
          </Text>
        </VStack>
      ),
      align: 'right',
      sortable: true,
    },
    {
      key: 'value',
      label: '在庫金額',
      accessor: (item) => formatCurrency(item.currentStock * item.cost),
      align: 'right',
      sortable: true,
    },
    {
      key: 'status',
      label: 'ステータス',
      accessor: (item) => {
        const level = calculateStockLevel(item);
        const status = STOCK_STATUS[level.toUpperCase() as keyof typeof STOCK_STATUS];
        
        let additionalBadge = null;
        if (item.expiryDate && isExpiringSoon(item.expiryDate)) {
          additionalBadge = (
            <Badge colorScheme="red" ml={1}>
              期限間近
            </Badge>
          );
        }
        
        return (
          <HStack>
            <Badge colorScheme={status.color}>{status.label}</Badge>
            {additionalBadge}
          </HStack>
        );
      },
    },
    {
      key: 'supplier',
      label: '仕入先',
      accessor: (item) => item.supplierName || '-',
    },
  ];

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
      setOpen(true);
  };

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAddMode(true);
        setFormData({
            name: '',
            code: `P${Date.now().toString().slice(-6)}`,
            barcode: '',
            categoryId: mockCategories[0]?.id || '',
            unit: 'kg',
            cost: 1000,
            price: 1500,
            minStock: 10,
            maxStock: 100,
            currentStock: 50,
            supplierId: mockSuppliers[0]?.id || '',
        });
        setIsEditOpen(true);
    };

  const handleEdit = (product: Product) => {
      setIsAddMode(false);
      setSelectedProduct(product);
      setFormData(product);
      setIsEditOpen(true);
  };

    const handleSave = () => {
        if (!formData.name) {
            toaster.create({
                title: '商品名を入力してください',
                status: 'error',
                duration: 3000,
            });
            return;
        }

        if (isAddMode) {
            const category = mockCategories.find(c => c.id === formData.categoryId);
            const supplier = mockSuppliers.find(s => s.id === formData.supplierId);

            const newProduct: Product = {
                id: `product-${Date.now()}`,
                name: formData.name || '',
                code: formData.code || '',
                barcode: formData.barcode || '',
                categoryId: formData.categoryId || '',
                categoryName: category?.name || '',
                unit: formData.unit || 'kg',
                cost: formData.cost || 0,
                price: formData.price || 0,
                minStock: formData.minStock || 0,
                maxStock: formData.maxStock || 0,
                currentStock: formData.currentStock || 0,
                supplierId: formData.supplierId || '',
                supplierName: supplier?.name || '',
                imageUrl: '',
                status: 'normal',
            };
            setProducts([...products, newProduct]);
            toaster.create({
                title: '商品を追加しました',
                status: 'success',
                duration: 3000,
            });
        } else if (selectedProduct) {
            const category = mockCategories.find(c => c.id === formData.categoryId);
            const supplier = mockSuppliers.find(s => s.id === formData.supplierId);

            setProducts(products.map(p =>
                p.id === selectedProduct.id ? {
                    ...p,
                    ...formData,
                    categoryName: category?.name || p.categoryName,
                    supplierName: supplier?.name || p.supplierName,
                } : p
            ));
            toaster.create({
                title: '商品を更新しました',
                duration: 3000,
            });
        }
        setIsEditOpen(false);
  };

  const handleDelete = (product: Product) => {
    toaster.create({
      title: '削除確認',
      description: `${product.name}を削除しますか？`,
      duration: 2000,
    });
  };

  const handleOrder = (product: Product) => {
    toaster.create({
      title: '発注画面',
      description: `${product.name}の発注画面を開きます`,
      duration: 2000,
    });
  };

  const actions = [
    {
      label: '詳細',
      icon: <FiEye />,
      onClick: handleViewDetails,
    },
    {
      label: '編集',
      icon: <FiEdit />,
      onClick: handleEdit,
    },
    {
      label: '発注',
      icon: <FiShoppingCart />,
      onClick: handleOrder,
      color: 'green.500',
    },
    {
      label: '削除',
      icon: <FiTrash2 />,
      onClick: handleDelete,
      color: 'red.500',
    },
  ];

  const filters = [
    { label: '在庫不足', value: 'low' },
    { label: '在庫過剰', value: 'excess' },
    { label: '期限切れ間近', value: 'expiring' },
  ];

  return (
    <Box p={{ base: 4, md: 6 }}>
      <VStack gap={6} align="stretch">
        <HStack justify="space-between" flexWrap="wrap">
          <Heading size="lg">在庫一覧</Heading>
          <HStack gap={2}>
            <Button
              variant="outline"
              size="sm"
            >
                <FiUpload/> インポート
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
                <FiDownload/> エクスポート
            </Button>
            <Button
              colorScheme="brand"
              size="sm"
              onClick={handleAdd}
            >
                <FiPlus/> 商品追加
            </Button>
          </HStack>
        </HStack>

        <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
          <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
            <Text fontSize="sm" color="gray.500">総商品数</Text>
              <Text fontSize="2xl" fontWeight="bold">{products.length}</Text>
          </Box>
          <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
            <Text fontSize="sm" color="gray.500">在庫総額</Text>
            <Text fontSize="2xl" fontWeight="bold">
              {formatCurrency(
                  products.reduce((sum, p) => sum + p.currentStock * p.cost, 0)
              )}
            </Text>
          </Box>
          <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
            <Text fontSize="sm" color="gray.500">在庫不足</Text>
            <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                {products.filter(p => p.status === 'low').length}件
            </Text>
          </Box>
          <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
            <Text fontSize="sm" color="gray.500">期限切れ間近</Text>
            <Text fontSize="2xl" fontWeight="bold" color="red.500">
                {products.filter(p => p.expiryDate && isExpiringSoon(p.expiryDate)).length}件
            </Text>
          </Box>
        </SimpleGrid>

          <TabsRoot colorPalette="brand" defaultValue="all">
              <TabsList>
                  <TabsTrigger value="all">すべて</TabsTrigger>
            {mockCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                <HStack gap={1}>
                  <Text>{category.icon}</Text>
                  <Text>{category.name}</Text>
                </HStack>
                </TabsTrigger>
            ))}
              </TabsList>

              <TabsContent value="all" px={0}>
                  <DataTable
                      data={products}
                      columns={columns}
                      searchable
                      searchPlaceholder="商品名・コードで検索"
                      filterable
                      filters={filters}
                      sortable
                      paginated
                      pageSize={10}
                      actions={actions}
                  />
              </TabsContent>
              {mockCategories.map((category) => (
                  <TabsContent key={category.id} value={category.id} px={0}>
                      <DataTable
                          data={products.filter(p => p.categoryId === category.id)}
                          columns={columns}
                          searchable
                          searchPlaceholder="商品名・コードで検索"
                          filterable
                          filters={filters}
                          sortable
                          paginated
                          pageSize={10}
                          actions={actions}
                      />
                  </TabsContent>
              ))}
          </TabsRoot>
      </VStack>

        <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)} size="xl">
            <DialogBackdrop/>
            <DialogPositioner>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedProduct?.name}</DialogTitle>
                    </DialogHeader>
                    <DialogCloseTrigger/>
                <DialogBody>
            {selectedProduct && (
              <VStack gap={4} align="stretch">
                <Image
                  src={selectedProduct.imageUrl || 'https://via.placeholder.com/300'}
                  alt={selectedProduct.name}
                  maxH="200px"
                  objectFit="cover"
                  borderRadius="lg"
                />
                <SimpleGrid columns={2} gap={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.500">商品コード</Text>
                    <Text fontWeight="medium">{selectedProduct.code}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">バーコード</Text>
                    <Text fontWeight="medium">{selectedProduct.barcode}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">カテゴリ</Text>
                    <Text fontWeight="medium">{selectedProduct.categoryName}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">単位</Text>
                    <Text fontWeight="medium">{selectedProduct.unit}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">現在庫</Text>
                    <Text fontWeight="medium">
                      {formatQuantity(selectedProduct.currentStock, selectedProduct.unit)}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">発注点</Text>
                    <Text fontWeight="medium">
                      {formatQuantity(selectedProduct.minStock, selectedProduct.unit)}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">原価</Text>
                    <Text fontWeight="medium">{formatCurrency(selectedProduct.cost)}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">売価</Text>
                    <Text fontWeight="medium">{formatCurrency(selectedProduct.price)}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">仕入先</Text>
                    <Text fontWeight="medium">{selectedProduct.supplierName}</Text>
                  </Box>
                  {selectedProduct.expiryDate && (
                    <Box>
                      <Text fontSize="sm" color="gray.500">賞味期限</Text>
                      <Text fontWeight="medium" color={isExpiringSoon(selectedProduct.expiryDate) ? 'red.500' : 'inherit'}>
                        {formatDate(selectedProduct.expiryDate)}
                      </Text>
                    </Box>
                  )}
                </SimpleGrid>
              </VStack>
            )}
                </DialogBody>
                </DialogContent>
            </DialogPositioner>
        </DialogRoot>

        <DialogRoot open={isEditOpen} onOpenChange={(details) => setIsEditOpen(details.open)} size="xl">
            <DialogBackdrop/>
            <DialogPositioner>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isAddMode ? '商品追加' : '商品編集'}
                        </DialogTitle>
                    </DialogHeader>
                    <DialogCloseTrigger/>
                    <DialogBody>
                        <VStack gap={4}>
                            <FormField label="商品名" required>
                                <Input
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="商品名を入力"
                                />
                            </FormField>

                            <HStack gap={4} width="100%">
                                <FormField label="商品コード" required>
                                    <Input
                                        value={formData.code || ''}
                                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                                        placeholder="P123456"
                                    />
                                </FormField>
                                <FormField label="バーコード">
                                    <Input
                                        value={formData.barcode || ''}
                                        onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                                        placeholder="4901234567890"
                                    />
                                </FormField>
                            </HStack>

                            <HStack gap={4} width="100%">
                                <FormField label="カテゴリ" required>
                                    <select
                                        value={formData.categoryId || ''}
                                        onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            borderRadius: '6px',
                                            border: '1px solid #e2e8f0'
                                        }}
                                    >
                                        {mockCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </FormField>
                                <FormField label="単位" required>
                                    <select
                                        value={formData.unit || 'kg'}
                                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            borderRadius: '6px',
                                            border: '1px solid #e2e8f0'
                                        }}
                                    >
                                        <option value="kg">kg</option>
                                        <option value="g">g</option>
                                        <option value="L">L</option>
                                        <option value="ml">ml</option>
                                        <option value="個">個</option>
                                        <option value="本">本</option>
                                        <option value="枚">枚</option>
                                        <option value="パック">パック</option>
                                        <option value="箱">箱</option>
                                    </select>
                                </FormField>
                            </HStack>

                            <HStack gap={4} width="100%">
                                <FormField label="現在庫">
                                    <Input
                                        type="number"
                                        value={formData.currentStock || 0}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            currentStock: Number(e.target.value)
                                        })}
                                    />
                                </FormField>
                                <FormField label="発注点">
                                    <Input
                                        type="number"
                                        value={formData.minStock || 0}
                                        onChange={(e) => setFormData({...formData, minStock: Number(e.target.value)})}
                                    />
                                </FormField>
                                <FormField label="最大在庫">
                                    <Input
                                        type="number"
                                        value={formData.maxStock || 0}
                                        onChange={(e) => setFormData({...formData, maxStock: Number(e.target.value)})}
                                    />
                                </FormField>
                            </HStack>

                            <HStack gap={4} width="100%">
                                <FormField label="原価">
                                    <Input
                                        type="number"
                                        value={formData.cost || 0}
                                        onChange={(e) => setFormData({...formData, cost: Number(e.target.value)})}
                                    />
                                </FormField>
                                <FormField label="売価">
                                    <Input
                                        type="number"
                                        value={formData.price || 0}
                                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                                    />
                                </FormField>
                            </HStack>

                            <FormField label="仕入先">
                                <select
                                    value={formData.supplierId || ''}
                                    onChange={(e) => setFormData({...formData, supplierId: e.target.value})}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0'
                                    }}
                                >
                                    {mockSuppliers.map(sup => (
                                        <option key={sup.id} value={sup.id}>{sup.name}</option>
                                    ))}
                                </select>
                            </FormField>
                        </VStack>
                    </DialogBody>
                    <DialogFooter>
                        <HStack justify="flex-end">
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                                キャンセル
                            </Button>
                            <Button colorScheme="brand" onClick={handleSave}>
                                {isAddMode ? '追加' : '更新'}
                            </Button>
                        </HStack>
                    </DialogFooter>
                </DialogContent>
            </DialogPositioner>
        </DialogRoot>
    </Box>
  );
};