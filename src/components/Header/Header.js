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
          <CDropdown inNav>
            <CDropdownToggle color="primary">Sugar</CDropdownToggle>
              {/* {(() => {
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
              })()} */}
            <CDropdownMenu>
              <CDropdownItem to="/Production">Production</CDropdownItem>
              <CDropdownItem to="/Logistic">Logistics</CDropdownItem>
              <CDropdownItem to="/Sales">Sales</CDropdownItem>
            </CDropdownMenu>
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
                <CNavLink to="/Stock">Stock</CNavLink>
                <CDropdown inNav>
                  <CDropdownToggle color="primary">User Management</CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem to="/User-management/list-user">List User</CDropdownItem>
                    <CDropdownItem to="/User-management/add-user">Add User</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
                <CNavLink href="/List-request-data">List Request Data</CNavLink>
                <CNavLink href="/"></CNavLink>
                <CDropdown inNav>
                  <CDropdownToggle color="primary">Farmer</CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem to="/List-mitra-petani">Farmer Partners</CDropdownItem>
                    <CDropdownItem to="/List-lokasi-kebun">Farmer's Garden</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
                {/* <CNavLink href="/List-petani">Farmer</CNavLink> */}
              </CNavbarNav>
            )
          } else {
            return (
              <CNavbarNav>
                <CNavLink href="/Request-data">Request Data</CNavLink>
                <CNavLink href="/Konsumen">Customer</CNavLink>
              </CNavbarNav>
            )
          }
        })()}

        {(() => {
          if (userName && userRole) {
            return (
              <CNavbarNav className="ml-auto">
                <CDropdown inNav>
                  <CDropdownToggle color="primary">
                    {userName}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem href="/login" onClick={() => props.logoutClick()}>
                      LogOut
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CNavbarNav>
            )
          } else {
            return (
              <CNavbarNav className="ml-auto">
                <CNavLink href="/Login">Login</CNavLink>
              </CNavbarNav>
            )
          }
        })()}
      </CCollapse>
    </CNavbar>
  );
};

export default Header;
