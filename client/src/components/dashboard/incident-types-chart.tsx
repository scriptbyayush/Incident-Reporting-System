import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface IncidentTypesChartProps {
  data: Record<string, number>;
  isLoading?: boolean;
}

const COLORS = ["#3b82f6", "#6366f1", "#f59e0b", "#ef4444", "#22c55e", "#8b5cf6"];

const TYPE_LABELS: Record<string, string> = {
  hardware: "Hardware",
  software: "Software",
  network: "Network",
  security: "Security",
  service: "Service",
  other: "Other"
};

export function IncidentTypesChart({ data, isLoading = false }: IncidentTypesChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const formattedData = Object.entries(data).map(([key, value]) => ({
        name: TYPE_LABELS[key] || key,
        value: value
      }));
      setChartData(formattedData);
    }
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Incident Types</CardTitle>
          <CardDescription>Distribution by category</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading chart data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Types</CardTitle>
        <CardDescription>Distribution by category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value, 'Incidents']} />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
