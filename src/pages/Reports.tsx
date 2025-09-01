import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Button,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Progress,
  Flex,
  Avatar,
  Select,
  useColorModeValue,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import {
  FiTrendingUp,
  FiAward,
  FiAlertCircle,
  FiDownload,
  FiPrinter,
  FiMail,
  FiCalendar,
  FiBarChart2,
  FiPieChart,
  FiActivity,
  FiPackage,
  FiDollarSign,
  FiShoppingBag,
  FiTarget,
  FiInfo,
  FiChevronRight,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { formatCurrency, formatDate } from '../utils/formatters';

// モックデータ
const salesData = [
  { month: '1月', 売上: 2800000, 前年: 2500000 },
  { month: '2月', 売上: 3200000, 前年: 2900000 },
  { month: '3月', 売上: 3500000, 前年: 3300000 },
  { month: '4月', 売上: 3100000, 前年: 3400000 },
  { month: '5月', 売上: 3800000, 前年: 3600000 },
  { month: '6月', 売上: 4200000, 前年: 3900000 },
];

const topProducts = [
  { rank: 1, name: '特選和牛サーロイン', sales: 850000, quantity: 120, trend: 'up', growth: 15 },
  { rank: 2, name: '新鮮野菜セット', sales: 620000, quantity: 450, trend: 'up', growth: 8 },
  { rank: 3, name: '自家製味噌', sales: 480000, quantity: 380, trend: 'down', growth: -3 },
  { rank: 4, name: '有機醤油', sales: 420000, quantity: 350, trend: 'up', growth: 12 },
  { rank: 5, name: '鮮魚詰め合わせ', sales: 380000, quantity: 95, trend: 'up', growth: 20 },
];

const categoryAnalysis = [
  { name: '肉類', value: 35, color: '#FF6B35' },
  { name: '野菜', value: 25, color: '#4ECDC4' },
  { name: '調味料', value: 20, color: '#45B7D1' },
  { name: '魚介類', value: 15, color: '#96CEB4' },
  { name: 'その他', value: 5, color: '#DDA0DD' },
];

const inventoryEfficiency = [
  { category: '適正在庫', count: 42, percentage: 60, color: 'green' },
  { category: '過剰在庫', count: 21, percentage: 30, color: 'yellow' },
  { category: '在庫不足', count: 7, percentage: 10, color: 'red' },
];

const turnoverRate = [
  { name: '目標', value: 12, fill: '#8884d8' },
  { name: '実績', value: 9.5, fill: '#FF6B35' },
];

export const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleExport = (type: string) => {
    toast({
      title: `${type}形式でダウンロード`,
      description: 'レポートのダウンロードを開始しました',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}位`;
  };

  return (
    <Box p={{ base: 4, md: 6 }} maxW="1400px" mx="auto">
      {/* ヘッダー */}
      <VStack align="stretch" spacing={6}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <VStack align="start" spacing={1}>
            <Heading size="lg" color="gray.800">
              <Icon as={FiBarChart2} mr={2} />
              レポート・分析
            </Heading>
            <Text color="gray.600">売上や在庫の状況を分かりやすく表示します</Text>
          </VStack>
          
          <HStack spacing={3}>
            <Select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              w="150px"
              bg={bgColor}
            >
              <option value="day">日別</option>
              <option value="week">週別</option>
              <option value="month">月別</option>
              <option value="year">年別</option>
            </Select>
            
            <Tooltip label="PDFでダウンロード">
              <IconButton
                aria-label="PDF出力"
                icon={<FiDownload />}
                colorScheme="orange"
                onClick={() => handleExport('PDF')}
              />
            </Tooltip>
            
            <Tooltip label="印刷">
              <IconButton
                aria-label="印刷"
                icon={<FiPrinter />}
                variant="outline"
                onClick={() => handleExport('印刷')}
              />
            </Tooltip>
            
            <Tooltip label="メールで送信">
              <IconButton
                aria-label="メール送信"
                icon={<FiMail />}
                variant="outline"
                onClick={() => handleExport('メール')}
              />
            </Tooltip>
          </HStack>
        </Flex>

        {/* サマリーカード */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4}>
          <Card bg={bgColor} borderWidth={1} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.600">今月の売上</StatLabel>
                <StatNumber fontSize="2xl" color="orange.500">
                  {formatCurrency(4200000)}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  前月比 10.5%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderWidth={1} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.600">在庫回転率</StatLabel>
                <StatNumber fontSize="2xl" color="blue.500">
                  9.5回
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  目標まであと2.5回
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderWidth={1} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.600">在庫金額</StatLabel>
                <StatNumber fontSize="2xl" color="green.500">
                  {formatCurrency(12500000)}
                </StatNumber>
                <StatHelpText>
                  適正範囲内
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderWidth={1} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.600">廃棄ロス率</StatLabel>
                <StatNumber fontSize="2xl" color="red.500">
                  2.3%
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  要改善
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* メインコンテンツ */}
        <Tabs colorScheme="orange" variant="enclosed">
          <TabList>
            <Tab><Icon as={FiTrendingUp} mr={2} />売上分析</Tab>
            <Tab><Icon as={FiPackage} mr={2} />在庫分析</Tab>
            <Tab><Icon as={FiAward} mr={2} />商品ランキング</Tab>
            <Tab><Icon as={FiTarget} mr={2} />改善提案</Tab>
          </TabList>

          <TabPanels>
            {/* 売上分析タブ */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Card bg={bgColor}>
                  <CardHeader>
                    <Heading size="md">月別売上推移</Heading>
                    <Text color="gray.600" fontSize="sm">今年と前年の比較</Text>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                        <RechartsTooltip 
                          formatter={(value: number) => formatCurrency(value)}
                        />
                        <Legend />
                        <Bar dataKey="売上" fill="#FF6B35" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="前年" fill="#FFB08A" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <Card bg={bgColor}>
                    <CardHeader>
                      <Heading size="md">カテゴリ別売上構成</Heading>
                    </CardHeader>
                    <CardBody>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={categoryAnalysis}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.name} ${entry.value}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryAnalysis.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardBody>
                  </Card>

                  <Card bg={bgColor}>
                    <CardHeader>
                      <Heading size="md">売上目標達成率</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Box>
                          <Flex justify="space-between" mb={2}>
                            <Text fontWeight="bold">今月</Text>
                            <Text color="green.500" fontWeight="bold">105%</Text>
                          </Flex>
                          <Progress value={105} colorScheme="green" size="lg" borderRadius="full" />
                        </Box>
                        <Box>
                          <Flex justify="space-between" mb={2}>
                            <Text fontWeight="bold">四半期</Text>
                            <Text color="orange.500" fontWeight="bold">92%</Text>
                          </Flex>
                          <Progress value={92} colorScheme="orange" size="lg" borderRadius="full" />
                        </Box>
                        <Box>
                          <Flex justify="space-between" mb={2}>
                            <Text fontWeight="bold">年間</Text>
                            <Text color="blue.500" fontWeight="bold">78%</Text>
                          </Flex>
                          <Progress value={78} colorScheme="blue" size="lg" borderRadius="full" />
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </VStack>
            </TabPanel>

            {/* 在庫分析タブ */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                  {inventoryEfficiency.map((item) => (
                    <Card key={item.category} bg={bgColor}>
                      <CardBody>
                        <VStack spacing={4}>
                          <Icon 
                            as={FiPackage} 
                            fontSize="3xl" 
                            color={`${item.color}.500`}
                          />
                          <Text fontSize="xl" fontWeight="bold">{item.category}</Text>
                          <Text fontSize="3xl" fontWeight="bold" color={`${item.color}.500`}>
                            {item.count}品目
                          </Text>
                          <Progress 
                            value={item.percentage} 
                            colorScheme={item.color} 
                            size="sm" 
                            width="100%"
                            borderRadius="full"
                          />
                          <Text color="gray.600">{item.percentage}%</Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>

                <Card bg={bgColor}>
                  <CardHeader>
                    <Heading size="md">在庫回転率</Heading>
                    <Text color="gray.600" fontSize="sm">目標値との比較</Text>
                  </CardHeader>
                  <CardBody>
                    <HStack spacing={8} justify="center">
                      <VStack>
                        <Box position="relative" width="150px" height="150px">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                              cx="50%" 
                              cy="50%" 
                              innerRadius="60%" 
                              outerRadius="90%" 
                              data={turnoverRate}
                            >
                              <RadialBar dataKey="value" cornerRadius={10} fill="#FF6B35" />
                            </RadialBarChart>
                          </ResponsiveContainer>
                          <VStack 
                            position="absolute" 
                            top="50%" 
                            left="50%" 
                            transform="translate(-50%, -50%)"
                            spacing={0}
                          >
                            <Text fontSize="2xl" fontWeight="bold">9.5</Text>
                            <Text fontSize="sm" color="gray.600">回/年</Text>
                          </VStack>
                        </Box>
                        <Text fontWeight="bold">現在の回転率</Text>
                      </VStack>

                      <VStack align="start" spacing={3}>
                        <HStack>
                          <Badge colorScheme="purple">目標</Badge>
                          <Text fontWeight="bold">12回/年</Text>
                        </HStack>
                        <HStack>
                          <Badge colorScheme="green">業界平均</Badge>
                          <Text>10回/年</Text>
                        </HStack>
                        <HStack>
                          <Badge colorScheme="orange">前年実績</Badge>
                          <Text>8.2回/年</Text>
                        </HStack>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>

                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>在庫状況の評価</AlertTitle>
                    <AlertDescription>
                      現在の在庫回転率は前年より改善していますが、目標にはまだ届いていません。
                      過剰在庫の商品を優先的に販売促進することをお勧めします。
                    </AlertDescription>
                  </Box>
                </Alert>
              </VStack>
            </TabPanel>

            {/* 商品ランキングタブ */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Card bg={bgColor}>
                  <CardHeader>
                    <Heading size="md">売上TOP5商品</Heading>
                    <Text color="gray.600" fontSize="sm">今月の人気商品</Text>
                  </CardHeader>
                  <CardBody>
                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>順位</Th>
                            <Th>商品名</Th>
                            <Th isNumeric>売上金額</Th>
                            <Th isNumeric>販売数</Th>
                            <Th>前月比</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {topProducts.map((product) => (
                            <Tr key={product.rank}>
                              <Td>
                                <Text fontSize="xl">{getRankIcon(product.rank)}</Text>
                              </Td>
                              <Td>
                                <Text fontWeight="bold">{product.name}</Text>
                              </Td>
                              <Td isNumeric>
                                <Text fontWeight="bold" color="orange.500">
                                  {formatCurrency(product.sales)}
                                </Text>
                              </Td>
                              <Td isNumeric>{product.quantity}個</Td>
                              <Td>
                                <HStack>
                                  <Icon 
                                    as={product.trend === 'up' ? FiTrendingUp : FiActivity} 
                                    color={product.trend === 'up' ? 'green.500' : 'red.500'}
                                  />
                                  <Text 
                                    color={product.growth > 0 ? 'green.500' : 'red.500'}
                                    fontWeight="bold"
                                  >
                                    {product.growth > 0 ? '+' : ''}{product.growth}%
                                  </Text>
                                </HStack>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <Card bg={bgColor}>
                    <CardHeader>
                      <Heading size="md">急上昇商品 🔥</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between" p={3} bg="orange.50" borderRadius="lg">
                          <HStack>
                            <Badge colorScheme="red">NEW</Badge>
                            <Text fontWeight="bold">季節限定さくらんぼ</Text>
                          </HStack>
                          <Text color="green.500" fontWeight="bold">+250%</Text>
                        </HStack>
                        <HStack justify="space-between" p={3} bg="blue.50" borderRadius="lg">
                          <Text fontWeight="bold">オーガニック豆腐</Text>
                          <Text color="green.500" fontWeight="bold">+180%</Text>
                        </HStack>
                        <HStack justify="space-between" p={3} bg="green.50" borderRadius="lg">
                          <Text fontWeight="bold">自家製パスタ</Text>
                          <Text color="green.500" fontWeight="bold">+95%</Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card bg={bgColor}>
                    <CardHeader>
                      <Heading size="md">要注意商品 ⚠️</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between" p={3} bg="red.50" borderRadius="lg">
                          <Text fontWeight="bold">冷凍エビ（大）</Text>
                          <Text color="red.500" fontWeight="bold">-45%</Text>
                        </HStack>
                        <HStack justify="space-between" p={3} bg="yellow.50" borderRadius="lg">
                          <Text fontWeight="bold">輸入チーズ</Text>
                          <Text color="red.500" fontWeight="bold">-32%</Text>
                        </HStack>
                        <HStack justify="space-between" p={3} bg="gray.50" borderRadius="lg">
                          <Text fontWeight="bold">缶詰セット</Text>
                          <Text color="red.500" fontWeight="bold">-28%</Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </VStack>
            </TabPanel>

            {/* 改善提案タブ */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Alert status="success" borderRadius="lg">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>AI分析による改善提案</AlertTitle>
                    <AlertDescription>
                      過去のデータを基に、以下の改善点をご提案します
                    </AlertDescription>
                  </Box>
                </Alert>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <Card bg={bgColor} borderColor="orange.200" borderWidth={2}>
                    <CardHeader bg="orange.50">
                      <HStack>
                        <Icon as={FiShoppingBag} color="orange.500" fontSize="xl" />
                        <Heading size="md">発注の最適化</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <Text>📌 <strong>野菜類</strong>の発注頻度を週3回に増やしましょう</Text>
                        <Text color="gray.600" fontSize="sm">
                          鮮度を保ちながら廃棄ロスを20%削減できます
                        </Text>
                        <Divider />
                        <Text>📌 <strong>調味料</strong>はまとめ買いがお得です</Text>
                        <Text color="gray.600" fontSize="sm">
                          月1回の大量発注で仕入れコストを15%削減
                        </Text>
                        <Button colorScheme="orange" size="sm" rightIcon={<FiChevronRight />}>
                          詳細を見る
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card bg={bgColor} borderColor="green.200" borderWidth={2}>
                    <CardHeader bg="green.50">
                      <HStack>
                        <Icon as={FiDollarSign} color="green.500" fontSize="xl" />
                        <Heading size="md">売上向上の機会</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <Text>💡 <strong>セット販売</strong>を導入してみましょう</Text>
                        <Text color="gray.600" fontSize="sm">
                          人気商品の組み合わせで客単価を25%アップ
                        </Text>
                        <Divider />
                        <Text>💡 <strong>季節商品</strong>の早期仕入れ</Text>
                        <Text color="gray.600" fontSize="sm">
                          トレンドを先取りして売上30%増の可能性
                        </Text>
                        <Button colorScheme="green" size="sm" rightIcon={<FiChevronRight />}>
                          詳細を見る
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card bg={bgColor} borderColor="blue.200" borderWidth={2}>
                    <CardHeader bg="blue.50">
                      <HStack>
                        <Icon as={FiActivity} color="blue.500" fontSize="xl" />
                        <Heading size="md">在庫効率の改善</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <Text>🎯 <strong>ABC分析</strong>の活用</Text>
                        <Text color="gray.600" fontSize="sm">
                          売れ筋商品に在庫を集中させて効率化
                        </Text>
                        <Divider />
                        <Text>🎯 <strong>リードタイム</strong>の見直し</Text>
                        <Text color="gray.600" fontSize="sm">
                          仕入先との調整で在庫保持日数を3日短縮
                        </Text>
                        <Button colorScheme="blue" size="sm" rightIcon={<FiChevronRight />}>
                          詳細を見る
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card bg={bgColor} borderColor="purple.200" borderWidth={2}>
                    <CardHeader bg="purple.50">
                      <HStack>
                        <Icon as={FiAlertCircle} color="purple.500" fontSize="xl" />
                        <Heading size="md">リスク管理</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <Text>⚠️ <strong>期限管理</strong>の強化が必要です</Text>
                        <Text color="gray.600" fontSize="sm">
                          アラート設定で廃棄ロスを50%削減可能
                        </Text>
                        <Divider />
                        <Text>⚠️ <strong>安全在庫</strong>の見直し</Text>
                        <Text color="gray.600" fontSize="sm">
                          需要予測の精度向上で欠品リスクを軽減
                        </Text>
                        <Button colorScheme="purple" size="sm" rightIcon={<FiChevronRight />}>
                          詳細を見る
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                <Card bg="blue.50" borderColor="blue.300" borderWidth={2}>
                  <CardBody>
                    <HStack spacing={4}>
                      <Icon as={FiInfo} color="blue.500" fontSize="3xl" />
                      <VStack align="start" flex={1}>
                        <Text fontWeight="bold" color="blue.700">
                          次回のレポート更新: 2024年7月1日（月）9:00
                        </Text>
                        <Text color="blue.600" fontSize="sm">
                          毎月の月初に自動でレポートが更新されます。カスタムレポートの作成も可能です。
                        </Text>
                      </VStack>
                      <Button colorScheme="blue" variant="solid">
                        カスタムレポート作成
                      </Button>
                    </HStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};