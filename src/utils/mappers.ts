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
        extension,
        title,
        uploaded,
        uploadedBy,
        averageRating,
        commentCount,
        ratingCount,
        userRating,
        views,
    } = photo;

    return {
        iid,
        description,
        extension,
        title,
        uploaded,
        uploadedBy: mapUserToDto(uploadedBy),
        changed,
        averageRating,
        commentCount,
        ratingCount,
        userRating,
        views,
    };
}
