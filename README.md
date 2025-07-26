This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Security & Legal Requirements

⚠️ **CRITICAL: This application is NOT ready for public deployment until the following issues are addressed.**

### 🔒 Security Issues

#### **IMMEDIATE FIXES REQUIRED:**

1. **Database Migration**
   - **Current**: Using SQLite (`file:./dev.db`) - NOT suitable for production
   - **Required**: Migrate to PostgreSQL or MySQL for production
   - **Action**: Update `DATABASE_URL` in production environment

2. **Environment Variables**
   - **Current**: Hardcoded `NEXTAUTH_SECRET` in setup documentation
   - **Required**: Generate new secret for production
   - **Action**: 
     ```bash
     openssl rand -base64 32
     # Set NEXTAUTH_URL="https://yourdomain.com"
     ```

3. **Security Headers**
   - **Missing**: Content Security Policy (CSP) headers
   - **Missing**: Rate limiting on authentication endpoints
   - **Missing**: Security middleware implementation

#### **PRODUCTION HARDENING:**

1. **Infrastructure Security**
   - Set up proper HTTPS configuration
   - Implement request rate limiting
   - Add security monitoring and logging
   - Configure proper backup strategies

2. **Authentication Security**
   - Add CSRF protection (NextAuth handles basic protection)
   - Implement session timeout policies
   - Add failed login attempt monitoring

### 📋 Legal Compliance Issues

#### **MISSING LEGAL DOCUMENTS:**

1. **Privacy Policy**
   - **Required**: Document how user data is collected, used, and stored
   - **Required**: Explain data sharing practices with Google OAuth
   - **Required**: Outline data retention policies

2. **Terms of Service**
   - **Required**: User agreement and service terms
   - **Required**: Liability limitations and user responsibilities
   - **Required**: Intellectual property rights

3. **Cookie Consent**
   - **Required**: GDPR-compliant cookie consent banner
   - **Required**: Clear explanation of cookie usage

#### **GDPR COMPLIANCE:**

1. **Data Rights Implementation**
   - **Missing**: Data deletion API endpoints
   - **Missing**: Data export functionality
   - **Missing**: User consent management
   - **Missing**: Data portability features

2. **Data Protection**
   - **Required**: Clear data retention schedules
   - **Required**: Data minimization practices
   - **Required**: User notification of data changes

### 🚨 **DEPLOYMENT CHECKLIST:**

Before public deployment, ensure all items below are completed:

#### **Security Checklist:**
- [ ] Migrate from SQLite to PostgreSQL/MySQL
- [ ] Generate new NEXTAUTH_SECRET for production
- [ ] Set proper NEXTAUTH_URL for production domain
- [ ] Implement security headers and CSP
- [ ] Add rate limiting to authentication endpoints
- [ ] Configure HTTPS and SSL certificates
- [ ] Set up monitoring and alerting
- [ ] Implement backup and disaster recovery

#### **Legal Checklist:**
- [ ] Create and publish Privacy Policy
- [ ] Create and publish Terms of Service
- [ ] Implement GDPR-compliant cookie consent
- [ ] Add data deletion functionality
- [ ] Add data export functionality
- [ ] Implement user consent management
- [ ] Set up data retention policies
- [ ] Add user notification systems

#### **Infrastructure Checklist:**
- [ ] Deploy to production-ready hosting platform
- [ ] Configure production database with proper scaling
- [ ] Set up CI/CD pipeline with security scanning
- [ ] Implement logging and error tracking
- [ ] Configure domain and DNS settings
- [ ] Set up SSL/TLS certificates
- [ ] Configure CDN for static assets

### 📊 **Current Status:**

- **Security Score**: 6/10 (Good foundation, needs production hardening)
- **Legal Score**: 3/10 (Missing essential legal documents)
- **Production Readiness**: ❌ NOT READY

**Recommendation**: Address all critical security and legal issues before any public deployment.

## Roadmap

Here are some planned features and ideas for future development:

- **Multi-User Decisions**
  - Allow multiple users to collaborate on the same decision, share factors, outcomes, and ratings.

- **Automatic Review Lookup / Web Scraping**
  - Integrate web scraping or API-based review lookup to automatically gather relevant information for decisions (e.g., product reviews, destination info).

- **AI-Assisted Decision Overview**
  - Use AI to analyze decision data and provide smart suggestions, summaries, or highlight potential biases.

- **Export & Share**
  - Allow users to export their decision summary as PDF or share a link with others for feedback.

- **Comments & Discussion**
  - Add a comment section for each decision so users (or collaborators) can discuss and provide input.

- **Reminders & Follow-ups**
  - Let users set reminders to revisit decisions or follow up on outcomes after a certain period.

- **Mobile App / PWA Support**
  - Make the app installable as a Progressive Web App (PWA) for offline and mobile use.

- **Custom Factor/Outcome Types**
  - Allow users to add descriptions, images, or links to factors and outcomes for richer context.

- **Decision Confidence Meter**
  - After rating, show a “confidence” score based on how balanced or lopsided the ratings are.

- **Integration with Calendar/Tasks**
  - Add decisions or follow-ups to Google Calendar, Outlook, or task management tools.

- **Anonymous/Public Decisions**
  - Allow users to make some decisions public for community input or to browse public decisions for inspiration.

- **Accessibility Enhancements**
  - Ensure the app is fully accessible (screen reader support, keyboard navigation, color contrast, etc.).