"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

// ---- Types ----
type Trade = {
  id: string;
  symbol: string;
  entryPrice: number;
  exitPrice?: number | null;
  quantity: number;
  stopLoss?: number | null;
  takeProfit?: number | null;
  outcome: "SL_HIT" | "TP_HIT" | "NONE";
  notes?: string | null;
  date: string;
  strategy?: string | null;
  imageUrl?: string | null; // Cloudinary URL or preview
};

type NewTrade = Omit<Trade, "id" | "imageUrl"> & {
  image?: string | null;
  imageFile?: File | null;
};

// ---- Component ----
export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTrade, setEditTrade] = useState<Trade | null>(null);
  const [newTrade, setNewTrade] = useState<NewTrade>({
    symbol: "",
    entryPrice: 0,
    exitPrice: null,
    quantity: 0,
    stopLoss: null,
    takeProfit: null,
    outcome: "NONE",
    notes: "",
    date: "",
    strategy: "",
    image: null,
    imageFile: null,
  });

  const resetForm = () => {
    setEditTrade(null);
    setNewTrade({
      symbol: "",
      entryPrice: 0,
      exitPrice: null,
      quantity: 0,
      stopLoss: null,
      takeProfit: null,
      outcome: "NONE",
      notes: "",
      date: "",
      strategy: "",
      image: null,
      imageFile: null,
    });
    setIsDialogOpen(false);
  };

  // ---- Fetch trades ----
  useEffect(() => {
    const fetchTrades = async () => {
      setLoading(true);
      try {
        const data: Trade[] = await fetchWithAuth(
          `/api/v1/trades`
        );
        setTrades(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, []);

  // ---- Save (Create / Update) ----
  const handleSaveTrade = async () => {
    if (!newTrade.symbol || !newTrade.date || !newTrade.entryPrice || !newTrade.quantity) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...newTrade,
        imageUrl: null,
      };
      const formData = new FormData();
      formData.append("trade", JSON.stringify(payload));
      if (newTrade.imageFile) formData.append("image", newTrade.imageFile);

      
      const url = editTrade
        ? `/api/v1/trades/${editTrade.id}`
        : `/api/v1/trades`;

      const method = editTrade ? "PUT" : "POST";
      const saved: Trade = await fetchWithAuth(url, {
        method,
        body: formData,
      });

      if (editTrade) {
        setTrades((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
      } else {
        setTrades((prev) => [...prev, saved]);
      }

      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to save trade.");
    } finally {
      setLoading(false);
    }
  };

  // ---- Delete ----
  const handleDeleteTrade = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trade?")) return;
    try {
      await fetchWithAuth(
        `/api/v1/trades/${id}`,
        { method: "DELETE" }
      );
      setTrades((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete trade.");
    }
  };

  // ---- Edit ----
  const handleEditClick = (trade: Trade) => {
    setEditTrade(trade);
    setNewTrade({
      ...trade,
      image: trade.imageUrl ?? null,
      imageFile: null,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">My Trades</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Add Trade</Button>
      </div>

      {/* ---- Dialog Form ---- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTrade ? "Edit Trade" : "Add Trade"}</DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveTrade();
            }}
          >
            {/* Date + Symbol */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newTrade.date}
                  onChange={(e) => setNewTrade({ ...newTrade, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Symbol</Label>
                <Input
                  type="text"
                  value={newTrade.symbol}
                  onChange={(e) => setNewTrade({ ...newTrade, symbol: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Entry + Exit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Entry Price</Label>
                <Input
                  type="number"
                  value={newTrade.entryPrice}
                  onChange={(e) =>
                    setNewTrade({ ...newTrade, entryPrice: parseFloat(e.target.value) || 0 })
                  }
                  required
                />
              </div>
              <div>
                <Label>Exit Price</Label>
                <Input
                  type="number"
                  value={newTrade.exitPrice ?? ""}
                  onChange={(e) =>
                    setNewTrade({
                      ...newTrade,
                      exitPrice: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                />
              </div>
            </div>

            {/* Quantity + StopLoss */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={newTrade.quantity}
                  onChange={(e) =>
                    setNewTrade({ ...newTrade, quantity: parseInt(e.target.value) || 0 })
                  }
                  required
                />
              </div>
              <div>
                <Label>Stop Loss</Label>
                <Input
                  type="number"
                  value={newTrade.stopLoss ?? ""}
                  onChange={(e) =>
                    setNewTrade({
                      ...newTrade,
                      stopLoss: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                />
              </div>
            </div>

            {/* TakeProfit + Outcome */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Take Profit</Label>
                <Input
                  type="number"
                  value={newTrade.takeProfit ?? ""}
                  onChange={(e) =>
                    setNewTrade({
                      ...newTrade,
                      takeProfit: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                />
              </div>
              <div>
                <Label>Outcome</Label>
                <Select
                  value={newTrade.outcome}
                  onValueChange={(val) => setNewTrade({ ...newTrade, outcome: val as Trade["outcome"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SL_HIT">SL_HIT</SelectItem>
                    <SelectItem value="TP_HIT">TP_HIT</SelectItem>
                    <SelectItem value="NONE">NONE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes + Strategy */}
            <div>
              <Label>Notes</Label>
              <Input
                type="text"
                value={newTrade.notes ?? ""}
                onChange={(e) => setNewTrade({ ...newTrade, notes: e.target.value })}
              />
            </div>
            <div>
              <Label>Strategy</Label>
              <Input
                type="text"
                value={newTrade.strategy ?? ""}
                onChange={(e) => setNewTrade({ ...newTrade, strategy: e.target.value })}
              />
            </div>

            {/* Screenshot */}
            <div>
              <Label>Screenshot</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setNewTrade({
                    ...newTrade,
                    image: file ? URL.createObjectURL(file) : null,
                    imageFile: file,
                  });
                }}
              />
              {newTrade.image && (
                <img
                  src={newTrade.image}
                  alt="preview"
                  className="mt-2 h-24 w-24 object-cover rounded"
                />
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : editTrade ? "Update Trade" : "Save Trade"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ---- Trades Table ---- */}
      <Card className="dark:bg-gray-800 dark:text-gray-200">
        <CardHeader>
          <CardTitle>All Trades</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading trades...</p>
          ) : trades.length === 0 ? (
            <p className="text-center py-4">No trades yet.</p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Symbol</th>
                  <th className="p-2 text-left">Entry</th>
                  <th className="p-2 text-left">Exit</th>
                  <th className="p-2 text-left">Qty</th>
                  <th className="p-2 text-left">Outcome</th>
                  <th className="p-2 text-left">Screenshot</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => (
                  <tr key={t.id} className="border-b dark:border-gray-600">
                    <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="p-2">{t.symbol}</td>
                    <td className="p-2">{t.entryPrice}</td>
                    <td className="p-2">{t.exitPrice ?? "-"}</td>
                    <td className="p-2">{t.quantity}</td>
                    <td
                      className={`p-2 font-bold ${
                        t.outcome === "TP_HIT"
                          ? "text-green-600 dark:text-green-400"
                          : t.outcome === "SL_HIT"
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-500 dark:text-gray-300"
                      }`}
                    >
                      {t.outcome}
                    </td>
                    <td className="p-2">
                      {t.imageUrl ? (
                        <img
                          src={t.imageUrl}
                          alt="screenshot"
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2 space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(t)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTrade(t.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
