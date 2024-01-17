import pool from "../db/connectionDB.js"
import format from "pg-format"

const getJoyas = async (order_by = "stock_ASC", limits = 10, page = 1) => {
  const [attribute, direction] = order_by.split("_")
  const offset = (page - 1) * limits
  const formattedQuery = format(
    "SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s;",
    attribute,
    direction,
    limits,
    offset
  )
  try {
    const response = await pool.query(formattedQuery)
    return response.rows
  } catch (error) {
    const { code } = error
    if (code == "23502") {
      res.status(400)
        .send("Se ha violado la restricción NOT NULL en uno de los campos de la tabla")
    } else if (code == "22P02") {
      res.status(400)
        .send("Bad Request: el servidor no puede procesar la solicitud debido a un error del cliente")
    } else {
      res.status(500).send(error)
    }
  }
}

const getFilter = async (precio_max, precio_min, categoria, metal) => {
  let filters = []
  const values = []

  const addFilter = (column, operators, value) => {
    values.push(value)
    const { length } = filters
    filters.push(`${column} ${operators} $${length + 1}`)
  }

  if (precio_max) addFilter('precio', '<=', `${precio_max}`)
  if (precio_min) addFilter('precio', '>=', `${precio_min}`)
  if (categoria) addFilter('categoria', '=', `${categoria}`)
  if (metal) addFilter('metal','=', `${metal}`)

  let SQLquery = "SELECT * FROM inventario"

  if (filters.length > 0) {
    filters = filters.join(" AND ")
    SQLquery += ` WHERE ${filters};`
  }
  try {
    const response = await pool.query(SQLquery, values)
    return response.rows
  } catch (error) {
    const { code } = error
    if (code == "23502") {
      res.status(400)
        .send("Se ha violado la restricción NOT NULL en uno de los campos de la tabla")
    } else if (code == "22P02") {
      res.status(400)
        .send("Bad Request: el servidor no puede procesar la solicitud debido a un error del cliente")
    } else {
      res.status(500).send(error)
    }
  }
}


export { getJoyas, getFilter }