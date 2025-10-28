// Text input + voice record button

export function MessageInput() {
  return (
    <div className="message-input">
      <input type="text" placeholder="Type a message..." />
      <button>🎤</button>
      <button>Send</button>
    </div>
  );
}
