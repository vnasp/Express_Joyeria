import express from "express"
import cors from "cors"
import { logger } from "logger-express"
import router from "./routes/joyasRoutes.js"

const PORT = process.env.PORT || 3000

const app = express();

app.use(express.json())
app.use(cors())
app.use(logger())
app.use(router)

app.get("*", (req, res) => {
  res.status(404).send("Esta ruta no existe")
})

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto: ${PORT}`);
});