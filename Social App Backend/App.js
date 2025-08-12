const express = require("express");
const app = express();
const postRouter = require("./Routes/postsRoute");
const errorController = require("./controllers/errorController");

const PORT = 3001;

app.use(express.urlencoded({ extended: true }));
app.use("/posts", postRouter);
app.use(errorController.handleError);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
