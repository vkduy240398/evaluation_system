import { Inject, Injectable } from '@nestjs/common';
import EntityConstant from 'src/constant/EntityConstant';
import { User } from 'src/entity/User';
import { UserHistoryUpdate } from 'src/entity/UserHistoryUpdate';

@Injectable()
export class UserHistoryUpdateRepo {
  getVersionSrtting() {
    throw new Error('Method not implemented.');
  }

  @Inject(EntityConstant.USER_HISTORY_UPDATE)
  private userHistoryUpdate: typeof UserHistoryUpdate;

  @Inject(EntityConstant.USER)
  private user: typeof User;

  async buildCreate(
    object: {
      userId: number;
      beforeUpdateContent: string;
      afterUpdateContent: string;
      option: string;
      companyGroupCode: string;
    }[],
  ) {
    return await this.userHistoryUpdate.bulkCreate(object);
  }

  async getHistoryUpdateUserList(companyGroupCode: string, userId: string) {
    return await this.user.findOne({
      attributes: ['id', 'employeeNumber', 'fullName', 'email'],
      where: {
        id: userId,
        companyGroupCode,
      },
      include: [
        {
          model: UserHistoryUpdate,
          as: 'userHistoryUpdates',
          include: [
            {
              model: User,
              as: 'creationUser',
              attributes: ['id', 'employeeNumber', 'fullName', 'email'],
            },
          ],
        },
      ],
      order: [
        [
          { model: UserHistoryUpdate, as: 'userHistoryUpdates' },
          'createdTime',
          'DESC',
        ],
      ],
    });
  }
}
