import React from 'react';
import {
    Alert,
    Badge,
    Box,
    Button,
    Card,
    Grid,
    GridItem,
    Heading,
    HStack,
    Icon,
    SimpleGrid,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import {
    FiAlertTriangle,
    FiArrowRight,
    FiClock,
    FiDollarSign,
    FiPackage,
    FiShoppingCart,
    FiTrendingUp,
} from 'react-icons/fi';
import {StatCard} from '../components/common/StatCard';
import {type Column, DataTable} from '../components/common/DataTable';
import {mockAlerts, mockDashboardStats, mockProducts} from '../data/mockData';
import {formatCurrency, formatDate, formatQuantity} from '../utils/formatters';
import type {StockTransaction} from '../types';
import {
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const inventoryData = [
  { name: '月', value: 850000 },
  { name: '火', value: 870000 },
  { name: '水', value: 840000 },
  { name: '木', value: 880000 },
  { name: '金', value: 920000 },
  { name: '土', value: 890000 },
  { name: '日', value: 892400 },
];

const categoryData = [
  { name: '肉類', value: 35, color: '#FF6B35' },
  { name: '野菜', value: 25, color: '#48BB78' },
  { name: '調味料', value: 15, color: '#ED8936' },
  { name: '飲料', value: 20, color: '#4299E1' },
  { name: '備品', value: 5, color: '#9F7AEA' },
];

export const Dashboard: React.FC = () => {

  const transactionColumns: Column<StockTransaction>[] = [
    {
      key: 'date',
      label: '日時',
      accessor: (item) => formatDate(item.date),
    },
    {
      key: 'productName',
      label: '商品名',
      accessor: (item) => item.productName,
    },
    {
      key: 'type',
      label: '種別',
      accessor: (item) => {
        const typeMap = {
          in: { label: '入庫', color: 'green' },
          out: { label: '出庫', color: 'blue' },
          disposal: { label: '廃棄', color: 'red' },
          adjustment: { label: '調整', color: 'orange' },
        };
        const type = typeMap[item.type];
        return <Badge colorScheme={type.color}>{type.label}</Badge>;
      },
    },
    {
      key: 'quantity',
      label: '数量',
      accessor: (item) => formatQuantity(item.quantity, '個'),
      align: 'right',
    },
    {
      key: 'totalAmount',
      label: '金額',
      accessor: (item) => formatCurrency(item.totalAmount),
      align: 'right',
    },
  ];

  const lowStockProducts = mockProducts.filter(p => p.status === 'low');

  return (
    <Box p={{ base: 4, md: 6 }}>
        <VStack gap={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">ダッシュボード</Heading>
          <Text color="gray.500">{formatDate(new Date())}</Text>
        </HStack>

            <SimpleGrid columns={{base: 1, sm: 2, lg: 4}} gap={4}>
          <StatCard
            label="在庫総額"
            value={formatCurrency(mockDashboardStats.totalInventoryValue)}
            icon={FiDollarSign}
            iconColor="green.500"
            change={2.5}
            changeLabel="前日比"
          />
          <StatCard
            label="総商品数"
            value={`${mockDashboardStats.totalProducts}品`}
            icon={FiPackage}
            iconColor="blue.500"
            helpText="登録済み商品"
          />
          <StatCard
            label="在庫不足"
            value={`${mockDashboardStats.lowStockItems}件`}
            icon={FiAlertTriangle}
            iconColor="orange.500"
            helpText="要発注"
          />
          <StatCard
            label="期限切れ間近"
            value={`${mockDashboardStats.expiringItems}件`}
            icon={FiClock}
            iconColor="red.500"
            helpText="3日以内"
          />
        </SimpleGrid>

        {mockAlerts.filter(a => !a.isRead).length > 0 && (
            <Stack gap={3}>
            <Heading size="md">アラート</Heading>
            {mockAlerts.filter(a => !a.isRead).map((alert) => (
                <Alert.Root
                key={alert.id}
                status={
                  alert.severity === 'error' ? 'error' :
                  alert.severity === 'warning' ? 'warning' : 'info'
                }
                borderRadius="lg"
              >
                    <Alert.Indicator/>
                <Box flex={1}>
                    <Alert.Title>{alert.title}</Alert.Title>
                    <Alert.Description>{alert.message}</Alert.Description>
                </Box>
                <Button size="sm" variant="ghost">
                  確認
                </Button>
                </Alert.Root>
            ))}
          </Stack>
        )}

        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
          <GridItem>
              <Card.Root>
                  <Card.Header>
                <HStack justify="space-between">
                  <Heading size="md">在庫金額推移</Heading>
                  <Icon as={FiTrendingUp} color="green.500" />
                </HStack>
                  </Card.Header>
                  <Card.Body>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={inventoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#FF6B35"
                      strokeWidth={2}
                      dot={{ fill: '#FF6B35' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                  </Card.Body>
              </Card.Root>
          </GridItem>

          <GridItem>
              <Card.Root>
                  <Card.Header>
                <HStack justify="space-between">
                  <Heading size="md">カテゴリ別在庫比率</Heading>
                  <Icon as={FiPackage} color="blue.500" />
                </HStack>
                  </Card.Header>
                  <Card.Body>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name} ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                  </Card.Body>
              </Card.Root>
          </GridItem>
        </Grid>

        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
          <GridItem>
              <Card.Root>
                  <Card.Header>
                <HStack justify="space-between">
                  <Heading size="md">最近の取引</Heading>
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="brand"
                  >
                      すべて見る <FiArrowRight/>
                  </Button>
                </HStack>
                  </Card.Header>
                  <Card.Body>
                <DataTable
                  data={mockDashboardStats.recentTransactions}
                  columns={transactionColumns}
                  showBorder={false}
                />
                  </Card.Body>
              </Card.Root>
          </GridItem>

          <GridItem>
              <Card.Root>
                  <Card.Header>
                <HStack justify="space-between">
                  <Heading size="md">在庫不足商品</Heading>
                  <Button
                    size="sm"
                    colorScheme="brand"
                  >
                      発注する <FiShoppingCart/>
                  </Button>
                </HStack>
                  </Card.Header>
                  <Card.Body>
                      <VStack gap={3} align="stretch">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <HStack
                      key={product.id}
                      p={3}
                      borderRadius="lg"
                      bg="gray.50"
                      justify="space-between"
                    >
                        <VStack align="start" gap={0}>
                        <Text fontWeight="medium">{product.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {product.categoryName}
                        </Text>
                      </VStack>
                        <VStack align="end" gap={0}>
                        <Badge colorScheme="orange">
                          残り {product.currentStock} {product.unit}
                        </Badge>
                        <Text fontSize="xs" color="gray.500">
                          発注点: {product.minStock} {product.unit}
                        </Text>
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
                  </Card.Body>
              </Card.Root>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};