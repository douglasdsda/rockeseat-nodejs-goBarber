import { startOfHour } from 'date-fns';
import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppErros';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import User from '../models/User';
// recebimento, tratamento de erro e acesso ao repositorio

interface Request {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    public async execute({ date, provider_id }: Request): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(
            AppointmentsRepository,
        );
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked');
        }

        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne({
            where: { id: provider_id },
        });

        if (!user) {
            throw new AppError('User not existis');
        }

        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });

        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
