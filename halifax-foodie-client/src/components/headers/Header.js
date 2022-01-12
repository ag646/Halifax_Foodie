import "./header.css"
import {Component} from "react";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {faUserCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {toast} from "react-toastify";
import {withRouter} from "react-router-dom";
import axios from "axios";
import {CHANGE_ORDER_STATUS} from "../../config";

class Header extends Component {
  constructor(props) {
    super(props);
    const user = JSON.parse(localStorage.getItem('user'));
    let isAuthenticated = false;
    let userEmail = '';
    if (user && user.userEmail && user.secure) {
      isAuthenticated = true;
      userEmail = user.userEmail
    }

    this.state = {
      isAuthenticated: isAuthenticated,
      userEmail: userEmail,
      headerLinks: [
        {id: 'Home', link: '/home', name: 'Home'},
        {id: 'My Orders', link: '/my-orders', name: 'My Orders'},
        {id: 'Classification', link: '/classification', name: 'Classification'},
        {id: 'Chat', link: '/chat', name: 'Chat'},
        {id: 'Online Support', link: '/online-support', name: 'Online Support'},
        {id: 'Visualization', link: '/visualization', name: 'Visualization'}
      ],
      activeLink: window.location
    }
  }

  async componentDidMount() {
    try {
      setInterval(async () => {
        await axios.post(CHANGE_ORDER_STATUS);
      }, 60000);
    } catch (e) {
      console.log(e);
    }
  }

  handleLinkClick(item, event) {
    this.setState({activeLink: item.id});
  }

  invalidateSession = () => {
    localStorage.removeItem('user');
    toast.success('User logged out successfully.');
    this.setState({
      isAuthenticated: false
    })
    this.props.history.push({
      pathname: '/'
    });
  }

  render() {
    const navDropDownTitle = (
      <FontAwesomeIcon
        size={"2x"}
        icon={faUserCircle}
        className={"secondary"}
      />
    );
    return (
      <Navbar bg="dark" expand="lg" variant={"dark"} sticky={"top"}>
        <Navbar.Brand href="/" className={"mr-5"}>
          <span className={"ml-2 logo-name-small"}>Halifax Foodie</span>
        </Navbar.Brand>
        {this.props.location.isAuthenticated && (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                {
                  this.state.headerLinks.map(headerLink => {
                    return <Nav.Link href={headerLink.link} key={headerLink.id}
                                     className={this.state.activeLink.pathname === headerLink.link ? 'active' : ''}
                                     onClick={this.handleLinkClick.bind(this, headerLink)}>
                      {headerLink.name}
                    </Nav.Link>

                  })}
              </Nav>
            </Navbar.Collapse>
            <Navbar.Collapse className="justify-content-end">
              <Nav>
                <NavDropdown
                  title={navDropDownTitle}
                  id="navbarScrollingDropdown"
                  alignRight
                >
                  {this.state.isAuthenticated && <NavDropdown.Header>{this.state.userEmail}</NavDropdown.Header>}
                  <NavDropdown.Divider/>
                  <NavDropdown.Item onClick={this.invalidateSession}>Log out</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Navbar>
    );
  }
}

export default withRouter(Header);
