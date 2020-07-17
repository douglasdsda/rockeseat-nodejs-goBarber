import { getRepository, Repository } from 'typeorm';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '../typeorm/entities/User';

class UsersRepository implements IUsersRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async findById(id: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({ where: { id } });

        return user || undefined;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({ where: { email } });

        return user || undefined;
    }

    public async save(user: User): Promise<User> {
        await this.ormRepository.save(user);

        return user;
    }

    public async create({
        email,
        name,
        password,
    }: ICreateUserDTO): Promise<User> {
        const user = this.ormRepository.create({
            email,
            name,
            password,
        });

        await this.ormRepository.save(user);

        return user;
    }
}

export default UsersRepository;