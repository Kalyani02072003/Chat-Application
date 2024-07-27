import asyncio
import websockets
import json
import dns.resolver

clients = {}

async def resolve_dns(domain):
    try:
        result = dns.resolver.resolve(domain, 'A')
        return [ip.address for ip in result]
    except Exception as e:
        return str(e)

async def register(websocket, nickname):
    clients[websocket] = nickname
    await broadcast(f"{nickname} has joined the chat.")
    try:
        async for message in websocket:
            data = json.loads(message)
            if data.get('type') == 'dns':
                response = await resolve_dns(data['message'])
                await websocket.send(json.dumps({'type': 'dns', 'response': response}))
            else:
                await broadcast(f"{clients[websocket]}: {data['message']}")
    finally:
        await unregister(websocket)

async def unregister(websocket):
    nickname = clients.pop(websocket, None)
    if nickname:
        await broadcast(f"{nickname} has left the chat.")

async def broadcast(message):
    if clients:
        await asyncio.wait([client.send(message) for client in clients])

async def main():
    async def handler(websocket):
        nickname = await websocket.recv()
        await register(websocket, nickname)
    
    async with websockets.serve(handler, "localhost", 5555):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
