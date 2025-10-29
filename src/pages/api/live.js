import liveController from "@/backend/controllers/live";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const live = await liveController.getAll();
        res.status(200).json(live);
    }
    if (req.method === "PATCH") {
        const live = await liveController.update(req.body);
        res.status(200).json(live);
    }
}