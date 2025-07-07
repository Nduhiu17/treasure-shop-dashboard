# Treasure Shop Admin Dashboard

A modern, responsive React admin dashboard for managing the Treasure Shop platform. Built with React, shadcn/ui, Tailwind CSS, and JWT-authenticated backend API integration.

## Features

- **User Authentication**: Secure login with JWT, protected routes, and logout functionality.
- **Role-Based Access**: Admin, Super Admin, Writer, and User roles with tailored dashboard views and actions.
- **Order Management**: View, filter, paginate, and assign orders. Custom modal for assigning writers. The "My Orders" page is now accessible at `/admin/dashboard`.
- **User Management**: List, filter, and paginate users by role.
- **Order Types Management**: Manage order types with pagination.
- **User Profile Page**: Beautiful, role-aware profile page showing user details and relevant orders, with world-class design and logout.
- **Loader Overlay**: Full-screen loader for all HTTP requests.
- **Responsive UI**: Fully responsive, modern design using Tailwind CSS and shadcn/ui components.
- **API Integration**: All data is fetched from the backend API (see `openapi.yaml`).

## Tech Stack

- [React 18](https://react.dev/)
- [React Router v7](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [@tanstack/react-query](https://tanstack.com/query/latest)

## Project Structure

```
src/
  components/ui/      # Reusable UI components (button, card, table, loader, etc.)
  features/
    auth/             # Auth context, login page, provider
    orders/           # Orders management, assign writer modal
    orderTypes/       # Order types management
    users/            # User management, user profile page
  App.js              # Main app and routing ("My Orders" is now at /admin/dashboard)
  index.js            # Entry point
  index.css           # Tailwind base styles
openapi.yaml          # Backend API spec
```

## Setup & Development

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Start the development server:**
   ```sh
   npm start
   ```

3. **Backend API:**
   - The dashboard expects a backend running at `http://localhost:8080` with endpoints as defined in `openapi.yaml`.
   - Ensure CORS is enabled on the backend for local development.

## Authentication & Roles
- JWT token is stored in `localStorage` after login.
- User details and roles are also stored in `localStorage`.
- All API requests include the JWT as a Bearer token.
- Unauthenticated users are redirected to `/login`.

## Custom Modal for Assigning Writers
- Orders with status `paid`, `feedback`, or `awaiting_assignment` can be assigned to a writer.
- The modal fetches writers from the backend and allows assignment with a single click.

## User Profile Page
- Shows a hero card with user info, role badge, and logout button.
- Orders table is filtered by role:
  - **Admin/Super Admin**: All orders
  - **Writer**: Orders assigned to them
  - **User**: Orders created by them
- Pagination and modern UI/UX.

## Styling & UI
- All UI is built with Tailwind CSS and shadcn/ui for a modern, accessible, and responsive experience.
- Loader overlay is shown during all HTTP requests.

## API Reference
- See [`openapi.yaml`](openapi.yaml) for all backend endpoints and request/response formats.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

**Private** — This codebase is proprietary. You must consult the project owner for permission before using, copying, or distributing any part of this project.


