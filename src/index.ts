import "dotenv/config";
import app from "./app";
const portFromEnv = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : Number.NaN;
const PORT = Number.isFinite(portFromEnv) ? portFromEnv : 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
