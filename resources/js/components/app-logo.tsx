import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <img
                    src={`${import.meta.env.BASE_URL}images/logo.png`}
                    alt="CTTTC Logo"
                    className="w-12 sm:w-12 md:w-12 lg:w-14 h-auto object-contain bg-[#fafafa]"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-xl">
                <span className="mb-0.5 truncate leading-none font-semibold">Cavite Tiger</span>
            </div>
        </>
    );
}
