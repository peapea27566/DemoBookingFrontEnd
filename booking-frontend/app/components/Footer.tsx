const Footer = () => {
  return (
    <footer className="footer footer-center text-base-content p-4 bg-white">
      <aside className="text-center">
        <p>
          Copyright © {new Date().getFullYear()} - Demo Booking
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
