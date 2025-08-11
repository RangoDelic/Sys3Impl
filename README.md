# GeneDetective - Genetic Analysis Information System

A comprehensive web-based information system for analyzing genetic data, identifying health risks, and discovering beneficial traits based on gene expression patterns and ancestry information.

## 🧬 Features Implemented

This prototype demonstrates 5 core functionalities as required:

1. **User Authentication & Role-Based Access** - Register/login system with different user roles (Patient, Genetic Counselor, Administrator, Researcher)
2. **Medical Data Input** - Patients can input and update their medical history
3. **Genetic Data Upload** - Upload ancestry information and simulate genetic data input
4. **Gene Expression Analysis** - Perform mock genetic analysis to identify risk variants and beneficial traits
5. **Interactive Reports & Visualization** - View analysis results with charts and visual representations

## 🏗️ Architecture

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: MySQL (designed for university server deployment)
- **Visualization**: Recharts library for data visualization
- **Authentication**: JWT-based authentication with bcrypt password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL database access
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone and Setup Backend

```bash
cd gene-detective/backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env file with your database credentials
```

### 2. Database Setup

1. Access your MySQL database (e.g., via phpMyAdmin at http://88.200.63.148/phpmyadmin)
2. Create a new database named `SISIII2024_[YOUR_ACCESSION_NUMBER]`
3. Import the schema from `database/schema.sql`

### 3. Configure Backend Environment

Edit `backend/.env`:
```
NODE_ENV=development
PORT=5000

DB_HOST=88.200.63.148
DB_USER=codeigniter
DB_PASSWORD=codeigniter2019
DB_NAME=SISIII2024_[YOUR_ACCESSION_NUMBER]

JWT_SECRET=your_secure_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
```

### 4. Setup Frontend

```bash
cd gene-detective/frontend
npm install
```

### 5. Start the Application

Start backend server:
```bash
cd backend
npm run dev
```

Start frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 👥 User Roles & Access

### Patient (Role 1)
- Register/login to the system
- Input and update medical history
- Upload genetic ancestry data
- Perform genetic analysis
- View personalized reports with risk assessments and beneficial traits
- Interactive visualizations of genetic data

### Genetic Counselor (Role 2)
- Access patient analysis results
- Provide professional interpretations
- Create recommendations for patients

### Administrator (Role 3)
- System administration features (placeholder in this demo)
- User management capabilities

### Researcher (Role 4)
- Access anonymized genetic data for research
- Statistical analysis tools (placeholder in this demo)

## 🧪 Demo Usage

1. **Register** as a Patient (Role 1)
2. **Login** with your credentials
3. **Update Medical History** - Add your medical background information
4. **Upload Genetic Data** - Use the ancestry sliders to simulate genetic data upload
5. **Perform Analysis** - Click "Perform Analysis" to run the genetic analysis algorithm
6. **View Results** - Explore your personalized genetic report with visualizations

## 🔬 Technical Implementation Details

### Mock Genetic Analysis
The system uses a sophisticated mock analysis algorithm that:
- Simulates real genetic variant detection
- Considers ancestry composition for risk calculation
- Identifies both harmful mutations and beneficial traits
- Generates realistic risk percentages and confidence levels

### Database Schema
Implements the complete relational model from the seminar report:
- Users with role-based access control
- Patient-specific medical data
- Genetic data storage with JSON fields
- Analysis results and recommendations
- Research data anonymization

### Security Features
- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control middleware
- SQL injection prevention with parameterized queries

## 📊 Visualizations

The system provides several types of data visualizations:
- Risk variant bar charts showing gene-specific risk percentages
- Beneficial traits pie charts categorized by trait type
- Gene coverage overview with status indicators
- Overall risk score progress bars
- Summary statistics cards

## 🚀 Deployment

For production deployment:

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Configure production environment variables
3. Deploy to university servers at http://88.200.63.148
4. Update database connection settings for production

## 🔧 Development Notes

### Mock Data
The system uses realistic mock genetic data for demonstration purposes:
- Simulated chromosome positions and variants
- Ancestry-based risk calculations
- Common genetic markers (BRCA1, BRCA2, APOE, CFTR, ACTN3, MCM6)

### Future Enhancements
- File upload for real genetic data (23andMe, AncestryDNA format)
- Integration with external genetic databases
- Advanced statistical analysis
- PDF report generation
- Real-time notifications
- Telehealth integration

## 📚 Technologies Used

- **Frontend**: React, TypeScript, Recharts, Axios
- **Backend**: Express.js, MySQL2, bcryptjs, jsonwebtoken
- **Database**: MySQL with relational schema design
- **Development**: Nodemon, CORS middleware

## 🏥 Medical Disclaimer

This is a prototype system for educational purposes. It should not be used for actual medical diagnosis or treatment decisions. Always consult with qualified healthcare professionals for genetic counseling and medical advice.