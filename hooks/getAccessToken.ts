import { getCookieByKey } from "@/actions/cookieToken";

export const getAccessToken = async () => {
    const token = await getCookieByKey("access_token");
    return token;
}