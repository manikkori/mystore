import { Phone } from "lucide-react";

const FloatingContact = () => {
  return (
    <a
      href="tel:+919876543210"
      className="hidden sm:flex fixed bottom-6 right-6 bg-brand-900 text-white p-4 rounded-full shadow-2xl hover:bg-black transition-colors z-50 items-center justify-center"
    >
      <Phone size={24} />
    </a>
  );
};

export default FloatingContact;
