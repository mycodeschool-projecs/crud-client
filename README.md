# CRUD Client Application

## Overview
The CRUD Client Application is a React-based frontend that provides a user interface for interacting with the CRUD microservices. It allows users to authenticate, manage client data, and view system notifications.

## Key Features
- User registration and login
- Client management:
  - Create new clients
  - View client details
  - Update client information
  - Delete clients
  - List all clients
- Notification center to view system events
- Responsive design for desktop and mobile devices

## Service Interactions
- **Auth API**: Handles user authentication and proxies client operations
- **Command API**: Manages client data (accessed through Auth API)
- **Notifications API**: Provides system notifications about client operations

## Technologies
- React
- TypeScript
- React Router for navigation
- Axios for API communication
- Bootstrap for UI components
- Docker for containerization

## Running the Application
### Prerequisites
- Node.js 14 or higher
- npm or yarn

### Local Development
1. Clone the repository
2. Navigate to the crud-client directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Configuration
Create a `.env` file in the root directory with the following variables:
```
REACT_APP_AUTH_API_URL=http://localhost:8081/api/v1
REACT_APP_NOTIFICATIONS_API_URL=http://localhost:8082/api/notifications
```

### Docker
The application can also be run using Docker:
```
docker build -t crud-client .
docker run -p 3000:80 crud-client
```

### Kubernetes
Kubernetes deployment configurations are available in the crud-app-k8s directory.

## Available Scripts
- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App configuration