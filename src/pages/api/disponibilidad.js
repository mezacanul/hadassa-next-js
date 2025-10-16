import disponibilidadController from "@/backend/controllers/disponibilidad";

export default async function handler(req, res) {
    // console.log("TEST", req.body);
    const response =
        await disponibilidadController.getHorariosDisponibles(
            req.body
        );
    res.status(200).json(response);
    // res.status(200).json(response);
}
