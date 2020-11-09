import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";

@EventSubscriber()
export class EntitySubscriber implements EntitySubscriberInterface<any> {
    constructor(connection: Connection){
        connection.subscribers.push(this);
    }

    //orm订阅者监听beforeInsert事件，自动完成创建时间和更新时间
    beforeInsert(event: InsertEvent<any>) {
        const now = Math.floor(new Date().getTime() / 1000);
        if(event.metadata.propertiesMap.hasOwnProperty('crtime')){
            event.entity.crtime = now;
        }
        if(event.metadata.propertiesMap.hasOwnProperty('uptime')){
            event.entity.uptime = now;
        }
    }

    //orm订阅者监听beforUpdate事件，自动完成更新时间
    beforeUpdate(event: UpdateEvent<any>) {
        const now = Math.floor(new Date().getTime() / 1000);

        if(event.metadata.propertiesMap.hasOwnProperty('uptime')){
            event.entity.uptime = now;
        }
    }
}