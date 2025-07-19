import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../lib/store";
import { fetchChatHistory, sendChatMessage, addUserMessage } from "../redux/chatSlice";
import { useCallback } from "react";

export const useChat = (documentId: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);

  const messages = useSelector(
    (state: RootState) => state.chat.messagesByDocId[documentId] || []
  );
  const status = useSelector((state: RootState) => state.chat.status);
  const error = useSelector((state: RootState) => state.chat.error);

  const loadHistory = useCallback(async () => {
    if (!token || !documentId) return;
    await dispatch(fetchChatHistory({ documentId, token }));
  }, [dispatch, token, documentId]);

  const sendMessage = useCallback(async (question: string) => {
    if (!token || !documentId) return;

    const userMessage = { role: 'user', content: question };
    dispatch(addUserMessage({ documentId, message: userMessage }));

    await dispatch(sendChatMessage({ documentId, question, token }));
  }, [dispatch, token, documentId]);

  return {
    messages,
    status,
    error,
    loadHistory,
    sendMessage
  };
};
