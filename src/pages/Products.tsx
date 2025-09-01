import React, {useState} from 'react';
import {
    Badge,
    Box,
    Button,
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
    Image,
    Input,
    SimpleGrid,
    Text,
    VStack
} from '@chakra-ui/react';
import {FiCode, FiDownload, FiEdit, FiPlus, FiSearch, FiTrash2, FiUpload,} from 'react-icons/fi';
import type {Column} from '../components/common/DataTable';
import {DataTable} from '../components/common/DataTable';
import {FormField} from '../components/common/FormField';
import type {Product} from '../types';
import {mockCategories, mockProducts, mockSuppliers} from '../data/mockData';
import {formatCurrency, formatQuantity} from '../utils/formatters';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const toast = createToaster({
        placement: "top"
    });

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
          <VStack align="start" gap={0}>
          <Text fontWeight="medium">{item.code}</Text>
          {item.barcode && (
              <HStack gap={1}>
                  <FiCode size={12}/>
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
          <VStack align="end" gap={0}>
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
      setIsOpen(true);
  };

  const handleEdit = (product: Product) => {
    setIsAddMode(false);
    setSelectedProduct(product);
    setFormData(product);
      setIsOpen(true);
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`「${product.name}」を削除しますか？`)) {
      setProducts(products.filter(p => p.id !== product.id));
        toast.create({
        title: '商品を削除しました',
        duration: 3000,
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
        toast.create({
        title: '商品を追加しました',
        duration: 3000,
      });
    } else if (selectedProduct) {
      setProducts(products.map(p => 
        p.id === selectedProduct.id ? { ...p, ...formData } : p
      ));
        toast.create({
        title: '商品を更新しました',
        duration: 3000,
      });
    }
      setIsOpen(false);
  };

  const handleExportCSV = () => {
      toast.create({
      title: 'CSVエクスポート',
      description: 'CSV形式でエクスポートしました',
      duration: 3000,
    });
  };

  const handleImportCSV = () => {
      toast.create({
      title: 'CSVインポート',
      description: 'CSV形式でインポートしました',
      duration: 3000,
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
            variant="outline"
            onClick={handleImportCSV}
          >
              <FiUpload/> インポート
          </Button>
          <Button
            variant="outline"
            onClick={handleExportCSV}
          >
              <FiDownload/> エクスポート
          </Button>
          <Button
            colorScheme="primary"
            onClick={handleAdd}
          >
              <FiPlus/> 新規登録
          </Button>
        </HStack>
      </Flex>

      <Box mb={4}>
          <Box position="relative" maxW="400px">
          <Input
            placeholder="商品名、コード、バーコードで検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            paddingStart="40px"
          />
              <Box
                  position="absolute"
                  left="12px"
                  top="50%"
                  transform="translateY(-50%)"
                  pointerEvents="none"
                  color="gray.400"
              >
                  <FiSearch/>
              </Box>
          </Box>
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

        <DialogRoot open={isOpen} onOpenChange={(details) => setIsOpen(details.open)} size="xl">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isAddMode ? '商品登録' : '商品編集'}
                    </DialogTitle>
                    <DialogCloseTrigger/>
                </DialogHeader>
                <DialogBody>
                    <SimpleGrid columns={{base: 1, md: 2}} gap={4}>
              <FormField
                label="商品コード"
                name="code"
                value={formData.code || ''}
                onChange={(value) => setFormData({...formData, code: String(value)})}
                isRequired
                placeholder="例: P001"
              />
              <FormField
                label="バーコード"
                name="barcode"
                value={formData.barcode || ''}
                onChange={(value) => setFormData({...formData, barcode: String(value)})}
                placeholder="JANコード等"
                rightIcon={<FiCode/>}
              />
              <FormField
                label="商品名"
                name="name"
                value={formData.name || ''}
                onChange={(value) => setFormData({...formData, name: String(value)})}
                isRequired
                placeholder="例: 国産牛ロース"
              />
              <FormField
                type="select"
                label="カテゴリ"
                name="categoryId"
                value={formData.categoryId || ''}
                onChange={(value) => setFormData({...formData, categoryId: String(value)})}
                options={categoryOptions}
                isRequired
              />
              <FormField
                type="select"
                label="仕入先"
                name="supplierId"
                value={formData.supplierId || ''}
                onChange={(value) => setFormData({...formData, supplierId: String(value)})}
                options={supplierOptions}
              />
              <FormField
                type="select"
                label="単位"
                name="unit"
                value={formData.unit || ''}
                onChange={(value) => setFormData({...formData, unit: String(value)})}
                options={unitOptions}
                isRequired
              />
              <FormField
                type="number"
                label="仕入値"
                name="cost"
                value={String(formData.cost || 0)}
                onChange={(value) => setFormData({...formData, cost: Number(value) || 0})}
                min={0}
                isRequired
              />
              <FormField
                type="number"
                label="販売価格"
                name="price"
                value={String(formData.price || 0)}
                onChange={(value) => setFormData({...formData, price: Number(value) || 0})}
                min={0}
                isRequired
              />
              <FormField
                type="number"
                label="最小在庫"
                name="minStock"
                value={String(formData.minStock || 0)}
                onChange={(value) => setFormData({...formData, minStock: Number(value) || 0})}
                min={0}
                helperText="この値を下回ると発注アラート"
              />
              <FormField
                type="number"
                label="最大在庫"
                name="maxStock"
                value={String(formData.maxStock || 0)}
                onChange={(value) => setFormData({...formData, maxStock: Number(value) || 0})}
                min={0}
                helperText="発注時の上限値"
              />
              <FormField
                type="number"
                label="現在庫"
                name="currentStock"
                value={String(formData.currentStock || 0)}
                onChange={(value) => setFormData({...formData, currentStock: Number(value) || 0})}
                min={0}
              />
            </SimpleGrid>
                </DialogBody>
                <DialogFooter>
                    <Button variant="ghost" mr={3} onClick={() => setIsOpen(false)}>
              キャンセル
            </Button>
            <Button colorScheme="primary" onClick={handleSave}>
              保存
            </Button>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    </Box>
  );
};