import { Request, Response } from 'express';

import { container } from 'tsyringe';
import ListProviderDayAvaliabilityService from '@modules/appointments/services/ListProviderDayAvaliabilityService';

export default class ProviderDayAvailabilityController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { provider_id } = request.params;
        const { month, year, day } = request.query;

        const listProviderDayhAvaliability = container.resolve(
            ListProviderDayAvaliabilityService,
        );

        const availability = await listProviderDayhAvaliability.execute({
            provider_id,
            day: Number(day),
            month: Number(month),
            year: Number(year),
        });
        return response.json(availability);
    }
}
