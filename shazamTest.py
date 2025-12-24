import asyncio
from shazamio import Shazam

async def main():
    shazam = Shazam()
    out = await shazam.recognize('Cry For Me.mp3') 
    
    print(out)

loop = asyncio.get_event_loop()
loop.run_until_complete(main())