
import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const handleToggleForm = () => {
    setActiveTab(activeTab === "login" ? "register" : "login");
  };

  return (
    <div className="min-h-screen flex flex-col sm:p-8 md:p-16 bg-gray-50">
      <div className="mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-finance-navy mb-2">Financial Compass</h1>
        <p className="text-muted-foreground">
          Your personal finance management solution
        </p>
      </div>

      <div className="flex flex-1 items-start">
        <div className="hidden md:block md:w-1/2 p-8">
          <div className="rounded-lg hero-gradient text-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              Take Control of Your Finances
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="mr-2 mt-1">✓</span>
                <span>Track your income and expenses with ease</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1">✓</span>
                <span>Set and monitor savings goals</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1">✓</span>
                <span>Create custom categories for better organization</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1">✓</span>
                <span>
                  Generate reports to understand your financial patterns
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1">✓</span>
                <span>Secure, private, and accessible from anywhere</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-sm">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "register")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onToggleForm={handleToggleForm} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm onToggleForm={handleToggleForm} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
