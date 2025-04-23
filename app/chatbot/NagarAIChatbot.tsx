'use client';

import { useState, useRef, useEffect, FormEvent, ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, X, Send, Maximize2, Minimize2 } from 'lucide-react';
import { apiClient } from "@/lib/api-client";
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

type Message = { text: string; isBot: boolean };

// Custom Markdown renderer component with proper typing
function MarkdownRenderer({ content }: { content: string }) {
  // Define properly typed components
  const components: Components = {
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
    ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
    li: ({ children }) => <li className="mb-1">{children}</li>,
    a: ({ href, children }) => (
      <a 
        className="text-red-400 hover:text-red-300 underline" 
        href={href}
        target="_blank" 
        rel="noopener noreferrer" 
      >
        {children}
      </a>
    ),
    code: ({ children, className }) => {
      // Check if this is an inline code block based on className
      const isInline = !className;
      return isInline ? (
        <code className="bg-neutral-700 px-1 py-0.5 rounded text-xs">{children}</code>
      ) : (
        <code className="block bg-neutral-700 p-2 rounded text-xs overflow-x-auto my-2">{children}</code>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-neutral-600 pl-3 italic my-2">{children}</blockquote>
    ),
    hr: () => <hr className="my-3 border-neutral-700" />,
    img: ({ src, alt }) => (
      <img className="max-w-full h-auto rounded my-2" src={src || "/placeholder.svg"} alt={alt || 'Image'} />
    ),
  };

  return (
    <div className="markdown-content text-white">
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

function NagarAILoader() {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <motion.div 
        className="relative w-6 h-6"
        aria-label="Loading"
      >
        {/* Outer ring */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-neutral-800 opacity-30"
        />
        {/* Animated arc */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-600"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1.2, 
            ease: "linear", 
            repeat: Infinity 
          }}
        />
        {/* Inner pulse */}
        <motion.div 
          className="absolute inset-[6px] rounded-full bg-red-600/20"
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.6, 0.3] }}
          transition={{ 
            duration: 2, 
            ease: "easeInOut", 
            repeat: Infinity 
          }}
        />
      </motion.div>
      <span className="text-sm font-medium text-white/80">Processing...</span>
    </div>
  );
}

export default function NagarAIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi, I'm NagarAI. How can I help you today?", isBot: true },
  ])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatWindowRef = useRef<HTMLDivElement>(null)

  // Default and expanded sizes
// Update these size constants
const defaultSize = { 
  width: "w-80 sm:w-[450px]",  // Increased from sm:w-96
  height: "h-[360px]"          // Reduced from h-80 (320px) to 360px
}
const expandedSize = { 
  width: "w-[95vw] sm:w-[800px]",  // Increased maximum width
  height: "h-[75vh] sm:h-[600px]"  // Reduced maximum height
}

  // scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  // focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [isOpen])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed) return

    setMessages((m) => [...m, { text: trimmed, isBot: false }])
    setInputText("")
    setIsLoading(true)

    try {
      const payload = { message: trimmed, context: "" }
      const res: { message: string } = await apiClient("/chatbot/message", {
        data: payload,
      })
      setMessages((m) => [...m, { text: res.message, isBot: true }])
    } catch {
      setMessages((m) => [
        ...m,
        { text: "Sorry, something went wrong. Please try again.", isBot: true },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSize = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWindowRef}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              width: isExpanded ? expandedSize.width : defaultSize.width,
              height: "auto"
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300,
              mass: 0.8
            }}
            className={`absolute bottom-16 right-0 bg-neutral-900 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-neutral-800 overflow-hidden`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-black to-red-900 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageSquare size={18} className="text-white/90" />
                </motion.div>
                <h3 className="font-semibold tracking-tight">NagarAI Assistant</h3>
              </div>
              <div className="flex items-center">
                <motion.button
                  onClick={toggleSize}
                  className="h-8 w-8 flex items-center justify-center text-white/90 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 mr-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={isExpanded ? "Minimize chat" : "Maximize chat"}
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </motion.button>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 flex items-center justify-center text-white/90 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close chat"
                >
                  <X size={18} />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className={`p-5 flex flex-col ${isExpanded ? expandedSize.height : defaultSize.height}`}>
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent"
                aria-live="polite"
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className={`p-3.5 rounded-2xl text-sm ${
                      msg.isBot
                        ? "bg-neutral-800 mr-10 shadow-sm"
                        : "bg-gradient-to-r from-red-800 to-red-600 text-white ml-10 shadow-md"
                    }`}
                  >
                    {msg.isBot ? (
                      <MarkdownRenderer content={msg.text} />
                    ) : (
                      <p className="leading-relaxed text-white">
                        {msg.text}
                      </p>
                    )}
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-2xl bg-neutral-800 mr-10 shadow-sm"
                  >
                    <NagarAILoader />
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex gap-2 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setInputText(e.target.value)
                  }
                  className="flex-1 p-3.5 pl-4 pr-12 border border-neutral-700 rounded-xl shadow-sm bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all placeholder:text-neutral-400 text-white"
                  placeholder="Ask me anything…"
                  disabled={isLoading}
                  aria-label="Chat message"
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-gradient-to-r from-red-800 to-red-600 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  aria-label="Send message"
                >
                  <Send size={16} className="text-white/90" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(185, 28, 28, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={`h-14 w-14 rounded-full flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
          isOpen
            ? "bg-neutral-900 text-white shadow-neutral-900/20"
            : "bg-gradient-to-r from-black to-red-900 text-white shadow-red-900/30"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X size={22} className="text-white/90" />
        ) : (
          <div className="relative">
            <MessageSquare size={22} className="text-white/90" />
            <motion.span 
              className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
              animate={{ 
                scale: [2, 2.4, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>
        )}
      </motion.button>
    </div>
  )
}