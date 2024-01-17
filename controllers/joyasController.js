import { getJoyas, getFilter } from '../models/joyasModel.js'

const prepararHATEOAS = (joyas) => {
  const results = joyas.map((j) => { return {
              name: j.nombre,
              href: `/joyas/joya/${j.id}`,
          }
  }).slice(0, 4)
  const totalJoyas = joyas.length
  const stockTotal = joyas.reduce((acumulador,joya) => { 
    const stockJoya = joya.stock;
    return acumulador + stockJoya;
    }, 0);
  const HATEOAS = {
  totalJoyas,
  stockTotal,
  results }
  return HATEOAS }

const getAllJoyas = async (req, res) => {
  try {
    const { order_by, limits, page } = req.query
    const joyas = await getJoyas(order_by, limits, page)
    const HATEOAS = await prepararHATEOAS(joyas)
    res.status(200).json(HATEOAS)
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

const getFilterJoyas = async (req, res) => {
  try {
    const { precio_max,precio_min,categoria,metal } = req.query
    const joyas_filter = await getFilter(precio_max,precio_min,categoria,metal)
    res.status(200).json(joyas_filter)
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

export { getAllJoyas, getFilterJoyas }