"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

// ---- Types ----
interface DashboardData {
  totalProfit: number;
  accuracy: number;
  winCount: number;
  lossCount: number;
  totalTrades: number;
  bestTrade: number;
  worstTrade: number;
  avgProfitPerTrade: number;
}

// ---- Component ----
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res: DashboardData = await fetchWithAuth(
          `/api/v1/dashboard`
        );
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard Overview</h1>

      {loading ? (
        <p className="text-center py-6 text-gray-500 dark:text-gray-400">Loading data...</p>
      ) : data ? (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Total Trades */}
          <Card className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Total Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{data.totalTrades}</p>
            </CardContent>
          </Card>

          {/* Win Rate */}
          <Card className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Win Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{data.accuracy.toFixed(2)}%</p>
            </CardContent>
          </Card>

          {/* Total Profit */}
          <Card className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Profit/Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-4xl font-bold ${
                  data.totalProfit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {data.totalProfit >= 0 ? `+ ₹${data.totalProfit.toFixed(2)}` : `- ₹${Math.abs(data.totalProfit).toFixed(2)}`}
              </p>
            </CardContent>
          </Card>

          {/* Best Trade */}
          <Card className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Best Trade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{data.bestTrade.toFixed(2)}</p>
            </CardContent>
          </Card>

          {/* Worst Trade */}
          <Card className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Worst Trade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{data.worstTrade.toFixed(2)}</p>
            </CardContent>
          </Card>

          {/* Avg Profit/Trade */}
          <Card className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Avg Profit/Trade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">₹{data.avgProfitPerTrade.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <p className="text-center py-6 text-gray-500 dark:text-gray-400">No data available</p>
      )}
    </div>
  );
}
