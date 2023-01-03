export function NavBar() {
  return (
    <nav
      className="navbar is-fixed-top is-link has-shadow"
      role="navigation"
      aria-label="main navigation"
      style={{ backgroundColor: "rgb(0, 107, 164)" }}
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="/players">
          <img src="/sig_logo_small.png" width="40" height="40" />
          <span
            style={{
              marginLeft: "15px",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Sweden Indoor Golf - Simple SGT
          </span>
        </a>

        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <div className="navbar-end">
            <div className="navbar-item"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}
