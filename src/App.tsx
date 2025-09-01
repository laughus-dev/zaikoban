import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, createSystem, defaultConfig, Box, Flex, Spinner } from '@chakra-ui/react';
import { ROUTES } from './config/constants';

import { Sidebar } from './components/Layout/Sidebar';
// Lazy load the Login page
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
import { Dashboard } from './pages/Dashboard';
import { InventoryList } from './pages/InventoryList';
import { Products } from './pages/Products';
import { StockInOut } from './pages/StockInOut';
import { Stocktaking } from './pages/Stocktaking';
import { Orders } from './pages/Orders';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';



const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Flex h="100vh">
      <Sidebar />
      <Box
        flex={1}
        ml={{ base: 0, lg: '280px' }}
        overflowY="auto"
        bg="gray.50"
      >
        {children}
      </Box>
    </Flex>
  );
};

const system = createSystem(defaultConfig);

// Loading component for lazy loaded pages
const PageLoader: React.FC = () => (
  <Flex h="100vh" align="center" justify="center">
    <Spinner size="xl" color="blue.500" />
  </Flex>
);

function App() {
  return (
    <ChakraProvider value={system}>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
          <Route
            path={ROUTES.INVENTORY}
            element={
              <AppLayout>
                <InventoryList />
              </AppLayout>
            }
          />
          <Route
            path={ROUTES.PRODUCTS}
            element={
              <AppLayout>
                <Products />
              </AppLayout>
            }
          />
          <Route
            path={ROUTES.STOCK_IN_OUT}
            element={
              <AppLayout>
                <StockInOut />
              </AppLayout>
            }
          />
          <Route
            path={ROUTES.STOCKTAKING}
            element={
              <AppLayout>
                <Stocktaking />
              </AppLayout>
            }
          />
          <Route
            path={ROUTES.ORDERS}
            element={
              <AppLayout>
                <Orders />
              </AppLayout>
            }
          />
          <Route
            path={ROUTES.REPORTS}
            element={
              <AppLayout>
                <Reports />
              </AppLayout>
            }
          />
          <Route
            path={ROUTES.SETTINGS}
            element={
              <AppLayout>
                <Settings />
              </AppLayout>
            }
          />
          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ChakraProvider>
  );
}

export default App;