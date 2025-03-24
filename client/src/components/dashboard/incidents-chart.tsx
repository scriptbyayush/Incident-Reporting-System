import { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface IncidentsChartProps {
  data: {
    weeks: string[];
    newIncidents: number[];
    resolvedIncidents: number[];
  };
  isLoading?: boolean;
}

export function IncidentsChart({ data, isLoading = false }: IncidentsChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.weeks && data.newIncidents && data.resolvedIncidents) {
      const formattedData = data.weeks.map((week, index) => ({
        name: week,
        new: data.newIncidents[index],
        resolved: data.resolvedIncidents[index]
      }));
      setChartData(formattedData);
    }
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Incident Trends</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
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
        <CardTitle>Incident Trends</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="new"
                name="New Incidents"
                stroke="#3b82f6"
                fill="rgba(59, 130, 246, 0.1)"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                name="Resolved Incidents"
                stroke="#22c55e"
                fill="rgba(34, 197, 94, 0.1)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
