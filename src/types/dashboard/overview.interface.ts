import { Center } from "../academic/center.interface";
import { Course } from "../academic/course.interface";
import { Lead } from "../academic/lead.interface";
import { Student } from "../academic/student.interface";
import { Payment } from "../finance/payment.interface";

export interface DashboardMetrics {
  // Financial Metrics
  totalRevenue: number;
  totalBilling: number; // Expected income based on enrolled courses
  totalPending: number;
  totalPayments: number;
  paymentCollectionRate: number; // Percentage
  billingVsRevenueGap: number;
  averagePaymentPerStudent: number;

  // Academic Metrics
  totalEnrollments: number;
  newLeads: number;
  conversionRate: number; // Percentage
  activeStudents: number;
  activeCenters: number;
  activeCourses: number;
  activeBatches: number;
  
  // Student Status Metrics
  totalStudents: number; // All students (not filtered by date or deletion)
  dropouts: number; // Students with DROPOUT status
  graduated: number; // Students with GRADUATED status
  archived: number; // Students with deletedAt set (archived)

  // Comparisons
  revenueMoM: number; // Month-over-month change percentage
  revenueYoY: number; // Year-over-year change percentage
  enrollmentMoM: number;
  enrollmentYoY: number;
  billingMoM: number;
  billingYoY: number;
}

export interface CenterPerformance {
  centerId: string;
  centerName: string;
  totalRevenue: number;
  totalBilling: number;
  totalEnrollments: number;
  pendingPayments: number;
  conversionRate: number;
  status: string;
}

export interface TrendDataPoint {
  date: string;
  revenue: number;
  billing: number;
  enrollments: number;
  payments: number;
}

export interface PaymentStatusDistribution {
  paid: number;
  pending: number;
  overdue: number;
}

export interface TopPerformingCenter {
  center: string;
  revenue: number;
  enrollments: number;
  status: string;
}

export interface TopPerformingCourse {
  courseName: string;
  enrollments: number;
  revenue: number;
}

export interface ActivityItem {
  type: "enrollment" | "payment" | "lead" | "batch";
  id: string;
  title: string;
  date: Date;
  meta: string;
  centerId?: string;
}

export interface DashboardInsight {
  type: "warning" | "success" | "info";
  message: string;
  centerName?: string;
  courseName?: string;
  value?: number;
}

export interface DashboardData {
  students: Student[];
  leads: Lead[];
  courses: Course[];
  centers: Center[];
  payments: Payment[];
  metrics: DashboardMetrics;
  centerPerformance: CenterPerformance[];
  trendData: TrendDataPoint[];
  paymentStatusDistribution: PaymentStatusDistribution;
  topPerformingCenters: TopPerformingCenter[];
  topPerformingCourses: TopPerformingCourse[];
  recentActivity: ActivityItem[];
  insights: DashboardInsight[];
}

export interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeValue?: number; // MoM (Month-over-Month)
  changeValueYoY?: number; // YoY (Year-over-Year)
  direction?: "up" | "down" | "neutral";
  directionYoY?: "up" | "down" | "neutral";
  icon: React.ComponentType<{ className?: string; size?: number }>;
  trendData?: number[];
  color?: "green" | "red" | "amber" | "blue" | "purple";
  formatValue?: (value: number) => string;
  sparklineType?: "area" | "line";
  layout?: "default" | "simple"; // Simple layout matches the design exactly
}

