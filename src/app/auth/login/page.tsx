"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Building2, ArrowRight } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full rounded-xl h-11" disabled={pending}>
      {pending ? "Signing in..." : "Sign In"}
      {!pending && <ArrowRight className="h-4 w-4 ml-2" />}
    </Button>
  );
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await login(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground mt-1">Sign in to manage your listings</p>
        </div>
        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-6">
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="rounded-xl h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="rounded-xl h-11"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive bg-destructive/5 rounded-lg p-3">{error}</p>
              )}
              <SubmitButton />
            </form>
          </CardContent>
          <CardFooter className="justify-center pb-6">
            <p className="text-xs text-muted-foreground">
              Admin access only
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
