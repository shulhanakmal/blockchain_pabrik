import React, { useState } from "react";
import "./Header.css";
import "./HeaderMedia.css";
import {
  CCollapse,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CNavbar,
  CNavbarNav,
  CToggler,
  CNavLink,
  CDropdown
} from "@coreui/react";

const Header = props => {
  const [isOpen, setIsOpen] = useState(false);
  const userRole = props.userRole;
  const userName = props.userName;
  
  return (
    <CNavbar expandable="sm" color="dark">
      <CToggler inNavbar onClick={() => setIsOpen(!isOpen)} />
      {/* <CNavbarBrand to="/">
        <CImg
          src="images/logo-kopi-ketjil.png"
          className="d-inline-block align-top"
          alt="logo-kopi-ketjil"
        />
      </CNavbarBrand> */}
      <CCollapse show={isOpen} navbar>
        <CNavbarNav>
        <CNavLink href="/">Dashboard</CNavLink>
        <CNavLink to="/Stock">Stock</CNavLink>
          <CDropdown inNav>
            <CDropdownToggle color="primary">Sugar</CDropdownToggle>
              {(() => {
                if (userRole === 'production') {
                  return (
                    <CDropdownMenu>
                      <CDropdownItem to="/Production">Production</CDropdownItem>
                    </CDropdownMenu>
                  )
                } else if (userRole === 'logistics') {
                  return (
                    <CDropdownMenu>
                      <CDropdownItem to="/Logistic">Logistics</CDropdownItem>
                    </CDropdownMenu>
                  )
                } else if (userRole === 'sales') {
                  return (
                    <CDropdownMenu>
                      <CDropdownItem to="/Sales">Sales</CDropdownItem>
                    </CDropdownMenu>
                  )
                } else {
                  return (
                    <CDropdownMenu>
                      <CDropdownItem to="/Production">Production</CDropdownItem>
                      <CDropdownItem to="/Logistic">Logistics</CDropdownItem>
                      <CDropdownItem to="/Sales">Sales</CDropdownItem>
                    </CDropdownMenu>
                  )
                }
              })()}
          </CDropdown>
        </CNavbarNav>
        <CNavbarNav>
          <CDropdown inNav>
            <CDropdownToggle color="primary">Summary</CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem to="/SummaryProduction">Summary Production</CDropdownItem>
              <CDropdownItem to="/SummaryLogistic">Summary Logistics</CDropdownItem>
              <CDropdownItem to="/SummarySales">Summary Sales</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CNavbarNav>
        {(() => {
          if (userRole === 'admin') {
            return (
              <CNavbarNav>
                <CDropdown inNav>
                  <CDropdownToggle color="primary">User Management</CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem to="/User-management/list-user">List User</CDropdownItem>
                    <CDropdownItem to="/User-management/add-user">Add User</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CNavbarNav>
            )
          }
        })()}
        <CNavbarNav className="ml-auto">
          <CDropdown inNav>
            <CDropdownToggle color="primary">
              {userName}
            </CDropdownToggle>
            <CDropdownMenu>
              {/* <CDropdownItem>Account</CDropdownItem>
              <CDropdownItem>Settings</CDropdownItem> */}
              <CDropdownItem href="/login" onClick={() => props.logoutClick()}>
                LogOut
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CNavbarNav>
      </CCollapse>
    </CNavbar>
  );
};

export default Header;
