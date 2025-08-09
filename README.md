# Modern Advanced Form Creator

A sophisticated, AI-powered form builder with an LLM-style chat interface that allows users to create complex forms through natural language prompts. Built with React, TypeScript, Node.js, and MySQL.

![Form Creator Demo](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Modern+Form+Creator)

## 🚀 Features

### Core Functionality
- **AI-Powered Form Generation**: Create forms using natural language prompts
- **LLM Chat Interface**: Conversational form building experience
- **Real-time Preview**: See your forms as you build them
- **Code Generation**: Export forms as JSON, React JSX, or HTML
- **Multi-page Forms**: Complex forms with navigation and progress tracking
- **Advanced Validation**: Yup-based validation with custom rules

### Form Elements
- **Standard Inputs**: Text, email, phone, textarea, select, radio, checkbox
- **Advanced Elements**: File uploads, digital signatures, date/time pickers
- **Dynamic Elements**: Conditional fields based on other inputs
- **Info Elements**: Instructions and help text
- **Modal Sub-forms**: Complex nested form structures

### Enterprise Features
- **Form Analytics**: Completion rates, drop-off analysis, device statistics
- **Theme Customization**: Custom colors, fonts, and layouts
- **Integrations**: Webhooks, email, Zapier, Slack, Google Sheets, CRM
- **Accessibility Checker**: WCAG 2.1 compliance analysis
- **Team Collaboration**: Multi-user editing and permissions
- **Data Export**: Multiple export formats

## 🏗️ Architecture

```
├── Frontend (React + TypeScript + Tailwind)
│   ├── Chat Interface (LLM-style conversation)
│   ├── Form Builder (Visual form editor)
│   ├── Preview Engine (Real-time form rendering)
│   └── Analytics Dashboard
│
├── Backend (Node.js + Express + TypeScript)
│   ├── REST API (Form CRUD operations)
│   ├── LLM Integration (OpenAI/Anthropic)
│   ├── MCP Support (Model Context Protocol)
│   └── Database Layer (Sequelize ORM)
│
└── Database (MySQL)
    ├── Forms & Structure
    ├── User Management
    ├── Analytics Data
    └── Integration Configs
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Yup** - Schema validation

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe backend
- **Sequelize** - ORM for database operations
- **MySQL** - Relational database

### AI Integration
- **OpenAI GPT-4** - Primary LLM provider
- **Anthropic Claude** - Alternative LLM provider
- **MCP (Model Context Protocol)** - Enhanced AI capabilities

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/modern-form-creator.git
cd modern-form-creator
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Database Setup
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE form_creator;
```

### 4. Environment Configuration
```bash
# Copy environment files
cp server/.env.example server/.env

# Edit server/.env with your configuration
```

Required environment variables:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=form_creator
DB_USER=root
DB_PASS=your_password

# LLM Configuration
OPENAI_API_KEY=sk-your-openai-key-here
LLM_PROVIDER=openai
LLM_MODEL=gpt-4

# Server
PORT=3001
JWT_SECRET=your-jwt-secret
```

### 5. Start the Application
```bash
# Optional: Seed database with sample forms
cd server
npm run seed
cd ..

# Start backend server
cd server
npm run dev

# In another terminal, start frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 🎯 Usage Guide

### Creating Your First Form

1. **Start a Conversation**
   - Click "New Form" in the header
   - Type a natural language prompt like: "Create a contact form with name, email, phone, and message fields"

2. **Review Generated Form**
   - Switch to the "Preview" tab to see your form
   - Use the "Code" tab to view generated code
   - Make adjustments by chatting with the AI

3. **Customize Your Form**
   - Use the "Theme" tab to customize colors and fonts
   - Add integrations in the "Integrations" tab
   - Check accessibility with the "A11y" tab

4. **Save and Deploy**
   - Forms are automatically saved to the database
   - Export code for integration into your website
   - Set up integrations to handle form submissions

### Advanced Features

#### Multi-page Forms
```
"Create a job application form with 3 pages: 
1. Personal information
2. Work experience 
3. References and documents"
```

#### Conditional Logic
```
"Add a field that shows additional questions only if 
the user selects 'Yes' to having previous experience"
```

#### Custom Validation
```
"Make the phone number field required and validate 
it follows US phone number format"
```

## 🔧 API Reference

### Forms API

#### Get All Forms
```http
GET /api/forms
```

#### Get Form by ID
```http
GET /api/forms/:id
```

#### Create Form
```http
POST /api/forms
Content-Type: application/json

{
  "title": "Contact Form",
  "subtitle": "Get in touch with us",
  "description": "We'd love to hear from you"
}
```

