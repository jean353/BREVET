# Brevet Hub - Intellectual Property Marketplace

Brevet Hub is a modern, high-performance web platform designed to connect patent inventors with potential buyers and licensees worldwide. Built on top of a robust tech stack, it provides a seamless and secure environment to browse, manage, and transact intellectual properties.

## 🚀 Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MySQL](https://www.mysql.com/) via [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a dark-mode-first glassmorphism aesthetic
- **Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Prerequisites

Ensure you have the following installed before proceeding:
- **Node.js** (v18+)
- **MySQL Server** (e.g., via XAMPP, WAMP, or Docker)
- **Git**

## 📦 Local Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jean353/BREVET.git
   cd BREVET
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Ensure your `.env` file matches your MySQL configuration:
   ```env
   # Database (MySQL)
   DATABASE_URL="mysql://root:@localhost:3306/brevet_db"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="change-this-to-a-random-secret-for-production"
   ```

4. **Initialize Database**
   Push the Prisma schema to your running MySQL instance and run the seed script to generate the Admin account:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to interact with the application.

## 🛡️ Admin Access

By default, an Admin account is created during the `npx prisma db seed` process to manage patent verifications and the platform dashboard.

- **Email**: `admin@brevethub.com`
- **Password**: `AdminPassword123!`

*Note: Change this password immediately if deploying to production!*

## 🧑‍💻 Usage & Workflows

### Inventors
- **Registration**: Register an account with the role "INVENTOR".
- **Dashboard**: Use the specific inventor dashboard to submit new patents.
- **Verification**: New patents begin in the `PENDING` state and require platform Admin approval before they join the live Marketplace.

### Buyers
- **Marketplace**: Browse all `VERIFIED` patents with extensive filters (Price, Category, Newest, etc).
- **Communication**: Directly message inventors via the native messaging feature to negotiate sales or licenses.

### Admins
- **Verification Queue**: Access `/admin` to approve or reject pending patents. Only verified patents are displayed to buyers.

## 🔄 CI/CD Automation

This project is configured using **GitHub Actions**. Upon every `push` or `pull_request` to the `main` branch, the workflow will automatically:
1. Set up Node.js.
2. Install dependencies.
3. Validate and generate the Prisma Client.
4. Run ESLint.
5. Create a Production Build of the Next.js application to ensure code integrity.

You can find the configuration in `.github/workflows/ci.yml`.

---
*Built for innovators, by innovators.*
