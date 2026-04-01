const {
  getAdminOverview,
  getAdminSectionDrilldown,
  getTeacherDashboard,
  getStudentDashboard,
} = require("../services/analytics.service");

/*
  ==============================
  Controller — Admin Overview
  ==============================
*/

const getAdminOverviewController = async (req, res) => {
  try {
    const { yearId, date } = req.query;

    const result = await getAdminOverview({
      yearId,
      date,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Admin Overview Error:", error);

    return res.status(500).json({
      message: "Failed to fetch admin analytics",
      error: error.message,
    });
  }
};

/*
  ==============================
  Controller — Admin Section Drilldown
  ==============================
*/


const getAdminSectionDrilldownController = async (req, res) => {
  try {
    const { sectionId, yearId, examInstanceId } = req.query;

    if (!sectionId) {
      return res.status(400).json({
        message: "sectionId is required",
      });
    }

    const result = await getAdminSectionDrilldown({
      sectionId,
      yearId,
      examInstanceId,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Section Drilldown Error:", error);

    return res.status(500).json({
      message: "Failed to fetch section analytics",
      error: error.message,
    });
  }
};

/*
  ==============================
  Controller — Teacher Dashboard
  ==============================
*/

const getTeacherDashboardController = async (req, res) => {
  try {
    const { userId, yearId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    const result = await getTeacherDashboard({
      userId,
      yearId,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Teacher Dashboard Error:", error);

    return res.status(500).json({
      message: "Failed to fetch teacher analytics",
      error: error.message,
    });
  }
};

/*
  ==============================
  Controller — Student Dashboard
  ==============================
*/

const getStudentDashboardController = async (req, res) => {
  try {
    const { userId, yearId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    const result = await getStudentDashboard({
      userId,
      yearId,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Student Dashboard Error:", error);

    return res.status(500).json({
      message: "Failed to fetch student analytics",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminOverviewController,
  getAdminSectionDrilldownController,
  getTeacherDashboardController,
  getStudentDashboardController,
};
