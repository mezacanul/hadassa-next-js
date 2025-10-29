import liveRepository from "../repositories/live";

async function getAll() {
    return await liveRepository.getAll();
}

async function update(body) {
    const { id, status } = body;
    return await liveRepository.update(id, status);
}

export default {
    getAll,
    update,
};