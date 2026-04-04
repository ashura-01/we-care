require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5600;

app.listen(PORT, () => {
  console.log("app running on port:", PORT);
});
