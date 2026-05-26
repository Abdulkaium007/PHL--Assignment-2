

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env")
});
var config = {
  port: process.env.PORT,
  connectionString: process.env.connectionString,
  secret: process.env.secret,
  refreshSecret: process.env.refreshSecret
};

// src/app.ts
import express from "express";

// src/modules/users/userRoute.ts
import { Router } from "express";

// src/modules/users/userService.ts
import bcrypt from "bcrypt";

// src/db/index.ts
import { Pool } from "pg";
var pool = new Pool({
  connectionString: config.connectionString
});
var initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'contributor',
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);
    await pool.query(`
            CREATE TABLE IF NOT EXISTS issues (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                type VARCHAR(50) NOT NULL,
                status VARCHAR(50) NOT NULL DEFAULT 'open',
                reporter_id INTEGER NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

// src/modules/users/userService.ts
var createUserIntoDB = async (payload) => {
  const { name, email, role, password } = payload;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role) 
        VALUES ($1, $2, $3, COALESCE($4, 'contributor')) 
        RETURNING *`,
    [name, email, hashedPassword, role]
  );
  delete result.rows[0].password;
  return result;
};
var getAllUsersFromDB = async () => {
  const result = await pool.query(
    `SELECT * FROM users`
  );
  return result;
};
var getSingleUserFromDB = async (id) => {
  const result = await pool.query(
    `SELECT * FROM users 
        WHERE id = $1`,
    [id]
  );
  return result;
};
var updateUserInDB = async (id, payload) => {
  const { name, email, password } = payload;
  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }
  const result = await pool.query(
    `UPDATE users  
        SET name = COALESCE($1, name), 
            email = COALESCE($2, email), 
            password = COALESCE($3, password) 
            WHERE id = $4 RETURNING *`,
    [name, email, hashedPassword, id]
  );
  return result;
};
var deleteUserFromDB = async (id) => {
  const result = await pool.query(
    `DELETE FROM users 
        WHERE id = $1 RETURNING *`,
    [id]
  );
  return result;
};
var userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserInDB,
  deleteUserFromDB
};

// src/utility/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    error: data.error
  });
};
var sendResponse_default = sendResponse;

// src/modules/users/userController.ts
var createUser = async (req, res) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create user.";
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: errorMessage,
      data: error
    });
  }
};
var getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsersFromDB();
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Users retrieved successfully!",
      data: result.rows
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to retrieve users.";
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: errorMessage,
      data: error
    });
  }
};
var getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUserFromDB(id);
    if (result.rows.length === 0) {
      sendResponse_default(res, {
        statusCode: 404,
        success: false,
        message: "User not found.",
        data: {}
      });
      return;
    }
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "User retrieved successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to retrieve user.";
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: errorMessage,
      data: error
    });
  }
};
var updateUser = async (req, res) => {
  const { id } = req.params;
  const loggedInUser = req.user;
  try {
    if (loggedInUser?.role === "contributor") {
      if (loggedInUser.id !== Number(id)) {
        return sendResponse_default(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden!!! You can only update your id"
        });
      }
    }
    const result = await userService.updateUserInDB(id, req.body);
    if (result.rows.length === 0) {
      sendResponse_default(res, {
        statusCode: 404,
        success: false,
        message: "User not found.",
        data: {}
      });
      return;
    }
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "User updated successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update user.";
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: errorMessage,
      data: error
    });
  }
};
var deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUserFromDB(id);
    if (result.rows.length === 0) {
      return sendResponse_default(res, {
        statusCode: 404,
        success: false,
        message: "User not found.",
        data: {}
      });
    }
    sendResponse_default(res, {
      statusCode: 204,
      success: true,
      message: "User deleted successfully!",
      data: {}
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete user.";
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: errorMessage,
      data: error
    });
  }
};
var userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
};

// src/middlewares/auth.ts
import jwt from "jsonwebtoken";
var auth = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return sendResponse_default(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized access!"
        });
      }
      const decoded = jwt.verify(token, config.secret);
      const userData = await pool.query(
        `SELECT * FROM users WHERE email=$1`,
        [decoded.email]
      );
      if (userData.rows.length === 0) {
        return sendResponse_default(res, {
          statusCode: 404,
          success: false,
          message: "User not found!"
        });
      }
      const user = userData.rows[0];
      if (roles.length && !roles.includes(user.role)) {
        return sendResponse_default(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden!!! This user have no access!"
        });
      }
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth;

// src/types/userTypes.ts
var USER_ROLE = {
  maintainer: "maintainer",
  contributor: "contributor"
};

// src/modules/users/userRoute.ts
var router = Router();
router.post("/", userController.createUser);
router.get("/", auth_default(USER_ROLE.maintainer), userController.getAllUsers);
router.get("/:id", userController.getSingleUser);
router.put("/:id", auth_default(), userController.updateUser);
router.delete("/:id", auth_default(USER_ROLE.maintainer), userController.deleteUser);
var userRoute = router;

