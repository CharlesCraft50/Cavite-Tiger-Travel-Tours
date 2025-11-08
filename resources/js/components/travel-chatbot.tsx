import { TourPackage } from "@/types";
import { Button, Input } from "@headlessui/react";
import clsx from "clsx";
import { Calendar, MapPin, MessageCircle, Phone, Send, Users, X } from "lucide-react";
import {  FormEventHandler, useEffect, useRef, useState } from "react";
import AppLogoIcon from "./app-logo-icon";
import PriceSign from "./price-sign";
import LinkLoading from "./link-loading";

type MessageProps = {
    id: number,
    text: string,
    sender: string,
    timestamp: Date,
}

export default function TravelChatbot() {

    const chatRef = useRef<HTMLDivElement | null>(null);
    
    const quickReplies = [
        { text: "View Tour Packages", icon: MapPin },
        { text: "Check Availability", icon: Calendar },
        { text: "Travel Tips & Guides", icon: Users },
        { text: "Contact Us", icon: Phone }
    ];

    const [packages, setPackages] = useState<TourPackage[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<MessageProps[]>([
        {
            id: 1,
            text: "Hi! Welcome to Cavite Tiger Travel Tours! 🐅 I'm here to help you plan your perfect getaway. What can I help you with today?",
            sender: 'bot',
            timestamp: new Date(),
        }
    ]);

    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch('/api/packages/latest');
                const packages = response.json();
                setPackages(await packages);
            } catch (error) {
                console.error('Error fetching packages: ', error);
            }
        }

        fetchPackages();
    }, []);

    const addMessage = (text: string, sender = 'user') => {
        const newMessage = {
            id: Date.now(),
            text,
            sender,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, newMessage]);
    }

    function messageIncludes (message: string, keywords: string[]) {
        return keywords.some((keyword) => message.includes(keyword));
    }

    const getReponseBot = (userResponse: string) => {
        const message = userResponse.toLowerCase();

        if (messageIncludes(message, ['contact', 'call', 'phone'])) {
            return {
                text: "${contact}",
            }
        }

        if (messageIncludes(message, ['package', 'tour'])) {
            return {
                text: "Here are our tour packages",
                showTime: true,
            }
        }
        
        if (messageIncludes(message, ['tips', 'guide', 'travel tips'])) {
            return {
                text: `🧳 𝗣𝗹𝗮𝗻𝗻𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝘁𝗿𝗶𝗽? Here are some helpful travel tips:

            - Pack light, but don't forget the essentials  
            - 📅 Book in advance for better deals  
            - 🛂 Always keep a digital copy of your IDs  
            - 💡 Learn a few local phrases  
            - 📱 Download offline maps before traveling

            Would you like more tips for a specific destination or type of trip?`,
            };
        }

        if (messageIncludes(message, ['check', 'availability', 'time', 'open', 'close'])) {
            return {
                text: `We're happy to help you plan your trip!
                For 𝐭𝐨𝐮𝐫 𝐝𝐞𝐭𝐚𝐢𝐥𝐬, 𝐛𝐨𝐨𝐤𝐢𝐧𝐠𝐬, or 𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐢𝐥𝐢𝐭𝐲 𝐢𝐧𝐪𝐮𝐢𝐫𝐢𝐞𝐬, please contact us at 𝟎𝟗𝟓𝟔-𝟑𝟕𝟓-𝟗𝟐𝟗𝟏 or message us on Facebook.

                Business Hours:
                • 𝐌𝐨𝐧𝐝𝐚𝐲 – 𝐅𝐫𝐢𝐝𝐚𝐲: 8:00 AM – 5:00 PM
                • 𝐒𝐚𝐭𝐮𝐫𝐝𝐚𝐲: 9:00 AM – 4:00 PM   
                • 𝐒𝐮𝐧𝐝𝐚𝐲: Closed`
            }
        }

        return {
            text: "${null}",
        };
    }
    
    const handleMessage: FormEventHandler = (e) => {
        e.preventDefault();

        if (!inputText.trim()) return;

        addMessage(inputText, 'user');
        setInputText('');
        setIsTyping(true);

        setTimeout(() => {
            const response = getReponseBot(inputText);
            addMessage(response?.text ?? '', 'bot');
            setIsTyping(false);

            if (response?.showTime) {
                setTimeout(() => {
                    addMessage('', 'bot');
                }, 500);
            }
        }, 1000);
    }

    const handleQuickReply = (replyText: string) => {
        addMessage(replyText, 'user');
        setIsTyping(true);

        setTimeout(() => {
            const response = getReponseBot(replyText);
            addMessage(response?.text ?? '', 'bot');
            setIsTyping(false);

            if (response?.showTime) {
                setTimeout(() => {
                    addMessage('', 'bot');
                }, 500);
            }
        }, 1000);
    }

    const formatTime = (timestamp: Date) => {
        return timestamp.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
        });
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <>
            <div className="fixed bottom-4 right-4 z-[9999] sm:bottom-4 sm:right-4">
                <div className="relative">
                    {/* Chatbox */}
                    <div
                        ref={chatRef}
                        className={clsx(
                            "absolute transition-all duration-300",
                            // Mobile: full screen positioning
                            "bottom-0 right-0 sm:bottom-0 sm:right-0",
                            isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-0 opacity-0 pointer-events-none"
                        )}
                        style={{
                            transformOrigin: 'bottom right',
                            // Mobile: near full screen, Desktop: fixed size
                            width: 'min(380px, calc(100vw - 2rem))',
                            height: 'min(500px, calc(100vh - 6rem))'
                        }}
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-30 shadow-lg dark:shadow-gray-950/50 flex flex-col h-full rounded-t-2xl border dark:border-gray-800">
                            {/* Header */}
                            <div className="bg-primary dark:bg-primary/90 flex flex-row p-3 sm:p-4 rounded-t-lg items-center justify-between shrink-0">
                                <div className="flex flex-row space-x-2 items-center min-w-0">
                                    <AppLogoIcon className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 text-white" />
                                    <div className="flex flex-col text-white min-w-0">
                                        <p className="text-xs sm:text-sm truncate">Cavite Tiger Travel</p>
                                        <p className="text-xs opacity-90">Online now</p>
                                    </div>
                                </div>
                                <Button
                                    className="border border-white/30 dark:border-white/20 rounded-2xl p-1 cursor-pointer shrink-0 hover:bg-white/10 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="w-4 h-4 text-white" />
                                </Button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 dark:bg-gray-950 min-h-0">
                                {messages.map((message: MessageProps, index) => (
                                    <>
                                        <div key={message.id ?? index} className={clsx("flex", message.sender === "bot" ? "justify-start" : "justify-end")}>
                                            <div
                                            className={clsx(
                                                "px-3 py-2 border rounded-lg w-fit",
                                                message.sender === "bot"
                                                ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border dark:border-gray-700 rounded-bl-none max-w-[85%] sm:max-w-xs"
                                                : "bg-primary dark:bg-primary/90 text-white rounded-br-none max-w-[85%] sm:max-w-[80%]"
                                            )}
                                            >
                                            <p className="text-xs sm:text-sm whitespace-pre-line break-words">
                                                {message.text == "${null}" 
                                                ? (
                                                    <span>
                                                        I'd be happy to help you with that! For tour details, bookings, or any questions, feel free to contact us at <strong>𝟎𝟗𝟕𝟔-𝟏𝟑𝟑-𝟔𝟑𝟐𝟐</strong> or{" "}
                                                        <a
                                                            href="https://www.facebook.com/profile.php?id=100093876846720"
                                                            className="underline text-blue-600 dark:text-blue-400"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            message us on Facebook
                                                        </a>
                                                        . What else would you like to know about our travel packages?
                                                    </span>
                                                ) : message.text == "${contact}" ? (
                                                    <span>
                                                        You can reach us at:
                                                        {"\n"}📞 0956-375-9291
                                                        {"\n"}📧 cavitetigers2021@gmail.com
                                                        {"\n"}📍 2nd Floor WLM Bldg., Salawag,
                                                        {"\n"}&nbsp; &nbsp; &nbsp; &nbsp;Dasmariñas, Cavite
                                                        {"\n"}🕒 Mon–Sat: 8AM–6PM
                                                        {"\n"}🔗 Facebook:{" "}
                                                        <a
                                                            href="https://www.facebook.com/profile.php?id=100093876846720"
                                                            className="underline text-blue-600 dark:text-blue-400"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Click here
                                                        </a>
                                                        </span>
                                                ) : message.text}
                                            </p>
                                            <p
                                                className={`text-xs mt-1 ${
                                                message.sender === 'user' ? 'text-orange-100 dark:text-orange-200' : 'text-gray-500 dark:text-gray-400'
                                                }`}
                                            >
                                                {formatTime(message.timestamp)}
                                            </p>
                                            </div>
                                        </div>

                                        {/* Show tour packages */}
                                        {message.sender === 'bot' && message.text.includes('tour packages') && (
                                            <div className="mt-2 sm:mt-3 space-y-2">
                                                {packages.map((pkg, index) => (
                                                    <LinkLoading
                                                    key={index}
                                                    href={route('packages.show', {
                                                        slug: pkg.slug
                                                    })}
                                                    useUI={false}
                                                    >
                                                        <div className="text-left bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-2 sm:p-3 hover:shadow-md dark:hover:shadow-gray-950/50 transition-shadow cursor-pointer">
                                                            <div className="flex justify-between items-start gap-2">
                                                            <h4 className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200 flex-1 min-w-0">{pkg.title}</h4>
                                                            <div className="flex flex-row items-center text-primary dark:text-primary/90 shrink-0">
                                                                <PriceSign />
                                                                <span className="font-bold text-xs sm:text-sm">{pkg.base_price}</span>
                                                            </div>
                                                            </div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0 mb-1 break-words">{pkg.subtitle}</p>

                                                            {pkg.package_categories?.map((category) => (
                                                            <p className="text-xs text-gray-700 dark:text-gray-300" key={category.id}>{category.name}</p>
                                                            ))}

                                                            <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{pkg.overview}</p>
                                                        </div>
                                                    </LinkLoading>
                                                ))}

                                                {/* Explore More link */}
                                                <LinkLoading href={route('packages.index')} useUI={false}>
                                                    <div className="text-left bg-white dark:bg-gray-800 border border-dashed dark:border-gray-700 rounded-lg p-2 sm:p-3 hover:shadow-md dark:hover:shadow-gray-950/50 transition-shadow cursor-pointer">
                                                    <div className="flex flex-row items-center justify-center gap-2 text-primary dark:text-primary/90">
                                                        <span className="font-semibold text-xs sm:text-sm">Explore more tours</span>
                                                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                                        </svg>
                                                    </div>
                                                    </div>
                                                </LinkLoading>
                                            </div>
                                        )}
                                    </>
                                ))}

                                {/* Typing indicator */}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg shadow-sm border dark:border-gray-700">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef}/>
                            </div>

                            {/* Quick Replies & Input */}
                            <div className="p-2 sm:p-2 border-t dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
                                {/* Quick Replies - Mobile: 2x2 grid, larger screens: same */}
                                <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-2 sm:mb-3">
                                    {quickReplies.map((reply, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => handleQuickReply(reply.text)}
                                            className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 p-1.5 sm:p-2 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <reply.icon size={12} className="text-primary dark:text-primary/90 sm:w-3.5 sm:h-3.5 shrink-0" />
                                            <span className="text-gray-700 dark:text-gray-300 text-[10px] sm:text-xs leading-tight text-center sm:text-left">{reply.text}</span>
                                        </Button>
                                    ))}
                                </div>
                            
                                {/* Input */}
                                {/* <form onSubmit={handleMessage} className="flex flex-row justify-between space-x-2 sm:space-x-4 p-1 sm:p-2">
                                    <Input 
                                        type="text" 
                                        className="bg-white dark:bg-gray-800 p-2 border border-gray-500 dark:border-gray-600 rounded-lg w-full text-sm min-w-0 text-gray-900 dark:text-gray-100" 
                                        placeholder="Enter message..." 
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                    <Button
                                        type="submit"
                                        className="p-2 border rounded-sm bg-primary dark:bg-primary/90 transition-all duration-300 cursor-pointer hover:bg-primary/90 dark:hover:bg-primary/80 shrink-0"
                                    >
                                        <Send className="w-4 h-4 text-white" />
                                    </Button>
                                </form> */}
                            </div>
                        </div>
                    </div>

                    {/* Message button */}
                    <div className="transition-all duration-300 scale-100">
                        <Button onClick={() => setIsOpen(true)}>
                            <MessageCircle className={clsx("p-3 sm:p-4 rounded-full bg-primary dark:bg-primary/90 w-12 h-12 sm:w-14 sm:h-14 cursor-pointer hover:bg-primary/90 dark:hover:bg-primary/80 hover:scale-110 transition-all duration-300 shadow-lg dark:shadow-gray-950/50 text-white", isOpen ? "scale-0 hidden" : "scale-100")} />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}