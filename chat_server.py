"""
This module contains a WebSocket server for a chat application.
It handles client connections, broadcasting messages, managing nicknames,
and performs DNS resolution.
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


async def register(websocket, nickname):
    """
    Register a new client, broadcast join messages, and handle their messages.

    Args:
        websocket (WebSocket): The WebSocket connection object.
        nickname (str): The nickname of the client.
    """
    clients[websocket] = nickname
    await broadcast(f"{nickname} has joined the chat.")
    try:
        async for message in websocket:
            data = json.loads(message)
            if data.get("type") == "dns":
                response = await resolve_dns(data["message"])
                await websocket.send(json.dumps({"type": "dns", "response": response}))
            else:
                await broadcast(f"{clients[websocket]}: {data['message']}")
    finally:
        await unregister(websocket)


async def unregister(websocket):
    """
    Unregister a client, broadcast their leave message.

    Args:
        websocket (WebSocket): The WebSocket connection object.
    """
    nickname = clients.pop(websocket, None)
    if nickname:
        await broadcast(f"{nickname} has left the chat.")


async def broadcast(message):
    """
    Broadcast a message to all connected clients.

    Args:
        message (str): The message to broadcast.
    """
    if clients:
        await asyncio.wait([client.send(message) for client in clients])


async def main():
    """
    Main function to start the WebSocket server.
    """

    async def handler(websocket):
        nickname = await websocket.recv()
        await register(websocket, nickname)

    async with websockets.serve(handler, "localhost", 5555):
        await asyncio.Future()  # Run forever


if __name__ == "__main__":
    asyncio.run(main())
