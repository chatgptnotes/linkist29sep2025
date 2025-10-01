# Linkist NFC - Smart Business Cards

A modern e-commerce platform for ordering premium NFC business cards with instant contact sharing. Built with Next.js, Supabase, and Stripe.

## 🚀 Features

- **Card Configurator**: Design custom NFC cards with live preview
- **Real-time Preview**: See your card design as you create it
- **Secure Checkout**: Stripe-powered payment processing
- **Order Tracking**: Complete order management system
- **Admin Dashboard**: Full order management with Supabase backend
- **Email Service**: Automated order lifecycle emails (Resend/Gmail SMTP)
- **Claude Code Auto-Accept**: Autonomous confirmation system for development
- **Founder Member Benefits**: Early adopter program with app access
- **International Shipping**: Worldwide delivery with localized pricing
- **Responsive Design**: Works perfectly on all devices
- **Theme Toggle**: Dark/light mode support

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Payments**: Stripe Checkout & Payment Intents
- **Email**: Resend API / Gmail SMTP with Nodemailer
- **UI Components**: Radix UI, Lucide React
- **Forms**: React Hook Form with Zod validation
- **Image Processing**: html2canvas, jsPDF
- **Development Tools**: Claude Code with Auto-Accept System

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (for payments)
- Resend or Gmail account (for emails)

### Quick Start

1. **Clone and install**
   ```bash
   git clone https://github.com/chatgptnotes/linkist29sep2025.git
   cd linkist29sep2025
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Set up Supabase database**
   - Create a Supabase project at https://supabase.com
   - Run the SQL schema from `supabase_schema.sql` in the SQL Editor
   - Copy your project URL and keys to `.env.local`

4. **Configure Stripe**
   - Get your API keys from https://dashboard.stripe.com/apikeys
   - Add them to `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Visit [http://localhost:3000](http://localhost:3000) to see your app

### Admin Access

Access the admin dashboard at `/admin-access` with credentials from `.env.local`:
- Default email: `admin@linkist.ai`
- Default password: Set in `ADMIN_PASSWORD` env variable

## 🗄 Database Schema

Run this SQL in your Supabase SQL Editor to set up the database:

```sql
-- See supabase/schema.sql for the complete schema
-- Tables: profiles, card_configs, orders, payments, shipping_addresses, card_assets
```

## 📱 Application Flow

1. **Landing Page** (`/`) - Marketing and product showcase
2. **Card Designer** (`/nfc/configure`) - Interactive card configuration with live preview  
3. **Checkout** (`/nfc/checkout`) - Shipping details and payment processing
4. **Order Confirmation** (`/nfc/success`) - Success page with order timeline
5. **Account Dashboard** (`/account`) - Order tracking and user profile

## 🔧 Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linter
npm run lint:fix # Fix linting issues
```

## 📂 Project Structure

```
linkist-app/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   ├── nfc/               # NFC card features
│   │   ├── configure/     # Card designer
│   │   ├── checkout/      # Payment flow  
│   │   └── success/       # Order confirmation
│   └── account/           # User dashboard
├── components/            # Reusable UI components
│   └── CardPreview.tsx   # Card preview component
├── lib/                   # Utility libraries
│   └── supabase/         # Supabase client configuration
├── supabase/             # Database schema
│   └── schema.sql        # Complete database setup
└── README.md             # This file
```

## 🌍 Environment Configuration

Your Supabase is already configured:
- **Project URL**: https://nyjduzifuibyowibhsjg.supabase.co
- **Database**: PostgreSQL with RLS enabled
- **Authentication**: Email-based with OTP support

## 🎨 Card Design Features

- Personal information (name, title, company)
- Contact details (email, phone, website)
- Social media links (LinkedIn, Twitter, Instagram, Facebook)
- Design customization (colors, background styles)
- Logo and photo uploads
- Live preview (front & back card views)
- PDF export for proofing

## 💳 Payment Processing

- Secure Stripe integration (currently in test mode)
- International payment support
- Dynamic tax calculation
- Shipping cost computation
- Order confirmation emails

## 🧪 Testing Checklist

- [x] Landing page loads correctly
- [x] Card configurator works with live preview
- [x] Form validation functions properly  
- [x] Checkout flow processes orders
- [x] Success page displays order details
- [x] Account dashboard shows order history
- [x] Responsive design works on mobile

## 🚀 Ready to Run

**Essential commands:**
```bash
npm run dev    # Start development → http://localhost:3000
npm run build  # Build for production
npm run lint   # Check code quality
```

**Next steps:**
1. Run `npm run dev` to start the development server
2. Visit the Supabase SQL Editor and run the schema from `supabase/schema.sql`
3. Test the card configurator and checkout flow
4. Configure Stripe for real payment processing when ready

## 🆘 Support

- **Database Issues**: Check the Supabase dashboard for connection status
- **Build Errors**: Run `npm run lint:fix` to resolve common issues
- **Payment Testing**: Use Stripe test cards (4242424242424242)

## 🔧 Claude Code Auto-Accept System

This project includes a fully functional auto-accept system for Claude Code development:

**Quick commands:**
```bash
/auto-status         # Check auto-accept status
/auto-accept on      # Enable auto-accept (default)
/auto-accept off     # Disable auto-accept
```

**Test the system:**
```bash
./.claude/test-auto-accept.sh
```

All auto-accepted actions are logged in `.claude/logs/auto-accept.log`.

## 📊 Database Migrations

To update existing orders from NFC- to LNK- prefix, run this in Supabase SQL Editor:

```sql
-- See: supabase/migrations/002_update_order_prefix.sql
UPDATE orders
SET order_number = REPLACE(order_number, 'NFC-', 'LNK-')
WHERE order_number LIKE 'NFC-%';
```

## 🚢 Deployment

**Vercel (Production):**
```bash
vercel --prod
```

**Environment Variables:**
Ensure all variables from `.env.example` are configured in Vercel dashboard.

---

🎉 **Your Linkist NFC application is ready to go!**
