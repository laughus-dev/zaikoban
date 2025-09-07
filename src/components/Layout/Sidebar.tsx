import React from 'react';
import {
    Box,
    Flex,
    HStack,
    Icon,
    IconButton,
    Image,
    Text,
    useBreakpointValue,
    useDisclosure,
    VStack
} from '@chakra-ui/react';
import {Drawer} from '@chakra-ui/react/drawer';
import {Link, useLocation} from 'react-router-dom';
import {
    FiBarChart2,
    FiBox,
    FiClipboard,
    FiHome,
    FiLogOut,
    FiMenu,
    FiPackage,
    FiSettings,
    FiShoppingCart,
    FiTruck,
} from 'react-icons/fi';
import {ROUTES} from '../../config/constants';

interface SidebarItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  { label: 'ダッシュボード', icon: FiHome, path: ROUTES.DASHBOARD },
  { label: '在庫一覧', icon: FiPackage, path: ROUTES.INVENTORY, badge: 3 },
  { label: '商品マスタ', icon: FiBox, path: ROUTES.PRODUCTS },
  { label: '入出庫', icon: FiTruck, path: ROUTES.STOCK_IN_OUT },
  { label: '棚卸し', icon: FiClipboard, path: ROUTES.STOCKTAKING },
  { label: '発注管理', icon: FiShoppingCart, path: ROUTES.ORDERS, badge: 1 },
  { label: 'レポート', icon: FiBarChart2, path: ROUTES.REPORTS },
  { label: '設定', icon: FiSettings, path: ROUTES.SETTINGS },
];

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  user = { name: '田中 太郎', email: 'manager@zaikoban.jp', role: '管理者' }
}) => {
  const location = useLocation();
    const {open, onOpen, setOpen} = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  
  const bg = 'white';
  const borderColor = 'gray.200';
  const activeBg = 'brand.50';
  const activeColor = 'brand.600';
  const hoverBg = 'gray.50';

    const SidebarContent = ({onClose}: { onClose?: () => void }) => (
    <Box
      bg={bg}
      borderRight="1px"
      borderColor={borderColor}
      w={{base: '250px', lg: '280px'}}
      h="full"
      position="fixed"
      left={0}
      top={0}
      overflowY="auto"
      className="no-print"
    >
        <VStack gap={0} align="stretch" h="full">
        <Box p={6}>
            <HStack gap={3}>
                <Image
                    src="/zaikoban.svg"
                    alt="Zaikoban Logo"
                    boxSize="40px"
                />
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="brand.500">
                  Zaikoban
              </Text>
              <Text fontSize="xs" color="gray.500">
                飲食店向け在庫管理
              </Text>
            </Box>
          </HStack>
        </Box>

        <Box borderTop="1px" borderColor={borderColor} />

        <VStack gap={1} align="stretch" flex={1} p={4}>
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
                <Link key={item.path} to={item.path} onClick={onClose}>
                <Flex
                  align="center"
                  p={3}
                  borderRadius="lg"
                  cursor="pointer"
                  bg={isActive ? activeBg : 'transparent'}
                  color={isActive ? activeColor : 'inherit'}
                  _hover={{ bg: isActive ? activeBg : hoverBg }}
                  transition="all 0.2s"
                >
                  <Icon as={item.icon} boxSize={5} mr={3} />
                  <Text fontWeight={isActive ? 'semibold' : 'normal'}>
                    {item.label}
                  </Text>
                  {item.badge && (
                    <Box
                      ml="auto"
                      bg="red.500"
                      color="white"
                      fontSize="xs"
                      px={2}
                      py={0.5}
                      borderRadius="full"
                      minW="20px"
                      textAlign="center"
                    >
                      {item.badge}
                    </Box>
                  )}
                </Flex>
              </Link>
            );
          })}
        </VStack>

        <Box borderTop="1px" borderColor={borderColor} />

        <Box p={4}>
          <HStack gap={3} mb={4}>
            <Box
              w={8}
              h={8}
              borderRadius="full"
              bg="orange.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontSize="sm"
              fontWeight="bold"
            >
              {user.name.charAt(0)}
            </Box>
            <Box flex={1}>
              <Text fontSize="sm" fontWeight="medium">
                {user.name}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {user.role}
              </Text>
            </Box>
          </HStack>
            <Link to={ROUTES.LOGIN} onClick={onClose}>
            <Flex
              align="center"
              p={3}
              borderRadius="lg"
              cursor="pointer"
              _hover={{ bg: hoverBg }}
              transition="all 0.2s"
              color="red.500"
            >
              <Icon as={FiLogOut} boxSize={5} mr={3} />
              <Text>ログアウト</Text>
            </Flex>
          </Link>
        </Box>
      </VStack>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          aria-label="メニューを開く"
          children={<FiMenu/>}
          onClick={onOpen}
          position="fixed"
          top={4}
          left={4}
          zIndex={20}
          colorScheme="brand"
          className="no-print"
        />
          <Drawer.Root open={open} placement="start" onOpenChange={(details) => setOpen(details.open)}>
              <Drawer.Backdrop/>
              <Drawer.Positioner>
                  <Drawer.Content>
                      <Drawer.Header>
                          <Drawer.CloseTrigger/>
                      </Drawer.Header>
                      <Drawer.Body p={0}>
                          <SidebarContent onClose={() => setOpen(false)}/>
                      </Drawer.Body>
                  </Drawer.Content>
              </Drawer.Positioner>
          </Drawer.Root>
      </>
    );
  }

  return <SidebarContent />;
};