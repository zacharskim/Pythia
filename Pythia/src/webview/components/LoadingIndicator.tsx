import * as React from 'react';
import { Socket } from 'socket.io-client';

export interface ILoadingIndicatorProps {

    generatingResponse: boolean;
    setResponseLoading: React.Dispatch<React.SetStateAction<boolean>>;
    socket: Socket | null;
}

export default function LoadingIndicator (props: ILoadingIndicatorProps) {
    const { generatingResponse, setResponseLoading, socket } = props;

    const cancelStream = (): void =>  {
      socket?.emit('cancel_request', 'STOP');
      setResponseLoading(false);
      
    };

  return (
    <div>
        {generatingResponse && (
          <button className="cancelRequest" onClick={() => cancelStream()}>
            <i className="fa-solid fa-circle-notch fa-spin"></i>Cancel Request
          </button>
        )}
      
    </div>
  );
}
