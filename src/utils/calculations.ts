import type { Product, StockTransaction, StocktakingItem } from '../types';

export const calculateInventoryValue = (products: Product[]): number => {
  return products.reduce((total, product) => {
    return total + (product.currentStock * product.cost);
  }, 0);
};

export const calculateTurnoverRate = (
  salesAmount: number,
  averageInventory: number
): number => {
  if (averageInventory === 0) return 0;
  return salesAmount / averageInventory;
};

export const calculateStockLevel = (product: Product): 'low' | 'normal' | 'excess' => {
  const { currentStock, minStock, maxStock } = product;
  
  if (currentStock <= minStock) return 'low';
  if (currentStock >= maxStock) return 'excess';
  return 'normal';
};

export const calculateReorderQuantity = (product: Product): number => {
  const { maxStock, currentStock } = product;
  return Math.max(0, maxStock - currentStock);
};

export const calculateStockDifference = (item: StocktakingItem): number => {
  return item.actualStock - item.theoreticalStock;
};

export const calculateStockDifferenceAmount = (
  item: StocktakingItem,
  unitCost: number
): number => {
  const difference = calculateStockDifference(item);
  return difference * unitCost;
};

export const calculateLossRate = (
  theoreticalStock: number,
  actualStock: number
): number => {
  if (theoreticalStock === 0) return 0;
  const loss = theoreticalStock - actualStock;
  return (loss / theoreticalStock) * 100;
};

export const calculateOrderTotal = (items: Array<{ quantity: number; unitPrice: number }>): number => {
  return items.reduce((total, item) => {
    return total + (item.quantity * item.unitPrice);
  }, 0);
};

export const calculateDaysUntilExpiry = (expiryDate: Date | string): number => {
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const groupTransactionsByType = (transactions: StockTransaction[]) => {
  return transactions.reduce((acc, transaction) => {
    const type = transaction.type;
    if (!acc[type]) {
      acc[type] = {
        count: 0,
        totalQuantity: 0,
        totalAmount: 0,
      };
    }
    acc[type].count += 1;
    acc[type].totalQuantity += transaction.quantity;
    acc[type].totalAmount += transaction.totalAmount;
    return acc;
  }, {} as Record<string, { count: number; totalQuantity: number; totalAmount: number }>);
};

export const calculateABCAnalysis = (products: Product[]) => {
  const sortedProducts = [...products].sort((a, b) => {
    const valueA = a.currentStock * a.cost;
    const valueB = b.currentStock * b.cost;
    return valueB - valueA;
  });

  const totalValue = calculateInventoryValue(products);
  let cumulativeValue = 0;
  
  return sortedProducts.map(product => {
    const value = product.currentStock * product.cost;
    cumulativeValue += value;
    const percentage = (cumulativeValue / totalValue) * 100;
    
    let category: 'A' | 'B' | 'C';
    if (percentage <= 70) {
      category = 'A';
    } else if (percentage <= 90) {
      category = 'B';
    } else {
      category = 'C';
    }
    
    return {
      ...product,
      value,
      percentage,
      category,
    };
  });
};