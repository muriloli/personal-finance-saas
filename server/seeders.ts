import { storage } from "./storage";
import bcrypt from "bcryptjs";

const defaultCategories = [
  // Income categories
  { name: "Salário", type: "income" as const, color: "#10B981", icon: "💰", isDefault: true },
  { name: "Freelance", type: "income" as const, color: "#059669", icon: "💻", isDefault: true },
  { name: "Investimentos", type: "income" as const, color: "#0D9488", icon: "📈", isDefault: true },
  { name: "Vendas", type: "income" as const, color: "#0891B2", icon: "🛍️", isDefault: true },
  { name: "Outros", type: "income" as const, color: "#0284C7", icon: "💼", isDefault: true },

  // Expense categories  
  { name: "Alimentação", type: "expense" as const, color: "#EF4444", icon: "🍽️", isDefault: true },
  { name: "Transporte", type: "expense" as const, color: "#F97316", icon: "🚗", isDefault: true },
  { name: "Moradia", type: "expense" as const, color: "#EAB308", icon: "🏠", isDefault: true },
  { name: "Saúde", type: "expense" as const, color: "#84CC16", icon: "🏥", isDefault: true },
  { name: "Educação", type: "expense" as const, color: "#06B6D4", icon: "📚", isDefault: true },
  { name: "Entretenimento", type: "expense" as const, color: "#8B5CF6", icon: "🎬", isDefault: true },
  { name: "Vestuário", type: "expense" as const, color: "#EC4899", icon: "👕", isDefault: true },
  { name: "Tecnologia", type: "expense" as const, color: "#6366F1", icon: "📱", isDefault: true },
  { name: "Outros", type: "expense" as const, color: "#6B7280", icon: "🛒", isDefault: true },
];

export async function seedDefaultCategories() {
  try {
    // Check if categories already exist
    const existingCategories = await storage.getCategories();
    
    if (existingCategories.length === 0) {
      console.log("Seeding default categories...");
      
      for (const category of defaultCategories) {
        await storage.createCategory(category);
      }
      
      console.log(`✅ Seeded ${defaultCategories.length} default categories`);
    } else {
      console.log(`ℹ️ Categories already exist (${existingCategories.length} found), skipping seed`);
    }
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
  }
}

export async function createTestUser() {
  try {
    // Check if test user exists
    const existingUser = await storage.getUserByCpf("12345678901");
    
    if (!existingUser) {
      console.log("Creating test user...");
      
      // Hash the default password
      const hashedPassword = await bcrypt.hash("123456", 10);
      
      const testUser = await storage.createUser({
        name: "Usuário Teste",
        cpf: "12345678901",
        phone: "+5511999999999",
        password: hashedPassword,
        isActive: true,
      });
      
      console.log(`✅ Created test user: ${testUser.name} (CPF: ${testUser.cpf})`);
      console.log(`📝 Default password: 123456`);
    } else {
      console.log(`ℹ️ Test user already exists: ${existingUser.name}`);
    }
  } catch (error) {
    console.error("❌ Error creating test user:", error);
  }
}

export async function runSeeders() {
  console.log("🌱 Running database seeders...");
  await seedDefaultCategories();
  await createTestUser();
  console.log("✅ Database seeding completed!");
}