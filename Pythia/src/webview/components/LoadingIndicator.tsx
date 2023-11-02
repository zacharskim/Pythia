import * as React from 'react';

export interface ILoadingIndicatorProps {

    generatingResponse: boolean;
}

export default function LoadingIndicator (props: ILoadingIndicatorProps) {
    const { generatingResponse } = props;

  return (
    <div>
        {generatingResponse && (
          <button className="cancelRequet" onClick={() => console.log('boi')}>
            <i className="fa-solid fa-circle-notch fa-spin"></i>Cancel Request
          </button>
        )}
      
    </div>
  );
}
