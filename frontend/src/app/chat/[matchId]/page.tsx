// Chat between worker & employer
// API: GET /api/messages/:match_id
// API: POST /api/message

export default function ChatPage({ params }: { params: { matchId: string } }) {
  return (
    <div>
      <h1>Chat: {params.matchId}</h1>
      {/* TODO: Add ChatWindow component */}
    </div>
  )
}
