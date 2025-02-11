import Aside from "./Aside"
import Main from "./Main"

function Header(){

  return<>
  <header className="header-login">
      <nav className="login-nav">
          <a href="">Login</a>
      </nav>
  </header>
    <Aside />
    <Main />
  </>
}

export default Header