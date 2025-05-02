let socketToken: string | null = null;

export function setSocketToken(token: string) {
    socketToken = token;
}

export function getSocketToken() {
    return socketToken;
}
