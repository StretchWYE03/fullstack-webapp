import { useUser } from "../auth/UserContext";

function Navbar() {
  const { logout } = useUser();

  return (
    <header className="topbar">
      <a className="brand" href="/" aria-label="Level Up home"><span>✦</span> level up</a>
      <div className="topbar-actions">
        <button className="icon-button" type="button" aria-label="View notifications">♢</button>
        <button className="avatar" type="button" onClick={logout} title="Log out">Z</button>
      </div>
    </header>
  );
}

export default Navbar;
