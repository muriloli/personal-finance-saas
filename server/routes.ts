import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, transactionFormSchema, insertUserSettingsSchema } from "@shared/schema";
import { z } from "zod";
import { authenticateUser } from "./middleware/auth";
import bcrypt from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { cpf, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByCpf(cpf);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Invalid CPF or password" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid CPF or password" });
      }

      // Create session
      const session = await storage.createSession(user.id, req.ip || "", req.get("User-Agent") || "");
      
      res.json({ user, sessionToken: session.sessionToken });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      const sessionToken = req.headers.authorization?.replace("Bearer ", "");
      if (sessionToken) {
        await storage.deleteSession(sessionToken);
      }
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  app.get("/api/auth/me", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUser(req.session!.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Authentication failed" });
    }
  });



  // Dashboard routes
  app.get("/api/dashboard/overview", authenticateUser, async (req, res) => {
    try {
      const overview = await storage.getDashboardOverview(req.session!.userId);
      res.json(overview);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  app.get("/api/dashboard/charts", authenticateUser, async (req, res) => {
    try {
      const charts = await storage.getChartData(req.session!.userId);
      res.json(charts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chart data" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", authenticateUser, async (req, res) => {
    try {
      const { 
        page = "1", 
        limit = "10", 
        search, 
        category, 
        type, 
        startDate, 
        endDate,
        sortField = "transactionDate",
        sortDirection = "desc"
      } = req.query;
      
      const filters = {
        search: search as string,
        category: category as string,
        type: type as "income" | "expense",
        startDate: startDate as string,
        endDate: endDate as string,
      };

      const transactions = await storage.getTransactions(
        req.session!.userId,
        parseInt(page as string),
        parseInt(limit as string),
        filters,
        sortField as string,
        sortDirection as string
      );
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", authenticateUser, async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await storage.getTransaction(id, req.session!.userId);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  app.post("/api/transactions", authenticateUser, async (req, res) => {
    try {
      const validatedData = transactionFormSchema.parse(req.body);
      
      // Use the date exactly as received from frontend (already in YYYY-MM-DD format)
      const dateToUse = validatedData.transactionDate;
      
      const transaction = await storage.createTransaction({
        ...validatedData,
        userId: req.session!.userId,
        amount: validatedData.amount.toString(),
        transactionDate: dateToUse,
      });
      
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Transaction creation error:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  app.put("/api/transactions/:id", authenticateUser, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = transactionFormSchema.parse(req.body);
      
      // Use the date exactly as received from frontend (already in YYYY-MM-DD format)
      const dateToUse = validatedData.transactionDate;
      
      const transaction = await storage.updateTransaction(id, {
        ...validatedData,
        userId: req.session!.userId,
        amount: validatedData.amount.toString(),
        transactionDate: dateToUse,
      });
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update transaction" });
    }
  });

  app.delete("/api/transactions/:id", authenticateUser, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTransaction(id, req.session!.userId);
      
      if (!success) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
      console.error("Transaction deletion error:", error);
      res.status(500).json({ message: "Failed to delete transaction" });
    }
  });



  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const { type } = req.query;
      const categories = await storage.getCategories(type as "income" | "expense");
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Settings routes
  app.get("/api/settings", authenticateUser, async (req, res) => {
    try {
      const settings = await storage.getUserSettings(req.session!.userId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", authenticateUser, async (req, res) => {
    try {
      const validatedData = insertUserSettingsSchema.parse(req.body);
      const settings = await storage.updateUserSettings(req.session!.userId, validatedData);
      
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Get all users (admin only)
  app.get("/api/users", authenticateUser, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  // User Registration route
  app.post("/api/users/register", authenticateUser, async (req, res) => {
    try {
      const { name, cpf, phone, password } = req.body;
      
      // Validate required fields
      if (!name || !cpf || !phone || !password) {
        return res.status(400).json({ message: "Name, CPF, phone, and password are required" });
      }

      // Validate CPF format (11 digits)
      if (!/^\d{11}$/.test(cpf)) {
        return res.status(400).json({ message: "CPF must be 11 digits" });
      }

      // Validate password length
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByCpf(cpf);
      if (existingUser) {
        return res.status(409).json({ message: "User with this CPF already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await storage.createUser({
        name,
        cpf,
        phone,
        password: hashedPassword,
        isActive: true,
        admin: false
      });

      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      console.error("User registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  // Update user
  app.put("/api/users/:id", authenticateUser, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, cpf, phone, isActive } = req.body;
      
      const updatedUser = await storage.updateUser(id, {
        name,
        cpf,
        phone,
        isActive,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Set password for existing user (temporary migration route)
  app.post("/api/users/:id/set-password", authenticateUser, async (req, res) => {
    try {
      const { id } = req.params;
      const { password } = req.body;
      
      if (!password || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedUser = await storage.updateUser(id, {
        password: hashedPassword,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Password set successfully" });
    } catch (error) {
      console.error("Set password error:", error);
      res.status(500).json({ message: "Failed to set password" });
    }
  });

  // Delete user
  app.delete("/api/users/:id", authenticateUser, async (req, res) => {
    try {
      const { id } = req.params;
      
      const deleted = await storage.deleteUser(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Temporary migration route to set passwords for existing users (no auth required)
  app.post("/api/migrate/set-password", async (req, res) => {
    try {
      const { cpf, password } = req.body;
      
      if (!cpf || !password) {
        return res.status(400).json({ message: "CPF and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      // Find user by CPF
      const user = await storage.getUserByCpf(cpf);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update user with hashed password
      const updatedUser = await storage.updateUser(user.id, { password: hashedPassword });
      
      if (updatedUser) {
        res.json({ message: "Password set successfully", user: { id: updatedUser.id, name: updatedUser.name, cpf: updatedUser.cpf } });
      } else {
        res.status(500).json({ message: "Failed to update password" });
      }
    } catch (error) {
      console.error("Migration error:", error);
      res.status(500).json({ message: "Failed to set password" });
    }
  });

  // Export routes
  app.get("/api/export/transactions", authenticateUser, async (req, res) => {
    try {
      const csvData = await storage.exportTransactionsCSV(req.session!.userId);
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=transactions.csv");
      res.send(csvData);
    } catch (error) {
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
