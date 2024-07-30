import { create } from 'zustand';
import { useUserStore } from './userStore';

export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    // Check if the current user is blocked by the other user
    if (user.blocked.includes(currentUser.id)) {
      set({
        chatId: null,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
      return;
    }

    // Check if the receiver user is blocked by the current user
    if (currentUser.blocked.includes(user.id)) {
      set({
        chatId: null,
        user: null,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
      return;
    }

    // If no blocks are found, set the chat normally
    set({
      chatId,
      user,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
    });
  },
  changeBlock: () => {
    set((state) => ({
      ...state,
      isReceiverBlocked: !state.isReceiverBlocked,
    }));
  },
}));