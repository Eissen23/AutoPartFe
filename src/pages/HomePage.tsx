import type { ComponentProps } from "react";
import {
  AlertTriangle,
  BarChart3,
  DollarSign,
  PieChart as PieChartIcon,
  Receipt,
  ShoppingCart,
  TrendingUp,
  Warehouse,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type MonthlySalesDatum = {
  month: string;
  sales: number;
  orders: number;
};

type CategoryRevenueDatum = {
  category: string;
  revenue: number;
};

type InventoryStatusDatum = {
  name: string;
  value: number;
};

type StockFlowDatum = {
  week: string;
  inbound: number;
  outbound: number;
};

type LowStockDatum = {
  sku: string;
  name: string;
  warehouse: string;
  qty: number;
  reorderPoint: number;
};

type StockStatus = {
  label: "Critical" | "Low" | "Watch";
  badgeClassName: string;
  rowClassName: string;
};

const monthlySalesData: MonthlySalesDatum[] = [
  { month: "Jan", sales: 92000, orders: 210 },
  { month: "Feb", sales: 88000, orders: 198 },
  { month: "Mar", sales: 101000, orders: 233 },
  { month: "Apr", sales: 109000, orders: 251 },
  { month: "May", sales: 117500, orders: 269 },
  { month: "Jun", sales: 124000, orders: 286 },
];

const categoryRevenueData: CategoryRevenueDatum[] = [
  { category: "Brake", revenue: 42000 },
  { category: "Engine", revenue: 51000 },
  { category: "Suspension", revenue: 32000 },
  { category: "Electrical", revenue: 28000 },
  { category: "Body", revenue: 21000 },
];

const inventoryStatusData: InventoryStatusDatum[] = [
  { name: "Healthy", value: 58 },
  { name: "Low", value: 27 },
  { name: "Critical", value: 15 },
];

const stockFlowData: StockFlowDatum[] = [
  { week: "W1", inbound: 430, outbound: 390 },
  { week: "W2", inbound: 520, outbound: 410 },
  { week: "W3", inbound: 480, outbound: 455 },
  { week: "W4", inbound: 610, outbound: 505 },
  { week: "W5", inbound: 560, outbound: 530 },
  { week: "W6", inbound: 590, outbound: 570 },
];

const lowStockData: LowStockDatum[] = [
  {
    sku: "BRK-2289",
    name: "Ceramic Brake Pad Set",
    warehouse: "WH-A",
    qty: 9,
    reorderPoint: 20,
  },
  {
    sku: "ENG-7410",
    name: "Oil Filter XL",
    warehouse: "WH-B",
    qty: 15,
    reorderPoint: 35,
  },
  {
    sku: "ELC-1108",
    name: "12V Ignition Coil",
    warehouse: "WH-C",
    qty: 6,
    reorderPoint: 18,
  },
  {
    sku: "SUS-9983",
    name: "Front Shock Absorber",
    warehouse: "WH-A",
    qty: 11,
    reorderPoint: 25,
  },
];

const PIE_COLORS = ["#16a34a", "#f59e0b", "#ef4444"];

type TooltipValue = number | string | readonly (number | string)[] | undefined;

const toCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const toNumber = (value: TooltipValue): number | null => {
  const raw = Array.isArray(value) ? value[0] : value;

  if (typeof raw === "number") {
    return raw;
  }

  if (typeof raw === "string") {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const formatCurrencyTooltip = (value: TooltipValue) => {
  const numeric = toNumber(value);
  return numeric === null ? "-" : toCurrency(numeric);
};

const formatPercentTooltip = (value: TooltipValue) => {
  const numeric = toNumber(value);
  return numeric === null ? "-" : `${numeric}%`;
};

type InventoryPieShapeProps = ComponentProps<typeof Sector> & {
  index?: number;
};

const renderInventorySlice = (props: InventoryPieShapeProps) => {
  const sliceIndex = props.index ?? 0;
  const fillColor = PIE_COLORS[sliceIndex % PIE_COLORS.length];

  return <Sector {...props} fill={fillColor} />;
};

const getStockStatus = (item: LowStockDatum): StockStatus => {
  const ratio = item.qty / item.reorderPoint;

  if (ratio <= 0.5) {
    return {
      label: "Critical",
      badgeClassName: "bg-rose-100 text-rose-700",
      rowClassName: "bg-rose-50/50",
    };
  }

  if (ratio <= 0.8) {
    return {
      label: "Low",
      badgeClassName: "bg-amber-100 text-amber-700",
      rowClassName: "bg-amber-50/40",
    };
  }

  return {
    label: "Watch",
    badgeClassName: "bg-sky-100 text-sky-700",
    rowClassName: "",
  };
};

/**
 * Dashboard Home Page
 * Demo analytics for auto-part sales and inventory monitoring.
 */
export default function HomePage() {
  const totalRevenue = monthlySalesData.reduce(
    (sum, row) => sum + row.sales,
    0,
  );
  const totalOrders = monthlySalesData.reduce(
    (sum, row) => sum + row.orders,
    0,
  );
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  return (
    <div className="min-h-full bg-linear-to-br from-slate-50 via-blue-50/30 to-cyan-50/40 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-4 md:space-y-6">
        <header className="space-y-2 rounded-2xl border border-blue-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600">
            Auto-part sales and warehouse overview (mock data)
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-emerald-100/70 p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-emerald-800">
                Total Revenue (6M)
              </p>
              <span className="rounded-xl bg-emerald-600/10 p-2 text-emerald-700">
                <DollarSign size={18} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-emerald-900">
              {toCurrency(totalRevenue)}
            </p>
          </article>

          <article className="rounded-2xl border border-blue-200 bg-linear-to-br from-blue-50 to-blue-100/70 p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-blue-800">
                Orders Fulfilled
              </p>
              <span className="rounded-xl bg-blue-600/10 p-2 text-blue-700">
                <ShoppingCart size={18} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-blue-900">
              {totalOrders}
            </p>
          </article>

          <article className="rounded-2xl border border-violet-200 bg-linear-to-br from-violet-50 to-violet-100/70 p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-violet-800">
                Average Order Value
              </p>
              <span className="rounded-xl bg-violet-600/10 p-2 text-violet-700">
                <Receipt size={18} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-violet-900">
              {toCurrency(avgOrderValue)}
            </p>
          </article>

          <article className="rounded-2xl border border-rose-200 bg-linear-to-br from-rose-50 to-rose-100/70 p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-rose-800">SKU at Risk</p>
              <span className="rounded-xl bg-rose-600/10 p-2 text-rose-700">
                <AlertTriangle size={18} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-rose-700">
              {inventoryStatusData.find((item) => item.name === "Critical")
                ?.value ?? 0}
              %
            </p>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <article className="rounded-2xl border border-blue-200 bg-linear-to-b from-white to-blue-50/50 p-4 shadow-sm lg:col-span-8">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Monthly Sales Trend
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <LineChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={toCurrency} width={90} />
                  <Tooltip
                    formatter={(value) => formatCurrencyTooltip(value)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    name="Sales"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-2xl border border-emerald-200 bg-linear-to-b from-white to-emerald-50/50 p-4 shadow-sm lg:col-span-4">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
              <PieChartIcon className="h-4 w-4 text-emerald-600" />
              Inventory Health
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={inventoryStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    shape={renderInventorySlice}
                  />
                  <Tooltip formatter={(value) => formatPercentTooltip(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-2xl border border-cyan-200 bg-linear-to-b from-white to-cyan-50/50 p-4 shadow-sm lg:col-span-5">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
              <BarChart3 className="h-4 w-4 text-cyan-600" />
              Revenue by Part Category
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={categoryRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cffafe" />
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={toCurrency} width={90} />
                  <Tooltip
                    formatter={(value) => formatCurrencyTooltip(value)}
                  />
                  <Bar dataKey="revenue" name="Revenue" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-2xl border border-indigo-200 bg-linear-to-b from-white to-indigo-50/50 p-4 shadow-sm lg:col-span-7">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
              <Warehouse className="h-4 w-4 text-indigo-600" />
              Inbound vs Outbound Stock Flow
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <AreaChart data={stockFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="inbound"
                    name="Inbound"
                    stackId="1"
                    stroke="#0f766e"
                    fill="#5eead4"
                  />
                  <Area
                    type="monotone"
                    dataKey="outbound"
                    name="Outbound"
                    stackId="1"
                    stroke="#4338ca"
                    fill="#a5b4fc"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-2xl border border-rose-200 bg-linear-to-b from-white to-rose-50/40 p-4 shadow-sm lg:col-span-12">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              Low Stock Alert
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50/90">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-slate-600">
                      SKU
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-600">
                      Part Name
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-600">
                      Warehouse
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-600">
                      Qty
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-600">
                      Reorder Point
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {lowStockData.map((item) => {
                    const stockStatus = getStockStatus(item);

                    return (
                      <tr key={item.sku} className={stockStatus.rowClassName}>
                        <td className="px-3 py-2 font-medium text-slate-900">
                          {item.sku}
                        </td>
                        <td className="px-3 py-2 text-slate-700">
                          {item.name}
                        </td>
                        <td className="px-3 py-2 text-slate-700">
                          {item.warehouse}
                        </td>
                        <td className="px-3 py-2 font-medium text-rose-600">
                          {item.qty}
                        </td>
                        <td className="px-3 py-2 text-slate-700">
                          {item.reorderPoint}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${stockStatus.badgeClassName}`}
                          >
                            {stockStatus.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
