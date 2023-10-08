import { JSXElementConstructor, ReactElement, useRef } from "react";
import { Link } from "react-router-dom";

export function Navbar() {
  // create ref to store the DOM element
  const navbarMenuRef = useRef<HTMLDivElement | null>(null);
  const burgerRef = useRef<HTMLAnchorElement | null>(null);

  function toggle(evt: any) {
    // toggle the active boolean in the state
    if (navbarMenuRef.current !== null && burgerRef.current !== null) {
      navbarMenuRef.current.classList.toggle("is-active");
      burgerRef.current.classList.toggle("is-active");
    }
  }

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src="./teetime-min.png" width="30" height="30" />
        </a>
        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          onClick={(evt) => {
            toggle(evt);
          }}
          ref={burgerRef}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu" ref={navbarMenuRef}>
        <div className="navbar-start">
          <Link className="navbar-item" to="/">
            Liga
          </Link>
          <Link className="navbar-item" to="/rundor/2023">
            Rundor
          </Link>
        </div>

        <div className="navbar-end"></div>
      </div>
    </nav>
  );
}
