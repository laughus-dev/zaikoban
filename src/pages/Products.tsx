import React, {useState} from 'react';
import {
    Badge,
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Text,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import {FiBarcode, FiDownload, FiEdit, FiPlus, FiSearch, FiTrash2, FiUpload,} from 'react-icons/fi';
import {Column, DataTable} from '../components/common/DataTable';
import {FormField} from '../components/common/FormField';
import {Product} from '../types';
import {mockCategories, mockProducts, mockSuppliers} from '../data/mockData';
import {formatCurrency, formatQuantity} from '../utils/formatters';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    code: '',
    barcode: '',
    categoryId: '',
    unit: 'kg',
    cost: 0,
    price: 0,
    minStock: 0,
    maxStock: 0,
    currentStock: 0,
    supplierId: '',
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
      key: 'code',
      label: '商品コード',
      accessor: (item) => (
        <VStack align="start" spacing={0}>
          <Text fontWeight="medium">{item.code}</Text>
          {item.barcode && (
            <HStack spacing={1}>
              <FiBarcode size={12} />
              <Text fontSize="xs" color="gray.500">
                {item.barcode}
              </Text>
            </HStack>
          )}
        </VStack>
      ),
      sortable: true,
    },
    {
      key: 'name',
      label: '商品名',
      accessor: (item) => item.name,
      sortable: true,
    },
    {
      key: 'category',
      label: 'カテゴリ',
      accessor: (item) => {
        const category = mockCategories.find(c => c.id === item.categoryId);
        return category ? (
          <Badge colorScheme="blue">{category.name}</Badge>
        ) : (
          '-'
        );
      },
      sortable: true,
    },
    {
      key: 'supplier',
      label: '仕入先',
      accessor: (item) => {
        const supplier = mockSuppliers.find(s => s.id === item.supplierId);
        return supplier ? supplier.name : '-';
      },
      sortable: true,
    },
    {
      key: 'unit',
      label: '単位',
      accessor: (item) => item.unit,
    },
    {
      key: 'cost',
      label: '仕入値',
      accessor: (item) => formatCurrency(item.cost),
      align: 'right',
      sortable: true,
    },
    {
      key: 'price',
      label: '販売価格',
      accessor: (item) => formatCurrency(item.price),
      align: 'right',
      sortable: true,
    },
    {
      key: 'stock',
      label: '在庫',
      accessor: (item) => (
        <VStack align="end" spacing={0}>
          <Text>{formatQuantity(item.currentStock, item.unit)}</Text>
          <Text fontSize="xs" color="gray.500">
            {formatQuantity(item.minStock, item.unit)} - {formatQuantity(item.maxStock, item.unit)}
          </Text>
        </VStack>
      ),
      align: 'right',
    },
  ];

  const handleAdd = () => {
    setIsAddMode(true);
    setFormData({
      name: '',
      code: '',
      barcode: '',
      categoryId: '',
      unit: 'kg',
      cost: 0,
      price: 0,
      minStock: 0,
      maxStock: 0,
      currentStock: 0,
      supplierId: '',
    });
    onOpen();
  };

  const handleEdit = (product: Product) => {
    setIsAddMode(false);
    setSelectedProduct(product);
    setFormData(product);
    onOpen();
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`「${product.name}」を削除しますか？`)) {
      setProducts(products.filter(p => p.id !== product.id));
      toast({
        title: '商品を削除しました',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSave = () => {
    if (isAddMode) {
      const newProduct: Product = {
        ...formData as Product,
        id: `product-${Date.now()}`,
      };
      setProducts([...products, newProduct]);
      toast({
        title: '商品を追加しました',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else if (selectedProduct) {
      setProducts(products.map(p => 
        p.id === selectedProduct.id ? { ...p, ...formData } : p
      ));
      toast({
        title: '商品を更新しました',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
  };

  const handleExportCSV = () => {
    toast({
      title: 'CSVエクスポート',
      description: 'CSV形式でエクスポートしました',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleImportCSV = () => {
    toast({
      title: 'CSVインポート',
      description: 'CSV形式でインポートしました',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const actions = [
    {
      label: '編集',
      icon: <FiEdit />,
      onClick: handleEdit,
    },
    {
      label: '削除',
      icon: <FiTrash2 />,
      onClick: handleDelete,
      color: 'red.500',
    },
  ];

  const categoryOptions = mockCategories.map(cat => ({
    value: cat.id,
    label: cat.name,
  }));

  const supplierOptions = mockSuppliers.map(sup => ({
    value: sup.id,
    label: sup.name,
  }));

  const unitOptions = [
    { value: 'kg', label: 'kg' },
    { value: 'g', label: 'g' },
    { value: 'L', label: 'L' },
    { value: 'ml', label: 'ml' },
    { value: '個', label: '個' },
    { value: '本', label: '本' },
    { value: '枚', label: '枚' },
    { value: 'パック', label: 'パック' },
    { value: '箱', label: '箱' },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">商品マスタ</Heading>
        <HStack>
          <Button
            leftIcon={<FiUpload />}
            variant="outline"
            onClick={handleImportCSV}
          >
            インポート
          </Button>
          <Button
            leftIcon={<FiDownload />}
            variant="outline"
            onClick={handleExportCSV}
          >
            エクスポート
          </Button>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="primary"
            onClick={handleAdd}
          >
            新規登録
          </Button>
        </HStack>
      </Flex>

      <Box mb={4}>
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="商品名、コード、バーコードで検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Box>

      <Box bg="white" borderRadius="lg" shadow="sm">
        <DataTable
          data={filteredProducts}
          columns={columns}
          sortable
          paginated
          pageSize={15}
          actions={actions}
        />
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isAddMode ? '商品登録' : '商品編集'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormField
                label="商品コード"
                name="code"
                value={formData.code}
                onChange={(value) => setFormData({ ...formData, code: value })}
                isRequired
                placeholder="例: P001"
              />
              <FormField
                label="バーコード"
                name="barcode"
                value={formData.barcode}
                onChange={(value) => setFormData({ ...formData, barcode: value })}
                placeholder="JANコード等"
                rightIcon={<FiBarcode />}
              />
              <FormField
                label="商品名"
                name="name"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                isRequired
                placeholder="例: 国産牛ロース"
              />
              <FormField
                type="select"
                label="カテゴリ"
                name="categoryId"
                value={formData.categoryId}
                onChange={(value) => setFormData({ ...formData, categoryId: value })}
                options={categoryOptions}
                isRequired
              />
              <FormField
                type="select"
                label="仕入先"
                name="supplierId"
                value={formData.supplierId}
                onChange={(value) => setFormData({ ...formData, supplierId: value })}
                options={supplierOptions}
              />
              <FormField
                type="select"
                label="単位"
                name="unit"
                value={formData.unit}
                onChange={(value) => setFormData({ ...formData, unit: value })}
                options={unitOptions}
                isRequired
              />
              <FormField
                type="number"
                label="仕入値"
                name="cost"
                value={formData.cost}
                onChange={(value) => setFormData({ ...formData, cost: value })}
                min={0}
                isRequired
              />
              <FormField
                type="number"
                label="販売価格"
                name="price"
                value={formData.price}
                onChange={(value) => setFormData({ ...formData, price: value })}
                min={0}
                isRequired
              />
              <FormField
                type="number"
                label="最小在庫"
                name="minStock"
                value={formData.minStock}
                onChange={(value) => setFormData({ ...formData, minStock: value })}
                min={0}
                helperText="この値を下回ると発注アラート"
              />
              <FormField
                type="number"
                label="最大在庫"
                name="maxStock"
                value={formData.maxStock}
                onChange={(value) => setFormData({ ...formData, maxStock: value })}
                min={0}
                helperText="発注時の上限値"
              />
              <FormField
                type="number"
                label="現在庫"
                name="currentStock"
                value={formData.currentStock}
                onChange={(value) => setFormData({ ...formData, currentStock: value })}
                min={0}
              />
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              キャンセル
            </Button>
            <Button colorScheme="primary" onClick={handleSave}>
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};