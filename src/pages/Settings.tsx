import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardHeader,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  Button,
  Avatar,
  Badge,
  SimpleGrid,
  Divider,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  useColorModeValue,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Radio,
  RadioGroup,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Icon,
  Tooltip,
  Image,
  Center,
} from '@chakra-ui/react';
import {
  FiUser,
  FiSettings,
  FiBell,
  FiShield,
  FiDatabase,
  FiMail,
  FiSmartphone,
  FiMonitor,
  FiSave,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiUpload,
  FiDownload,
  FiRefreshCw,
  FiHelpCircle,
  FiLock,
  FiUnlock,
  FiCheck,
  FiX,
  FiCamera,
  FiMapPin,
  FiClock,
  FiPackage,
  FiTag,
  FiDollarSign,
  FiPalette,
  FiType,
  FiSun,
  FiMoon,
  FiGlobe,
} from 'react-icons/fi';

// モックデータ
const mockUsers = [
  { id: 1, name: '田中 太郎', email: 'tanaka@zaikoban.jp', role: '管理者', status: 'active', avatar: '👨‍💼' },
  { id: 2, name: '佐藤 花子', email: 'sato@zaikoban.jp', role: 'マネージャー', status: 'active', avatar: '👩‍💼' },
  { id: 3, name: '鈴木 次郎', email: 'suzuki@zaikoban.jp', role: 'スタッフ', status: 'active', avatar: '👨' },
  { id: 4, name: '山田 美咲', email: 'yamada@zaikoban.jp', role: 'スタッフ', status: 'inactive', avatar: '👩' },
];

const mockCategories = [
  { id: 1, name: '肉類', icon: '🥩', color: 'red', count: 25 },
  { id: 2, name: '野菜', icon: '🥬', color: 'green', count: 38 },
  { id: 3, name: '魚介類', icon: '🐟', color: 'blue', count: 18 },
  { id: 4, name: '調味料', icon: '🧂', color: 'yellow', count: 42 },
  { id: 5, name: '飲料', icon: '🥤', color: 'purple', count: 15 },
];

const mockUnits = [
  { id: 1, name: 'キログラム', symbol: 'kg', type: '重量' },
  { id: 2, name: 'グラム', symbol: 'g', type: '重量' },
  { id: 3, name: 'リットル', symbol: 'L', type: '容量' },
  { id: 4, name: 'ミリリットル', symbol: 'ml', type: '容量' },
  { id: 5, name: '個', symbol: '個', type: '個数' },
  { id: 6, name: 'パック', symbol: 'パック', type: '個数' },
];

