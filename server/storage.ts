import { 
  users, 
  categories, 
  transactions, 
  userSessions, 
  userSettings,
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type Transaction,
  type InsertTransaction,
  type UserSession,
  type InsertUserSession,
  type UserSettings,
  type InsertUserSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, ilike, gte, lte, sql, count } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByCpf(cpf: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Session methods
  createSession(userId: string, ipAddress: string, userAgent: string): Promise<UserSession>;
  getSessionByToken(token: string): Promise<UserSession | undefined>;
  deleteSession(token: string): Promise<void>;

  // Transaction methods
  getTransactions(
    userId: string, 
    page: number, 
    limit: number, 
    filters: {
      search?: string;
      category?: string;
      type?: "income" | "expense";
      startDate?: string;
      endDate?: string;
    }
  ): Promise<{
    transactions: (Transaction & { category: Category })[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: string, userId: string): Promise<boolean>;

  // Category methods
  getCategories(type?: "income" | "expense"): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Settings methods
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  updateUserSettings(userId: string, settings: Partial<InsertUserSettings>): Promise<UserSettings>;

  // Dashboard methods
  getDashboardOverview(userId: string): Promise<{
    totalIncome: number;
    totalExpenses: number;
    currentBalance: number;
    monthlySavings: number;
    incomeChange: number;
    expenseChange: number;
    balanceChange: number;
    savingsRate: number;
  }>;
  getChartData(userId: string): Promise<{
    incomeVsExpenses: Array<{
      month: string;
      income: number;
      expenses: number;
    }>;
    expensesByCategory: Array<{
      name: string;
      value: number;
      color: string;
    }>;
  }>;

  // Export methods
  exportTransactionsCSV(userId: string): Promise<string>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByCpf(cpf: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.cpf, cpf));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createSession(userId: string, ipAddress: string, userAgent: string): Promise<UserSession> {
    const sessionToken = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes

    const [session] = await db
      .insert(userSessions)
      .values({
        userId,
        sessionToken,
        expiresAt,
        ipAddress,
        userAgent,
      })
      .returning();

    return session;
  }

  async getSessionByToken(token: string): Promise<UserSession | undefined> {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.sessionToken, token));
    return session || undefined;
  }

  async deleteSession(token: string): Promise<void> {
    await db.delete(userSessions).where(eq(userSessions.sessionToken, token));
  }

  async getTransactions(
    userId: string, 
    page: number, 
    limit: number, 
    filters: {
      search?: string;
      category?: string;
      type?: "income" | "expense";
      startDate?: string;
      endDate?: string;
    }
  ) {
    let query = db
      .select({
        id: transactions.id,
        userId: transactions.userId,
        categoryId: transactions.categoryId,
        type: transactions.type,
        amount: transactions.amount,
        description: transactions.description,
        transactionDate: transactions.transactionDate,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
        source: transactions.source,
        category: {
          id: categories.id,
          name: categories.name,
          type: categories.type,
          color: categories.color,
          icon: categories.icon,
          isDefault: categories.isDefault,
          createdAt: categories.createdAt,
        }
      })
      .from(transactions)
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.userId, userId));

    // Apply filters
    const conditions = [eq(transactions.userId, userId)];

    if (filters.search) {
      conditions.push(ilike(transactions.description, `%${filters.search}%`));
    }

    if (filters.category) {
      conditions.push(eq(transactions.categoryId, filters.category));
    }

    if (filters.type) {
      conditions.push(eq(transactions.type, filters.type));
    }

    if (filters.startDate) {
      conditions.push(gte(transactions.transactionDate, filters.startDate));
    }

    if (filters.endDate) {
      conditions.push(lte(transactions.transactionDate, filters.endDate));
    }

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(transactions)
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(and(...conditions));

    const total = totalResult.count;

    // Get paginated results
    const results = await db
      .select({
        id: transactions.id,
        userId: transactions.userId,
        categoryId: transactions.categoryId,
        type: transactions.type,
        amount: transactions.amount,
        description: transactions.description,
        transactionDate: transactions.transactionDate,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
        source: transactions.source,
        category: {
          id: categories.id,
          name: categories.name,
          type: categories.type,
          color: categories.color,
          icon: categories.icon,
          isDefault: categories.isDefault,
          createdAt: categories.createdAt,
        }
      })
      .from(transactions)
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(desc(transactions.transactionDate), desc(transactions.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return {
      transactions: results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [created] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return created;
  }

  async updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const [updated] = await db
      .update(transactions)
      .set({ ...transaction, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteTransaction(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
    return result.rowCount > 0;
  }

  async getCategories(type?: "income" | "expense"): Promise<Category[]> {
    let query = db.select().from(categories);
    
    if (type) {
      query = query.where(eq(categories.type, type));
    }
    
    return await query.orderBy(asc(categories.name));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [created] = await db
      .insert(categories)
      .values(category)
      .returning();
    return created;
  }

  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
    return settings || undefined;
  }

  async updateUserSettings(userId: string, settings: Partial<InsertUserSettings>): Promise<UserSettings> {
    // Try to update existing settings first
    const [updated] = await db
      .update(userSettings)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(userSettings.userId, userId))
      .returning();

    if (updated) {
      return updated;
    }

    // If no existing settings, create new ones
    const [created] = await db
      .insert(userSettings)
      .values({ ...settings, userId })
      .returning();
    
    return created;
  }

  async getDashboardOverview(userId: string) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Current month data
    const currentMonthStart = new Date(currentYear, currentMonth, 1);
    const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0);

    const [currentMonthIncome] = await db
      .select({ total: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS DECIMAL)), 0)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, "income"),
          gte(transactions.transactionDate, currentMonthStart.toISOString().split('T')[0]),
          lte(transactions.transactionDate, currentMonthEnd.toISOString().split('T')[0])
        )
      );

    const [currentMonthExpenses] = await db
      .select({ total: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS DECIMAL)), 0)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, "expense"),
          gte(transactions.transactionDate, currentMonthStart.toISOString().split('T')[0]),
          lte(transactions.transactionDate, currentMonthEnd.toISOString().split('T')[0])
        )
      );

    // Last month data for comparison
    const lastMonthStart = new Date(lastMonthYear, lastMonth, 1);
    const lastMonthEnd = new Date(lastMonthYear, lastMonth + 1, 0);

    const [lastMonthIncome] = await db
      .select({ total: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS DECIMAL)), 0)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, "income"),
          gte(transactions.transactionDate, lastMonthStart.toISOString().split('T')[0]),
          lte(transactions.transactionDate, lastMonthEnd.toISOString().split('T')[0])
        )
      );

    const [lastMonthExpenses] = await db
      .select({ total: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS DECIMAL)), 0)` })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, "expense"),
          gte(transactions.transactionDate, lastMonthStart.toISOString().split('T')[0]),
          lte(transactions.transactionDate, lastMonthEnd.toISOString().split('T')[0])
        )
      );

    const totalIncome = currentMonthIncome.total || 0;
    const totalExpenses = currentMonthExpenses.total || 0;
    const currentBalance = totalIncome - totalExpenses;
    const monthlySavings = Math.max(0, currentBalance);

    const lastIncome = lastMonthIncome.total || 0;
    const lastExpenses = lastMonthExpenses.total || 0;
    const lastBalance = lastIncome - lastExpenses;

    const incomeChange = lastIncome > 0 ? ((totalIncome - lastIncome) / lastIncome) * 100 : 0;
    const expenseChange = lastExpenses > 0 ? ((totalExpenses - lastExpenses) / lastExpenses) * 100 : 0;
    const balanceChange = lastBalance > 0 ? ((currentBalance - lastBalance) / lastBalance) * 100 : 0;
    const savingsRate = totalIncome > 0 ? (monthlySavings / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      currentBalance,
      monthlySavings,
      incomeChange,
      expenseChange,
      balanceChange,
      savingsRate,
    };
  }

  async getChartData(userId: string) {
    // Get last 6 months of income vs expenses
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        year: date.getFullYear(),
        monthNum: date.getMonth(),
      });
    }

    const incomeVsExpenses = await Promise.all(
      months.map(async ({ month, year, monthNum }) => {
        const monthStart = new Date(year, monthNum, 1);
        const monthEnd = new Date(year, monthNum + 1, 0);

        const [income] = await db
          .select({ total: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS DECIMAL)), 0)` })
          .from(transactions)
          .where(
            and(
              eq(transactions.userId, userId),
              eq(transactions.type, "income"),
              gte(transactions.transactionDate, monthStart.toISOString().split('T')[0]),
              lte(transactions.transactionDate, monthEnd.toISOString().split('T')[0])
            )
          );

        const [expenses] = await db
          .select({ total: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS DECIMAL)), 0)` })
          .from(transactions)
          .where(
            and(
              eq(transactions.userId, userId),
              eq(transactions.type, "expense"),
              gte(transactions.transactionDate, monthStart.toISOString().split('T')[0]),
              lte(transactions.transactionDate, monthEnd.toISOString().split('T')[0])
            )
          );

        return {
          month,
          income: income.total || 0,
          expenses: expenses.total || 0,
        };
      })
    );

    // Get current month expenses by category
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const expensesByCategory = await db
      .select({
        name: categories.name,
        value: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS DECIMAL)), 0)`,
        color: categories.color,
      })
      .from(transactions)
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, "expense"),
          gte(transactions.transactionDate, currentMonthStart.toISOString().split('T')[0]),
          lte(transactions.transactionDate, currentMonthEnd.toISOString().split('T')[0])
        )
      )
      .groupBy(categories.id, categories.name, categories.color)
      .having(sql`SUM(CAST(${transactions.amount} AS DECIMAL)) > 0`)
      .orderBy(sql`SUM(CAST(${transactions.amount} AS DECIMAL)) DESC`);

    return {
      incomeVsExpenses,
      expensesByCategory: expensesByCategory.map(item => ({
        name: item.name,
        value: item.value || 0,
        color: item.color || "#6b7280",
      })),
    };
  }

  async exportTransactionsCSV(userId: string): Promise<string> {
    const results = await db
      .select({
        date: transactions.transactionDate,
        description: transactions.description,
        category: categories.name,
        type: transactions.type,
        amount: transactions.amount,
        source: transactions.source,
      })
      .from(transactions)
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.transactionDate));

    const headers = ["Date", "Description", "Category", "Type", "Amount", "Source"];
    const rows = results.map(row => [
      row.date,
      row.description || "",
      row.category,
      row.type,
      row.amount,
      row.source || "web",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => 
        row.map(cell => {
          const stringCell = String(cell);
          if (stringCell.includes(",") || stringCell.includes('"')) {
            return `"${stringCell.replace(/"/g, '""')}"`;
          }
          return stringCell;
        }).join(",")
      ),
    ].join("\n");

    return csvContent;
  }

  private generateSessionToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}

export const storage = new DatabaseStorage();
