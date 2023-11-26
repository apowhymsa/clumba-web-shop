import {NextResponse, NextRequest} from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    const requestBody = await req.json();

    const res = await fetch(
        "https://joinposter.com/api/clients.createClient?token=873272:452823191a9f05cd1e925d447e379edc",
        {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        },
    );

    const data = await res.json();

    return NextResponse.json(data);
}
