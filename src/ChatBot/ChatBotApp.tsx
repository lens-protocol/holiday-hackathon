import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { TextField, Button, Stack, Typography, Box } from "@mui/material";
import TabBar from "../Tabbar/TabBar";
import AppTheme from "../theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import "./ChatBotApp.css";
import { ReactTyped } from "react-typed"; // Correct import

// Define the type for chat messages
interface Message {
  text: string;
  isUser: boolean; // Change this to isUser
}
const ChatContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    paddingTop: theme.spacing(14),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
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

// const ChatContainer = styled(Box)(({ theme }) => ({
//   display: "flex",
//   flexDirection: "column",
//   height: "100%",
//   padding: theme.spacing(2),
//   overflowY: "auto",
// }));

const MessageBubble = styled(Box)(({ isUser }: { isUser: boolean }) => ({
  alignSelf: isUser ? "flex-end" : "flex-start",
  backgroundColor: isUser ? "#007bff" : "#e0e0e0",
  color: isUser ? "white" : "black",
  borderRadius: "20px",
  padding: "10px 15px",
  margin: "5px 0",
  maxWidth: "70%",
}));

export default function ChatBotApp(props: { disableCustomTheme?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]); // Use the Message type
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const aiURL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
    import.meta.env.VITE_GOOGLE_API_KEY;
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      if (inputValue) {
        setIsTyping(true);
      } else {
        setIsTyping(false);
      }
    }, 1); // Show typing indicator after 300ms of typing

    return () => clearTimeout(typingTimeout);
  }, [inputValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000); // 5000 milliseconds = 5 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { text: inputValue, isUser: true }]);
    setIsTyping(false);
    // Call the API
    try {
      const response = await fetch(aiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: inputValue }] }],
        }),
      });

      const data = await response.json();
      const botMessage =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I didn't understand that.";

      // Add bot response to chat
      setMessages((prev) => [...prev, { text: botMessage, isUser: false }]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, there was an error processing your request.",
          isUser: false,
        },
      ]);
    }
    setInputValue(""); // Clear input field
  };

  return (
    <AppTheme {...props}>
      <TabBar />
      <CssBaseline enableColorScheme />
      <ChatContainer>
        {showWelcome && (
          <div
            className={`text-center ${showWelcome ? "fade-in" : "fade-out"}`}
          >
            <ReactTyped
              strings={["Welcome to the ChatBot AI Assist"]}
              typeSpeed={50}
              backSpeed={80}
              className="typed-text" // Apply the CSS class
            />
          </div>
        )}
        {messages.map((msg, index) => (
          <MessageBubble key={index} isUser={msg.isUser}>
            {isTyping && (
              <div className="typing-indicator">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}
            <Typography variant="body1">{msg.text}</Typography>
          </MessageBubble>
        ))}

        <Stack direction="row" spacing={1} sx={{ marginTop: "auto" }}>
          <TextField
            variant="outlined"
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your prompt..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Prevent the default action (like a form submission)
                handleSendMessage(); // Call the send message function
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            sx={{ width: "175px" }}
          >
            Send
          </Button>
        </Stack>
      </ChatContainer>
    </AppTheme>
  );
}
