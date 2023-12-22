import jwt from "jsonwebtoken";

export const tokenData = ({
    payload = {} || '',
    signatuer = process.env.TOKEN_SIGNATUAR,
    expiresIn = 1200,
    generation = true
}) => {
    if (typeof payload == 'object') {
        if (Object.keys(payload).length && generation) {
            const token = jwt.sign(payload, signatuer, { expiresIn })
            return token;
        }
    }
    if (typeof payload == 'string') {
        if (payload == '' && generation) {
            return false
        }
        const decoded = jwt.verify(payload, signatuer);
        return decoded;
    }
    return false;
}