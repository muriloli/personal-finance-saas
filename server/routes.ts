import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, transactionFormSchema, insertUserSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { cpf } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByCpf(cpf);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Invalid CPF or user not found" });
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

  app.get("/api/auth/me", async (req, res) => {
    try {
      const sessionToken = req.headers.authorization?.replace("Bearer ", "");
      if (!sessionToken) {
        return res.status(401).json({ message: "No session token" });
      }

      const session = await storage.getSessionByToken(sessionToken);
      if (!session || session.expiresAt < new Date()) {
        return res.status(401).json({ message: "Invalid or expired session" });
      }

      const user = await storage.getUser(session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Dashboard routes
  app.get("/api/dashboard/overview", async (req, res) => {
    try {
      const sessionToken = req.headers.authorization?.replace("Bearer ", "");
      const session = await storage.getSessionByToken(sessionToken || "");
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const overview = await storage.getDashboardOverview(session.userId);
      res.json(overview);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  app.get("/api/dashboard/charts", async (req, res) => {
    try {
      const sessionToken = req.headers.authorization?.replace("Bearer ", "");
      const session = await storage.getSessionByToken(sessionToken || "");
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const charts = await storage.getChartData(session.userId);
      res.json(charts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chart data" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const sessionToken = req.headers.authorization?.replace("Bearer ", "");
      const session = await storage.getSessionByToken(sessionToken || "");
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { page = "1", limit = "10", search, category, type, startDate, endDate } = req.query;
      
      const filters = {
        search: search as string,
        category: category as string,
        type: type as "income" | "expense",
        startDate: startDate as string,
        endDate: endDate as string,
      };

      const transactions = await storage.getTransactions(
        session.userId,
        parseInt(page as string),
        parseInt(limit as string),
        filters
      );
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const sessionToken = req.headers.authorization?.replace("Bearer ", "");
      const session = await storage.getSessionByToken(sessionToken || "");
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = transactionFormSchema.parse(req.body);
      
      const transaction = await storage.createTransaction({
        ...validatedData,
        userId: session.userId,
        amount: validatedData.amount.toString(),
      });
      
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  app.put("/api/transactions/:id", async (req, res) => {
    try {
      const sessionToken = req.headers.authorization?.replace("Bearer ", "");
      const session = await storage.getSessionByToken(sessionToken || "");
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      const validatedData = transactionFormSchema.parse(req.body);
      
      const transaction = await storage.updateTransaction(id, {
        ...validatedData,
        amount: validatedData.amount.toString(),
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

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const sessionToken = req.headers.authorization?.replace("Bearer ", "");
      const session = await storage.getSessionByToken(sessionToken || "");
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      const success = await storage.deleteTransaction(id, session.userId);
      
      if (!success) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
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
  app.get("/api/settings", async (req, res) => {
    try {
      const sessionToken = req.headers.authorization?.replace("Bearer ", "");
      const session = await storage.getSessionByToken(sessionToken || "");
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const settings = await storage.getUserSettings(session.userId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const sessionToken = req.headers.authorization?.replace("Bearer ", "");
      const session = await storage.getSessionByToken(sessionToken || "");
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertUserSettingsSchema.parse(req.body);
      const settings = await storage.updateUserSettings(session.userId, validatedData);
      
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Export routes
  app.get("/api/export/transactions", async (req, res) => {
    try {
      const sessionToken = req.headers.authorization?.replace("Bearer ", "");
      const session = await storage.getSessionByToken(sessionToken || "");
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const csvData = await storage.exportTransactionsCSV(session.userId);
      
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
