import React, {useState} from 'react';
import {
    AlertDescription,
    AlertRoot,
    AlertTitle,
    Badge,
    Box,
    Button,
    CardBody,
    CardHeader,
    CardRoot,
    Center,
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
    Heading,
    HStack,
    Icon,
    IconButton,
    Input,
    NativeSelectField,
    NativeSelectRoot,
    Separator,
    SimpleGrid,
    SliderMarker,
    SliderRange,
    SliderRoot,
    SliderThumb,
    SliderTrack,
    Stack,
    SwitchRoot,
    SwitchThumb,
    Table,
    TabsContent,
    TabsList,
    TabsRoot,
    TabsTrigger,
    Text,
    TooltipContent,
    TooltipRoot,
    TooltipTrigger,
    VStack,
} from '@chakra-ui/react';
import {
    FiBell,
    FiCamera,
    FiChevronRight,
    FiClock,
    FiDatabase,
    FiDownload,
    FiEdit2,
    FiGlobe,
    FiHelpCircle,
    FiInfo,
    FiLock,
    FiMail,
    FiMapPin,
    FiMonitor,
    FiMoon,
    FiPackage,
    FiPlus,
    FiRefreshCw,
    FiSave,
    FiSettings,
    FiShield,
    FiSmartphone,
    FiTrash2,
    FiType,
    FiUnlock,
    FiUpload,
    FiUser,
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

    const toast = createToaster({
        placement: 'top',
    });
    const bgColor = 'white'; // useColorModeValue('white', 'gray.800');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const handleSave = (section: string) => {
      toast.create({
      title: '設定を保存しました',
      description: `${section}の設定が正常に保存されました`,
      duration: 3000,
    });
  };

  const handleModalOpen = (type: string) => {
    setModalType(type);
      setIsDialogOpen(true);
  };

    const handleModalClose = () => {
        setIsDialogOpen(false);
        setModalType('');
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
        <VStack align="stretch" gap={6}>
            <VStack align="start" gap={1}>
          <Heading size="lg" color="gray.800">
            <Icon as={FiSettings} mr={2} />
            設定
          </Heading>
          <Text color="gray.600">システムの各種設定を管理します</Text>
        </VStack>

        {/* タブ */}
            <TabsRoot colorScheme="orange" variant="enclosed" defaultValue="profile">
                <TabsList flexWrap="wrap">
                    <TabsTrigger value="profile"><Icon as={FiUser} mr={2}/>プロフィール</TabsTrigger>
                    <TabsTrigger value="store"><Icon as={FiMapPin} mr={2}/>店舗情報</TabsTrigger>
                    <TabsTrigger value="products"><Icon as={FiPackage} mr={2}/>商品設定</TabsTrigger>
                    <TabsTrigger value="notifications"><Icon as={FiBell} mr={2}/>通知設定</TabsTrigger>
                    <TabsTrigger value="appearance"><Icon as={FiMonitor} mr={2}/>画面設定</TabsTrigger>
                    <TabsTrigger value="users"><Icon as={FiShield} mr={2}/>ユーザー管理</TabsTrigger>
                    <TabsTrigger value="system"><Icon as={FiDatabase} mr={2}/>システム</TabsTrigger>
                    <TabsTrigger value="help"><Icon as={FiHelpCircle} mr={2}/>ヘルプ</TabsTrigger>
                </TabsList>
            {/* プロフィール設定 */}
                <TabsContent value="profile">
                    <CardRoot bg={bgColor}>
                <CardBody>
                    <VStack gap={6} align="stretch">
                    <Center>
                        <VStack gap={4}>
                            <Box
                                display="inline-flex"
                                alignItems="center"
                                justifyContent="center"
                                width="80px"
                                height="80px"
                                borderRadius="full"
                                bg="orange.500"
                                color="white"
                                fontSize="xl"
                                fontWeight="semibold"
                            >
                                田中
                            </Box>
                            <Button size="sm" colorScheme="orange" variant="outline">
                                <HStack gap={1}>
                                    <FiCamera/>
                                    <Text>写真を変更</Text>
                                </HStack>
                            </Button>
                      </VStack>
                    </Center>

                        <SimpleGrid columns={{base: 1, md: 2}} gap={4}>
                            <FieldRoot>
                                <FieldLabel>名前</FieldLabel>
                        <Input defaultValue="田中 太郎" />
                            </FieldRoot>

                            <FieldRoot>
                                <FieldLabel>メールアドレス</FieldLabel>
                        <Input type="email" defaultValue="tanaka@zaikoban.jp" />
                            </FieldRoot>

                            <FieldRoot>
                                <FieldLabel>電話番号</FieldLabel>
                        <Input type="tel" defaultValue="03-1234-5678" />
                            </FieldRoot>

                            <FieldRoot>
                                <FieldLabel>役職</FieldLabel>
                                <NativeSelectRoot>
                                    <NativeSelectField defaultValue="manager">
                                        <option value="admin">管理者</option>
                                        <option value="manager">マネージャー</option>
                                        <option value="staff">スタッフ</option>
                                    </NativeSelectField>
                                </NativeSelectRoot>
                            </FieldRoot>
                    </SimpleGrid>

                        <Separator/>

                        <VStack align="stretch" gap={3}>
                      <Heading size="sm">パスワード変更</Heading>
                            <FieldRoot>
                                <FieldLabel>現在のパスワード</FieldLabel>
                        <Input type="password" placeholder="現在のパスワードを入力" />
                            </FieldRoot>
                            <FieldRoot>
                                <FieldLabel>新しいパスワード</FieldLabel>
                        <Input type="password" placeholder="新しいパスワードを入力" />
                            </FieldRoot>
                            <FieldRoot>
                                <FieldLabel>新しいパスワード（確認）</FieldLabel>
                        <Input type="password" placeholder="もう一度入力してください" />
                            </FieldRoot>
                    </VStack>

                    <HStack justify="flex-end">
                      <Button variant="outline">キャンセル</Button>
                      <Button 
                        colorScheme="orange" 
                        onClick={() => handleSave('プロフィール')}
                      >
                          <FiSave/>
                        保存する
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
                    </CardRoot>
                </TabsContent>

            {/* 店舗情報 */}
                <TabsContent value="store">
                    <CardRoot bg={bgColor}>
                <CardBody>
                    <VStack gap={6} align="stretch">
                        <SimpleGrid columns={{base: 1, md: 2}} gap={4}>
                            <FieldRoot>
                                <FieldLabel>店舗名</FieldLabel>
                        <Input 
                          value={storeName} 
                          onChange={(e) => setStoreName(e.target.value)}
                        />
                            </FieldRoot>

                            <FieldRoot>
                                <FieldLabel>業態</FieldLabel>
                                <NativeSelectRoot>
                                    <NativeSelectField defaultValue="restaurant">
                                        <option value="restaurant">レストラン</option>
                                        <option value="cafe">カフェ</option>
                                        <option value="bar">バー</option>
                                        <option value="izakaya">居酒屋</option>
                                        <option value="other">その他</option>
                                    </NativeSelectField>
                                </NativeSelectRoot>
                            </FieldRoot>

                            <FieldRoot gridColumn={{md: 'span 2'}}>
                                <FieldLabel>住所</FieldLabel>
                        <Input 
                          value={storeAddress} 
                          onChange={(e) => setStoreAddress(e.target.value)}
                        />
                            </FieldRoot>

                            <FieldRoot>
                                <FieldLabel>営業開始時間</FieldLabel>
                        <Input 
                          type="time" 
                          value={openTime}
                          onChange={(e) => setOpenTime(e.target.value)}
                        />
                            </FieldRoot>

                            <FieldRoot>
                                <FieldLabel>営業終了時間</FieldLabel>
                        <Input 
                          type="time" 
                          value={closeTime}
                          onChange={(e) => setCloseTime(e.target.value)}
                        />
                            </FieldRoot>

                            <FieldRoot gridColumn={{md: 'span 2'}}>
                                <FieldLabel>定休日</FieldLabel>
                          <HStack gap={3} flexWrap="wrap">
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
                            </FieldRoot>
                    </SimpleGrid>

                        <Separator/>

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
                        onClick={() => handleSave('店舗情報')}
                      >
                          <FiSave/>
                        保存する
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
                    </CardRoot>
                </TabsContent>

            {/* 商品設定 */}
                <TabsContent value="products">
                <VStack gap={6} align="stretch">
                {/* カテゴリ管理 */}
                    <CardRoot bg={bgColor}>
                  <CardHeader>
                    <HStack justify="space-between">
                      <Heading size="md">カテゴリ管理</Heading>
                      <Button 
                        size="sm" 
                        colorScheme="orange" 
                        onClick={() => handleModalOpen('category')}
                      >
                          <FiPlus/>
                        カテゴリ追加
                      </Button>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                      <SimpleGrid columns={{base: 2, md: 3, lg: 5}} gap={4}>
                      {mockCategories.map((category) => (
                          <CardRoot key={category.id} variant="outline">
                          <CardBody>
                              <VStack gap={2}>
                              <Text fontSize="2xl">{category.icon}</Text>
                              <Text fontWeight="bold">{category.name}</Text>
                              <Badge colorScheme={category.color}>{category.count}商品</Badge>
                              <HStack>
                                <IconButton
                                  aria-label="編集"
                                  size="xs"
                                  variant="ghost"
                                >
                                    <FiEdit2/>
                                </IconButton>
                                <IconButton
                                  aria-label="削除"
                                  size="xs"
                                  variant="ghost"
                                  colorScheme="red"
                                >
                                    <FiTrash2/>
                                </IconButton>
                              </HStack>
                            </VStack>
                          </CardBody>
                          </CardRoot>
                      ))}
                    </SimpleGrid>
                  </CardBody>
                    </CardRoot>

                {/* 単位マスタ */}
                    <CardRoot bg={bgColor}>
                  <CardHeader>
                    <HStack justify="space-between">
                      <Heading size="md">単位マスタ</Heading>
                      <Button 
                        size="sm" 
                        colorScheme="orange" 
                        onClick={() => handleModalOpen('unit')}
                      >
                          <FiPlus/>
                        単位追加
                      </Button>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                      <Table.ScrollArea>
                          <Table.Root>
                              <Table.Header>
                                  <Table.Row>
                                      <Table.ColumnHeader>単位名</Table.ColumnHeader>
                                      <Table.ColumnHeader>記号</Table.ColumnHeader>
                                      <Table.ColumnHeader>種類</Table.ColumnHeader>
                                      <Table.ColumnHeader>操作</Table.ColumnHeader>
                                  </Table.Row>
                              </Table.Header>
                              <Table.Body>
                          {mockUnits.map((unit) => (
                              <Table.Row key={unit.id}>
                                  <Table.Cell>{unit.name}</Table.Cell>
                                  <Table.Cell>
                                <Badge>{unit.symbol}</Badge>
                                  </Table.Cell>
                                  <Table.Cell>{unit.type}</Table.Cell>
                                  <Table.Cell>
                                  <HStack gap={2}>
                                  <IconButton
                                    aria-label="編集"
                                    size="sm"
                                    variant="ghost"
                                  >
                                      <FiEdit2/>
                                  </IconButton>
                                  <IconButton
                                    aria-label="削除"
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="red"
                                  >
                                      <FiTrash2/>
                                  </IconButton>
                                </HStack>
                                  </Table.Cell>
                              </Table.Row>
                          ))}
                              </Table.Body>
                          </Table.Root>
                      </Table.ScrollArea>
                  </CardBody>
                    </CardRoot>

                {/* 在庫設定 */}
                    <CardRoot bg={bgColor}>
                  <CardHeader>
                    <Heading size="md">在庫アラート設定</Heading>
                  </CardHeader>
                  <CardBody>
                      <VStack gap={6} align="stretch">
                          <FieldRoot>
                              <FieldLabel>
                          期限切れアラート（{alertDays}日前）
                              </FieldLabel>
                              <SliderRoot
                                  value={[alertDays]}
                                  onValueChange={(details) => setAlertDays(details.value[0])}
                          min={1}
                          max={14}
                                  colorPalette="orange"
                        >
                          <SliderTrack>
                              <SliderRange/>
                          </SliderTrack>
                                  <SliderThumb index={0}/>
                                  <SliderMarker value={1}>
                                      1日
                                  </SliderMarker>
                                  <SliderMarker value={7}>
                                      7日
                                  </SliderMarker>
                                  <SliderMarker value={14}>
                                      14日
                                  </SliderMarker>
                              </SliderRoot>
                          </FieldRoot>

                          <FieldRoot>
                              <FieldLabel>
                          在庫不足アラート（残り{stockLevel}%）
                              </FieldLabel>
                              <SliderRoot
                                  value={[stockLevel]}
                                  onValueChange={(details) => setStockLevel(details.value[0])}
                          min={5}
                          max={50}
                          step={5}
                                  colorPalette="orange"
                        >
                          <SliderTrack>
                              <SliderRange/>
                          </SliderTrack>
                                  <SliderThumb index={0}/>
                                  <SliderMarker value={10}>
                                      10%
                                  </SliderMarker>
                                  <SliderMarker value={30}>
                                      30%
                                  </SliderMarker>
                                  <SliderMarker value={50}>
                                      50%
                                  </SliderMarker>
                              </SliderRoot>
                          </FieldRoot>

                      <HStack justify="flex-end">
                        <Button 
                          colorScheme="orange" 
                          onClick={() => handleSave('商品設定')}
                        >
                            <FiSave/>
                          保存する
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                    </CardRoot>
              </VStack>
                </TabsContent>

            {/* 通知設定 */}
                <TabsContent value="notifications">
                    <CardRoot bg={bgColor}>
                <CardBody>
                    <VStack gap={6} align="stretch">
                        <AlertRoot status="info" borderRadius="lg">
                            <Icon as={FiInfo}/>
                      <Box>
                        <AlertTitle>通知について</AlertTitle>
                        <AlertDescription>
                          重要な情報をタイムリーにお知らせします。必要な通知だけをONにしてください。
                        </AlertDescription>
                      </Box>
                        </AlertRoot>

                        <VStack align="stretch" gap={4}>
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
                          <SwitchRoot
                              checked={notifications.stockAlert}
                              onCheckedChange={(details) => setNotifications({
                                  ...notifications,
                                  stockAlert: details.checked
                              })}
                              colorPalette="orange"
                          size="lg"
                          >
                              <SwitchThumb/>
                          </SwitchRoot>
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
                          <SwitchRoot
                              checked={notifications.expiryAlert}
                              onCheckedChange={(details) => setNotifications({
                                  ...notifications,
                                  expiryAlert: details.checked
                              })}
                              colorPalette="orange"
                          size="lg"
                          >
                              <SwitchThumb/>
                          </SwitchRoot>
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
                          <SwitchRoot
                              checked={notifications.orderReminder}
                              onCheckedChange={(details) => setNotifications({
                                  ...notifications,
                                  orderReminder: details.checked
                              })}
                              colorPalette="orange"
                          size="lg"
                          >
                              <SwitchThumb/>
                          </SwitchRoot>
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
                          <SwitchRoot
                              checked={notifications.reportSummary}
                              onCheckedChange={(details) => setNotifications({
                                  ...notifications,
                                  reportSummary: details.checked
                              })}
                              colorPalette="orange"
                          size="lg"
                          >
                              <SwitchThumb/>
                          </SwitchRoot>
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
                          <SwitchRoot
                              checked={notifications.systemUpdate}
                              onCheckedChange={(details) => setNotifications({
                                  ...notifications,
                                  systemUpdate: details.checked
                              })}
                              colorPalette="orange"
                          size="lg"
                          >
                              <SwitchThumb/>
                          </SwitchRoot>
                      </HStack>
                    </VStack>

                        <Separator/>

                        <VStack align="stretch" gap={3}>
                      <Heading size="sm">通知方法</Heading>
                            <SimpleGrid columns={{base: 1, md: 3}} gap={4}>
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
                        onClick={() => handleSave('通知設定')}
                      >
                          <FiSave/>
                        保存する
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
                    </CardRoot>
                </TabsContent>

            {/* 画面設定 */}
                <TabsContent value="appearance">
                    <CardRoot bg={bgColor}>
                <CardBody>
                    <VStack gap={6} align="stretch">
                        <VStack align="stretch" gap={4}>
                      <Heading size="sm">テーマカラー</Heading>
                            <Box>
                          <SimpleGrid columns={{base: 2, md: 4}} gap={4}>
                              <CardRoot
                            p={3} 
                            borderWidth={2} 
                            borderColor={theme === 'orange' ? 'orange.500' : 'gray.200'}
                            cursor="pointer"
                            onClick={() => setTheme('orange')}
                          >
                            <VStack>
                              <Box w={12} h={12} bg="orange.500" borderRadius="lg" />
                                <Text>オレンジ</Text>
                            </VStack>
                              </CardRoot>
                              <CardRoot
                            p={3} 
                            borderWidth={2} 
                            borderColor={theme === 'blue' ? 'blue.500' : 'gray.200'}
                            cursor="pointer"
                            onClick={() => setTheme('blue')}
                          >
                            <VStack>
                              <Box w={12} h={12} bg="blue.500" borderRadius="lg" />
                                <Text>ブルー</Text>
                            </VStack>
                              </CardRoot>
                              <CardRoot
                            p={3} 
                            borderWidth={2} 
                            borderColor={theme === 'green' ? 'green.500' : 'gray.200'}
                            cursor="pointer"
                            onClick={() => setTheme('green')}
                          >
                            <VStack>
                              <Box w={12} h={12} bg="green.500" borderRadius="lg" />
                                <Text>グリーン</Text>
                            </VStack>
                              </CardRoot>
                              <CardRoot
                            p={3} 
                            borderWidth={2} 
                            borderColor={theme === 'purple' ? 'purple.500' : 'gray.200'}
                            cursor="pointer"
                            onClick={() => setTheme('purple')}
                          >
                            <VStack>
                              <Box w={12} h={12} bg="purple.500" borderRadius="lg" />
                                <Text>パープル</Text>
                            </VStack>
                              </CardRoot>
                        </SimpleGrid>
                            </Box>
                    </VStack>

                        <Separator/>

                        <VStack align="stretch" gap={4}>
                      <Heading size="sm">文字サイズ</Heading>
                            <Box>
                          <HStack gap={4}>
                              <CardRoot
                            p={4} 
                            borderWidth={2} 
                            borderColor={fontSize === 'small' ? 'orange.500' : 'gray.200'}
                            cursor="pointer"
                            onClick={() => setFontSize('small')}
                          >
                            <VStack>
                              <Icon as={FiType} fontSize="lg" />
                                <Text>小</Text>
                            </VStack>
                              </CardRoot>
                              <CardRoot
                            p={4} 
                            borderWidth={2} 
                            borderColor={fontSize === 'medium' ? 'orange.500' : 'gray.200'}
                            cursor="pointer"
                            onClick={() => setFontSize('medium')}
                          >
                            <VStack>
                              <Icon as={FiType} fontSize="xl" />
                                <Text>中</Text>
                            </VStack>
                              </CardRoot>
                              <CardRoot
                            p={4} 
                            borderWidth={2} 
                            borderColor={fontSize === 'large' ? 'orange.500' : 'gray.200'}
                            cursor="pointer"
                            onClick={() => setFontSize('large')}
                          >
                            <VStack>
                              <Icon as={FiType} fontSize="2xl" />
                                <Text>大</Text>
                            </VStack>
                              </CardRoot>
                        </HStack>
                            </Box>
                    </VStack>

                        <Separator/>

                        <VStack align="stretch" gap={4}>
                      <Heading size="sm">その他の設定</Heading>
                            <Stack gap={3}>
                        <HStack justify="space-between">
                          <HStack>
                            <Icon as={FiMoon} />
                            <Text>ダークモード</Text>
                          </HStack>
                            <SwitchRoot colorPalette="orange">
                                <SwitchThumb/>
                            </SwitchRoot>
                        </HStack>
                        <HStack justify="space-between">
                          <HStack>
                            <Icon as={FiGlobe} />
                            <Text>言語</Text>
                          </HStack>
                            <NativeSelectRoot w="150px">
                                <NativeSelectField defaultValue="ja">
                                    <option value="ja">日本語</option>
                                    <option value="en">English</option>
                                    <option value="zh">中文</option>
                                </NativeSelectField>
                            </NativeSelectRoot>
                        </HStack>
                      </Stack>
                    </VStack>

                    <HStack justify="flex-end">
                      <Button 
                        colorScheme="orange" 
                        onClick={() => handleSave('画面設定')}
                      >
                          <FiSave/>
                        保存する
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
                    </CardRoot>
                </TabsContent>

            {/* ユーザー管理 */}
                <TabsContent value="users">
                    <CardRoot bg={bgColor}>
                <CardHeader>
                  <HStack justify="space-between">
                    <Heading size="md">ユーザー一覧</Heading>
                    <Button 
                      colorScheme="orange" 
                      onClick={() => handleModalOpen('user')}
                    >
                        <FiPlus/>
                      ユーザー追加
                    </Button>
                  </HStack>
                </CardHeader>
                <CardBody>
                    <Table.ScrollArea>
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>ユーザー</Table.ColumnHeader>
                                    <Table.ColumnHeader>メールアドレス</Table.ColumnHeader>
                                    <Table.ColumnHeader>役割</Table.ColumnHeader>
                                    <Table.ColumnHeader>ステータス</Table.ColumnHeader>
                                    <Table.ColumnHeader>操作</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                        {mockUsers.map((user) => (
                            <Table.Row key={user.id}>
                                <Table.Cell>
                              <HStack>
                                <Text fontSize="xl">{user.avatar}</Text>
                                <Text fontWeight="bold">{user.name}</Text>
                              </HStack>
                                </Table.Cell>
                                <Table.Cell>{user.email}</Table.Cell>
                                <Table.Cell>
                              <Badge colorScheme={getRoleBadgeColor(user.role)}>
                                {user.role}
                              </Badge>
                                </Table.Cell>
                                <Table.Cell>
                              <Badge colorScheme={user.status === 'active' ? 'green' : 'gray'}>
                                {user.status === 'active' ? '有効' : '無効'}
                              </Badge>
                                </Table.Cell>
                                <Table.Cell>
                                <HStack gap={2}>
                                    <TooltipRoot>
                                        <TooltipTrigger asChild>
                                            <IconButton
                                                aria-label="編集"
                                                size="sm"
                                                variant="ghost"
                                            >
                                                <FiEdit2/>
                                            </IconButton>
                                        </TooltipTrigger>
                                        <TooltipContent>編集</TooltipContent>
                                    </TooltipRoot>
                                    <TooltipRoot>
                                        <TooltipTrigger asChild>
                                            <IconButton
                                                aria-label="ステータス変更"
                                                size="sm"
                                                variant="ghost"
                                                colorScheme={user.status === 'active' ? 'orange' : 'green'}
                                            >
                                                {user.status === 'active' ? <FiLock/> : <FiUnlock/>}
                                            </IconButton>
                                        </TooltipTrigger>
                                        <TooltipContent>{user.status === 'active' ? '無効化' : '有効化'}</TooltipContent>
                                    </TooltipRoot>
                                    <TooltipRoot>
                                        <TooltipTrigger asChild>
                                            <IconButton
                                                aria-label="削除"
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="red"
                                            >
                                                <FiTrash2/>
                                            </IconButton>
                                        </TooltipTrigger>
                                        <TooltipContent>削除</TooltipContent>
                                    </TooltipRoot>
                              </HStack>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                            </Table.Body>
                        </Table.Root>
                    </Table.ScrollArea>
                </CardBody>
                    </CardRoot>
                </TabsContent>

            {/* システム */}
                <TabsContent value="system">
                <VStack gap={6} align="stretch">
                    <CardRoot bg={bgColor}>
                  <CardHeader>
                    <Heading size="md">データ管理</Heading>
                  </CardHeader>
                  <CardBody>
                      <SimpleGrid columns={{base: 1, md: 2}} gap={4}>
                          <CardRoot variant="outline">
                        <CardBody>
                            <VStack gap={3}>
                            <Icon as={FiDownload} fontSize="2xl" color="blue.500" />
                            <Text fontWeight="bold">バックアップ</Text>
                            <Text fontSize="sm" color="gray.600" textAlign="center">
                              データのバックアップを作成します
                            </Text>
                                <Button colorScheme="blue" size="sm">
                                    <FiDownload/>
                              バックアップ作成
                            </Button>
                          </VStack>
                        </CardBody>
                          </CardRoot>

                          <CardRoot variant="outline">
                        <CardBody>
                            <VStack gap={3}>
                            <Icon as={FiUpload} fontSize="2xl" color="green.500" />
                            <Text fontWeight="bold">リストア</Text>
                            <Text fontSize="sm" color="gray.600" textAlign="center">
                              バックアップからデータを復元します
                            </Text>
                                <Button colorScheme="green" size="sm">
                                    <FiUpload/>
                              データ復元
                            </Button>
                          </VStack>
                        </CardBody>
                          </CardRoot>

                          <CardRoot variant="outline">
                        <CardBody>
                            <VStack gap={3}>
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
                          </CardRoot>

                          <CardRoot variant="outline">
                        <CardBody>
                            <VStack gap={3}>
                            <Icon as={FiRefreshCw} fontSize="2xl" color="orange.500" />
                            <Text fontWeight="bold">キャッシュクリア</Text>
                            <Text fontSize="sm" color="gray.600" textAlign="center">
                              一時ファイルをクリアします
                            </Text>
                                <Button colorScheme="orange" size="sm">
                                    <FiRefreshCw/>
                              クリア実行
                            </Button>
                          </VStack>
                        </CardBody>
                          </CardRoot>
                    </SimpleGrid>
                  </CardBody>
                    </CardRoot>

                    <CardRoot bg={bgColor}>
                  <CardHeader>
                    <Heading size="md">システム情報</Heading>
                  </CardHeader>
                  <CardBody>
                      <VStack align="stretch" gap={3}>
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
                    </CardRoot>
              </VStack>
                </TabsContent>

            {/* ヘルプ */}
                <TabsContent value="help">
                <VStack gap={6} align="stretch">
                    <AlertRoot status="info" borderRadius="lg">
                        <Icon as={FiInfo}/>
                  <Box>
                    <AlertTitle>サポートセンター</AlertTitle>
                    <AlertDescription>
                      お困りのことがありましたら、お気軽にお問い合わせください。
                      営業時間: 平日 9:00-18:00
                    </AlertDescription>
                  </Box>
                    </AlertRoot>

                    <SimpleGrid columns={{base: 1, md: 2}} gap={6}>
                        <CardRoot bg={bgColor}>
                    <CardHeader>
                      <Heading size="md">よくある質問</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack align="stretch" gap={3}>
                        <HStack as="button" justify="space-between" p={3} _hover={{ bg: 'gray.50' }}>
                          <Text>在庫データのバックアップ方法は？</Text>
                          <Icon as={FiChevronRight} />
                        </HStack>
                            <Separator/>
                        <HStack as="button" justify="space-between" p={3} _hover={{ bg: 'gray.50' }}>
                          <Text>複数店舗での利用は可能ですか？</Text>
                          <Icon as={FiChevronRight} />
                        </HStack>
                            <Separator/>
                        <HStack as="button" justify="space-between" p={3} _hover={{ bg: 'gray.50' }}>
                          <Text>レポートの出力形式を変更できますか？</Text>
                          <Icon as={FiChevronRight} />
                        </HStack>
                            <Separator/>
                        <HStack as="button" justify="space-between" p={3} _hover={{ bg: 'gray.50' }}>
                          <Text>パスワードを忘れた場合は？</Text>
                          <Icon as={FiChevronRight} />
                        </HStack>
                      </VStack>
                    </CardBody>
                        </CardRoot>

                        <CardRoot bg={bgColor}>
                    <CardHeader>
                      <Heading size="md">お問い合わせ</Heading>
                    </CardHeader>
                    <CardBody>
                        <VStack gap={4}>
                        <Button 
                          w="full" 
                          colorScheme="orange" 
                          size="lg"
                        >
                            <FiMail/>
                          メールで問い合わせ
                        </Button>
                        <Button 
                          w="full" 
                          colorScheme="green" 
                          size="lg"
                        >
                            <FiSmartphone/>
                          電話で問い合わせ
                        </Button>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          📞 03-1234-5678<br />
                          ✉️ support@zaikoban.jp
                        </Text>
                      </VStack>
                    </CardBody>
                        </CardRoot>
                </SimpleGrid>

                    <CardRoot bg="orange.50" borderColor="orange.200" borderWidth={2}>
                  <CardBody>
                      <HStack gap={4}>
                      <Icon as={FiHelpCircle} color="orange.500" fontSize="3xl" />
                      <VStack align="start" flex={1}>
                        <Text fontWeight="bold" color="orange.700">
                          操作マニュアル
                        </Text>
                        <Text color="orange.600" fontSize="sm">
                          詳しい操作方法はマニュアルをご覧ください
                        </Text>
                      </VStack>
                          <Button colorScheme="orange">
                              <FiDownload/>
                        ダウンロード
                      </Button>
                    </HStack>
                  </CardBody>
                    </CardRoot>
              </VStack>
                </TabsContent>
            </TabsRoot>
      </VStack>

        {/* ダイアログ */}
        <DialogRoot open={isDialogOpen} onOpenChange={({open}) => !open && handleModalClose()}>
            <DialogBackdrop/>
            <DialogPositioner>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {modalType === 'user' && 'ユーザー追加'}
                            {modalType === 'category' && 'カテゴリ追加'}
                            {modalType === 'unit' && '単位追加'}
                        </DialogTitle>
                    </DialogHeader>
                    <DialogCloseTrigger/>
                <DialogBody>
            {modalType === 'user' && (
                <VStack gap={4}>
                    <FieldRoot>
                        <FieldLabel>名前</FieldLabel>
                  <Input placeholder="山田 太郎" />
                    </FieldRoot>
                    <FieldRoot>
                        <FieldLabel>メールアドレス</FieldLabel>
                  <Input type="email" placeholder="yamada@example.com" />
                    </FieldRoot>
                    <FieldRoot>
                        <FieldLabel>役割</FieldLabel>
                        <NativeSelectRoot>
                            <NativeSelectField>
                                <option>スタッフ</option>
                                <option>マネージャー</option>
                                <option>管理者</option>
                            </NativeSelectField>
                        </NativeSelectRoot>
                    </FieldRoot>
              </VStack>
            )}
            {modalType === 'category' && (
                <VStack gap={4}>
                    <FieldRoot>
                        <FieldLabel>カテゴリ名</FieldLabel>
                  <Input placeholder="例: デザート" />
                    </FieldRoot>
                    <FieldRoot>
                        <FieldLabel>アイコン</FieldLabel>
                  <Input placeholder="例: 🍰" />
                    </FieldRoot>
                    <FieldRoot>
                        <FieldLabel>カラー</FieldLabel>
                        <NativeSelectRoot>
                            <NativeSelectField>
                                <option value="red">赤</option>
                                <option value="blue">青</option>
                                <option value="green">緑</option>
                                <option value="yellow">黄</option>
                                <option value="purple">紫</option>
                            </NativeSelectField>
                        </NativeSelectRoot>
                    </FieldRoot>
              </VStack>
            )}
            {modalType === 'unit' && (
                <VStack gap={4}>
                    <FieldRoot>
                        <FieldLabel>単位名</FieldLabel>
                  <Input placeholder="例: ダース" />
                    </FieldRoot>
                    <FieldRoot>
                        <FieldLabel>記号</FieldLabel>
                  <Input placeholder="例: dz" />
                    </FieldRoot>
                    <FieldRoot>
                        <FieldLabel>種類</FieldLabel>
                        <NativeSelectRoot>
                            <NativeSelectField>
                                <option>重量</option>
                                <option>容量</option>
                                <option>個数</option>
                                <option>長さ</option>
                            </NativeSelectField>
                        </NativeSelectRoot>
                    </FieldRoot>
              </VStack>
            )}
                </DialogBody>
                <DialogFooter>
                    <Button variant="ghost" mr={3} onClick={handleModalClose}>
              キャンセル
            </Button>
            <Button 
              colorScheme="orange" 
              onClick={() => {
                handleSave(modalType === 'user' ? 'ユーザー' : modalType === 'category' ? 'カテゴリ' : '単位');
                  handleModalClose();
              }}
            >
              追加
            </Button>
                </DialogFooter>
                </DialogContent>
            </DialogPositioner>
        </DialogRoot>
    </Box>
  );
};