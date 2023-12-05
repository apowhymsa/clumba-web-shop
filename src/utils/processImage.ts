export function processImage(url: string) {
    // Распарсим URL-адрес
    const parsedUrl = new URL(process.env.ADMIN_ENDPOINT_BACKEND + url);

    // Извлечем параметр url из запроса
    const originalImageUrl = parsedUrl.searchParams.get('url');

    // Извлечем только имя файла из полного пути
    const fileName = originalImageUrl?.split('/').pop();

    return fileName;
}