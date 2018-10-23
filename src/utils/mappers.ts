import {
    IUser,
    IUserDto,
    IPhoto,
    IPhotoDto,
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

export function mapPhotoToDto(photo: IPhoto): IPhotoDto {
    const {
        iid,
        changed,
        description,
        title,
        uploaded,
        uploadedBy,
    } = photo;

    return {
        iid,
        description,
        title,
        uploaded,
        uploadedBy: mapUserToDto(uploadedBy),
        changed,
    };
}
