import { NextResponse } from "next/server";
import axios from "axios";

const URL = `${process.env.POSTER_API_URL}/menu.getCategories?token=${process.env.POSTER_API_ACCESS_TOKEN}`;

export async function GET() {
  const response = await fetch(URL, {
    method: 'GET',
    cache: 'no-cache'
  });
  const categories = await response.json();

  return NextResponse.json(categories.response);
}
