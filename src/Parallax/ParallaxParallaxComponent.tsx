import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { ReactTyped } from "react-typed"; // Correct import
import "./ParallaxComponent.css"; // Import the CSS file
import logo from "../images/banner.png";
import { Link } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import AppTheme from "../theme/AppTheme";
import Typography from "@mui/material/Typography";
import roadmap from "../images/roadmap.png";

const ParallaxContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function ParallaxComponent(props: {
  disableCustomTheme?: boolean;
}) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <ParallaxContainer>
        <Parallax pages={2} style={{ top: "0", left: "0" }}>
          <ParallaxLayer offset={0} speed={0.5} className="background-layer" />

          <ParallaxLayer offset={0} speed={1}>
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
            <div className="parallax-container">
              <Stack spacing={7}>
                <Typography
                  component="h2"
                  variant="h4"
                  sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
                >
                  Build on Lens Protocol for Lens
                </Typography>

                <ReactTyped
                  strings={["Welcome to the AI NFT Generator On Lens Dapp"]}
                  typeSpeed={50}
                  backSpeed={80}
                  loop
                  className="typed-text" // Apply the CSS class
                />
              </Stack>
            </div>

            <div className="launch-app">
              <button>
                <Link
                  to="/chatBot"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <Typography variant="h6">Launch Dapp</Typography>
                </Link>
              </button>
            </div>
          </ParallaxLayer>

          <ParallaxLayer offset={1} speed={1}>
          <div className="roadmap">
              <img src={roadmap} alt="roadmap" />
            </div>
          </ParallaxLayer>
        </Parallax>
      </ParallaxContainer>
    </AppTheme>
  );
}
