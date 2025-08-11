# GeneDetective Changelog

## [Latest] - 2025-08-11

### Added
- Patient list and analysis access for genetic counselors and researchers
- PatientList component with role-based data display
- PatientAnalysisView component for detailed genetic analysis results
- Role-specific dashboards for different user types

### Changed
- Updated Dashboard component to support multiple user roles
- Genetic counselors can view full patient information and add recommendations
- Researchers see anonymized data (Subject IDs instead of patient names)
- Improved privacy protection for research use cases

### Security
- Implemented data anonymization for researchers
- Patient names replaced with Subject IDs for research access
- Medical history anonymized for research purposes
- Clinical recommendations hidden from researchers to maintain privacy

## [Previous] - 2025-08-11

### Fixed
- User interface and database connectivity issues
- TypeScript interface mismatches (camelCase vs snake_case)
- Frontend compilation errors with visualizations
- Port configuration for university server deployment

### Added  
- Production environment configuration
- University server deployment scripts
- SQLite fallback for local development