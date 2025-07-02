import { ChevronDown, ChevronRight, HelpCircle, Mail, Phone, Activity } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    question: "How do I add a new transaction?",
    answer: "You can add transactions in two ways: 1) Click the 'Add Transaction' button in the top menu or dashboard, 2) Send a message to our WhatsApp bot with your expense details. The system will automatically categorize and record your transaction."
  },
  {
    question: "How does the WhatsApp integration work?",
    answer: "Simply send a message to our WhatsApp bot describing your expense or income. For example: 'Spent R$ 50 on groceries at Supermarket XYZ'. The AI will automatically extract the amount, category, and description to create a transaction record."
  },
  {
    question: "Can I edit or delete transactions?",
    answer: "Yes! Go to the Transactions page, find the transaction you want to modify, and click the 'Edit' or 'Delete' button. You can edit all transaction details including amount, category, date, and description."
  },
  {
    question: "How do I set up expense alerts?",
    answer: "Go to Settings > Preferences and enable 'Expense Alerts'. Set your monthly expense limit, and you'll receive notifications when you're approaching or exceeding your budget."
  },
  {
    question: "What file formats can I export my data in?",
    answer: "Currently, you can export all your transaction data in CSV format. This includes all transactions with their categories, amounts, dates, and descriptions. The export feature is available in the Transactions page and Settings."
  },
  {
    question: "How secure is my financial data?",
    answer: "We take security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices and never store your banking credentials. Your CPF is used only for authentication."
  },
  {
    question: "Can I categorize transactions automatically?",
    answer: "Yes! Enable 'Auto-categorization' in Settings > WhatsApp Integration. Our AI will automatically categorize transactions based on the description and merchant information."
  },
  {
    question: "How do I change my notification preferences?",
    answer: "Go to Settings and adjust your notification preferences. You can enable/disable daily reminders, monthly reports, expense alerts, and WhatsApp notifications according to your needs."
  }
];

const guides = [
  {
    title: "Getting Started with FinanceFlow",
    description: "Learn the basics of using your financial dashboard",
    steps: [
      "Log in with your CPF",
      "Review your dashboard overview",
      "Add your first transaction",
      "Set up your preferences in Settings"
    ]
  },
  {
    title: "Using WhatsApp for Expense Tracking",
    description: "Master the WhatsApp bot for quick expense logging",
    steps: [
      "Save the WhatsApp bot number",
      "Send a test message: 'Spent R$ 20 on coffee'",
      "Check if the transaction appears in your dashboard",
      "Customize auto-categorization settings"
    ]
  },
  {
    title: "Setting Up Budget Alerts",
    description: "Configure alerts to stay within your budget",
    steps: [
      "Go to Settings > Preferences",
      "Set your monthly expense limit",
      "Enable 'Expense Alerts'",
      "Choose your notification preferences"
    ]
  }
];

export default function Help() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openGuide, setOpenGuide] = useState<number | null>(null);

  return (
    <>
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Find answers to common questions and get help using FinanceFlow.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Quick Help Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <HelpCircle className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">FAQ</CardTitle>
                <CardDescription>
                  Common questions and answers about using the platform
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Activity className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">System Status</CardTitle>
                <CardDescription>
                  All systems operational
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Online
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Mail className="h-8 w-8 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Contact Support</CardTitle>
                <CardDescription>
                  Get help from our support team
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" size="sm">
                  contact@financeflow.com
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find quick answers to the most common questions about FinanceFlow.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq, index) => (
                <Collapsible
                  key={index}
                  open={openFaq === index}
                  onOpenChange={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <span className="font-medium">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 text-muted-foreground">
                    {faq.answer}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CardContent>
          </Card>

          {/* How-to Guides */}
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Guides</CardTitle>
              <CardDescription>
                Detailed instructions for getting the most out of FinanceFlow.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {guides.map((guide, index) => (
                <Collapsible
                  key={index}
                  open={openGuide === index}
                  onOpenChange={() => setOpenGuide(openGuide === index ? null : index)}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <h3 className="font-medium">{guide.title}</h3>
                      <p className="text-sm text-muted-foreground">{guide.description}</p>
                    </div>
                    {openGuide === index ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4">
                    <ol className="space-y-2">
                      {guide.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-medium mr-3 mt-0.5">
                            {stepIndex + 1}
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
              <CardDescription>
                Contact our support team for personalized assistance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@financeflow.com</p>
                    <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">WhatsApp Support</p>
                    <p className="text-sm text-muted-foreground">+55 (11) 99999-9999</p>
                    <p className="text-xs text-muted-foreground">Available 9 AM - 6 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
