require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");

const authRoutes = require("./modules/user/auth.routes");
const userRoutes = require("./modules/user/user.routes");
const academicStructureRoutes = require("./modules/academicStructure/academicStructure.routes");
const studentManagementRoutes = require("./modules/studentManagement/studentManagement.routes");
const teacherAssignmentRoutes = require("./modules/teacherAssignmentManagement/teacherAssignmentManagement.routes");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// Test Route
app.get("/", (req, res) => {
  res.send("School Management System Backend Running");
});

// Mount Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/", academicStructureRoutes);
app.use("/", studentManagementRoutes);
app.use("/", teacherAssignmentRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
