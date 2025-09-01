import React from 'react';
import {
  Box,
  Input,
  Textarea,
  Text,
} from '@chakra-ui/react';

type FieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'select' 
  | 'textarea' 
  | 'switch' 
  | 'checkbox' 
  | 'radio'
  | 'date'
  | 'time'
  | 'datetime-local';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormFieldProps {
  type?: FieldType;
  name: string;
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  onBlur?: () => void;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  options?: Option[];
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const FormField: React.FC<FormFieldProps> = ({
  type = 'text',
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
  isRequired = false,
}) => {
  // プロトタイプ用の簡略化されたrenderField
  const renderField = () => {
    if (type === 'textarea') {
      return (
        <Textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      );
    }
    
    return (
      <Input
        type={type === 'password' ? 'password' : 'text'}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    );
  };

  if (type === 'checkbox' && !label) {
    return (
      <Box>
        {renderField()}
        {error && <Text color="red.500" fontSize="sm">{error}</Text>}
        {helperText && !error && <Text color="gray.600" fontSize="sm">{helperText}</Text>}
      </Box>
    );
  }

  return (
    <Box>
      {label && (
        <Text mb={type === 'switch' ? 0 : 2} fontWeight="medium">
          {label} {isRequired && '*'}
        </Text>
      )}
      {renderField()}
      {error && <Text color="red.500" fontSize="sm">{error}</Text>}
      {helperText && !error && <Text color="gray.600" fontSize="sm">{helperText}</Text>}
    </Box>
  );
};