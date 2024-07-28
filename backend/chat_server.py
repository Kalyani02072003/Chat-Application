"""
WebSocket server for a chat application that handles client connections,
broadcasting messages, managing nicknames, and performing DNS resolution.
"""

import json
import asyncio
import websockets
import dns.resolver

clients = {}


async def resolve_dns(domain):
    """
    Resolve DNS for a given domain and return a list of IP addresses.

    Args:
        domain (str): The domain name to resolve.

    Returns:
        list: List of IP addresses or an error message if the resolution fails.
    """
    try:
        result = dns.resolver.resolve(domain, "A")
        return [ip.address for ip in result]
    except dns.resolver.NoAnswer as err:
        return str(err)
    except dns.resolver.NXDOMAIN as err:
        return str(err)
    except dns.exception.DNSException as err:
        return str(err)


async def register(websocket, nickname, room):
    """
    Register a new client, broadcast join messages, and handle their messages.

    Args:
        websocket (WebSocket): The WebSocket connection object.
        nickname (str): The nickname of the client.
        room (str): The room the client wants to join.
    """
    if room not in clients:
        clients[room] = {}
    clients[room][websocket] = nickname
    await broadcast(f"{nickname} has joined the chat.", room)
    try:
        async for message in websocket:
            data = json.loads(message)
            if data.get("type") == "dns":
                response = await resolve_dns(data["message"])
                await websocket.send(json.dumps({"type": "dns", "response": response}))
            else:
                await broadcast(f"{clients[room][websocket]}: {data['message']}", room)
    finally:
        await unregister(websocket, room)


async def unregister(websocket, room):
    """
    Unregister a client and broadcast their leave message.

    Args:
        websocket (WebSocket): The WebSocket connection object.
        room (str): The room the client was in.
    """
    nickname = clients[room].pop(websocket, None)
    if nickname:
        await broadcast(f"{nickname} has left the chat.", room)
    if not clients[room]:
        del clients[room]


async def broadcast(message, room):
    """
    Broadcast a message to all connected clients in a room.

    Args:
        message (str): The message to broadcast.
        room (str): The room to broadcast the message in.
    """
    if clients.get(room):
        await asyncio.wait([client.send(message) for client in clients[room]])


async def main():
    """
    Main function to start the WebSocket server.
    """

    async def handler(websocket):
        registration_info = await websocket.recv()
        data = json.loads(registration_info)
        await register(websocket, data["nickname"], data["room"])

    async with websockets.serve(handler, "localhost", 5555):
        await asyncio.Future()  # Run forever


if __name__ == "__main__":
    asyncio.run(main())
