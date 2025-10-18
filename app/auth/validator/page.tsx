import AuthLayout from "@/layouts/AuthLayout";
import ActiveMobileForm from "./_components/ActiveMobileForm";
import { getAccessToken } from "@/hooks/getAccessToken";

const MobileValidatorPage = async () => {
    const accessToken = await getAccessToken();

    return (
        <AuthLayout>
                <ActiveMobileForm accessToken={accessToken || ""} />
        </AuthLayout>
    );
}

export default MobileValidatorPage;