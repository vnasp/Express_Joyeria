import { getJoyas, getFilter } from '../../src/models/joyasModel.js'
import { findError } from "../../src/utils/utils.js"

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
    console.log(error);
    const errorFound = findError(error.code);
    return res
      .status(errorFound[0]?.status)
      .json({ error: errorFound[0]?.message });
  }
}

const getFilterJoyas = async (req, res) => {
  try {
    const { precio_max,precio_min,categoria,metal } = req.query
    const joyas_filter = await getFilter(precio_max,precio_min,categoria,metal)
    res.status(200).json(joyas_filter)
  } catch (error) {
    console.log(error);
    const errorFound = findError(error.code);
    return res
      .status(errorFound[0]?.status)
      .json({ error: errorFound[0]?.message });
  }
};

export { getAllJoyas, getFilterJoyas }