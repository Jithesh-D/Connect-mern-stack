// const express = require("express");
// const fetchService = require("../services/fetchService");
// const router = express.Router();

// // Route to fetch raw website data
// router.get("/fetch-data", async (req, res) => {
//   try {
//     const { site } = req.query;

//     if (!site) {
//       return res.status(400).json({
//         success: false,
//         error: "Site parameter is required. Use ?site=1 or ?site=2",
//       });
//     }

//     const result = await fetchService.fetchData(site);
//     res.set("Content-Type", "text/html");
//     res.status(200).send(result.data);
//   } catch (error) {
//     console.error("Route error:", error);

//     res.status(error.status || 500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// });

// module.exports = router;
