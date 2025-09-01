import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Container,
  Input,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/constants';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('manager@zaikoban.jp');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Simple login success
      navigate(ROUTES.DASHBOARD);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Container maxW="md">
        <VStack gap={8}>
          <Heading size="xl" color="orange.500">
            在庫番 - Prototype
          </Heading>
          
          <Box w="full" bg="white" borderRadius="lg" p={8} boxShadow="lg">
            <form onSubmit={handleLogin}>
              <VStack gap={6}>
                <Heading size="md" textAlign="center">
                  ログイン
                </Heading>

                <Box w="full">
                  <Text mb={2} fontWeight="medium">メールアドレス *</Text>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Box>

                <Box w="full">
                  <Text mb={2} fontWeight="medium">パスワード *</Text>
                  <Input
                    type="password"
                    placeholder="パスワードを入力"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Box>

                <Button
                  type="submit"
                  colorScheme="orange"
                  size="lg"
                  w="full"
                  loading={isLoading}
                  loadingText="ログイン中..."
                >
                  ログイン
                </Button>

                <Box
                  p={3}
                  bg="gray.50"
                  borderRadius="md"
                  w="full"
                  fontSize="sm"
                >
                  <Text fontWeight="medium">デモアカウント:</Text>
                  <Text>メール: manager@zaikoban.jp</Text>
                  <Text>パスワード: password</Text>
                </Box>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};