import React from 'react';
import {
  Box,
  HStack,
  Icon,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { Stat } from '@chakra-ui/react/stat';
import type { IconType } from 'react-icons';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: IconType;
  iconColor?: string;
  change?: number;
  changeLabel?: string;
  helpText?: string;
  isLoading?: boolean;
  color?: string;
  bgGradient?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  iconColor = 'brand.500',
  change,
  changeLabel,
  helpText,
  isLoading = false,
  color,
  bgGradient,
  onClick,
}) => {
  const bg = 'white';
  const borderColor = 'gray.200';

  if (isLoading) {
    return (
      <Box
        p={6}
        bg={bg}
        borderRadius="xl"
        borderWidth={1}
        borderColor={borderColor}
        boxShadow="sm"
      >
        <Skeleton height="20px" width="60%" mb={2} />
        <Skeleton height="32px" width="80%" mb={2} />
        <Skeleton height="16px" width="40%" />
      </Box>
    );
  }

  return (
    <Box
      p={6}
      bg={bgGradient ? undefined : bg}
      bgGradient={bgGradient}
      borderRadius="xl"
      borderWidth={1}
      borderColor={borderColor}
      boxShadow="sm"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      transition="all 0.3s"
      _hover={
        onClick
          ? {
              transform: 'translateY(-2px)',
              boxShadow: 'md',
            }
          : undefined
      }
    >
      <Stat.Root>
        <HStack justify="space-between" mb={2}>
          <Stat.Label color={color || 'gray.600'} fontSize="sm" fontWeight="medium">
            {label}
          </Stat.Label>
          {icon && (
            <Icon as={icon} color={iconColor} boxSize={6} />
          )}
        </HStack>
        
        <Stat.ValueText
          fontSize="3xl"
          fontWeight="bold"
          color={color || 'gray.800'}
        >
          {value}
        </Stat.ValueText>
        
        {(change !== undefined || helpText) && (
          <Stat.HelpText mb={0}>
            {change !== undefined && (
              <HStack spacing={1}>
                <Stat.UpIndicator display={change >= 0 ? 'inline' : 'none'} />
                <Stat.DownIndicator display={change < 0 ? 'inline' : 'none'} />
                <Text as="span">{Math.abs(change)}%</Text>
                {changeLabel && (
                  <Text as="span" color="gray.500">
                    {changeLabel}
                  </Text>
                )}
              </HStack>
            )}
            {helpText && !change && (
              <Text color="gray.500">{helpText}</Text>
            )}
          </Stat.HelpText>
        )}
      </Stat.Root>
    </Box>
  );
};