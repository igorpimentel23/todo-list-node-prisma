# Todo List Backend API

Backend API for Todo List application built with Express.js, Prisma and MySQL, following Clean Architecture principles.

## 🚀 Technologies

- **Node.js** with TypeScript
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **MySQL** - Database
- **Zod** - Data validation
- **CORS** - Cross-Origin Resource Sharing

## 🏗️ Architecture

The project follows **Clean Architecture** principles with clear separation of responsibilities:

### 📋 Application Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    HTTP Layer (Controllers)                 │
│  - Receives HTTP requests                                   │
│  - Validates input data                                     │
│  - Calls use cases                                          │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Use Cases (Business Logic)                │
│  - Contains business rules                                  │
│  - Orchestrates operations                                  │
│  - Framework independent                                    │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                  Repository Layer (Data)                    │
│  - Interface for data access                                │
│  - Prisma implementation                                    │
│  - Database abstraction                                     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Database (MySQL)                         │
│  - Data persistence                                         │
│  - Managed by Prisma                                        │
└─────────────────────────────────────────────────────────────┘
```

### 🎯 Architecture Benefits

- **Separation of Concerns**: Each layer has a specific function
- **Testability**: Easy to test each layer in isolation
- **Maintainability**: Changes in one layer don't affect others
- **Flexibility**: Can swap implementations without affecting business rules

## 🐳 Starting the Project with Docker

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)

### Step by Step

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd todo-list-backend
```

#### 2. Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env
```

#### 3. Start Database with Docker
```bash
# Start MySQL in container
docker compose up -d

# Wait a few seconds for database to initialize
sleep 10
```

#### 4. Configure Database Permissions (First time)
```bash
# Grant necessary permissions to docker user
docker exec -it todo-list-node-prisma-api-todo-mysql-1 mysql -u root -pdocker -e "GRANT ALL PRIVILEGES ON *.* TO 'docker'@'%' WITH GRANT OPTION; FLUSH PRIVILEGES;"
```

#### 5. Run Prisma Migrations
```bash
# Generate and apply migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

#### 6. Install Dependencies
```bash
yarn install
```

#### 7. Start the Application
```bash
# Development mode
yarn dev

# Or production mode
yarn build
yarn start
```

#### 8. Verify it's Working
```bash
# Test the API
curl http://localhost:3333/tasks
```

#### 9. (Optional) Start Prisma Studio
```bash
# Open database GUI in browser
npx prisma studio
```
This will open Prisma Studio at `http://localhost:5555` where you can view and edit your database directly.

### 🛠️ Useful Docker Commands

```bash
# Stop services
docker compose down

# Stop and remove volumes (complete reset)
docker compose down -v

# View database logs
docker compose logs api-todo-mysql

# Access MySQL directly
docker exec -it todo-list-node-prisma-api-todo-mysql-1 mysql -u docker -pdocker api-todo

# Open Prisma Studio (database GUI)
npx prisma studio

## 📁 Code Structure

```
src/
├── http/                    # HTTP presentation layer
│   ├── controllers/         # Route controllers
│   │   └── taskController.ts
│   └── routes/             # Route definitions
│       └── taskRoutes.ts
├── useCases/               # Use cases (business logic)
│   ├── createTask.ts       # Create task
│   ├── findAll.ts          # List tasks
│   ├── updateTask.ts       # Update task
│   └── deleteTask.ts       # Delete task
├── repositories/           # Data access layer
│   ├── tasksRepository.ts  # Repository interface
│   └── prisma/            # Prisma implementation
│       └── tasksRepository.ts
├── lib/                   # Libraries and configurations
│   └── prisma.ts          # Prisma client
├── env/                   # Environment configuration
│   └── index.ts
├── app.ts                 # Express configuration
└── server.ts              # Entry point
```

### 🔧 Layer Details

#### HTTP Layer (Controllers & Routes)
- **Responsibility**: Receive HTTP requests and return responses
- **Validation**: Uses Zod to validate input data
- **Error Handling**: Global middleware for errors

#### Use Cases Layer
- **Responsibility**: Contains business rules
- **Independence**: Doesn't depend on external frameworks
- **Testability**: Easy to test in isolation

#### Repository Layer
- **Interface**: Defines contract for data access
- **Implementation**: Prisma for database operations
- **Abstraction**: Allows easy implementation swapping

## 📚 API Endpoints

### GET /tasks
List all tasks ordered by creation date (newest first).

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Example task",
    "color": "red",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /tasks
Create a new task.

**Body:**
```json
{
  "title": "New task",
  "color": "blue"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "New task",
  "color": "blue",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /tasks/:id
Update an existing task.

**Body:**
```json
{
  "title": "Updated task",
  "color": "green",
  "completed": true
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Updated task",
  "color": "green",
  "completed": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### DELETE /tasks/:id
Remove a task.

**Response:** 204 No Content

## 🗄️ Database Structure

### Table: tasks

| Field     | Type      | Description                    |
|-----------|-----------|--------------------------------|
| id        | String    | Unique task ID (UUID)          |
| title     | String    | Task title                     |
| color     | String    | Task color                     |
| completed | Boolean   | Completion status              |
| createdAt | DateTime  | Creation date                  |
| updatedAt | DateTime  | Last update date               |

## 🚀 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run linter

## 📝 Validations

- **Title**: Required field, non-empty string
- **Color**: Required field, non-empty string
- **Completed**: Optional field, boolean

## 📄 License

This project is licensed under the ISC License.
