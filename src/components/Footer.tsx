const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Mujthaba Salim. Built with React & ❤️
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          Designed & Developed by <span className="text-primary">Mujthaba Salim</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
