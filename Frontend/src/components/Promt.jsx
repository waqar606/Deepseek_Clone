import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Paperclip, ArrowUp, Globe, Bot } from "lucide-react";
import logo from "/logo.png";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";
import { BACKEND_URL } from "../../utils/utils";

function Promt() {
  //store the input query by user
  const [inputValue, setInputValue] = useState("");
  
  //show the user message at right side
  const [typeMessage, setTypeMessage] = useState("");

  //prompt store karega
  const [promt, setPromt] = useState([]);

  const [loading, setLoading] = useState(false);

  // scroll automatically to end
  const promtEndRef = useRef();

  //so that refresh the user data not lost 
  //in this we store the prompt in localStorage
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const storedPromt = localStorage.getItem(`promtHistory_${user._id}`);
      if (storedPromt) {
        //take pehle wale dikhen
        setPromt(JSON.parse(storedPromt));
      }
    }
  }, []);


  //take history delete na ho 
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      localStorage.setItem(`promtHistory_${user._id}`, JSON.stringify(promt));
      
    }
  }, [promt]);

  useEffect(() => {
    promtEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [promt, loading]);

  
  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first");
      return;
    }

    setInputValue("");
    setTypeMessage(trimmed);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        // "http://localhost:1000/api/v1/deepseekai/promt",
        `${BACKEND_URL}/deepseekai/promt`,
        { content: trimmed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const updatedPromt = [
        ...promt,
        { role: "user", content: trimmed },
        { role: "assistant", content: data.reply },
      ];
      setPromt(updatedPromt);
      localStorage.setItem(`promtHistory_${user._id}`, JSON.stringify(updatedPromt));
    } catch (error) {
      console.error("API Error:", error);
      const updatedPromt = [
        ...promt,
        { role: "user", content: trimmed },
        {
          role: "assistant",
          content: "❌ Something went wrong with the AI response.",
        },
      ];
      setPromt(updatedPromt);
      localStorage.setItem(`promtHistory_${user._id}`, JSON.stringify(updatedPromt));
    } finally {
      setLoading(false);
      setTypeMessage(null);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col items-center justify-between flex-1 w-full px-4 pb-4 md:pb-8">
      {/* Greeting */}
      <div className="mt-8 md:mt-16 text-center">
        <div className="flex items-center justify-center gap-2">
          <img src={logo} alt="DeepSeek Logo" className="h-6 md:h-8" />
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">
            Hi, I'm DeepSeek.
          </h1>
        </div>
        <p className="text-gray-400 text-base md:text-sm mt-2">
          💬 How can I help you today?
        </p>
      </div>

      {/* Chat Box */}
      <div className="w-full max-w-4xl flex-1 overflow-y-auto mt-6 mb-4 space-y-4 max-h-[60vh] px-1">
        {promt.map((msg, index) => (
          <div
            key={index}
            className={`w-full flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" ? (
              <div className="w-full bg-[#232323] text-white rounded-xl px-4 py-3 text-sm whitespace-pre-wrap">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={codeTheme}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg mt-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-gray-800 px-1 py-0.5 rounded"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="w-[30%] bg-blue-600 text-white rounded-xl px-4 py-3 text-sm whitespace-pre-wrap self-start">
                {msg.content}
              </div>
            )}
          </div>
        ))}

        {/* User message while loading */}
        {loading && typeMessage && (
          <div className="whitespace-pre-wrap px-4 py-3 rounded-2xl text-sm break-words bg-blue-600 text-white self-end ml-auto max-w-[40%]">
            {typeMessage}
          </div>
        )}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex justify-start w-full">
            <div className="bg-[#2f2f2f] text-white px-4 py-3 rounded-xl text-sm animate-pulse">
              🤖Loading...
            </div>
          </div>
        )}

        <div ref={promtEndRef} />
      </div>

      {/* Input Section */}
      <div className="w-full max-w-4xl relative mt-auto">
        <div className="bg-[#2f2f2f] rounded-[2rem] px-4 md:px-6 py-6 md:py-8 shadow-md">
          <input
            type="text"
            placeholder="💬 Message DeepSeek"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent w-full text-white placeholder-gray-400 text-base md:text-lg outline-none"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
            <div className="flex gap-2 flex-wrap">
              <button className="flex items-center gap-2 border border-gray-500 text-white text-sm md:text-base px-3 py-1.5 rounded-full hover:bg-gray-600 transition">
                <Bot className="w-4 h-4" />
                DeepThink (R1)
              </button>
              <button className="flex items-center gap-2 border border-gray-500 text-white text-sm md:text-base px-3 py-1.5 rounded-full hover:bg-gray-600 transition">
                <Globe className="w-4 h-4" />
                Search
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button className="text-gray-400 hover:text-white transition">
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                onClick={handleSend}
                className="bg-gray-500 hover:bg-blue-600 p-2 rounded-full text-white transition"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Promt;