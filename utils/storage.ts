export class Storage {

    private ROOM_ID_KEY = 'room_id';
    private JWT_TOKEN_KEY = 'jwt_token';

    static setRoomId(roomId: string) {}
    static getRoomId() {}
    static removeRoomId() {}
    static getJwtToken() {}
    static removeJwtToken() {}
    static setJwtToken(token: string, expiresIn: number) {}
}