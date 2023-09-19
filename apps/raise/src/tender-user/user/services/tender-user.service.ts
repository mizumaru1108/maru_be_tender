import { BadRequestException, Injectable } from '@nestjs/common';
import { getTimeGap } from '../../../tender-commons/utils/get-time-gap';
import { SearchUserFilterRequest } from '../dtos/requests';
import { FindUserResponse } from '../dtos/responses/find-user-response.dto';
import { TenderCurrentUser } from '../interfaces/current-user.interface';

import { TenderUserRepository } from '../repositories/tender-user.repository';

@Injectable()
export class TenderUserService {
  constructor(private readonly userRepo: TenderUserRepository) {}

  async findUsers(
    currentUser: TenderCurrentUser,
    filter: SearchUserFilterRequest,
  ): Promise<FindUserResponse> {
    const {
      sorting_field,
      hide_internal,
      hide_external,
      include_schedule,
      association_name,
      client_field,
      track_id,
      single_role,
      user_type_id,
    } = filter;
    if (
      sorting_field &&
      [
        'employee_name',
        'track_id',
        'email',
        'created_at',
        'updated_at',
      ].indexOf(sorting_field) === -1
    ) {
      throw new BadRequestException(
        `Sorting field by ${sorting_field} is not allowed!`,
      );
    }

    if (hide_internal === '1' && hide_external === '1') {
      throw new BadRequestException(
        "You can't hide both internal and external user!",
      );
    }

    if (hide_internal === '1' && single_role) {
      throw new BadRequestException(
        "You can't use single_role when hide the internal user!",
      );
    }

    if (hide_internal === '1' && track_id) {
      throw new BadRequestException(
        "You can't use track_id when hide the internal user!",
      );
    }

    if ((hide_external === '0' || !hide_external) && single_role) {
      throw new BadRequestException(
        'External must be hidden when you want to use single_role filter!',
      );
    }

    if (hide_external === '1' && include_schedule === '1') {
      throw new BadRequestException(
        "You can't hide external user when you want to include schedule!",
      );
    }

    if (hide_external === '1' && association_name) {
      throw new BadRequestException(
        "You can't hide external user when you want to search client by association name!",
      );
    }

    if (hide_external === '1' && client_field) {
      throw new BadRequestException(
        "You can't hide external user when you want to search client by association name!",
      );
    }

    if (
      hide_external === '1' &&
      (association_name || include_schedule === '1')
    ) {
      throw new BadRequestException(
        "You can't hide external user when you want to search client by association name or include schedule!",
      );
    }

    /* if loggined user is account manager, it will show all user, if not, only active user will shown */
    const findOnlyActive =
      currentUser.choosenRole === 'tender_accounts_manager' ? false : true;

    const response = await this.userRepo.findUsers(filter, findOnlyActive);

    let finalResult: FindUserResponse['data'] = [];

    // only show internal user & split if user has multiple roles (like using unwind in mongodb)
    if (single_role && hide_external === '1') {
      for (const user of response.data) {
        for (const role of user.roles) {
          const data = {
            ...user,
            roles: [role],
          };
          finalResult.push(data);
        }
      }
    } else if (include_schedule === '1' && hide_internal === '1') {
      for (const user of response.data) {
        const data = {
          ...user,
        };

        if (user.schedule && user.schedule.length > 0) {
          for (const schedule of user.schedule) {
            if (schedule.start_time && schedule.end_time) {
              const gap = getTimeGap(
                schedule.start_time,
                schedule.end_time,
                15,
              );
              schedule.time_gap = gap;
            }
          }
        }

        finalResult.push(data);
      }
    } else {
      finalResult = response.data;
    }

    // console.log({ finalResult });

    return {
      data: finalResult,
      total: response.total,
    };
  }
}
