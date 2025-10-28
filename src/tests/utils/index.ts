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

export const isJwt = (token: string | null): boolean => {
    if (token === null) {
        return false;
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
        return false;
    }

    try {
        parts.forEach((part) => {
            // This is to check if the part is a valid base64 string
            Buffer.from(part, 'base64').toString('utf-8');
        });
        return true;
    } catch {
        return false;
    }
};
