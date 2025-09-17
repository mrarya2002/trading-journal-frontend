"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Moon, BarChart3, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { theme, setTheme } = useTheme();
  return (
     <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <Link href="/" className="text-2xl font-bold">
          TradeJournal<span className="text-primary">X</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="#features" className="hover:text-primary">Features</Link>
          <Link href="#analytics" className="hover:text-primary">Analytics</Link>
          <Link href="#pricing" className="hover:text-primary">Pricing</Link>
          <Button asChild>
            <Link href="/auth/login">Get Started</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center py-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold mb-6"
        >
          Master Your <span className="text-primary">Trades</span> with Confidence
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8"
        >
          A professional trading journal to track, analyze, and grow your portfolio.  
          Gain insights and become a disciplined trader.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex gap-4"
        >
          <Button size="lg" asChild>
            <Link href="/signup">Start Free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">Learn More</Link>
          </Button>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Why Choose TradeJournalX?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="flex flex-col items-center text-center">
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
                <p className="text-muted-foreground">
                  Visualize your trades with modern charts and gain insights instantly.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="flex flex-col items-center text-center">
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Performance Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor your growth, win-rate, and risk-to-reward ratio in real-time.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="flex flex-col items-center text-center">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your trading data is encrypted and safe. Privacy is our priority.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Analytics Preview */}
      <section id="analytics" className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Powerful Analytics Dashboard</h2>
          <p className="text-muted-foreground mb-12">
            Track performance metrics, PnL, and detailed trade history with ease.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-muted rounded-2xl shadow-lg p-12"
          >
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              📊 [Analytics Chart Preview Here]
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary text-primary-foreground text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold mb-6"
        >
          Ready to Level Up Your Trading?
        </motion.h2>
        <p className="mb-8 text-lg">
          Join thousands of traders using TradeJournalX to build consistency and profitability.
        </p>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/signup">Get Started Today</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} TradeJournalX. All rights reserved.
      </footer>
    </div>
  
  );
}
