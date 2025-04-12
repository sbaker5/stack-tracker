💪 Technical Infrastructure and Modular Architecture
🚀 Core Technology Stack
Layer	Tools/Frameworks	Purpose
Frontend	React, Tailwind CSS	SPA architecture and UI components
Backend	Flask / FastAPI	API handling, session management
Database	MongoDB Atlas	Document-based storage and flexible schema support
Auth	Flask-JWT / Flask-Login	Authentication and access control
Hosting	Netlify, Render, VPS	CI/CD deployment and hosting
📁 Project Structure
Frontend – React Structure
/client-stack-tracker-frontend
├── public/
├── src/
│   ├── components/       # Modular components
│   ├── pages/            # Page-level views
│   ├── context/          # Application state
│   ├── hooks/            # Reusable logic
│   ├── utils/            # Utility scripts
│   └── App.jsx           # App container
├── tailwind.config.js
└── package.json
Backend – Flask Structure
/client-stack-tracker-backend
├── app/
│   ├── routes/           # API endpoints
│   ├── models/           # Database schema
│   ├── services/         # Business logic
│   ├── utils/            # Logging, export, helpers
│   └── app.py            # Main application
├── requirements.txt
└── wsgi.py
🔒 Authentication and Role Logic
•	Session control using JWT tokens
•	UI and API protection by role
•	Admin-only controls for user access provisioning
🧠 API Routes
POST /auth/login
GET  /auth/me
GET  /clients
POST /clients
GET  /clients/<id>
PUT  /clients/<id>
DELETE /clients/<id>
GET  /export/pdf/<id>
GET  /export/csv/<id>
GET  /backup
📊 Database Design
•	Core collections: clients, users, optionally logs
•	Embedded tier array per client
•	Indexed fields for rapid querying
💡 Key React Components
Component	Description
TreeView	Recursive display of stack architecture
ClientPage	Client detail and editing interface
SearchBar	Search tool with autocomplete
TagFlagManager	Manage tags and flags
ExportMenu	Export options menu
DarkModeToggle	Session-aware dark mode
AuthForm	Secure login and token handling
🔧 Libraries and Enhancements
•	PDF Export: pdfkit, wkhtmltopdf, or reportlab
•	CSV Export: pandas, csv module
•	Tree UI: react-treebeard, react-sortable-tree
•	Search: fuse.js for fuzzy search
🔁 DevOps Workflow
•	GitHub Actions for continuous deployment
•	.env + GitHub Secrets for environment configuration
•	Deployment on main branch merge
🧪 Testing and QA
•	Frontend: Jest, React Testing Library
•	Backend: PyTest
•	Mobile QA: Physical iPhone + emulators
•	Data Validation: Backup/export testing for fidelity

