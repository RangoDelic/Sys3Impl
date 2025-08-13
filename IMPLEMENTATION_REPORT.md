---
output:
  pdf_document: default
  html_document: default
---
# Gene Detective - Implementation Report



 Goran Delić


## Project URLs

**Git Repository:** https://github.com/RangoDelic/Sys3Impl.git  
**Demo Video:** https://www.youtube.com/watch?v=fw48fKJkcFo  
**Live Application:** http://88.200.63.148:3122

---

## System Overview

Gene Detective is a comprehensive genetic analysis information system designed for personalized medicine. The application facilitates genetic data analysis, medical history management, and clinical decision support for patients, genetic counselors, and researchers. Built with React frontend and Node.js/Express backend, the system implements role-based access control and provides distinct analysis results for different patient profiles.

---

## Functionality 1: User Authentication & Role-Based Access Control(Register/Login)

### Description
A comprehensive authentication system supporting four distinct user roles: Patient (Role 1), Genetic Counselor (Role 2), Administrator (Role 3), and Researcher (Role 4). Each role has customized dashboard interfaces and access permissions. The system uses JWT tokens for secure session management and bcrypt for password hashing.

### Most Difficult Implementation Aspect
The most challenging part was implementing **role-based middleware that dynamically serves different content** based on user roles while maintaining security. Creating separate data access patterns for each role required careful consideration of data privacy (especially for researchers accessing anonymized data) and ensuring genetic counselors could only access appropriate patient data. The middleware had to validate not just authentication but also authorization for specific resources.

### Usage Instructions
1. Navigate to http://88.200.63.148:3122
2. Click "Need an account? Register" for new users
3. Fill in registration form selecting appropriate user role
4. For existing users, enter email and password to login
5. Dashboard content automatically adapts based on user role

---

## Functionality 2: Medical History Management

### Description
A comprehensive medical data input system allowing patients to record and update their medical history. The system captures family history, previous conditions, medications, and other relevant medical information. Data is stored securely and linked to the patient's genetic analysis workflow to provide contextual risk assessments.

### Most Difficult Implementation Aspect
The most challenging aspect was **designing a flexible medical history schema** that could accommodate diverse medical information while maintaining data integrity. Creating a balance between structured data fields (for analysis algorithms) and free-text areas (for detailed patient narratives) required careful database design. Additionally, ensuring medical data validation and implementing proper data privacy measures for sensitive health information added complexity.

### Usage Instructions
1. Login as a Patient (Role 1)
2. Locate "Medical History" section in the left panel
3. Fill in medical background information
4. Click "Update Medical History" to save changes
5. Data is automatically linked to genetic analysis workflow

---

## Functionality 3: Genetic Data Specification

### Description
A system for ancestral/genetic origin specification and submission.

---

## Functionality 4: Gene Expression Analysis generation

### Description
An advanced genetic analysis engine that processes uploaded genetic data to identify risk variants, beneficial traits, and overall genetic risk scores. The system analyzes multiple genes (BRCA1, BRCA2, APOE, CFTR, ACTN3, MCM6, TP53, PALB2, LDLR, PCSK9, CYP2D6, VKORC1, HLA-B, G6PD) and provides patient-specific results with confidence levels and risk percentages.

### Most Difficult Implementation Aspect
The most challenging aspect was **creating distinct, scientifically accurate patient profiles** that generate different analysis results for demonstration purposes. Each patient needed realistic genetic variants, risk assessments, and beneficial traits that align with their ancestry and medical history. Implementing the analysis algorithm that considers multiple factors (ancestry composition, medical history, genetic variants) and produces comprehensive reports with proper confidence intervals required extensive research into genetic risk calculation methodologies.

### Usage Instructions
1. Complete medical history and genetic data upload first
2. Navigate to "Gene Expression Analysis" section
3. Click "Perform Analysis" button
4. Wait for analysis completion (typically 2-3 seconds)
5. Review detailed results including risk variants, beneficial traits, and overall score
6. Explore interactive visualizations and detailed gene information

---

## Functionality 5: Multi-User Analysis through role-based dashboards

### Description
A comprehensive multi-user interface enabling genetic counselors and researchers to access patient analysis results. Genetic counselors can view identified patients, access their genetic analysis results, and provide clinical recommendations. Researchers access anonymized patient data for research purposes with de-identified subject numbers.

### Most Difficult Implementation Aspect
The most complex implementation challenge was **managing data privacy and access control** across different user types. Ensuring genetic counselors could access appropriate patient data while researchers only saw anonymized information required sophisticated database queries and middleware logic. Creating distinct patient profiles with different genetic results for each subject (Patient 1: high-risk BRCA2/TP53, Patient 2: APOE/cardiovascular, Patient 3: low-risk pharmacogenetic, Patient 4: BRCA1/immune variants) and ensuring these were consistently displayed across different user interfaces added significant complexity.



## Technical Implementation Details

### Architecture
- **Frontend:** React 19.1.1 with TypeScript, responsive CSS-in-JS styling
- **Backend:** Node.js with Express 5.1.0, JWT authentication, bcrypt password hashing  
- **Database:** MySQL on university server (SISIII2024_89201217)
- **Deployment:** University server at http://88.200.63.148