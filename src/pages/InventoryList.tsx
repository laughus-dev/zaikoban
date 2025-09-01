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
  Badge,
  Image,
  Text,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  SimpleGrid,
  Flex,
  Icon,
  useToast,
} from '@chakra-ui/react';
import {
  FiPlus,
  FiDownload,
  FiUpload,
  FiEdit,
  FiTrash2,
  FiEye,
  FiShoppingCart,
} from 'react-icons/fi';
import { DataTable, Column } from '../components/common/DataTable';
import { mockProducts, mockCategories } from '../data/mockData';
import { Product } from '../types';
import { formatCurrency, formatQuantity, formatDate, isExpiringSoon } from '../utils/formatters';
import { calculateStockLevel } from '../utils/calculations';
import { STOCK_STATUS } from '../config/constants';

export const InventoryList: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

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
        <VStack align="start" spacing={0}>
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
        <VStack align="end" spacing={0}>
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
    onOpen();
  };

  const handleEdit = (product: Product) => {
    toast({
      title: '編集画面',
      description: `${product.name}の編集画面を開きます`,
      status: 'info',
      duration: 2000,
    });
  };

  const handleDelete = (product: Product) => {
    toast({
      title: '削除確認',
      description: `${product.name}を削除しますか？`,
      status: 'warning',
      duration: 2000,
    });
  };

  const handleOrder = (product: Product) => {
    toast({
      title: '発注画面',
      description: `${product.name}の発注画面を開きます`,
      status: 'success',
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
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" flexWrap="wrap">
          <Heading size="lg">在庫一覧</Heading>
          <HStack spacing={2}>
            <Button
              leftIcon={<FiUpload />}
              variant="outline"
              size="sm"
            >
              インポート
            </Button>
            <Button
              leftIcon={<FiDownload />}
              variant="outline"
              size="sm"
            >
              エクスポート
            </Button>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="brand"
              size="sm"
            >
              商品追加
            </Button>
          </HStack>
        </HStack>

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
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

        <Tabs colorScheme="brand">
          <TabList>
            <Tab>すべて</Tab>
            {mockCategories.map((category) => (
              <Tab key={category.id}>
                <HStack spacing={1}>
                  <Text>{category.icon}</Text>
                  <Text>{category.name}</Text>
                </HStack>
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
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
            </TabPanel>
            {mockCategories.map((category) => (
              <TabPanel key={category.id} px={0}>
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
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedProduct?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedProduct && (
              <VStack spacing={4} align="stretch">
                <Image
                  src={selectedProduct.imageUrl || 'https://via.placeholder.com/300'}
                  alt={selectedProduct.name}
                  maxH="200px"
                  objectFit="cover"
                  borderRadius="lg"
                />
                <SimpleGrid columns={2} spacing={4}>
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
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              閉じる
            </Button>
            <Button colorScheme="brand">編集</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};