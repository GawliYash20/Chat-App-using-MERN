import { create } from "zustand";
import { persist } from "zustand/middleware";

const useConversation = create(
  persist(
    (set) => ({
      selectedConversation: null,
      setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
      messages: [],
      setMessages: (messages) => set({ messages }),
    }),
    {
      name: "conversation-storage", // Unique name for storage key
    }
  )
);

export default useConversation;
