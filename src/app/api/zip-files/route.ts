import archiver from 'archiver';
import fetch from 'node-fetch';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const fileUrls = body.urls as string[];
        const fileNames = body.fileNames as string[];


        if (!fileUrls || !Array.isArray(fileUrls) || fileUrls.length === 0) {
            return new NextResponse(JSON.stringify({ error: 'Missing or invalid URLs' }), { status: 400 });
        }

        const zip = archiver('zip', { zlib: { level: 9 } });

        const chunks: Uint8Array[] = [];
        zip.on('data', (chunk: Uint8Array) => {
            chunks.push(chunk);
        });

        const promises = fileUrls.map(async (url, index) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
                    return null;
                }

                const buffer = await response.buffer();
                const filename = fileNames[index] || new URL(url).pathname.split('/').pop() || 'downloaded_file';
                zip.append(buffer, { name: filename });
                return true;
            } catch (error) {
                console.error(`Error processing ${url}:`, error);
                return null;
            }
        });

        const results = await Promise.all(promises);
        const hasSuccess = results.some((result) => result);

        if (!hasSuccess) {
            return new NextResponse(JSON.stringify({ error: 'All downloads failed' }), { status: 500 });
        }

        await zip.finalize();

        const zipBuffer = Buffer.concat(chunks);
        return new NextResponse(zipBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename=archive.zip',
            },
        });
    } catch (error) {
        console.error('Error creating ZIP:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to create ZIP archive' }), { status: 500 });
    }
}
