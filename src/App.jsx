import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';

const VideoChat = () => {
  const [peerId, setPeerId] = useState('');
  const [remoteId, setRemoteId] = useState('');
  const [peer, setPeer] = useState(null);
  const [currentCall, setCurrentCall] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  currentCall;

  useEffect(() => {
    const newPeer = new Peer();
    newPeer.on('open', (id) => {
      setPeerId(id);
    });
    newPeer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
        localVideoRef.current.srcObject = stream;
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
        setCurrentCall(call);
      }).catch(console.log);
    });
    setPeer(newPeer);

    return () => {
      newPeer.destroy();
    };
  }, []);

  const handleCall = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then((stream) => {
      localVideoRef.current.srcObject = stream;
      const newCall = peer.call(remoteId, stream);
      newCall.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
      });
      setCurrentCall(newCall);
    });
  };

  return (
    <div>
      <h1>Video Chat</h1>
      <p>Your ID: {peerId}</p>
      <input
        type="text"
        placeholder="Enter remote ID"
        value={remoteId}
        onChange={(e) => setRemoteId(e.target.value)}
      />
      <button onClick={handleCall}>Call</button>
      <div>
        <h2>Local Video</h2>
        <video ref={localVideoRef} autoPlay />
      </div>
      <div>
        <h2>Remote Video</h2>
        <video ref={remoteVideoRef} autoPlay />
      </div>
    </div>
  );
};

export default VideoChat;