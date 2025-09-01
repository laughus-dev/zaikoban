import React, { useState, useMemo } from 'react';
import {
  Box,
  HStack,
  IconButton,
  Text,
  useBreakpointValue,
  Flex,
  Input,
  InputGroup,
  Skeleton,
  Stack,
  Table,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from '@chakra-ui/react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
} from 'react-icons/fi';

export interface Column<T> {
  key: string;
  label: string;
  accessor: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface Action<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  color?: string;
  isDisabled?: (item: T) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  filterable?: boolean;
  filters?: Array<{ label: string; value: string }>;
  sortable?: boolean;
  paginated?: boolean;
  pageSize?: number;
  actions?: Action<T>[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  showBorder?: boolean;
  stickyHeader?: boolean;
  responsive?: boolean;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = '検索...',
  filterable = false,
  // filters = [],
  sortable = false,
  paginated = false,
  pageSize = 20,
  actions = [],
  onRowClick,
  isLoading = false,
  emptyMessage = 'データがありません',
  showBorder = true,
  stickyHeader = false,
  responsive = true,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  // const [filterValue, setFilterValue] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const visibleColumns = responsive && isMobile ? columns.slice(0, 3) : columns;

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      result = result.filter((item) =>
        columns.some((col) => {
          const value = col.accessor(item);
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // if (filterValue) {
    //   result = result.filter((item) =>
    //     columns.some((col) => {
    //       const value = col.accessor(item);
    //       return String(value).includes(filterValue);
    //     })
    //   );
    // }

    if (sortKey && sortable) {
      result.sort((a, b) => {
        const column = columns.find((col) => col.key === sortKey);
        if (!column) return 0;

        const aValue = String(column.accessor(a));
        const bValue = String(column.accessor(b));

        if (sortDirection === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
    }

    return result;
  }, [data, searchTerm, /* filterValue, */ sortKey, sortDirection, columns, sortable]);

  const paginatedData = useMemo(() => {
    if (!paginated) return filteredData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize, paginated]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (key: string) => {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  if (isLoading) {
    return (
      <Stack gap={3}>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} height="60px" />
        ))}
      </Stack>
    );
  }

  return (
    <Box>
      {(searchable || filterable) && (
        <Flex gap={4} mb={4} flexDirection={{ base: 'column', md: 'row' }}>
          {searchable && (
            <InputGroup maxW={{ base: '100%', md: '300px' }}>
              {/* TODO: Fix InputElement for Chakra v3 */}
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          )}
          {/* TODO: Update Select component for Chakra UI v3 */}
          {/* {filterable && filters.length > 0 && (
            <Select ... />
          )} */}
        </Flex>
      )}

      <Box
        overflowX="auto"
        borderWidth={showBorder ? 1 : 0}
        borderRadius="lg"
      >
        <Table.Root size={isMobile ? 'sm' : 'md'}>
          <Table.Header
            position={stickyHeader ? 'sticky' : 'relative'}
            top={0}
            bg="white"
            zIndex={1}
          >
            <Table.Row>
              {visibleColumns.map((column) => (
                <Table.ColumnHeader
                  key={column.key}
                  width={column.width}
                  textAlign={column.align || 'left'}
                  cursor={column.sortable && sortable ? 'pointer' : 'default'}
                  onClick={() => column.sortable && handleSort(column.key)}
                  _hover={
                    column.sortable && sortable
                      ? { bg: 'gray.50' }
                      : undefined
                  }
                >
                  <HStack gap={1}>
                    <Text>{column.label}</Text>
                    {column.sortable && sortable && sortKey === column.key && (
                      <Text fontSize="xs">
                        {sortDirection === 'asc' ? '▲' : '▼'}
                      </Text>
                    )}
                  </HStack>
                </Table.ColumnHeader>
              ))}
              {actions.length > 0 && <Table.ColumnHeader width="50px" />}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {paginatedData.length === 0 ? (
              <Table.Row>
                <Table.Cell
                  colSpan={visibleColumns.length + (actions.length > 0 ? 1 : 0)}
                  textAlign="center"
                  py={8}
                  color="gray.500"
                >
                  {emptyMessage}
                </Table.Cell>
              </Table.Row>
            ) : (
              paginatedData.map((item) => (
                <Table.Row
                  key={item.id}
                  cursor={onRowClick ? 'pointer' : 'default'}
                  onClick={() => onRowClick && onRowClick(item)}
                  _hover={{ bg: 'gray.50' }}
                >
                  {visibleColumns.map((column) => (
                    <Table.Cell
                      key={column.key}
                      textAlign={column.align || 'left'}
                    >
                      {column.accessor(item)}
                    </Table.Cell>
                  ))}
                  {actions.length > 0 && (
                    <Table.Cell>
                      <MenuRoot>
                        <MenuTrigger asChild>
                          <IconButton
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiMoreVertical />
                          </IconButton>
                        </MenuTrigger>
                        <MenuContent>
                          {actions.map((action, index) => (
                            <MenuItem
                              key={index}
                              value={`action-${index}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(item);
                              }}
                              color={action.color}
                              disabled={
                                action.isDisabled && action.isDisabled(item)
                              }
                            >
                              {action.label}
                            </MenuItem>
                          ))}
                        </MenuContent>
                      </MenuRoot>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      {paginated && totalPages > 1 && (
        <Flex justify="space-between" align="center" mt={4}>
          <Text fontSize="sm" color="gray.600">
            {filteredData.length}件中 {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, filteredData.length)}件を表示
          </Text>
          <HStack>
            <IconButton
              aria-label="Previous page"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
            </IconButton>
            <Text fontSize="sm">
              {currentPage} / {totalPages}
            </Text>
            <IconButton
              aria-label="Next page"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              <FiChevronRight />
            </IconButton>
          </HStack>
        </Flex>
      )}
    </Box>
  );
}