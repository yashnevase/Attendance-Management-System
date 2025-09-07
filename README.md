# Smart Leave & Attendance Management System - Frontend

This project is the React frontend for the Smart Leave & Attendance Management System, designed to integrate with a Node.js backend.

## Getting Started

Follow these instructions to set up and run the frontend application.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (comes with Node.js)

### Installation

1.  **Navigate to the frontend directory:**

    ```bash
    cd client/attendance-management-system
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

### Running the Application

1.  **Start the React development server:**

    ```bash
    npm start
    ```

    This will open the application in your browser at `http://localhost:3000` (or another available port).

### Backend Integration

This frontend is designed to work with a Node.js backend. Ensure your backend server is running and accessible at `http://localhost:5000`.

**Backend Endpoints Used:**

*   `POST /api/auth/login`: User login
*   `POST /api/users/create`: Admin creates new managers/employees
*   `GET /api/leave/all`: Admin views all leave requests
*   `PUT /api/leave/status/:id`: Manager approves/rejects leave requests
*   `PUT /api/leave/override/:id`: Admin overrides leave decisions
*   `GET /api/leave/team`: Manager views team leave requests
*   `POST /api/leave/submit`: Employee submits leave requests
*   `GET /api/leave/history`: Employee views their leave history and balance
*   `GET /api/leave/types`: Get all available leave types
*   `POST /api/attendance/check-in`: Employee marks daily check-in
*   `POST /api/attendance/check-out`: Employee marks daily check-out
*   `GET /api/attendance/daily`: Employee views daily attendance

### Available Scripts

In the project directory, you can run:

*   `npm start`: Runs the app in development mode.
*   `npm build`: Builds the app for production.
*   `npm test`: Launches the test runner.

Feel free to explore and modify the components to enhance the UI/UX as needed.