// src/modules/issues/issuesRoute.ts
import { Router as Router2 } from "express";

// src/modules/issues/issuesService.ts
var SORT_MAP = {
  newest: "DESC",
  oldest: "ASC"
};
var createIssueIntoDB = async (payload) => {
  const { title, description, type, status, reporter_id } = payload;
  const result = await pool.query(
    `INSERT INTO issues (title, description, type, status, reporter_id) 
        VALUES ($1, $2, $3, COALESCE($4, 'open'), $5) 
        RETURNING *`,
    [title, description, type, status, reporter_id]
  );
  return result;
};
var getAllIssuesFromDB = async (sort = "newest") => {
  const order = SORT_MAP[sort] ?? "DESC";
  const result = await pool.query(
    `SELECT * FROM issues ORDER BY created_at ${order}`
  );
  return result;
};
var getSingleIssueFromDB = async (id) => {
  const result = await pool.query(
    `SELECT * FROM issues
        WHERE id = $1`,
    [id]
  );
  return result;
};
var updateIssueInDB = async (id, payload) => {
  const { title, description, type, status } = payload;
  const result = await pool.query(
    `UPDATE issues 
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            type = COALESCE($3, type),
            status = COALESCE($4, status)
        WHERE id = $5 
        RETURNING *`,
    [title, description, type, status, id]
  );
  return result;
};
var deleteIssueFromDB = async (id) => {
  const result = await pool.query(
    `DELETE FROM issues
        WHERE id = $1
        RETURNING *`,
    [id]
  );
  return result;
};
var issuesService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueInDB,
  deleteIssueFromDB
};

// src/modules/issues/issuesController.ts
import "pg";
var createIssue = async (req, res) => {
  try {
    const result = await issuesService.createIssueIntoDB(req.body);
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create issue.";
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: errorMessage,
      data: error
    });
  }
};
var getAllIssues = async (req, res) => {
  try {
    const sort = req.query.sort;
    const result = await issuesService.getAllIssuesFromDB(sort);
    const allIssues = result.rows;
    const reporterInfo = await pool.query(
      `SELECT id, name, role FROM users`
    );
    const reporterMap = /* @__PURE__ */ new Map();
    reporterInfo.rows.map((reporter) => {
      reporterMap.set(reporter.id, reporter);
    });
    const formattedIssues = allIssues.map((issue) => {
      return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: reporterMap.get(issue.reporter_id),
        created_at: issue.created_at,
        updated_at: issue.updated_at
      };
    });
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrieved successfully!",
      data: formattedIssues
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to retrieve issues.";
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: errorMessage,
      data: error
    });
  }
};
var getSingleIssue = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await issuesService.getSingleIssueFromDB(id);
    if (result.rows.length === 0) {
      sendResponse_default(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found!",
        data: {}
      });
    }
    const reporterInfo = await pool.query(
      `SELECT id, name, role FROM users WHERE id = $1`,
      [result.rows[0].reporter_id]
    );
    const formatedIssue = {
      id: result.rows[0].id,
      title: result.rows[0].title,
      description: result.rows[0].description,
      type: result.rows[0].type,
      status: result.rows[0].status,
      reporter: reporterInfo.rows[0],
      created_at: result.rows[0].created_at,
      updated_at: result.rows[0].updated_at
    };
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrieved successfully!",
      data: formatedIssue
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to retrieve issue.";
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: errorMessage,
      data: error
    });
  }
};
var updateIssue = async (req, res) => {
  const { id } = req.params;
  const loggedInUser = req.user;
  try {
    const existingIssue = await issuesService.getSingleIssueFromDB(id);
    if (existingIssue.rows.length === 0) {
      sendResponse_default(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found!",
        data: {}
      });
    }
    if (loggedInUser?.role === "contributor") {
      if (existingIssue.rows[0].reporter_id !== loggedInUser.id) {
        return sendResponse_default(res, {
          statusCode: 403,
          success: false,
          message: "You can only update your own issue"
        });
      }
      if (existingIssue.rows[0].status !== "open") {
        return sendResponse_default(res, {
          statusCode: 409,
          success: false,
          message: "Issue already in progress or closed"
        });
      }
      if (req.body.status) {
        return sendResponse_default(res, {
          statusCode: 403,
          success: false,
          message: "Contributors cannot change issue status"
        });
      }
    }
    const result = await issuesService.updateIssueInDB(id, req.body);
    sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Faiiled to update issue!";
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: errorMessage,
      data: error
    });
  }
};
var deleteIssue = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await issuesService.deleteIssueFromDB(id);
    if (result.rows.length === 0) {
      sendResponse_default(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found!",
        data: {}
      });
    }
    sendResponse_default(res, {
      statusCode: 204,
      success: true,
      message: "Issue deleted successfully!",
      data: {}
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Faiiled to delete issue!";
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: errorMessage,
      data: error
    });
  }
};
var issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue
};

