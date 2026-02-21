import asyncio
import json
import websockets

# Global shared state
state = {
    "type": "CIRCLE",
    "size": 250,
    "position": {"x": 400, "y": 200},
    "isDragging": False,
    "webcamEnabled": False,
}

connected_clients = set()

async def handler(websocket):
    print("Client connected")
    connected_clients.add(websocket)

    # Send initial state
    await websocket.send(json.dumps({
        "type": "sync",
        "state": state
    }))

    try:
        async for message in websocket:
            data = json.loads(message)
            print("Received:", data)

            msg_type = data.get("type")

            if msg_type == "setShape":
                state["type"] = data.get("value")

            elif msg_type == "setSize":
                state["size"] = data.get("value")

            elif msg_type == "setPosition":
                state["position"] = data.get("value")

            elif msg_type == "setDragging":
                state["isDragging"] = data.get("value")

            elif msg_type == "setWebcam":
                state["webcamEnabled"] = data.get("value")

            # Broadcast to all clients
            update = json.dumps({
                "type": "update",
                "state": state
            })

            await asyncio.gather(
                *[client.send(update) for client in connected_clients]
            )

    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")

    finally:
        connected_clients.remove(websocket)


async def main():
    async with websockets.serve(handler, "0.0.0.0", 8080):
        print("WebSocket server running on ws://localhost:8080")
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())