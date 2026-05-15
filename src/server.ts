import config from "./config";
import { initDB } from "./db";
import { app } from "./app";

const main = () => {
  initDB();
  app.listen(config.port, () => {
    console.log(`User app listening on port ${config.port}`);
  });
};

main();
