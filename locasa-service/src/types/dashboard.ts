// Dashboard Analytics Types

export interface OverviewMetrics {
  totalOrders: number;
  delivered: number;
  pending: number;
}

export interface MonthlyOrderData {
  value: number;
  label: string;
}

export interface OrderStatusData {
  value: number;
  color: string;
  text: string;
  label: string;
}

export interface DeliveredOrderData {
  value: number;
  label: string;
  frontColor: string;
}

export interface MostOrderedProductData {
  value: number;
  label: string;
  frontColor: string;
}

export interface OrderStatistics {
  completedOrders: number;
  cancelledOrders: number;
}

export interface ProductPerformance {
  name: string;
  sales: string;
  color: string;
}

export interface CustomerEngagement {
  activeCustomers: number;
  newCustomers: number;
}

export interface DashboardAnalytics {
  overviewMetrics: OverviewMetrics;
  monthlyOrdersData: MonthlyOrderData[];
  orderStatusData: OrderStatusData[];
  deliveredOrdersData: DeliveredOrderData[];
  mostOrderedProductsData: MostOrderedProductData[];
  orderStatistics: OrderStatistics;
  productPerformance: ProductPerformance[];
  customerEngagement: CustomerEngagement;
}
