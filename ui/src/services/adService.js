import requester from './requester';
import toBase64 from './fileConverter';

export async function createAd(title, shortDescription, reward, validTo, minVideos, minSubscribers, minViews, picture, characteristics) {
    let pictureBase64 = await toBase64(picture);

    return await requester('/ad/create', 'POST', true, {
        title, 
        shortDescription, 
        reward, 
        validTo, 
        minVideos, 
        minSubscribers, 
        minViews, 
        pictureBase64, 
        characteristics
    });
}

