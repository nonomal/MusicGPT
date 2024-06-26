import useWebSocket from "react-use-websocket";
import { useCallback, useEffect, useState } from "react";
import { InboundMsg, Info, OutboundMsg } from "./bindings.ts";

const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL ?? window.location.origin
export const WS_URL = `${BACKEND_URL.replace('http', 'ws')}/ws`
export const FILES_URL = `${BACKEND_URL}/files`

export function useBackend () {
  const [info, setInfo] = useState<Info>()

  const [closeEvent, setCloseEvent] = useState<WebSocketEventMap['close']>()

  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket<OutboundMsg>(WS_URL, {
      share: true,
      retryOnError: true,
      shouldReconnect: close => {
        setCloseEvent(close)
        return true
      }
    });

  const send = useCallback((msg: InboundMsg) => {
    sendJsonMessage(msg);
  }, [sendJsonMessage]);

  const last = lastJsonMessage;

  useEffect(() => {
    if (last != null && 'Info' in last) {
      setInfo(last.Info);
    }
  }, [last]);

  return { send, last, readyState, closeEvent, info };
}