#### Generate Form from Prompt
```http
POST /api/forms/generate
Content-Type: application/json

{
  "prompt": "Create a contact form with name, email, and message",
  "selectedElements": [],
  "context": {}
}
```

#### Update Form
```http
PUT /api/forms/:id
Content-Type: application/json

{
  "title": "Updated Form Title"
}
```

#### Delete Form
```http
DELETE /api/forms/:id
```

### Templates API

#### Get Form Templates
```http
GET /api/forms/templates?category=contact
```

### Analytics API

#### Get Form Analytics
```http
GET /api/analytics/:formId?timeRange=30d
```

## 🎨 Customization

### Themes
The application supports custom themes with the following structure:

```typescript
interface FormTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: 'compact' | 'normal' | 'spacious';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
}
```

### Custom Elements
Add new form elements by extending the element types:

```typescript
// Add to src/types/index.ts
export type ElementType = 
  | 'text' | 'email' | 'textarea' 
  | 'select' | 'radio' | 'checkbox'
  | 'file' | 'signature' | 'date'
  | 'your-custom-element';
```

## 🔌 Integrations

### Supported Integrations
- **Webhooks** - Send data to any URL
- **Email** - Email notifications
- **Zapier** - Connect to 5000+ apps
- **Slack** - Post to Slack channels
- **Google Sheets** - Save to spreadsheets
- **CRM Systems** - Sync with your CRM

### Adding Custom Integrations
1. Create integration handler in `server/src/integrations/`
2. Add integration type to the database schema
3. Implement frontend configuration UI
4. Test the integration flow

## 📊 Analytics

### Available Metrics
- **Form Views** - Total form impressions
- **Submissions** - Completed form submissions
- **Completion Rate** - Percentage of viewers who submit
- **Average Time** - Time spent filling out forms
- **Drop-off Points** - Where users abandon forms
- **Device Statistics** - Mobile vs desktop usage

### Custom Analytics
Extend analytics by adding custom events:

```typescript
// Track custom events
analytics.track('form_field_focused', {
  formId: 'form-123',
  fieldName: 'email',
  timestamp: new Date()
});
```

## ♿ Accessibility

The application includes built-in accessibility features:

- **WCAG 2.1 Compliance** - Automated accessibility checking
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Support** - Proper ARIA labels and roles
- **Color Contrast** - Automated contrast ratio checking
- **Focus Management** - Logical tab order

### Accessibility Checker
Use the built-in accessibility checker to ensure your forms meet standards:

1. Go to the "A11y" tab
2. Review identified issues
3. Follow suggestions to fix problems
4. Re-run the checker to verify fixes

## 🚀 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Build backend
cd server
npm run build
```

### Environment Variables (Production)
```env
NODE_ENV=production
DB_HOST=your-production-db-host
OPENAI_API_KEY=your-production-api-key
JWT_SECRET=your-secure-jwt-secret
```

### Docker Deployment
```dockerfile
# Dockerfile included in repository
docker build -t form-creator .
docker run -p 3000:3000 form-creator
```

### Cloud Deployment
The application is ready for deployment on:
- **Vercel** (Frontend)
- **Railway** (Backend + Database)
- **AWS** (Full stack)
- **Google Cloud** (Full stack)
- **Azure** (Full stack)

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
npm test

# Backend tests
cd server
npm test

# E2E tests
npm run test:e2e
```

### Test Coverage
- Unit tests for all components
- Integration tests for API endpoints
- E2E tests for critical user flows
- Accessibility tests for WCAG compliance

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint + Prettier for code formatting
- Conventional commits for commit messages
- Jest for testing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Component Documentation](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### Community
- [GitHub Issues](https://github.com/yourusername/modern-form-creator/issues)
- [Discussions](https://github.com/yourusername/modern-form-creator/discussions)
- [Discord Community](https://discord.gg/form-creator)

### Commercial Support
For enterprise support and custom development, contact us at support@formcreator.com

## 🗺️ Roadmap

### Version 2.0 (Q2 2024)
- [ ] Advanced workflow automation
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app companion

### Version 2.1 (Q3 2024)
- [ ] AI-powered form optimization
- [ ] Advanced collaboration features
- [ ] Custom element marketplace
- [ ] Enterprise SSO integration

### Version 3.0 (Q4 2024)
- [ ] No-code workflow builder
- [ ] Advanced data visualization
- [ ] Machine learning insights
- [ ] White-label solutions

## 🙏 Acknowledgments

- OpenAI for GPT-4 integration
- Anthropic for Claude integration
- The React and Node.js communities
- All our contributors and users

---

**Built with ❤️ by the Form Creator Team**

For more information, visit our [website](https://formcreator.com) or follow us on [Twitter](https://twitter.com/formcreator).