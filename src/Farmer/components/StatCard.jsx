import { Card } from "flowbite-react";

export default function StatCard({ icon: Icon, label, value = 0, trend }) {
  return (
    <Card className="dark:bg-gray-800">
      <div className="flex justify-between">
        <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
          {Icon && (
            <Icon className="h-5 w-5 text-green-700 dark:text-green-300" />
          )}
        </div>

        {trend && (
          <span className="text-sm text-green-600 dark:text-green-400">
            {trend}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold dark:text-white">
          {value}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </p>
      </div>
    </Card>
  );
}
