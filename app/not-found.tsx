import MainLayout from "@/layouts/MainLayout";
import Link from "next/link";

const NotFound = () => {
    return (
        <MainLayout>
            <section className="wrapper">
                <div className="container m-auto text-center">
                    <h2 className="text-black font-bold text-2xl md:text-3xl mb-4">این صفحه پیدا نشد!</h2>
                    <p className="font-thin text-base text-slate-700">صفحه ای که بدنبال آن میگردید یافت نشد. از طریق لینک های زیر به بخش های دیگر سامانه دسترسی داشته باشید.</p>
                    <div className="flex justify-center gap-4 md:gap-6 mt-5 md:mt-6">
                        <Link
                            className="text-sm xs:text-base rounded-lg xs:rounded-xl py-2 px-4 bg-primary border border-transparent text-white shadow-md shadow-primary/20 transition hover:bg-transparent hover:text-primary hover:border-primary"
                            href="/wallet"
                        >
                            بازگشت به کیف پول
                        </Link>
                        <Link
                            className="text-sm xs:text-base rounded-lg xs:rounded-xl py-2 px-4 bg-transparent border border-primary text-primary shadow-md shadow-primary/20 transition hover:bg-primary hover:text-white"
                            href="/profile"
                        >
                            حساب کاربری
                        </Link>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}

export default NotFound;