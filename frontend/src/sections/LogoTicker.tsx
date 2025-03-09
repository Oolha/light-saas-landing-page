import Image from "next/image";
import AcmeLogo from "@/assets/acme-logo.png";
import ApexLogo from "@/assets/apex-logo.png";
import CelestiaLogo from "@/assets/celestia-logo.png";
import EchoLogo from "@/assets/echo-logo.png";
import PulseLogo from "@/assets/pulse-logo.png";
import QuantumLogo from "@/assets/quantum-logo.png";

export const LogoTicker = ({}) => {
  return (
    <div className="py-8 md:py-12 bg-white">
      <div className="container">
        <div className="flex overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,black,transparent)] [webkit-mask-image:linear-gradient(to_right,transparent,black,transparent)]">
          <div className="flex gap-14 flex-none">
            <Image
              src={AcmeLogo}
              alt="Acme logo"
              className="logo-ticker-image"
            />
            <Image
              src={ApexLogo}
              alt="Apex logo"
              className="logo-ticker-image"
            />
            <Image
              src={CelestiaLogo}
              alt="Celestia logo"
              className="logo-ticker-image"
            />
            <Image
              src={EchoLogo}
              alt="Echo logo"
              className="logo-ticker-image"
            />
            <Image
              src={PulseLogo}
              alt="Pulse logo"
              className="logo-ticker-image"
            />
            <Image
              src={QuantumLogo}
              alt="Quantum logo"
              className="logo-ticker-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
