import type { DataSource } from 'typeorm';

export const truncateTables = async (dbConnection: DataSource) => {
    const entities = dbConnection?.entityMetadatas;
    await Promise.all(
        entities?.map((entity) => {
            const repository = dbConnection.getRepository(entity.name);
            return repository.clear();
        })
    );
};