// src/modules/issues/issuesRoute.ts
var router2 = Router2();
router2.post("/", auth_default(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.createIssue);
router2.get("/", auth_default(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.getAllIssues);
router2.get("/:id", auth_default(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.getSingleIssue);
router2.put("/:id", auth_default(USER_ROLE.contributor, USER_ROLE.maintainer), issuesController.updateIssue);
router2.delete("/:id", auth_default(USER_ROLE.maintainer), issuesController.deleteIssue);
var issuesRoute = router2;

// src/app.ts
import cookieParser from "cookie-parser";

// src/modules/auth/authRoute.ts
import { Router as Router3 } from "express";

// src/modules/auth/authService.ts
import bcrypt2 from "bcrypt";
import jwt2 from "jsonwebtoken";
var regusterUserIntoDB = async (payload) => {
  const { name, email, role, password } = payload;
  const hashedPassword = await bcrypt2.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role) 
            VALUES ($1, $2, $3, COALESCE($4, 'contributor')) 
            RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, role]
  );
  return result;
};
var loginUserIntoDB = async (payload) => {
  const { email, password } = payload;
  const userData = await pool.query(
    `SELECT * FROM users 
         WHERE email = $1`,
    [email]
  );
  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials!");
  }
  const user = userData.rows[0];
  const matchPassword = await bcrypt2.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwt2.sign(jwtPayload, config.secret, {
    expiresIn: "1d"
  });
  const refreshToken = jwt2.sign(jwtPayload, config.refreshSecret, {
    expiresIn: "10d"
  });
  return { accessToken, refreshToken };
};
var getRefreshToken = async (token) => {
  if (!token) {
    throw new Error("Unauthorized!");
  }
  const decoded = jwt2.verify(
    token,
    config.refreshSecret
  );
  const userData = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [decoded.email]
  );
  if (userData.rows.length === 0) {
    throw new Error("User not found!");
  }
  ;
  const user = userData.rows[0];
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwt2.sign(jwtPayload, config.secret, {
    expiresIn: "1d"
  });
  return { accessToken };
};
var authService = {
  loginUserIntoDB,
  getRefreshToken,
  regusterUserIntoDB
};

// src/modules/auth/authController.ts
var registerUser = async (req, res) => {
  try {
    const result = await authService.regusterUserIntoDB(req.body);
    return sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to register!";
    return sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: errorMessage,
      error
    });
  }
  ;
};
var loginUser = async (req, res) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    const { refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
      secure: false,
      httpOnly: true,
      sameSite: "lax"
    });
    return sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "User login successfully!",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to login!";
    return sendResponse_default(res, {
      statusCode: 401,
      success: false,
      message: errorMessage,
      error
    });
  }
  ;
};
var refreshAccessToken = async (req, res) => {
  try {
    const result = await authService.getRefreshToken(req.cookies.refreshToken);
    return sendResponse_default(res, {
      statusCode: 200,
      success: true,
      message: "Access token generated!",
      data: result
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to generate access token!";
    return sendResponse_default(res, {
      statusCode: 401,
      success: false,
      message: errorMessage,
      error
    });
  }
};
var authController = {
  loginUser,
  refreshAccessToken,
  registerUser
};

// src/modules/auth/authRoute.ts
var router3 = Router3();
router3.post("/login", authController.loginUser);
router3.post("/refresh-token", authController.refreshAccessToken);
router3.post("/register", authController.registerUser);
var authRoute = router3;

// src/middlewares/logger.ts
import fs from "fs";
var logger = (req, res, next) => {
  const log = `
Method : ${req.method} -> Time : ${Date.now()} -> URL : ${req.url}
`;
  fs.appendFile("logger.txt", log, (err) => {
  });
  next();
};
var logger_default = logger;

// src/app.ts
import cors from "cors";

// src/middlewares/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  return sendResponse_default(res, {
    statusCode: 500,
    success: false,
    message: err.message || "Internal server error!"
  });
};
var globalErrorHandler_default = globalErrorHandler;

// src/app.ts
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(cookieParser());
app.use(logger_default);
app.use(cors({
  origin: "http://localhost:5000"
}));
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the API!"
  });
});
app.use("/api/users", userRoute);
app.use("/api/issues", issuesRoute);
app.use("/api/auth", authRoute);
app.use(globalErrorHandler_default);
var app_default = app;

// src/server.ts
var main = () => {
  initDB();
  app_default.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};
main();
//# sourceMappingURL=server.js.map