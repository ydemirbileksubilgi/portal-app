import { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  CssBaseline,
  Collapse,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import logo from "../../assets/KolinLogo.png";
import { useNavigate } from "react-router";

const drawerWidth = 300;
const miniDrawerWidth = 70;

const menuItems = [
  {
    text: "Kolin Procurement Auth",
    icon: <HomeIcon />,
    children: [
      { text: "Quotation-My Step", path: "/quotation-my-step" },
      { text: "Quotation-ALL", path: "/quotation-all" },
      { text: "Past Approved / Rejected Quotes", path: "/past-quotes" },
    ],
  },
  {
    text: "Kolin Financials",
    icon: <BusinessIcon />,
    children: [],
    path: "/financials",
  },
  {
    text: "KSA T.O.",
    icon: <AssessmentIcon />,
    children: [
      { text: "Supplier Invoice Analysis", path: "/supplier-invoice-analysis" },
    ],
  },
];

export default function SidebarMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const toggleDrawer = () => {
    setOpen(!open);
    if (open) {
      setOpenSubMenus([]);
    }
  };
  const navigate = useNavigate();
  const handleMenuItemClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  const handleSubMenuClick = (text: string) => {
    setOpenSubMenus((prevOpenMenus) => {
      const isOpen = prevOpenMenus.includes(text);
      if (isOpen) {
        return prevOpenMenus.filter((menuText) => menuText !== text);
      } else {
        return [...prevOpenMenus, text];
      }
    });
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const renderMenuItems = (items: any[]) => {
    return items.map((item) => (
      <div key={item.text}>
        {item.children ? (
          <>
            <ListItemButton
              onClick={() => handleSubMenuClick(item.text)}
              sx={{
                mx: open ? 1.5 : 0.5,
                mb: 0.5,
                borderRadius: 2,
                background: openSubMenus.includes(item.text)
                  ? "#360165"
                  : "transparent",
                color: openSubMenus.includes(item.text) ? "#fff" : "#4B5563",
                "&:hover": {
                  background: openSubMenus.includes(item.text)
                    ? "#360165"
                    : "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 20px rgba(139, 92, 246, 0.25)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                minHeight: 48,
              }}
            >
              <ListItemIcon
                sx={{
                  color: openSubMenus.includes(item.text) ? "#fff" : "#360165",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                />
              )}
              {open &&
                (openSubMenus.includes(item.text) ? (
                  <ExpandLess sx={{ color: "#fff" }} />
                ) : (
                  <ExpandMore sx={{ color: "#8B5CF6" }} />
                ))}
            </ListItemButton>
            <Collapse
              in={openSubMenus.includes(item.text)}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {item.children.map((child: any) => (
                  <ListItemButton
                    key={child.text}
                    sx={{
                      pl: open ? 8 : 2,
                      mx: open ? 2 : 0.5,
                      borderRadius: 1.5,
                      backgroundColor: "rgba(139, 92, 246, 0.05)",
                      border: "1px solid rgba(139, 92, 246, 0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(139, 92, 246, 0.1)",
                        transform: "translateX(4px)",
                      },
                    }}
                    onClick={() => handleMenuItemClick(child.path)}
                  >
                    {open && (
                      <ListItemText
                        primary={child.text}
                        primaryTypographyProps={{
                          fontSize: "0.85rem",
                          color: "#6B7280",
                          fontWeight: 400,
                        }}
                      />
                    )}
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleMenuItemClick(item.path)}
              sx={{
                mx: open ? 1.5 : 0.5,
                borderRadius: 2,
                mb: 0.5,
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: open ? 2.5 : 1,
                background: "transparent",
                color: "#4B5563",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 15px rgba(139, 92, 246, 0.2)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#360165",
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        )}
      </div>
    ));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
         background: "#360165", // BURADA TEK RENK
    boxShadow: "0 4px 25px rgba(54,0,101,0.4)", // Mor tonlu gölge
          width: `calc(100% - ${open ? drawerWidth : miniDrawerWidth}px)`,
          ml: `${open ? drawerWidth : miniDrawerWidth}px`,
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Sol taraf */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="menüyü aç"
              onClick={toggleDrawer}
              edge="start"
              sx={{
                mr: 2,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                ml: 2,
                fontWeight: "600",
                color: "#fff",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              IFS Portal
            </Typography>
          </Box>

          {/* Sağ taraf kullanıcı alanı */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ color: "#fff", fontWeight: 500 }}>
              Test Kullanıcı
            </Typography>
            <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
              <Avatar 
                alt="Test" 
                src="/static/images/avatar/1.jpg"
                sx={{
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    border: "2px solid rgba(255, 255, 255, 0.6)",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease",
                }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{
                "& .MuiPaper-root": {
                  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  border: "1px solid rgba(139, 92, 246, 0.1)",
                  borderRadius: 2,
                  boxShadow: "0 10px 30px rgba(139, 92, 246, 0.15)",
                },
              }}
            >
              <MenuItem 
                onClick={handleCloseMenu}
                sx={{
                  "&:hover": {
                    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
                  },
                }}
              >
                Profil
              </MenuItem>
              <MenuItem 
                onClick={handleCloseMenu}
                sx={{
                  "&:hover": {
                    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
                  },
                }}
              >
                Çıkış Yap
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : miniDrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : miniDrawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #fefefe 0%, #f8fafc 50%, #f1f5f9 100%)",
            borderRight: "1px solid rgba(139, 92, 246, 0.1)",
            overflowX: "hidden",
            boxShadow: "4px 0 20px rgba(139, 92, 246, 0.08)",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
      >
        <Box sx={{ 
          px: 3, 
          py: 2,
          mb: 2, 
          display: "flex", 
          justifyContent: "center",
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)",
          borderRadius: open ? 2 : 0,
          mx: open ? 1 : 0,
          mt: 1,
        }}>
          <img
            src={logo}
            alt="Kolin Logo"
            style={{
              width: open ? "140px" : "50px",
              height: open ? "70px" : "30px",
              objectFit: "contain",
              filter: "drop-shadow(0 2px 12px rgba(139, 92, 246, 0.2))",
            }}
          />
        </Box>

        <Box sx={{ overflow: "auto", pt: 2 }}>
          {open && (
            <Divider
              sx={{
                mb: 2,
                mx: 2,
                background:
                  "#360165",
                height: 2,
                borderRadius: 1,
              }}
            />
          )}
          <List sx={{ px: 0 }}>{renderMenuItems(menuItems)}</List>
        </Box>
      </Drawer>

      {/* İçerik */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          background: "linear-gradient(135deg, #faf5ff 0%, #f3f4f6 50%, #f8fafc 100%)",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}