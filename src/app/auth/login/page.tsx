"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


//   {
//   "email": "nikhil@example.com",
//   "password": "123456"
//  http://localhost:8080/api/auth/login
// }
 // This runs every time user types in an input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target; 
    setFormData((prev) => ({
      ...prev,
      [id]: value, // updates the field that matches input's "id"
    }));
  };
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", formData);

      // assuming backend returns { token: "jwt_here" }
      localStorage.setItem("token", res.data.token);

      // ✅ success toast
      toast.success("Login successful 🎉");

      // redirect if needed
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);

      // ❌ error toast
      if (err.response?.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error("Something went wrong, try again");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Welcome Back
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Login to continue to your dashboard
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange} // 🔹 capture value
                  placeholder="Enter your email"
                  required
                  className="rounded-xl"

                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange} // 🔹 capture value
                  placeholder="Enter your password"
                  required
                  className="rounded-xl"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full rounded-xl"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              {/* Links */}
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <a href="#" className="hover:underline">
                  Forgot password?
                </a>
                <a href="#" className="hover:underline">
                  Create account
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
