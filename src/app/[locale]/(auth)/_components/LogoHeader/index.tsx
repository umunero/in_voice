import { Link } from "@/i18n/navigation";
import { AppRoutes } from "@/lib/constants/routes";
// import Image from "next/image";

export default function LogoHeader() {
    return (
        <Link href={AppRoutes.HOME} className="max-w-fit">
            LOGO
            {/* <Image src={Logo} alt="logo" height={80} className="max-w-[70vw] md:min-w-60" /> */}
        </Link>
    );
}