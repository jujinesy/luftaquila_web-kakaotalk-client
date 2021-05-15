import asyncio
import packet
from bson import BSON as bson
import time
import json

class Chat:
    def __init__(self, writer, packet):
        self.writer = writer
        self.rawBody = packet.toJsonBody()

        self.chatId = self.rawBody["chatLog"]["chatId"]
        self.logId = self.rawBody["chatLog"]["logId"]

        self.type = self.rawBody["chatLog"]["type"]
        self.message = self.rawBody["chatLog"]["message"]
        
        self.authorId = self.rawBody["chatLog"]["authorId"]
        
        try:
            if "attachment" in self.rawBody["chatLog"]:
                self.attachment = josn.loads(self.rawBody["chatLog"]["attachment"])
            else:
                self.attachment = {}
        except:
            pass
        
        if "li" in self.rawBody:
            self.li = self.rawBody["li"]
        else:
            self.li = 0

        self.nickName = self.rawBody["authorNickname"]

    async def reply(self, msg, type = 0):
        return await self.sendText(msg,
                json.dumps({
                    "attach_only":False,
                    "attach_type":type,
                    "mentions":[],
                    "src_linkId":self.li,
                    "src_logId":self.logId,
                    "src_mentions":[],
                    "src_message":self.message,
                    "src_type":self.type,
                    "src_userId":self.authorId
                    }), 26)

    async def sendText(self, msg, extra = "{}", t = 1):
        return await self.writer.sendPacket(packet.Packet(0, 0, "WRITE", 0, bson.encode({
            "chatId": self.chatId,
            "extra": extra,
            "type": t,
            "msgId": int(time.time()/10),
            "msg": str(msg),
            "noSeen": False,
        })))
        
    async def delete(self):
        await self.writer.sendPacket(packet.Packet(0, 0, "DELETEMSG", 0, bson.encode({
            "chatId":self.chatId,
            "logId":self.logId
        })))
        
    async def hide(self):
        if self.li:
            await self.writer.sendPacket(packet.Packet(0, 0, "REWRITE", 0, bson.encode({
                "c":self.chatId,
                "li":self.li,
                "logId":self.logId,
                "t":1
            })))
