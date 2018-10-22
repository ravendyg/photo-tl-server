import {
    IUser,
    IUserDto,
} from '../types';

export function mapUserToDto(user: IUser): IUserDto {
    const {
        name,
        uid,
    } = user;

    return {
        name,
        uid,
    };
}
