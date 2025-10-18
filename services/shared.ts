export async function revalidateDataByTag({ tag }: { tag: string }) {
    try {
        // http://localhost:3000/api/revalidate?tag=mamad
        const response = await fetch(`${process?.env?.NEXT_PUBLIC_APP_URL}/api/revalidate?tag=${decodeURI(tag)}`, {
            cache: 'no-store',
        })
        if (!response.ok) {
            throw new Error('Failed to revalidateDataByTag')
        }
        return await response.json()

    } catch (error) {
        console.log(error);
    }
}