import bcrypt from 'bcryptjs';

export const hashData = ({ payload = '', saltRound = +process.env.SALT_ROUNDS }) => {
    if (payload == '') {
        return false;
    }
    const hashPayload = bcrypt.hashSync(payload, saltRound);
    return hashPayload;
}

export const compareData = ({ payload = '', referenceData = '' }) => {
    if (payload === '' && referenceData === '') {
        return false;
    }
    const match = bcrypt.compareSync(payload, referenceData);
    return match;
}