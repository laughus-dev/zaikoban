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
    FieldLabel,
    FieldRoot,
    Flex,
    Heading,
    HStack,
    Input,
    NativeSelectField,
    NativeSelectRoot,
    SimpleGrid,
    Text,
    VStack
} from '@chakra-ui/react';
import {FiDownload, FiEdit, FiPlus, FiSearch, FiTrash2, FiUpload,} from 'react-icons/fi';
import type {Column} from '../components/common/DataTable';
import {DataTable} from '../components/common/DataTable';
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
      accessor: (item) => {
        const category = mockCategories.find(c => c.id === item.categoryId);
        return category ? (
            <Badge colorScheme="gray">{category.name}</Badge>
        ) : (
          '-'
        );
      },
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
      key: 'cost',
        label: '仕入価格',
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
        key: 'supplier',
        label: '仕入先',
        accessor: (item) => {
            const supplier = mockSuppliers.find(s => s.id === item.supplierId);
            return supplier ? supplier.name : '-';
        },
    },
  ];

  const handleAdd = () => {
    setIsAddMode(true);
    setFormData({
      name: '',
        code: `P${Date.now().toString().slice(-6)}`, // 自動生成
      barcode: '',
        categoryId: mockCategories[0]?.id || '', // デフォルトで最初のカテゴリを選択
      unit: 'kg',
        cost: 1000,
        price: 1500,
        minStock: 10,
        maxStock: 100,
        currentStock: 50,
        supplierId: mockSuppliers[0]?.id || '', // デフォルトで最初の仕入先を選択
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
      // 必須項目の簡単なチェック
      if (!formData.name) {
          toast.create({
              title: '商品名を入力してください',
              status: 'error',
              duration: 3000,
          });
          return;
      }
    
    if (isAddMode) {
        // カテゴリと仕入先の名前を取得
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
        toast.create({
        title: '商品を追加しました',
            status: 'success',
        duration: 3000,
      });
    } else if (selectedProduct) {
        // カテゴリと仕入先の名前を取得
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
              <HStack gap={1}>
                  <FiUpload/>
                  <Text>インポート</Text>
              </HStack>
          </Button>
          <Button
            variant="outline"
            onClick={handleExportCSV}
          >
              <HStack gap={1}>
                  <FiDownload/>
                  <Text>エクスポート</Text>
              </HStack>
          </Button>
          <Button
              colorScheme="brand"
            onClick={handleAdd}
          >
              <HStack gap={1}>
                  <FiPlus/>
                  <Text>新規登録</Text>
              </HStack>
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
            <DialogBackdrop/>
            <DialogPositioner>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isAddMode ? '商品登録' : '商品編集'}
                        </DialogTitle>
                    </DialogHeader>
                    <DialogCloseTrigger/>
                <DialogBody>
                    <SimpleGrid columns={{base: 1, md: 2}} gap={4}>
                        <FieldRoot>
                            <FieldLabel>商品コード</FieldLabel>
                            <Input
                                value={formData.code || ''}
                                onChange={(e) => setFormData({...formData, code: e.target.value})}
                                placeholder="例: P001"
                            />
                        </FieldRoot>

                        <FieldRoot>
                            <FieldLabel>バーコード</FieldLabel>
                            <Input
                                value={formData.barcode || ''}
                                onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                                placeholder="JANコード等"
                            />
                        </FieldRoot>

                        <FieldRoot>
                            <FieldLabel>商品名 <Text as="span" color="red.500">*</Text></FieldLabel>
                            <Input
                                value={formData.name || ''}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="例: 国産牛ロース"
                            />
                        </FieldRoot>

                        <FieldRoot>
                            <FieldLabel>カテゴリ</FieldLabel>
                            <NativeSelectRoot>
                                <NativeSelectField
                                    value={formData.categoryId || ''}
                                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                                >
                                    <option value="">選択してください</option>
                                    {categoryOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </NativeSelectField>
                            </NativeSelectRoot>
                        </FieldRoot>

                        <FieldRoot>
                            <FieldLabel>仕入先</FieldLabel>
                            <NativeSelectRoot>
                                <NativeSelectField
                                    value={formData.supplierId || ''}
                                    onChange={(e) => setFormData({...formData, supplierId: e.target.value})}
                                >
                                    <option value="">選択してください</option>
                                    {supplierOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </NativeSelectField>
                            </NativeSelectRoot>
                        </FieldRoot>

                        <FieldRoot>
                            <FieldLabel>単位</FieldLabel>
                            <NativeSelectRoot>
                                <NativeSelectField
                                    value={formData.unit || ''}
                                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                                >
                                    {unitOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </NativeSelectField>
                            </NativeSelectRoot>
                        </FieldRoot>

                        <FieldRoot>
                            <FieldLabel>仕入値</FieldLabel>
                            <Input
                                type="number"
                                value={formData.cost || 0}
                                onChange={(e) => setFormData({...formData, cost: Number(e.target.value) || 0})}
                                min={0}
                            />
                        </FieldRoot>

                        <FieldRoot>
                            <FieldLabel>販売価格</FieldLabel>
                            <Input
                                type="number"
                                value={formData.price || 0}
                                onChange={(e) => setFormData({...formData, price: Number(e.target.value) || 0})}
                                min={0}
                            />
                        </FieldRoot>

                        <FieldRoot>
                            <FieldLabel>最小在庫</FieldLabel>
                            <Input
                                type="number"
                                value={formData.minStock || 0}
                                onChange={(e) => setFormData({...formData, minStock: Number(e.target.value) || 0})}
                                min={0}
                            />
                            <Text fontSize="sm" color="gray.600" mt={1}>この値を下回ると発注アラート</Text>
                        </FieldRoot>

                        <FieldRoot>
                            <FieldLabel>最大在庫</FieldLabel>
                            <Input
                                type="number"
                                value={formData.maxStock || 0}
                                onChange={(e) => setFormData({...formData, maxStock: Number(e.target.value) || 0})}
                                min={0}
                            />
                            <Text fontSize="sm" color="gray.600" mt={1}>発注時の上限値</Text>
                        </FieldRoot>

                        <FieldRoot>
                            <FieldLabel>現在庫</FieldLabel>
                            <Input
                                type="number"
                                value={formData.currentStock || 0}
                                onChange={(e) => setFormData({...formData, currentStock: Number(e.target.value) || 0})}
                                min={0}
                            />
                        </FieldRoot>
                    </SimpleGrid>
                </DialogBody>
                <DialogFooter>
                    <Button variant="ghost" mr={3} onClick={() => setIsOpen(false)}>
              キャンセル
            </Button>
                    <Button colorScheme="brand" onClick={handleSave}>
              保存
            </Button>
                </DialogFooter>
                </DialogContent>
            </DialogPositioner>
        </DialogRoot>
    </Box>
  );
};