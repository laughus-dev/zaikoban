import React, {useState} from 'react';
import {
    Badge,
    Box,
    Button,
    createToaster,
    DialogBody,
    DialogContent,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    Heading,
    HStack,
    Image,
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
import {mockCategories, mockProducts} from '../data/mockData';
import type {Product} from '../types';
import {formatCurrency, formatDate, formatQuantity, isExpiringSoon} from '../utils/formatters';
import {calculateStockLevel} from '../utils/calculations';
import {STOCK_STATUS} from '../config/constants';

export const InventoryList: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [open, setOpen] = useState(false);
  const toaster = createToaster({
    placement: 'top',
  });

  const columns: Column<Product>[] = [
    {
      key: 'image',
      label: '',
      accessor: (item) => (
        <Image
          src={item.imageUrl || 'https://via.placeholder.com/50'}
          alt={item.name}
          boxSize="40px"
          objectFit="cover"
          borderRadius="md"
        />
      ),
      width: '60px',
    },
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

  const handleEdit = (product: Product) => {
    toaster.create({
      title: '編集画面',
      description: `${product.name}の編集画面を開きます`,
      duration: 2000,
    });
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
            >
                <FiPlus/> 商品追加
            </Button>
          </HStack>
        </HStack>

        <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
          <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
            <Text fontSize="sm" color="gray.500">総商品数</Text>
            <Text fontSize="2xl" fontWeight="bold">{mockProducts.length}</Text>
          </Box>
          <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
            <Text fontSize="sm" color="gray.500">在庫総額</Text>
            <Text fontSize="2xl" fontWeight="bold">
              {formatCurrency(
                mockProducts.reduce((sum, p) => sum + p.currentStock * p.cost, 0)
              )}
            </Text>
          </Box>
          <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
            <Text fontSize="sm" color="gray.500">在庫不足</Text>
            <Text fontSize="2xl" fontWeight="bold" color="orange.500">
              {mockProducts.filter(p => p.status === 'low').length}件
            </Text>
          </Box>
          <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
            <Text fontSize="sm" color="gray.500">期限切れ間近</Text>
            <Text fontSize="2xl" fontWeight="bold" color="red.500">
              {mockProducts.filter(p => p.expiryDate && isExpiringSoon(p.expiryDate)).length}件
            </Text>
          </Box>
        </SimpleGrid>

          <TabsRoot colorPalette="brand">
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
                      data={mockProducts}
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
                          data={mockProducts.filter(p => p.categoryId === category.id)}
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedProduct?.name}</DialogTitle>
                </DialogHeader>
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
        </DialogRoot>
    </Box>
  );
};