export const Settings: React.FC = () => {
  const [storeName, setStoreName] = useState('在庫番レストラン');
  const [storeAddress, setStoreAddress] = useState('東京都渋谷区渋谷1-2-3');
  const [openTime, setOpenTime] = useState('11:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [alertDays, setAlertDays] = useState(3);
  const [stockLevel, setStockLevel] = useState(20);
  const [fontSize, setFontSize] = useState('medium');
  const [theme, setTheme] = useState('orange');
  const [notifications, setNotifications] = useState({
    stockAlert: true,
    expiryAlert: true,
    orderReminder: true,
    reportSummary: false,
    systemUpdate: true,
  });

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState('');

  const handleSave = (section: string) => {
    toast({
      title: '設定を保存しました',
      description: `${section}の設定が正常に保存されました`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  const handleModalOpen = (type: string) => {
    setModalType(type);
    onOpen();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case '管理者': return 'red';
      case 'マネージャー': return 'orange';
      case 'スタッフ': return 'green';
      default: return 'gray';
    }
  };

  return (
    <Box p={{ base: 4, md: 6 }} maxW="1400px" mx="auto">
      {/* ヘッダー */}
      <VStack align="stretch" spacing={6}>
        <VStack align="start" spacing={1}>
          <Heading size="lg" color="gray.800">
            <Icon as={FiSettings} mr={2} />
            設定
          </Heading>
          <Text color="gray.600">システムの各種設定を管理します</Text>
        </VStack>

        {/* タブ */}
        <Tabs colorScheme="orange" variant="enclosed">
          <TabList flexWrap="wrap">
            <Tab><Icon as={FiUser} mr={2} />プロフィール</Tab>
            <Tab><Icon as={FiMapPin} mr={2} />店舗情報</Tab>
            <Tab><Icon as={FiPackage} mr={2} />商品設定</Tab>
            <Tab><Icon as={FiBell} mr={2} />通知設定</Tab>
            <Tab><Icon as={FiPalette} mr={2} />画面設定</Tab>
            <Tab><Icon as={FiShield} mr={2} />ユーザー管理</Tab>
            <Tab><Icon as={FiDatabase} mr={2} />システム</Tab>
            <Tab><Icon as={FiHelpCircle} mr={2} />ヘルプ</Tab>
          </TabList>

          <TabPanels>
            {/* プロフィール設定 */}
            <TabPanel>
              <Card bg={bgColor}>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Center>
                      <VStack spacing={4}>
                        <Avatar size="2xl" name="田中 太郎" bg="orange.500" />
                        <Button leftIcon={<FiCamera />} size="sm" colorScheme="orange" variant="outline">
                          写真を変更
                        </Button>
                      </VStack>
                    </Center>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl>
                        <FormLabel>名前</FormLabel>
                        <Input defaultValue="田中 太郎" />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>メールアドレス</FormLabel>
                        <Input type="email" defaultValue="tanaka@zaikoban.jp" />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>電話番号</FormLabel>
                        <Input type="tel" defaultValue="03-1234-5678" />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>役職</FormLabel>
                        <Select defaultValue="manager">
                          <option value="admin">管理者</option>
                          <option value="manager">マネージャー</option>
                          <option value="staff">スタッフ</option>
                        </Select>
                      </FormControl>
                    </SimpleGrid>

                    <Divider />

                    <VStack align="stretch" spacing={3}>
                      <Heading size="sm">パスワード変更</Heading>
                      <FormControl>
                        <FormLabel>現在のパスワード</FormLabel>
                        <Input type="password" placeholder="現在のパスワードを入力" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>新しいパスワード</FormLabel>
                        <Input type="password" placeholder="新しいパスワードを入力" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>新しいパスワード（確認）</FormLabel>
                        <Input type="password" placeholder="もう一度入力してください" />
                      </FormControl>
                    </VStack>

                    <HStack justify="flex-end">
                      <Button variant="outline">キャンセル</Button>
                      <Button 
                        colorScheme="orange" 
                        leftIcon={<FiSave />}
                        onClick={() => handleSave('プロフィール')}
                      >
                        保存する
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* 店舗情報 */}
            <TabPanel>
              <Card bg={bgColor}>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl>
                        <FormLabel>店舗名</FormLabel>
                        <Input 
                          value={storeName} 
                          onChange={(e) => setStoreName(e.target.value)}
                        />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>業態</FormLabel>
                        <Select defaultValue="restaurant">
                          <option value="restaurant">レストラン</option>
                          <option value="cafe">カフェ</option>
                          <option value="bar">バー</option>
                          <option value="izakaya">居酒屋</option>
                          <option value="other">その他</option>
                        </Select>
                      </FormControl>
                      
                      <FormControl gridColumn={{ md: 'span 2' }}>
                        <FormLabel>住所</FormLabel>
                        <Input 
                          value={storeAddress} 
                          onChange={(e) => setStoreAddress(e.target.value)}
                        />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>営業開始時間</FormLabel>
                        <Input 
                          type="time" 
                          value={openTime}
                          onChange={(e) => setOpenTime(e.target.value)}
                        />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>営業終了時間</FormLabel>
                        <Input 
                          type="time" 
                          value={closeTime}
                          onChange={(e) => setCloseTime(e.target.value)}
                        />
                      </FormControl>
                      
                      <FormControl gridColumn={{ md: 'span 2' }}>
                        <FormLabel>定休日</FormLabel>
                        <HStack spacing={3} flexWrap="wrap">
                          {['月', '火', '水', '木', '金', '土', '日'].map((day) => (
                            <Button 
                              key={day} 
                              size="sm" 
                              variant="outline"
                              colorScheme={day === '水' ? 'orange' : 'gray'}
                            >
                              {day}
                            </Button>
                          ))}
                        </HStack>
                      </FormControl>
                    </SimpleGrid>

                    <Divider />

                    <Box>
                      <Heading size="sm" mb={3}>店舗マップ</Heading>
                      <Box 
                        h="200px" 
                        bg="gray.100" 
                        borderRadius="lg" 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                      >
                        <VStack>
                          <Icon as={FiMapPin} fontSize="3xl" color="gray.400" />
                          <Text color="gray.500">地図を表示</Text>
                          <Button size="sm" colorScheme="orange" variant="outline">
                            地図を設定
                          </Button>
                        </VStack>
                      </Box>
                    </Box>

                    <HStack justify="flex-end">
                      <Button variant="outline">キャンセル</Button>
                      <Button 
                        colorScheme="orange" 
                        leftIcon={<FiSave />}
                        onClick={() => handleSave('店舗情報')}
                      >
                        保存する
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* 商品設定 */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                {/* カテゴリ管理 */}
                <Card bg={bgColor}>
                  <CardHeader>
                    <HStack justify="space-between">
                      <Heading size="md">カテゴリ管理</Heading>
                      <Button 
                        size="sm" 
                        colorScheme="orange" 
                        leftIcon={<FiPlus />}
                        onClick={() => handleModalOpen('category')}
                      >
                        カテゴリ追加
                      </Button>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
                      {mockCategories.map((category) => (
                        <Card key={category.id} variant="outline">
                          <CardBody>
                            <VStack spacing={2}>
                              <Text fontSize="2xl">{category.icon}</Text>
                              <Text fontWeight="bold">{category.name}</Text>
                              <Badge colorScheme={category.color}>{category.count}商品</Badge>
                              <HStack>
                                <IconButton
                                  aria-label="編集"
                                  icon={<FiEdit2 />}
                                  size="xs"
                                  variant="ghost"
                                />
                                <IconButton
                                  aria-label="削除"
                                  icon={<FiTrash2 />}
                                  size="xs"
                                  variant="ghost"
                                  colorScheme="red"
                                />
                              </HStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {/* 単位マスタ */}
                <Card bg={bgColor}>
                  <CardHeader>
                    <HStack justify="space-between">
                      <Heading size="md">単位マスタ</Heading>
                      <Button 
                        size="sm" 
                        colorScheme="orange" 
                        leftIcon={<FiPlus />}
                        onClick={() => handleModalOpen('unit')}
                      >
                        単位追加
                      </Button>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>単位名</Th>
                            <Th>記号</Th>
                            <Th>種類</Th>
                            <Th>操作</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {mockUnits.map((unit) => (
                            <Tr key={unit.id}>
                              <Td>{unit.name}</Td>
                              <Td>
                                <Badge>{unit.symbol}</Badge>
                              </Td>
                              <Td>{unit.type}</Td>
                              <Td>
                                <HStack spacing={2}>
                                  <IconButton
                                    aria-label="編集"
                                    icon={<FiEdit2 />}
                                    size="sm"
                                    variant="ghost"
                                  />
                                  <IconButton
                                    aria-label="削除"
                                    icon={<FiTrash2 />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="red"
                                  />
                                </HStack>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>

                {/* 在庫設定 */}
                <Card bg={bgColor}>
                  <CardHeader>
                    <Heading size="md">在庫アラート設定</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <FormControl>
                        <FormLabel>
                          期限切れアラート（{alertDays}日前）
                        </FormLabel>
                        <Slider 
                          value={alertDays} 
                          onChange={setAlertDays}
                          min={1}
                          max={14}
                          colorScheme="orange"
                        >
                          <SliderMark value={1} mt={2} fontSize="sm">1日</SliderMark>
                          <SliderMark value={7} mt={2} ml={-2} fontSize="sm">7日</SliderMark>
                          <SliderMark value={14} mt={2} ml={-4} fontSize="sm">14日</SliderMark>
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      </FormControl>

                      <FormControl>
                        <FormLabel>
                          在庫不足アラート（残り{stockLevel}%）
                        </FormLabel>
                        <Slider 
                          value={stockLevel} 
                          onChange={setStockLevel}
                          min={5}
                          max={50}
                          step={5}
                          colorScheme="orange"
                        >
                          <SliderMark value={10} mt={2} fontSize="sm">10%</SliderMark>
                          <SliderMark value={30} mt={2} ml={-2} fontSize="sm">30%</SliderMark>
                          <SliderMark value={50} mt={2} ml={-4} fontSize="sm">50%</SliderMark>
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      </FormControl>

                      <HStack justify="flex-end">
                        <Button 
                          colorScheme="orange" 
                          leftIcon={<FiSave />}
                          onClick={() => handleSave('商品設定')}
                        >
                          保存する
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* 通知設定 */}
            <TabPanel>
              <Card bg={bgColor}>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Alert status="info" borderRadius="lg">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>通知について</AlertTitle>
                        <AlertDescription>
                          重要な情報をタイムリーにお知らせします。必要な通知だけをONにしてください。
                        </AlertDescription>
                      </Box>
                    </Alert>

                    <VStack align="stretch" spacing={4}>
                      <HStack justify="space-between" p={4} bg="orange.50" borderRadius="lg">
                        <HStack>
                          <Icon as={FiPackage} color="orange.500" fontSize="xl" />
                          <Box>
                            <Text fontWeight="bold">在庫不足アラート</Text>
                            <Text fontSize="sm" color="gray.600">
                              在庫が設定値を下回ったときに通知
                            </Text>
                          </Box>
                        </HStack>
                        <Switch 
                          isChecked={notifications.stockAlert}
                          onChange={(e) => setNotifications({...notifications, stockAlert: e.target.checked})}
                          colorScheme="orange"
                          size="lg"
                        />
                      </HStack>

                      <HStack justify="space-between" p={4} bg="red.50" borderRadius="lg">
                        <HStack>
                          <Icon as={FiClock} color="red.500" fontSize="xl" />
                          <Box>
                            <Text fontWeight="bold">期限切れアラート</Text>
                            <Text fontSize="sm" color="gray.600">
                              商品の期限が近づいたときに通知
                            </Text>
                          </Box>
                        </HStack>
                        <Switch 
                          isChecked={notifications.expiryAlert}
                          onChange={(e) => setNotifications({...notifications, expiryAlert: e.target.checked})}
                          colorScheme="orange"
                          size="lg"
                        />
                      </HStack>

                      <HStack justify="space-between" p={4} bg="blue.50" borderRadius="lg">
                        <HStack>
                          <Icon as={FiShield} color="blue.500" fontSize="xl" />
                          <Box>
                            <Text fontWeight="bold">発注リマインダー</Text>
                            <Text fontSize="sm" color="gray.600">
                              定期発注の時期をお知らせ
                            </Text>
                          </Box>
                        </HStack>
                        <Switch 
                          isChecked={notifications.orderReminder}
                          onChange={(e) => setNotifications({...notifications, orderReminder: e.target.checked})}
                          colorScheme="orange"
                          size="lg"
                        />
                      </HStack>

                      <HStack justify="space-between" p={4} bg="green.50" borderRadius="lg">
                        <HStack>
                          <Icon as={FiMail} color="green.500" fontSize="xl" />
                          <Box>
                            <Text fontWeight="bold">レポートサマリー</Text>
                            <Text fontSize="sm" color="gray.600">
                              毎日の売上・在庫サマリーを送信
                            </Text>
                          </Box>
                        </HStack>
                        <Switch 
                          isChecked={notifications.reportSummary}
                          onChange={(e) => setNotifications({...notifications, reportSummary: e.target.checked})}
                          colorScheme="orange"
                          size="lg"
                        />
                      </HStack>

                      <HStack justify="space-between" p={4} bg="purple.50" borderRadius="lg">
                        <HStack>
                          <Icon as={FiRefreshCw} color="purple.500" fontSize="xl" />
                          <Box>
                            <Text fontWeight="bold">システムアップデート</Text>
                            <Text fontSize="sm" color="gray.600">
                              新機能やメンテナンス情報
                            </Text>
                          </Box>
                        </HStack>
                        <Switch 
                          isChecked={notifications.systemUpdate}
                          onChange={(e) => setNotifications({...notifications, systemUpdate: e.target.checked})}
                          colorScheme="orange"
                          size="lg"
                        />
                      </HStack>
                    </VStack>

                    <Divider />

                    <VStack align="stretch" spacing={3}>
                      <Heading size="sm">通知方法</Heading>
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        <HStack p={3} borderWidth={1} borderRadius="lg" borderColor="orange.300" bg="orange.50">
                          <Icon as={FiMonitor} color="orange.500" />
                          <Text>画面通知</Text>
                          <Badge colorScheme="green">有効</Badge>
                        </HStack>
                        <HStack p={3} borderWidth={1} borderRadius="lg">
                          <Icon as={FiMail} />
                          <Text>メール通知</Text>
                          <Badge>設定</Badge>
                        </HStack>
                        <HStack p={3} borderWidth={1} borderRadius="lg">
                          <Icon as={FiSmartphone} />
                          <Text>プッシュ通知</Text>
                          <Badge>設定</Badge>
                        </HStack>
                      </SimpleGrid>
                    </VStack>

                    <HStack justify="flex-end">
                      <Button 
                        colorScheme="orange" 
                        leftIcon={<FiSave />}
                        onClick={() => handleSave('通知設定')}
                      >
                        保存する
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* 画面設定 */}
            <TabPanel>
              <Card bg={bgColor}>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <VStack align="stretch" spacing={4}>
                      <Heading size="sm">テーマカラー</Heading>
                      <RadioGroup value={theme} onChange={setTheme}>
                        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                          <Card 
                            p={3} 
                            borderWidth={2} 
                            borderColor={theme === 'orange' ? 'orange.500' : 'gray.200'}
                            cursor="pointer"
                            onClick={() => setTheme('orange')}
                          >
                            <VStack>
                              <Box w={12} h={12} bg="orange.500" borderRadius="lg" />
                              <Radio value="orange">オレンジ</Radio>
                            </VStack>
                          </Card>
                          <Card 
                            p={3} 
                            borderWidth={2} 
                            borderColor={theme === 'blue' ? 'blue.500' : 'gray.200'}
                            cursor="pointer"
                            onClick={() => setTheme('blue')}
                          >
                            <VStack>
                              <Box w={12} h={12} bg="blue.500" borderRadius="lg" />
                              <Radio value="blue">ブルー</Radio>
                            </VStack>
                          </Card>
                          <Card 
                            p={3} 
                            borderWidth={2} 
                            borderColor={theme === 'green' ? 'green.500' : 'gray.200'}
                            cursor="pointer"
                            onClick={() => setTheme('green')}
                          >
                            <VStack>
                              <Box w={12} h={12} bg="green.500" borderRadius="lg" />
                              <Radio value="green">グリーン</Radio>
                            </VStack>
                          </Card>
                          <Card 
                            p={3} 
                            borderWidth={2} 
                            borderColor={theme === 'purple' ? 'purple.500' : 'gray.200'}
                            cursor="pointer"
                            onClick={() => setTheme('purple')}
                          >
                            <VStack>
                              <Box w={12} h={12} bg="purple.500" borderRadius="lg" />
                              <Radio value="purple">パープル</Radio>
                            </VStack>
                          </Card>
                        </SimpleGrid>
                      </RadioGroup>
                    </VStack>

                    <Divider />

                    <VStack align="stretch" spacing={4}>
                      <Heading size="sm">文字サイズ</Heading>
                      <RadioGroup value={fontSize} onChange={setFontSize}>
                        <HStack spacing={4}>
                          <Card 
                            p={4} 
                            borderWidth={2} 
                            borderColor={fontSize === 'small' ? 'orange.500' : 'gray.200'}
                            cursor="pointer"
                            onClick={() => setFontSize('small')}
                          >
                            <VStack>
                              <Icon as={FiType} fontSize="lg" />
                              <Radio value="small">小</Radio>
                            </VStack>
                          </Card>
                          <Card 
                            p={4} 
                            borderWidth={2} 
                            borderColor={fontSize === 'medium' ? 'orange.500' : 'gray.200'}
                            cursor="pointer"
                            onClick={() => setFontSize('medium')}
                          >
                            <VStack>
                              <Icon as={FiType} fontSize="xl" />
                              <Radio value="medium">中</Radio>
                            </VStack>
                          </Card>
                          <Card 
                            p={4} 
                            borderWidth={2} 
                            borderColor={fontSize === 'large' ? 'orange.500' : 'gray.200'}
                            cursor="pointer"
                            onClick={() => setFontSize('large')}
                          >
                            <VStack>
                              <Icon as={FiType} fontSize="2xl" />
                              <Radio value="large">大</Radio>
                            </VStack>
                          </Card>
                        </HStack>
                      </RadioGroup>
                    </VStack>

                    <Divider />

                    <VStack align="stretch" spacing={4}>
                      <Heading size="sm">その他の設定</Heading>
                      <Stack spacing={3}>
                        <HStack justify="space-between">
                          <HStack>
                            <Icon as={FiMoon} />
                            <Text>ダークモード</Text>
                          </HStack>
                          <Switch colorScheme="orange" />
                        </HStack>
                        <HStack justify="space-between">
                          <HStack>
                            <Icon as={FiGlobe} />
                            <Text>言語</Text>
                          </HStack>
                          <Select w="150px" defaultValue="ja">
                            <option value="ja">日本語</option>
                            <option value="en">English</option>
                            <option value="zh">中文</option>
                          </Select>
                        </HStack>
                      </Stack>
                    </VStack>

                    <HStack justify="flex-end">
                      <Button 
                        colorScheme="orange" 
                        leftIcon={<FiSave />}
                        onClick={() => handleSave('画面設定')}
                      >
                        保存する
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* ユーザー管理 */}
            <TabPanel>
              <Card bg={bgColor}>
                <CardHeader>
                  <HStack justify="space-between">
                    <Heading size="md">ユーザー一覧</Heading>
                    <Button 
                      colorScheme="orange" 
                      leftIcon={<FiPlus />}
                      onClick={() => handleModalOpen('user')}
                    >
                      ユーザー追加
                    </Button>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <TableContainer>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>ユーザー</Th>
                          <Th>メールアドレス</Th>
                          <Th>役割</Th>
                          <Th>ステータス</Th>
                          <Th>操作</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {mockUsers.map((user) => (
                          <Tr key={user.id}>
                            <Td>
                              <HStack>
                                <Text fontSize="xl">{user.avatar}</Text>
                                <Text fontWeight="bold">{user.name}</Text>
                              </HStack>
                            </Td>
                            <Td>{user.email}</Td>
                            <Td>
                              <Badge colorScheme={getRoleBadgeColor(user.role)}>
                                {user.role}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge colorScheme={user.status === 'active' ? 'green' : 'gray'}>
                                {user.status === 'active' ? '有効' : '無効'}
                              </Badge>
                            </Td>
                            <Td>
                              <HStack spacing={2}>
                                <Tooltip label="編集">
                                  <IconButton
                                    aria-label="編集"
                                    icon={<FiEdit2 />}
                                    size="sm"
                                    variant="ghost"
                                  />
                                </Tooltip>
                                <Tooltip label={user.status === 'active' ? '無効化' : '有効化'}>
                                  <IconButton
                                    aria-label="ステータス変更"
                                    icon={user.status === 'active' ? <FiLock /> : <FiUnlock />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme={user.status === 'active' ? 'orange' : 'green'}
                                  />
                                </Tooltip>
                                <Tooltip label="削除">
                                  <IconButton
                                    aria-label="削除"
                                    icon={<FiTrash2 />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="red"
                                  />
                                </Tooltip>
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
            </TabPanel>

            {/* システム */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Card bg={bgColor}>
                  <CardHeader>
                    <Heading size="md">データ管理</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Card variant="outline">
                        <CardBody>
                          <VStack spacing={3}>
                            <Icon as={FiDownload} fontSize="2xl" color="blue.500" />
                            <Text fontWeight="bold">バックアップ</Text>
                            <Text fontSize="sm" color="gray.600" textAlign="center">
                              データのバックアップを作成します
                            </Text>
                            <Button colorScheme="blue" size="sm" leftIcon={<FiDownload />}>
                              バックアップ作成
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>

                      <Card variant="outline">
                        <CardBody>
                          <VStack spacing={3}>
                            <Icon as={FiUpload} fontSize="2xl" color="green.500" />
                            <Text fontWeight="bold">リストア</Text>
                            <Text fontSize="sm" color="gray.600" textAlign="center">
                              バックアップからデータを復元します
                            </Text>
                            <Button colorScheme="green" size="sm" leftIcon={<FiUpload />}>
                              データ復元
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>

                      <Card variant="outline">
                        <CardBody>
                          <VStack spacing={3}>
                            <Icon as={FiDatabase} fontSize="2xl" color="purple.500" />
                            <Text fontWeight="bold">データ初期化</Text>
                            <Text fontSize="sm" color="gray.600" textAlign="center">
                              すべてのデータを初期状態に戻します
                            </Text>
                            <Button colorScheme="red" variant="outline" size="sm">
                              初期化
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>

                      <Card variant="outline">
                        <CardBody>
                          <VStack spacing={3}>
                            <Icon as={FiRefreshCw} fontSize="2xl" color="orange.500" />
                            <Text fontWeight="bold">キャッシュクリア</Text>
                            <Text fontSize="sm" color="gray.600" textAlign="center">
                              一時ファイルをクリアします
                            </Text>
                            <Button colorScheme="orange" size="sm" leftIcon={<FiRefreshCw />}>
                              クリア実行
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                <Card bg={bgColor}>
                  <CardHeader>
                    <Heading size="md">システム情報</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <HStack justify="space-between">
                        <Text color="gray.600">バージョン</Text>
                        <Badge colorScheme="green">v1.0.0</Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.600">最終更新日</Text>
                        <Text>2024年6月15日</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.600">データベース容量</Text>
                        <Text>256MB / 1GB</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.600">ライセンス</Text>
                        <Badge colorScheme="blue">プロフェッショナル</Badge>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* ヘルプ */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>サポートセンター</AlertTitle>
                    <AlertDescription>
                      お困りのことがありましたら、お気軽にお問い合わせください。
                      営業時間: 平日 9:00-18:00
                    </AlertDescription>
                  </Box>
                </Alert>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Card bg={bgColor}>
                    <CardHeader>
                      <Heading size="md">よくある質問</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <HStack as="button" justify="space-between" p={3} _hover={{ bg: 'gray.50' }}>
                          <Text>在庫データのバックアップ方法は？</Text>
                          <Icon as={FiChevronRight} />
                        </HStack>
                        <Divider />
                        <HStack as="button" justify="space-between" p={3} _hover={{ bg: 'gray.50' }}>
                          <Text>複数店舗での利用は可能ですか？</Text>
                          <Icon as={FiChevronRight} />
                        </HStack>
                        <Divider />
                        <HStack as="button" justify="space-between" p={3} _hover={{ bg: 'gray.50' }}>
                          <Text>レポートの出力形式を変更できますか？</Text>
                          <Icon as={FiChevronRight} />
                        </HStack>
                        <Divider />
                        <HStack as="button" justify="space-between" p={3} _hover={{ bg: 'gray.50' }}>
                          <Text>パスワードを忘れた場合は？</Text>
                          <Icon as={FiChevronRight} />
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card bg={bgColor}>
                    <CardHeader>
                      <Heading size="md">お問い合わせ</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4}>
                        <Button 
                          w="full" 
                          colorScheme="orange" 
                          leftIcon={<FiMail />}
                          size="lg"
                        >
                          メールで問い合わせ
                        </Button>
                        <Button 
                          w="full" 
                          colorScheme="green" 
                          leftIcon={<FiSmartphone />}
                          size="lg"
                        >
                          電話で問い合わせ
                        </Button>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          📞 03-1234-5678<br />
                          ✉️ support@zaikoban.jp
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                <Card bg="orange.50" borderColor="orange.200" borderWidth={2}>
                  <CardBody>
                    <HStack spacing={4}>
                      <Icon as={FiHelpCircle} color="orange.500" fontSize="3xl" />
                      <VStack align="start" flex={1}>
                        <Text fontWeight="bold" color="orange.700">
                          操作マニュアル
                        </Text>
                        <Text color="orange.600" fontSize="sm">
                          詳しい操作方法はマニュアルをご覧ください
                        </Text>
                      </VStack>
                      <Button colorScheme="orange" leftIcon={<FiDownload />}>
                        ダウンロード
                      </Button>
                    </HStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* モーダル */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalType === 'user' && 'ユーザー追加'}
            {modalType === 'category' && 'カテゴリ追加'}
            {modalType === 'unit' && '単位追加'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalType === 'user' && (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>名前</FormLabel>
                  <Input placeholder="山田 太郎" />
                </FormControl>
                <FormControl>
                  <FormLabel>メールアドレス</FormLabel>
                  <Input type="email" placeholder="yamada@example.com" />
                </FormControl>
                <FormControl>
                  <FormLabel>役割</FormLabel>
                  <Select>
                    <option>スタッフ</option>
                    <option>マネージャー</option>
                    <option>管理者</option>
                  </Select>
                </FormControl>
              </VStack>
            )}
            {modalType === 'category' && (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>カテゴリ名</FormLabel>
                  <Input placeholder="例: デザート" />
                </FormControl>
                <FormControl>
                  <FormLabel>アイコン</FormLabel>
                  <Input placeholder="例: 🍰" />
                </FormControl>
                <FormControl>
                  <FormLabel>カラー</FormLabel>
                  <Select>
                    <option value="red">赤</option>
                    <option value="blue">青</option>
                    <option value="green">緑</option>
                    <option value="yellow">黄</option>
                    <option value="purple">紫</option>
                  </Select>
                </FormControl>
              </VStack>
            )}
            {modalType === 'unit' && (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>単位名</FormLabel>
                  <Input placeholder="例: ダース" />
                </FormControl>
                <FormControl>
                  <FormLabel>記号</FormLabel>
                  <Input placeholder="例: dz" />
                </FormControl>
                <FormControl>
                  <FormLabel>種類</FormLabel>
                  <Select>
                    <option>重量</option>
                    <option>容量</option>
                    <option>個数</option>
                    <option>長さ</option>
                  </Select>
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              キャンセル
            </Button>
            <Button 
              colorScheme="orange" 
              onClick={() => {
                handleSave(modalType === 'user' ? 'ユーザー' : modalType === 'category' ? 'カテゴリ' : '単位');
                onClose();
              }}
            >
              追加
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};