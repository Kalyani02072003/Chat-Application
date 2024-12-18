"""
WebSocket server for a chat application that handles client connections,
broadcasting messages, managing nicknames, and performing DNS resolution.
"""

import json
import asyncio
import logging
import websockets
import dns.resolver


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("chat_server.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

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
        ips = [ip.address for ip in result]
        logger.info("Resolved DNS for %s: %s", domain, ips)
        return ips
    except dns.resolver.NoAnswer as err:
        logger.error("DNS resolution error (NoAnswer) for %s: %s", domain, err)
        return str(err)
    except dns.resolver.NXDOMAIN as err:
        logger.error("DNS resolution error (NXDOMAIN) for %s: %s", domain, err)
        return str(err)
    except dns.exception.DNSException as err:
        logger.error("DNS resolution error for %s: %s", domain, err)
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
    logger.info("%s joined room %s", nickname, room)
    await broadcast(f"{nickname} has joined the chat.", room)
    try:
        async for message in websocket:
            data = json.loads(message)
            if data.get("type") == "dns":
                response = await resolve_dns(data["message"])
                await websocket.send(json.dumps({"type": "dns", "response": response}))
            elif data.get("type") == "echo":
                # Extract the client's IP address and send it back
                client_ip = websocket.remote_address[0]
                await websocket.send(
                    json.dumps({"type": "echo", "response": client_ip})
                )
            else:
                await broadcast(
                    f"{clients[room][websocket]}: {data['message']}", room
                )
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
        logger.info("%s left room %s", nickname, room)
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
        logger.info("Broadcasting message in room %s: %s", room, message)
        # Wrap coroutines in asyncio.create_task
        tasks = [asyncio.create_task(client.send(message)) for client in clients[room]]
        await asyncio.wait(tasks)


async def main():
    """
    Main function to start the WebSocket server.
    """

    async def handler(websocket):
        registration_info = await websocket.recv()
        data = json.loads(registration_info)
        logger.info("New connection: %s in room %s", data["nickname"], data["room"])
        await register(websocket, data["nickname"], data["room"])

    async with websockets.serve(handler, "0.0.0.0", 5555):
        logger.info("Server started on ws://l0.0.0.0:5555")
        await asyncio.Future()  # Run forever


if __name__ == "__main__":
    asyncio.run(main())