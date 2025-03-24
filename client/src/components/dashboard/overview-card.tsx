import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OverviewCardProps {
  title: string;
  value: number;
  percentChange: number;
  icon: React.ReactNode;
  iconBgClass: string;
  iconTextClass: string;
}

export function OverviewCard({
  title,
  value,
  percentChange,
  icon,
  iconBgClass,
  iconTextClass,
}: OverviewCardProps) {
  const isPositiveChange = percentChange >= 0;
  const percentChangeDisplay = Math.abs(percentChange).toFixed(1);

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
          </div>
          <div className={`w-12 h-12 ${iconBgClass} rounded-full flex items-center justify-center`}>
            <div className={`w-6 h-6 ${iconTextClass}`}>{icon}</div>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className={`flex items-center font-medium ${
            isPositiveChange ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}>
            {isPositiveChange ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
            {percentChangeDisplay}%
          </span>
          <span className="text-gray-500 dark:text-gray-400 ml-2">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}
