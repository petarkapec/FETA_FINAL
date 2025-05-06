import { WebSocketServer } from "ws";

let clients = [];

export const initWebSocket = (server) => {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
        console.log("Klijent povezan na WebSocket");
        clients.push(ws);

        ws.on("close", () => {
            clients = clients.filter((client) => client !== ws);
            console.log("Klijent se odspojio");
        });
    });

    return wss;
};

// Funkcija za slanje obavijesti svim klijentima
export const notifyClients = (message) => {
    clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(message));
        }
    });
};
